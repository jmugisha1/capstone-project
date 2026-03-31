import os
import django
from django.conf import settings

if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY="test-secret-key-replace-in-production",
        ALLOWED_HOSTS=["*"],
        INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"],
        ROOT_URLCONF=__name__,
    )

django.setup()

import pickle
import numpy as np
from django.core.wsgi import get_wsgi_application
from django.urls import path
from ninja import NinjaAPI
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import load_model
from openai import OpenAI

# ── Load ML assets ────────────────────────────────────────────────
keras_model = load_model("disease_classifier_v2.keras")
clinicalbert = SentenceTransformer("emilyalsentzer/Bio_ClinicalBERT")
keyword_embeddings = np.load("keyword_embeddings_v2.npy")

with open("vocab_v2.pkl", "rb") as f:
    vocab = pickle.load(f)
    keyword_list = vocab["keyword_list"]
    keyword_to_idx = vocab["keyword_to_idx"]
    keyword_weight = vocab["keyword_weight"]
    symptom_disease_count = vocab["symptom_disease_count"]

with open("label_encoder_v2.pkl", "rb") as f:
    label_encoder: LabelEncoder = pickle.load(f)

with open("disease_lookup_v2.pkl", "rb") as f:
    disease_lookup = pickle.load(f)

vocab_size = len(keyword_list)

nvidia_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="key",
)

NUM_FOLLOWUP_QUESTIONS = 9


# ── Helper functions ──────────────────────────────────────────────
def extract_keywords(user_text: str) -> str:
    prompt = f"""You are a medical keyword extraction tool.
From the patient's description below, extract ONLY short medical keywords or phrases.
INCLUDE:
- Symptoms (e.g. fever, chest pain, dizziness, rash)
- Conditions (e.g. diabetes, high blood pressure)
- Risk factors (e.g. smoking, family history)
- Demographics (e.g. age, gender)
- Behaviours (e.g. heavy alcohol use)
EXCLUDE:
- Filler words and sentences
- Non-medical terms
FORMAT: Return ONLY keywords separated by ' | ' on a single line. Nothing else.
PATIENT TEXT: {user_text}"""
    completion = nvidia_client.chat.completions.create(
        model="meta/llama-3.3-70b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=512,
        stream=False,
    )
    return completion.choices[0].message.content.strip()


def text_to_multihot(keyword_string: str):
    vec = np.zeros(vocab_size, dtype=np.float32)
    if not keyword_string.strip():
        return vec
    keywords = [k.strip().lower() for k in keyword_string.split("|") if k.strip()]
    for kw in keywords:
        if kw in keyword_to_idx:
            idx = keyword_to_idx[kw]
            vec[idx] = keyword_weight.get(kw, 1.0)
        else:
            kw_emb = clinicalbert.encode([kw])
            sims = cosine_similarity(kw_emb, keyword_embeddings)[0]
            best_idx = np.argmax(sims)
            if sims[best_idx] > 0.7:
                vec[best_idx] = keyword_weight.get(keyword_list[best_idx], 1.0)
    return vec


def predict_disease(keywords_text: str, top_k=3):
    multihot = text_to_multihot(keywords_text).reshape(1, -1)
    probs = keras_model.predict(multihot, verbose=0)[0]
    top_idx = np.argsort(probs)[::-1][:top_k]
    return [
        {
            "disease": label_encoder.inverse_transform([i])[0],
            "confidence": round(float(probs[i]), 4),
        }
        for i in top_idx
    ]


def get_disease_keywords(disease_name: str) -> set:
    """Get ALL keywords (symptoms + risk factors) for a disease."""
    if disease_name not in disease_lookup.index:
        return set()
    symptoms = disease_lookup.loc[disease_name, "symptoms"]
    risk_factors = disease_lookup.loc[disease_name, "risk_factors"]
    all_kws = set()
    for text in [symptoms, risk_factors]:
        for kw in text.split("|"):
            if kw.strip():
                all_kws.add(kw.strip().lower())
    return all_kws


def get_specialist(disease_name: str) -> str:
    if disease_name not in disease_lookup.index:
        return "general practitioner"
    return disease_lookup.loc[disease_name, "specialist"]


def is_similar_symptom(symptom: str, asked_set: set) -> bool:
    s = symptom.lower().strip()
    for asked in asked_set:
        a = asked.lower().strip()
        if s in a or a in s:
            return True
        if s.rstrip("s") == a.rstrip("s"):
            return True
        s_words = set(s.split())
        a_words = set(a.split())
        if s_words and a_words:
            overlap = len(s_words & a_words) / min(len(s_words), len(a_words))
            if overlap >= 0.8:
                return True
    return False


def keyword_to_question(keyword: str) -> str:
    """Convert a keyword into a natural yes/no question."""
    keyword = keyword.strip().lower()

    gerund_map = {
        "exercising": "exercise", "running": "run", "swimming": "swim",
        "working": "work", "living": "live", "eating": "eat",
        "drinking": "drink", "using": "use", "taking": "take",
        "standing": "stand", "sitting": "sit", "smoking": "smoke",
        "walking": "walk", "lifting": "lift", "sleeping": "sleep",
    }

    risk_phrases = [
        "family history", "exposure", "surgery", "transplant", "history",
        "obesity", "pregnancy", "overweight", "weakened immune",
        "chronic", "previous", "prior",
    ]
    if any(rp in keyword for rp in risk_phrases):
        return f"Do you have {keyword}?"

    if keyword.startswith("age") or keyword.startswith("older") or keyword.startswith("young"):
        return f"Are you {keyword}?"
    if keyword in ("male", "female") or keyword.startswith("born"):
        return f"Are you {keyword}?"

    first_word = keyword.split()[0]
    if first_word in gerund_map:
        base = gerund_map[first_word]
        rest = " ".join(keyword.split()[1:])
        return f"Do you {base} {rest}".strip() + "?"

    return f"Do you experience {keyword}?"


def pick_best_question(top_preds: list, user_kws: set, asked_set: set):
    """Pick the most discriminative keyword across top predicted diseases."""
    relevant_preds = [p for p in top_preds[:3] if p["confidence"] >= 0.10]
    if not relevant_preds:
        relevant_preds = [top_preds[0]]

    candidates = []
    for pred in relevant_preds:
        all_kws = get_disease_keywords(pred["disease"])
        for kw in all_kws:
            if kw in user_kws or is_similar_symptom(kw, asked_set):
                continue
            presence = sum(
                1 for p in relevant_preds if kw in get_disease_keywords(p["disease"])
            )
            discriminative_score = 1.0 / presence
            candidates.append((kw, discriminative_score))

    if not candidates:
        return None

    candidates.sort(key=lambda x: (-x[1], x[0]))
    return candidates[0][0]


def build_questions(predictions: list, user_kws: set) -> list:
    """Simulate iterative question selection to pre-build question list."""
    asked_set = set()
    questions = []

    for _ in range(NUM_FOLLOWUP_QUESTIONS):
        best_kw = pick_best_question(predictions, user_kws, asked_set)
        if best_kw is None:
            break
        questions.append({
            "disease": next(
                (p["disease"] for p in predictions if best_kw in get_disease_keywords(p["disease"])),
                predictions[0]["disease"],
            ),
            "symptom": best_kw,
            "question": keyword_to_question(best_kw),
        })
        asked_set.add(best_kw)

    return questions


# ── API ───────────────────────────────────────────────────────────
api = NinjaAPI(title="Disease Classifier API", version="2.0.0")


class StartInput(BaseModel):
    message: str


class Prediction(BaseModel):
    disease: str
    confidence: float


class QuestionItem(BaseModel):
    disease: str
    symptom: str
    question: str


class StartOutput(BaseModel):
    keywords: str
    initial_predictions: List[Prediction]
    skip_followup: bool
    questions: List[QuestionItem]
    specialist: str


class AnswerInput(BaseModel):
    keywords: str
    questions: List[QuestionItem]
    answers: List[str]


class FinalOutput(BaseModel):
    final_predictions: List[Prediction]
    specialist: str


@api.post("/chat/start", response=StartOutput)
def chat_start(request, payload: StartInput):
    keywords = extract_keywords(payload.message)
    predictions = predict_disease(keywords)

    user_kws = {k.strip().lower() for k in keywords.split("|") if k.strip()}
    questions = build_questions(predictions, user_kws)

    return StartOutput(
        keywords=keywords,
        initial_predictions=[Prediction(**p) for p in predictions],
        skip_followup=False,
        questions=[QuestionItem(**q) for q in questions],
        specialist=get_specialist(predictions[0]["disease"]),
    )


@api.post("/chat/answer", response=FinalOutput)
def chat_answer(request, payload: AnswerInput):
    """Iteratively accumulate confirmed keywords and re-predict after each answer."""
    current_keywords = payload.keywords
    user_kws = {k.strip().lower() for k in payload.keywords.split("|") if k.strip()}

    for item, answer in zip(payload.questions, payload.answers):
        if answer.strip().lower() in ["yes", "y"]:
            current_keywords += " | " + item.symptom
            user_kws.add(item.symptom.lower())

    final_preds = predict_disease(current_keywords, top_k=1)
    specialist = get_specialist(final_preds[0]["disease"])

    return FinalOutput(
        final_predictions=[Prediction(**p) for p in final_preds],
        specialist=specialist,
    )


@api.get("/health")
def health(request):
    return {"status": "ok"}


urlpatterns = [path("api/", api.urls)]

application = get_wsgi_application()

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
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import load_model
from openai import OpenAI

# ── Load ML assets ────────────────────────────────────────────────
keras_model        = load_model("disease_classifier_v2.keras")
clinicalbert       = SentenceTransformer("emilyalsentzer/Bio_ClinicalBERT")
keyword_embeddings = np.load("keyword_embeddings_v2.npy")

with open("vocab_v2.pkl", "rb") as f:
    vocab = pickle.load(f)
    keyword_list         = vocab["keyword_list"]
    keyword_to_idx       = vocab["keyword_to_idx"]
    keyword_weight       = vocab["keyword_weight"]
    symptom_disease_count = vocab["symptom_disease_count"]

with open("label_encoder_v2.pkl", "rb") as f:
    label_encoder: LabelEncoder = pickle.load(f)

with open("disease_lookup_v2.pkl", "rb") as f:
    disease_lookup = pickle.load(f)

vocab_size = len(keyword_list)

nvidia_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="myapi"
)

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
        temperature=0, max_tokens=512, stream=False
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
        {"disease": label_encoder.inverse_transform([i])[0], "confidence": round(float(probs[i]), 4)}
        for i in top_idx
    ]


def get_disease_symptoms(disease_name: str) -> set:
    if disease_name not in disease_lookup.index:
        return set()
    raw = disease_lookup.loc[disease_name, "symptoms"]
    return {s.strip().lower() for s in raw.split("|") if s.strip()}


def get_specialist(disease_name: str) -> str:
    if disease_name not in disease_lookup.index:
        return "general practitioner"
    return disease_lookup.loc[disease_name, "specialist"]


def should_skip_followup(predictions: list, num_matched_keywords: int) -> bool:
    if num_matched_keywords < 6:
        return False
    if len(predictions) < 2:
        return True
    if predictions[0]["confidence"] >= 0.75 and predictions[1]["confidence"] <= 0.15:
        return True
    return False


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


def get_top_symptoms_for_disease(disease_name: str, user_kws: set, shared_by_all: set, n=3) -> list:
    """Return N rarest symptoms for a disease, excluding ones the user already mentioned or shared by all top diseases."""
    symptoms = get_disease_symptoms(disease_name)
    candidates = []
    for symptom in symptoms:
        if symptom in user_kws:
            continue
        if symptom in shared_by_all:
            continue
        rarity = 1.0 / max(symptom_disease_count.get(symptom, 999), 1)
        candidates.append({"symptom": symptom, "rarity": rarity})
    candidates.sort(key=lambda x: x["rarity"], reverse=True)
    return [c["symptom"] for c in candidates[:n]]


def symptom_to_question(symptom: str) -> str:
    symptom = symptom.strip().lower()
    risk_phrases = ["family history", "smoking", "alcohol", "drug use",
                    "tobacco", "exposure", "surgery", "transplant", "history"]
    if any(rp in symptom for rp in risk_phrases):
        return f"Do you have {symptom}?"
    return f"Do you experience {symptom}?"


QUESTIONS_PER_DISEASE = 3


def build_questions(predictions: list, user_kws: set) -> list:
    """
    Build the ordered follow-up question list across all top diseases.
    Returns a list of dicts: {disease, symptom, question}.
    """
    all_sets = [get_disease_symptoms(p["disease"]) for p in predictions]
    if len(all_sets) >= 3:
        shared_by_all = all_sets[0] & all_sets[1] & all_sets[2]
    elif len(all_sets) == 2:
        shared_by_all = all_sets[0] & all_sets[1]
    else:
        shared_by_all = set()

    all_asked_symptoms: set = set()
    questions = []

    for pred in predictions:
        disease_name = pred["disease"]
        candidates = get_top_symptoms_for_disease(
            disease_name, user_kws, shared_by_all, n=QUESTIONS_PER_DISEASE + 3
        )
        filtered = []
        for s in candidates:
            if not is_similar_symptom(s, all_asked_symptoms):
                filtered.append(s)
            if len(filtered) >= QUESTIONS_PER_DISEASE:
                break

        for symptom in filtered:
            questions.append({
                "disease": disease_name,
                "symptom": symptom,
                "question": symptom_to_question(symptom),
            })
            all_asked_symptoms.add(symptom.lower())

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
    questions: List[QuestionItem]  # empty when skip_followup is True
    specialist: str                # specialist for top prediction


class AnswerInput(BaseModel):
    keywords: str
    questions: List[QuestionItem]
    answers: List[str]             # "yes" or "no" per question


class FinalOutput(BaseModel):
    final_predictions: List[Prediction]
    specialist: str


@api.post("/chat/start", response=StartOutput)
def chat_start(request, payload: StartInput):
    keywords = extract_keywords(payload.message)
    predictions = predict_disease(keywords)

    num_matched = int(np.sum(text_to_multihot(keywords) > 0))
    skip = should_skip_followup(predictions, num_matched)

    user_kws = {k.strip().lower() for k in keywords.split("|") if k.strip()}
    questions = [] if skip else build_questions(predictions, user_kws)

    return StartOutput(
        keywords=keywords,
        initial_predictions=[Prediction(**p) for p in predictions],
        skip_followup=skip,
        questions=[QuestionItem(**q) for q in questions],
        specialist=get_specialist(predictions[0]["disease"]),
    )


@api.post("/chat/answer", response=FinalOutput)
def chat_answer(request, payload: AnswerInput):
    confirmed_symptoms = []
    disease_scores: dict = {}

    for item, answer in zip(payload.questions, payload.answers):
        disease = item.disease
        if disease not in disease_scores:
            disease_scores[disease] = {"yes": 0, "no": 0}

        if answer.strip().lower() in ["yes", "y"]:
            confirmed_symptoms.append(item.symptom)
            disease_scores[disease]["yes"] += 1
        else:
            disease_scores[disease]["no"] += 1

    # Determine winner: first disease with >= 2 yes answers
    winner = None
    for disease, scores in disease_scores.items():
        if scores["yes"] >= 2:
            winner = disease
            break

    enriched = payload.keywords
    if confirmed_symptoms:
        enriched += " | " + " | ".join(confirmed_symptoms)

    final_preds = predict_disease(enriched)

    # If we have a clear winner from follow-up, surface it first
    if winner:
        winner_pred = next((p for p in final_preds if p["disease"] == winner), None)
        if winner_pred is None:
            winner_pred = {"disease": winner, "confidence": 0.90}
        others = [p for p in final_preds if p["disease"] != winner]
        final_preds = [winner_pred] + others

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

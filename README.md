# 🩺 MediCheck — AI Disease Classifier

A full-stack medical symptom checker that uses machine learning to predict possible diseases based on patient-described symptoms, with conversational follow-up questions to refine results.

🔗 **Live App:** [https://capstone-project-06.vercel.app/](https://capstone-project-06.vercel.app/)
🎥 **Demo Video:** [Google Drive](https://drive.google.com/file/d/1bFmI-VVBxlbpLbscpVTNf-QyDx5nOYn9/view?usp=sharing)

---

## 📁 Project Structure

```
├── frontend/         # Next.js app (deployed on Vercel)
│   ├── app/
│   │   ├── auth/     # Sign in, Sign up, Reset password
│   │   ├── chat/     # Chat interface, history, settings
│   │   └── lib/
├── backend/          # Django REST API (auth + chat)
└── model/            # app.py — Django Ninja ML inference API
```

---

## ⚙️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Auth & Chat Backend | Django, DRF, SimpleJWT, PostgreSQL |
| ML API | Django Ninja, Keras, SentenceTransformers, scikit-learn |
| LLM | NVIDIA NIM (Llama 3.3 70B) for keyword extraction |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

---

### 2. Backend Setup (Django — Auth & Chat)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@host:port/dbname
```

Run migrations and start:

```bash
python manage.py migrate
python manage.py runserver
```

**Auth API:** `http://localhost:8000/api/auth/`
**Chat API:** `http://localhost:8000/api/chat/`

---

### 3. ML Model API Setup

```bash
cd model
pip install django-ninja sentence-transformers tensorflow scikit-learn openai
```

Place these model files in the same directory:

- `disease_classifier_v2.keras`
- `keyword_embeddings_v2.npy`
- `vocab_v2.pkl`
- `label_encoder_v2.pkl`
- `disease_lookup_v2.pkl`

Run the ML API:

```bash
python app.py
```

**ML API:** `http://localhost:8001/api/`

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ML_API_URL=http://localhost:8001
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 API Endpoints

### Auth (`/api/auth/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | Create account |
| POST | `/login/` | Get JWT tokens |
| POST | `/token/refresh/` | Refresh access token |

### Chat (`/api/chat/conversations/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all conversations |
| POST | `/create/` | Start new conversation |
| GET | `/<id>/` | Get conversation detail |
| POST | `/<id>/message/` | Send a message |
| PATCH | `/<id>/title/` | Update conversation title |

### ML Model (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat/start` | Extract keywords & initial predictions |
| POST | `/chat/answer` | Submit follow-up answers & get final diagnosis |
| GET | `/health` | Health check |

---

## 📋 Backend `requirements.txt`

```
asgiref==3.11.1
bcrypt==5.0.0
Django==6.0.2
django-cors-headers==4.9.0
djangorestframework==3.16.1
djangorestframework_simplejwt==5.5.1
psycopg2-binary==2.9.11
PyJWT==2.11.0
python-dotenv==1.2.1
sqlparse==0.5.5
dj-database-url
gunicorn
```

---

## 📌 Notes

- The **chat history** page displays past conversations as diagnostic reports.
- The ML model uses **Bio_ClinicalBERT** embeddings for semantic symptom matching.
- Follow-up questions are skipped automatically when the model is highly confident.
- This app is for **educational purposes only** and is not a substitute for professional medical advice.

<div align="center">

# 🌟 CreditLens Code-Alpha

**Enterprise-Grade Real-Time Credit Scoring & Assessment Platform**

*CreditLens Code-Alpha is a robust FinTech application engineered to deliver explainable AI-driven credit scoring. It seamlessly fuses live banking data, transparent machine learning, strict regulatory compliance, and a frictionless glassmorphic user experience.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Plaid](https://img.shields.io/badge/Plaid-111111?style=for-the-badge&logo=plaid&logoColor=white)](https://plaid.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

</div>

---

## 📑 Table of Contents
- [🚀 Core Features](#-core-features)
- [🧭 System Architecture](#-system-architecture)
- [🔄 Credit Scoring Workflow](#-credit-scoring-workflow)
- [🏗️ Architecture & Tech Stack](#-architecture--tech-stack)
- [⚙️ Local Setup & Installation](#️-local-setup--installation)
- [🚀 Production Deployment](#-production-deployment)
- [📝 License & Contact](#-license--contact)

---

## 🚀 Core Features

CreditLens is built upon **4 Enterprise Pillars**, ensuring a scalable, secure, and legally compliant product:

### 1. 🔒 Security & Identity
- **JWT Authentication**: Industry-standard stateless authentication for secure API access.
- **Passlib bcrypt Hashing**: Defense-in-depth password hashing protecting user credentials.
- **Strict Auth Guards**: React routing fully encapsulates the application behind a robust login wall, ensuring zero unauthorized access.

### 2. ⚡ Live Data Ingestion
- **Plaid API Integration**: Users can securely connect their bank accounts via the Plaid Sandbox. The system automatically ingests live income and liabilities directly into the Machine Learning pipeline.
- **Glassmorphic UI**: The frontend features a stunning, premium UI with conditional locking. Once live bank data is verified, inputs are visually locked with a "Verified" badge to guarantee data integrity.

### 3. ⚖️ Compliance & Governance
- **Immutable Audit Logging**: Built for GDPR and CCPA readiness. Every single AI decision is permanently locked into a PostgreSQL `audit_logs` table.
- **Explainable Evidence**: The audit log precisely tracks the `user_id`, UTC `timestamp`, exact `model_version`, the JSON snapshot of the exact data fed to the model, and the resulting AI predicted score.
- **Data Rights API**: A dedicated `/api/audit/my-logs` endpoint allows users to request their historical AI decision records.

### 4. ♾️ DevOps & CI/CD
- **Automated Workflows**: GitHub Actions CI/CD pipelines trigger on every push, actively validating Python syntax and building the frontend bundle to prevent regressions.
- **Infrastructure-as-Code (IaC)**: Deployments are driven entirely by a declarative `render.yaml` file orchestrating the PostgreSQL database, the Gunicorn/FastAPI web service, and the static React CDN.

---

## 🧭 System Architecture

```mermaid
graph TB
    subgraph Client["💻 Client Layer"]
        UI["React 19 + Vite<br/>TailwindCSS · Framer Motion"]
    end

    subgraph API["⚙️ API Layer — FastAPI"]
        Auth["Auth Service<br/>JWT · bcrypt"]
        Score["Scoring Engine<br/>Scikit-Learn · SHAP"]
        Audit["Audit Service<br/>/api/audit/my-logs"]
    end

    subgraph External["🌐 External Services"]
        Plaid["Plaid API<br/>Live Bank Data"]
    end

    subgraph Data["🗄️ Data Layer"]
        PG[("PostgreSQL<br/>SQLAlchemy · Alembic")]
        AuditLog[("audit_logs table<br/>Immutable")]
    end

    UI -->|Axios + JWT| Auth
    UI -->|Connect Bank| Plaid
    Plaid -->|Income & Liabilities| Score
    Auth --> PG
    Score --> PG
    Score -->|Every Prediction| AuditLog
    Audit --> AuditLog
    UI -->|View History| Audit

    style Client fill:#0F172A,stroke:#61DAFB,color:#fff
    style API fill:#0F172A,stroke:#22D3EE,color:#fff
    style External fill:#0F172A,stroke:#F59E0B,color:#fff
    style Data fill:#0F172A,stroke:#10B981,color:#fff
```

---

## 🔄 Credit Scoring Workflow

```mermaid
sequenceDiagram
    actor User
    participant FE as React Frontend
    participant BE as FastAPI Backend
    participant Plaid as Plaid API
    participant ML as ML Pipeline (SHAP)
    participant DB as PostgreSQL

    User->>FE: Log in (JWT)
    FE->>BE: Authenticate request
    BE-->>FE: Access token

    User->>FE: Connect bank account
    FE->>Plaid: Initiate Plaid Link (Sandbox)
    Plaid-->>FE: Access token + account data
    FE->>BE: Submit verified income/liabilities

    BE->>ML: Feed live data snapshot
    ML-->>BE: Credit score + SHAP explanation

    BE->>DB: Write immutable audit_log entry
    Note over DB: user_id · timestamp · model_version<br/>input snapshot · predicted score

    BE-->>FE: Return score + explanation
    FE-->>User: Display glassmorphic result card

    User->>FE: Request decision history
    FE->>BE: GET /api/audit/my-logs
    BE->>DB: Fetch audit trail
    DB-->>BE: Historical records
    BE-->>FE: Audit log JSON
```

---

## 🏗️ Architecture & Tech Stack

**Frontend (Client Layer)**
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS with premium glassmorphic aesthetics and Framer Motion for micro-animations.
- **State & Routing**: Context API, Axios Interceptors for dynamic JWT injection.

**Backend (API Layer)**
- **Framework**: FastAPI (Asynchronous, High-Performance)
- **Database ORM**: SQLAlchemy 2.0 with `asyncpg`
- **Migrations**: Alembic
- **Machine Learning**: Scikit-Learn (`RandomForestClassifier`), Joblib, SHAP (for Explainable AI).

**Infrastructure**
- **Hosting**: Render (Web Service + Static Site + Managed PostgreSQL)
- **CI/CD**: GitHub Actions

---

## ⚙️ Local Setup & Installation

Follow these steps to get the CreditLens environment running on your local machine.

### Prerequisites
- Node.js (v20+)
- Python (3.12+)
- PostgreSQL (or Docker)

### 1. Backend Setup
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file inside the `backend/` directory with the following keys:
```env
# Application Secrets
SECRET_KEY=your_super_secret_jwt_key_here
DATABASE_URL=postgresql+asyncpg://admin:adminpassword@localhost:5432/credit_scoring

# Plaid API Credentials (Sandbox)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```

### 3. Database Migration
Apply the Alembic migrations to generate the schema:
```bash
alembic upgrade head
```

Run the backend development server:
```bash
uvicorn main:app --reload
```

### 4. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🚀 Production Deployment

```mermaid
graph LR
    A["👨‍💻 git push<br/>main branch"] --> B["🔍 GitHub Actions<br/>ci.yml"]
    B --> C{"✅ Checks pass?"}
    C -->|Yes| D["📦 render.yaml<br/>Blueprint triggers"]
    C -->|No| E["❌ Build fails<br/>Notify developer"]
    D --> F[("🗄️ Managed PostgreSQL")]
    D --> G["🐍 FastAPI backend<br/>via Gunicorn"]
    D --> H["⚛️ React frontend<br/>Static CDN"]

    style A fill:#1E293B,stroke:#61DAFB,color:#fff
    style B fill:#1E293B,stroke:#2088FF,color:#fff
    style C fill:#1E293B,stroke:#F59E0B,color:#fff
    style D fill:#1E293B,stroke:#10B981,color:#fff
    style E fill:#1E293B,stroke:#EF4444,color:#fff
    style F fill:#1E293B,stroke:#316192,color:#fff
    style G fill:#1E293B,stroke:#005571,color:#fff
    style H fill:#1E293B,stroke:#61DAFB,color:#fff
```

CreditLens is configured for zero-downtime deployments via **Render** and **GitHub Actions**.

1. **GitHub Actions**: Upon pushing to the `main` branch, the `.github/workflows/ci.yml` pipeline strictly checks backend syntax and validates the frontend build.
2. **Render IaC**: Simply connect this repository to your Render account via the Blueprint interface. Render reads the `render.yaml` file and automatically provisions:
   - A Managed PostgreSQL instance.
   - The Python/FastAPI backend (served via `gunicorn`).
   - The optimized, static React frontend.

---

## 📝 License & Contact

This project is licensed under the **MIT License**.

Built with precision for the future of decentralized and explainable finance. For inquiries, architectural discussions, or compliance audits, please reach out to the repository maintainer.

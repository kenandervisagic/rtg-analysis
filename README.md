# 🩺 PneumoDetect AI

**Web Service for Pneumonia Detection on Chest X-Rays Using Deep Learning and Large Language Models for Result Interpretation**

---

## 📘 About the Project

This project is developed as part of my bachelor thesis. The goal is to build a full-stack web application deployed on a live server and accessible via a custom domain.

Users can upload chest X-ray images, and the system performs two core tasks:

1. **Detect pneumonia** using a deep learning model (e.g., PyTorch or TensorFlow).
2. **Generate a textual medical report** using an LLM (e.g., GPT-4 via OpenAI API).

The system is containerized and fully automated using DevOps practices, enabling real-time diagnostics in a production-ready environment.

---

## 🧪 Tech Stack

### Frontend
- **React.js**
- **Material UI (MUI)**
- **TypeScript**
- **Vite** (dev server + build tool)

### Backend
- **Python**
- **FastAPI** – API framework
- **PyTorch or TensorFlow** – for X-ray image classification
- **OpenCV** – for image preprocessing
- **OpenAI Python SDK** – for generating LLM-based medical reports

### DevOps & Infrastructure
- **Docker** – containerization
- **GitHub Actions** – CI/CD pipelines
- **NGINX** – reverse proxy
- **Self-hosted server** (via Docker Compose)
- **TLS/SSL** – secured with Let's Encrypt
- **Performance monitoring** and future support for:
  - Email/Slack real-time doctor alerts


---

## 📂 Project Structure

```
├── backend/                 # FastAPI backend + AI logic
├── frontend/                # React frontend (Vite + MUI)
├── .infrastructure/         # Docker Compose, TLS setup, NGINX configs
├── .github/workflows/       # CI/CD GitHub Actions
├── nginx-local/             # Local NGINX reverse proxy
```

---

## 🚀 Deployment Strategy

- **Branching Strategy**:
  - `master` → production branch
  - `feature/*` → feature development
- **CI/CD**:
  - PRs and pushes to `master` trigger:
    - Linting
    - Build
    - Deployment

> Built with production-first principles in mind using containerized services and automated pipelines.

---

## 🎓 Thesis Statement

**"Web service for pneumonia detection on chest X-ray images using deep learning and large language models for result interpretation"**

This thesis demonstrates the integration of AI/ML capabilities with modern web technologies, DevOps tooling, and secure infrastructure to provide a production-ready medical AI assistant.

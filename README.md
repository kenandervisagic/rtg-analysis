# 🩺 PneumoDetect AI

**Web Service for Pneumonia Detection on Chest X-Rays Using Deep Learning and Large Language Models for Result Interpretation**

---

## 🎓 Thesis Statement

**"Web service for pneumonia detection on chest X-ray images using deep learning and large language models for result interpretation"**

This thesis demonstrates the integration of AI/ML capabilities with modern web technologies, DevOps tooling, and secure infrastructure to provide a production-ready medical AI assistant.

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

## ⚙️ Local Development Setup

### Environment Variables Setup

Before running the application locally, make sure to create and configure environment files in both the frontend and backend directories:

- **Frontend:**

  ```bash
  cd frontend
  cp env.example .env
  ```
  Then edit .env to set your local config (e.g., API URLs)


- **Backend:**

  ```bash
  cd backend
  cp env.example .env
  ```
  Then edit .env to set your local config (e.g., DB_USER)
  
---

 ### Starting the Full Application Locally

 ```bash
  cd backend
  docker compose -f docker-compose-local.yaml up
```

This command will build and start all services (backend, frontend, and any dependencies) together, using the .env files you configured.

You don't need to start frontend or backend separately — Docker Compose handles the orchestration.
 

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

## ⚖️ License & Rights

© 2025 Kenan Dervišagić.  
All rights reserved. This project and its contents are protected under copyright law.  
Unauthorized copying, distribution, or use without explicit permission is prohibited.

---

## 📞 Contact

For questions or collaboration, please contact me at:  
**notkenan@gmail.com**

---


## 📝 Disclaimer

This project is for educational and research purposes only. It is **not** a medical device and should not be used for clinical diagnosis or treatment without proper validation and certification.


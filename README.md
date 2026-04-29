# AI Task Processing Platform 🚀

A production-ready, scalable AI task processing platform built with the MERN stack, Python Workers, Redis, and Kubernetes.

## 🏗️ Architecture Overview

This platform uses a **Producer-Consumer** architecture designed for high throughput and reliability:

- **Frontend**: React (Vite) + Tailwind CSS for a premium, responsive dashboard.
- **Backend**: Node.js & Express API for task management and user authentication.
- **Message Broker**: Redis handles the task queue between the API and workers.
- **Worker**: Python-based worker service that processes string operations (uppercase, reverse, etc.).
- **Database**: MongoDB stores persistent task history and user data.
- **Orchestration**: Kubernetes (k8s) manages scaling and health of all services.
- **GitOps**: Argo CD ensures the cluster state matches the GitHub repository.

---

## 🌟 Key Features

- **Asynchronous Processing**: Tasks are queued in Redis and processed by Python workers.
- **Horizontal Scaling**: Easily scale from 1 to 100+ workers based on load.
- **Auto-Requeuing**: Updating a task automatically resets its status and re-queues it for processing.
- **Full CI/CD**: Automated image builds and manifest updates via GitHub Actions.
- **GitOps Ready**: Automated deployments using Argo CD.
- **Security**: JWT-based authentication and non-root Docker containers.

---

## 🛠️ Local Development Setup

### 1. Docker Compose (Quick Start)
To run the entire stack locally with one command:
```bash
docker-compose up --build
```
Access the app at `http://localhost:3000`.

### 2. Kubernetes Deployment
To deploy to a local cluster (Docker Desktop / Kind):

```powershell
# 1. Create namespace
kubectl apply -f infra/k8s/namespace.yaml

# 2. Deploy everything
kubectl apply -f infra/k8s/

# 3. Access the frontend
kubectl port-forward svc/frontend-service -n ai-task-platform 8080:80
```

---

## 🚀 CI/CD & GitOps Flow

1. **Push Code**: When you push to the `main` branch, GitHub Actions triggers.
2. **Build & Push**: Images are built and pushed to **Docker Hub**.
3. **Manifest Update**: The pipeline automatically updates image tags in `infra/k8s/`.
4. **Argo CD Sync**: Argo CD detects the change in GitHub and "Syncs" the cluster to the new version.

### Monitoring Argo CD:
- **Port Forward**: `kubectl port-forward svc/argocd-server -n argocd 8081:443`
- **Login**: Use `admin` and the initial secret generated during installation.

---

## 📂 Project Structure

```text
├── .github/workflows/   # CI/CD Pipelines
├── backend/            # Node.js Express API
├── frontend/           # React Application
├── worker/             # Python Task Processor
├── infra/
│   ├── k8s/           # Kubernetes Manifests
│   └── argocd-app.yaml # Argo CD Application Config
└── docker-compose.yml  # Local Orchestration
```

---

## ⚖️ License
MIT License. Built for performance and scalability.

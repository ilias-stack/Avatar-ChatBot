# Avatar-ChatBot

A full-stack application with a frontend (Vite/Three) and backend (Python/Flask) service, containerized using Docker.

## Project Structure
```
Avatar-ChatBot/
├── Application/ # Frontend (Vite/React)
│ ├── Dockerfile
│ ├── package.json
│ └── src/
├── Backend/ # Backend (Python/Flask)
│ ├── Dockerfile
│ ├── chatbot/
│ ├── emotion detection/
│ ├── requirements.txt
│ └── app.py
├── docker-compose.yml
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v22)
- [Python](https://www.python.org/) (3.9)
- [Docker](https://www.docker.com/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.20+)

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/ilias-stack/Avatar-ChatBot.git
cd Avatar-ChatBot
```

### 2. Frontend Setup 
```bash
cd Application
npm install       # Install dependencies
npm run dev      # Start development server
```

### 3. Backend Setup 
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

## Docker Deployment
```bash
# Build and start containers
docker-compose up --build

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs -f
```

## Access Services
| Service       | URL           |
|---------------|---------------|
| Application   | [localhost:80](http://localhost)  | 
| Backend       | [localhost:5000](http://localhost:5000/)  | 


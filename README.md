# Kaivalya Yoga Studio Platform

A full-stack web application for managing a yoga studio, including class scheduling, memberships, payments, and an admin dashboard.

This repository contains **both frontend and backend**, fully containerized using **Docker** for easy setup and collaboration.

---

## 🧱 Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router
- Razorpay Checkout

### Backend
- Go (Golang)
- Gin Web Framework
- GORM (SQLite)
- JWT Authentication

---

## 🚀 Quick Start (Recommended – Docker)

This is the **recommended way** to run the project.  
No need to install Go or Node locally.

### Prerequisites
- **Docker Desktop**
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/pigeio/kaivaliyayoga.git
cd kaivaliyayoga

2. Environment Setup (Backend)

Create a .env file inside the server/ directory:

cp server/.env.example server/.env


3. Start the Application (Docker)

From the project root, run:

docker compose up


This will:

Start the Go backend on http://localhost:8080

Start the React frontend on http://localhost:5173

Automatically create the SQLite database

💡 Note
On older Docker versions, you may need:

docker-compose up


4. Stop the Application

To stop all running containers:

docker compose down


Legacy alternative (older Docker versions):

docker-compose down


5. Access the App

Frontend: http://localhost:5173

Backend API: http://localhost:8080

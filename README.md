# Kaivalya Yoga Studio Platform

A full-stack web application for managing a yoga studio, featuring class scheduling, membership management, and a comprehensive admin dashboard.

## Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Icons**

### Backend
- **Go** (Golang 1.25+)
- **Gin Web Framework**
- **GORM** (SQLite Database)
- **JWT** Authentication

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Go](https://go.dev/dl/) (version 1.25 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/downloads)

### 1. Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/kaivaliyayoga.git
cd kaivaliyayoga
```
*(Replace `YOUR_GITHUB_USERNAME` with the actual username where the repo is hosted)*

### 2. Backend Setup
The backend server runs on port `8080`.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install Go dependencies:
    ```bash
    go mod download
    ```
3.  Create a `.env` file in the `server/` directory (if not already present). You can copy the example or use these defaults:
    ```env
    PORT=8080
    DB_NAME=yoga.db
    JWT_SECRET=your_super_secret_key
    ```
4.  Run the server:
    ```bash
    go run .
    ```
    You should see: `Starting server... v6 on 8080`

### 3. Frontend Setup
The frontend runs on port `5173` (default Vite port).

1.  Open a **new terminal** window (keep the backend running in the first one).
2.  Navigate to the project root (if not already there):
    ```bash
    cd kaivaliyayoga
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and visit: `http://localhost:5173`

---

## 🤝 For Collaborators

If you are a collaborator (e.g., checking this out on another system):

1.  **Get Access**: Ensure you have been added as a collaborator to the GitHub repository. You should receive an email invitation or see it in your GitHub notifications.
2.  **Clone**: Follow the "Clone the Repository" step above.
3.  **Branching**:
    - Always create a new branch for your changes:
      ```bash
      git checkout -b feature/new-amazing-feature
      ```
4.  **Syncing**:
    - Before starting work, always pull the latest changes:
      ```bash
      git pull origin main
      ```
5.  **Running Locally**: Follow the Backend and Frontend setup steps exactly as above. The database (`yoga.db`) is SQLite, so a local file will be created when you first run the backend.

### Troubleshooting
- **Port In Use**: If port 8080 is busy, check if another instance of the server is running.
- **Database**: If you see DB errors, try deleting `yoga.db` in the `server/` folder and restarting the server (it will auto-migration and recreate it).

# 🌍 TRAVELOOP — Premium Travel Planning Platform

A full-stack, production-ready travel planning application built with **FastAPI** (Python) and **React** (Vite + Tailwind CSS). Traveloop provides a comprehensive, beautifully designed ecosystem for travelers to plan trips, manage budgets, discover cities, and share experiences.

## ✨ Highlights & Key Features

Traveloop boasts a **premium, glassmorphism UI** with a warm amber-themed palette, smooth micro-animations, and fully responsive layouts across all screens.

### 🌟 Core Capabilities
1. **Seamless Authentication** — JWT-based login, secure registration with strict frontend and backend validations (including strict phone number formatting and password rules).
2. **Dynamic Trip Creation** — Build trips with live popular destination suggestions pulled directly from the database, along with robust date and budget validation.
3. **Interactive Itinerary Builder** — Section-based stops, real-time city searching, and intuitive trip organization. Includes robust date scaling for multi-century trip dates!
4. **Rich Budgeting & PDF Export** — Track expenses against your trip budget, view dynamic category breakdowns via elegant Recharts visualizations, and seamlessly export **real, professionally-styled PDF Invoices** (powered by ReportLab on the backend).
5. **Community Hub** — Upload actual travel photos and share stories to inspire fellow travelers.
6. **Smart Admin Dashboard** — Monitor platform growth with actual backend-calculated SQLite metrics, live trend lines, and user activity feeds—securely protected by an Admin guard.
7. **Packing Checklists & Journals** — Keep track of tasks with category-based checklists and a robust trip-notes journaling system.
8. **Premium User Profiles** — Sleek glassmorphism dashboards tracking upcoming, completed, and ongoing trips, complete with photo upload capabilities.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS (Glassmorphism), Vite, Recharts, Lucide Icons |
| **Backend** | Python, FastAPI, ReportLab (PDFs), Alembic (Migrations) |
| **Database** | SQLite (SQLAlchemy ORM) |
| **Auth** | JWT (python-jose + bcrypt) |

## 🏗️ Getting Started

### 1. Backend Setup
```bash
cd traveloop-backend

# Create virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: The backend automatically runs Alembic migrations and seeds the database (50+ cities, 75+ activities, and an admin user) upon the first startup!*

### 2. Frontend Setup
```bash
cd traveloop-frontend
npm install
npm run dev
```

### 3. Default Credentials
- **Admin Access**: `admin@traveloop.com` / `admin123`

## 📊 Architecture & Best Practices
- **Automatic Migrations**: Uses Alembic for database schema versioning.
- **Service Layer Pattern**: Complex logic like PDF generation is isolated in `services/pdf_service.py`.
- **CORS & Security**: Strict Cross-Origin Resource Sharing rules and secure password hashing via bcrypt.
- **RESTful API**: Clean, well-documented FastAPI routes serving the React frontend.

## 👥 Team
Built with ❤️ for the **Odoo Virtual Hackathon 2026**.

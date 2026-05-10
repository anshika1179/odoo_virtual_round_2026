# 🌍 TRAVELOOP — Travel Planning Platform

A full-stack travel planning application built with **FastAPI** (Python) and **React** (Vite + Tailwind CSS).

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Python + FastAPI |
| Database | SQLite (SQLAlchemy ORM) |
| Auth | JWT (python-jose + bcrypt) |
| Charts | Recharts |
| Icons | Lucide React |

## 📱 Features (14 Screens)

1. **Login** — JWT-based authentication
2. **Registration** — Full user profile with city/country
3. **Landing Page** — Hero section, top destinations, search
4. **Create Trip** — Date range, budget, city suggestions
5. **Itinerary Builder** — Section-based stops with city search
6. **Trip Listing** — Ongoing/Upcoming/Completed with filters
7. **User Profile** — Editable details, trip history
8. **City & Activity Search** — Filters by region, type, cost
9. **Itinerary View** — Day-wise with activity/expense columns
10. **Community Tab** — Share experiences, like posts
11. **Packing Checklist** — Category-based with progress bar
12. **Admin Dashboard** — Stats, charts, user management
13. **Trip Notes** — Journal with filter tabs
14. **Expense Invoice** — Line items, budget summary, pie chart

## 🏗️ Getting Started

### Backend
```bash
cd traveloop-backend
pip install -r requirements.txt
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd traveloop-frontend
npm install
npm run dev
```

### Default Credentials
- **Admin**: admin@traveloop.com / admin123

## 📊 Database
- **50+ seeded cities** with real images
- **75+ seeded activities** with costs and durations
- Auto-computed trip status (ONGOING/UPCOMING/COMPLETED)

## 👥 Team
Built for Odoo Virtual Hackathon 2026

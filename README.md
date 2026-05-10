<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg" width="80" alt="Traveloop Logo"/>
  <h1>🌍 TRAVELOOP</h1>
  <p><strong>A Premium, Full-Stack Multi-City Travel Planning Ecosystem</strong></p>
  
  <h3>Team Leader: <strong>Anshika</strong></h3>
  <p><i>Built for the Odoo × Parul University Virtual Round 2026</i></p>
</div>

---

## 📖 Overview

**Traveloop** is a comprehensive, production-grade application designed to solve the chaos of travel planning. It empowers users to seamlessly design multi-city itineraries, manage travel budgets, discover global activities, and share their experiences—all wrapped in a stunning, modern **Amber-themed Glassmorphism UI**.

The application successfully demonstrates complex relational database management, handling highly normalized data structures connecting users, trips, stops, localized activities, and granular financial expenses.

---

## ✨ 100% Feature Complete

Traveloop strictly adheres to and fully implements all 14 requirements outlined in the hackathon problem statement:

1. 🔐 **Authentication Flow** — Secure email/password login, JWT registration, and a complete 'Forgot Password' reset flow.
2. 📊 **Dashboard Hub** — A central landing page highlighting upcoming trips, recently completed adventures, and popular cities.
3. ✈️ **Dynamic Trip Creation** — Forms to initialize trips with validation for start/end dates, cover photos, and intelligent constraints.
4. 🗂️ **My Trips (Trip List)** — A beautiful grid displaying all user trips with inline **Edit** and **Delete** functionality and status badging.
5. 🗺️ **Itinerary Builder** — A drag-and-drop, interactive builder to add stops, search for cities, and seamlessly slot activities into specific dates.
6. 📅 **Chronological Timeline View** — A visually striking day-by-day itinerary view mapping out all stops, schedules, and costs chronologically.
7. 🏙️ **City Discovery Search** — A robust search interface filtering destinations by country, region, and popularity.
8. 🏄 **Activity Search** — Browse things to do categorized by interest (Sightseeing, Food, Adventure) and filterable by budget.
9. 💰 **Budget & Cost Breakdown** — Financial dashboards with dynamic **Recharts pie charts** showing total spent vs. budget, and **1-click PDF Invoice Exports** (generated natively in Python).
10. ✅ **Packing Checklist** — Categorized, interactive checklists with progress bars to ensure nothing is forgotten.
11. 🔗 **Public Itinerary Sharing** — Generate secure, public URLs. Viewers can share the trip on social media or click **"Copy This Trip"** to instantly clone the itinerary into their own account.
12. 👤 **User Profiles & Privacy** — Track lifetime travel stats, update profile pictures, and utilize the "Danger Zone" to securely delete the account and all associated data.
13. 📝 **Trip Journal & Notes** — A dedicated text-editor screen for saving flight numbers, hotel details, and personal reminders.
14. 👑 **Admin Analytics Dashboard** — A secure admin-only route visualizing platform growth, user metrics, and top-performing destinations.

---

## 🛠️ Technology Stack

We carefully selected a modern, high-performance tech stack to ensure smooth scaling and rapid development:

### **Frontend (Client)**
* **Framework:** React.js powered by Vite
* **Styling:** Tailwind CSS with a custom Glassmorphism design system
* **Routing:** React Router v6
* **Data Visualization:** Recharts
* **Icons:** Lucide-React

### **Backend (API)**
* **Framework:** FastAPI (Python 3) - Chosen for its incredible speed and automatic Swagger UI generation.
* **Database:** SQLite (Easily swappable to PostgreSQL) managed by SQLAlchemy ORM.
* **Migrations:** Alembic
* **Authentication:** Passlib (Bcrypt) & Python-JOSE (JWT)
* **Document Generation:** ReportLab (For dynamic PDF invoices)

---

## 🏗️ Architecture & Database Design

The application utilizes a highly normalized, relational database architecture to maintain data integrity:

* `Users` (1:N) `Trips`
* `Trips` (1:N) `Stops` (Cities)
* `Stops` (1:N) `StopActivities` (Experiences)
* `Trips` (1:N) `Expenses` (Budget tracking)
* `Trips` (1:N) `ChecklistItems`
* `Trips` (1:N) `Notes`

This structured approach ensures that when a user deletes a stop, all cascading activities are handled correctly, and the total trip budget is re-calculated in real-time.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Backend Setup
```bash
cd traveloop-backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: The backend automatically seeds the database with over 50 global cities, activities, and an admin user on its first launch!*

### 2. Frontend Setup
Open a new terminal window:
```bash
cd traveloop-frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The application will be running at `http://localhost:5173`.

### 🔑 Test Accounts
* **Admin:** `admin@traveloop.com` / `admin123`
* **Regular User:** Create a new account or use `test@test.com` / `password123` (if seeded).

---

## 🤝 The Team

Designed, developed, and delivered by:

* **Anshika** (Team Leader)
* **Khushi Patel**
* **Atul Upadhyay**
* **Satyam Kumar Singh**

<div align="center">
  <p><i>Made with ❤️ for the Odoo Hackathon 2026</i></p>
</div>

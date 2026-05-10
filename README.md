<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg" width="80" alt="Traveloop Logo"/>
  <h1>🌍 TRAVELOOP</h1>
  <p><strong>A Premium, Full-Stack Multi-City Travel Planning Ecosystem</strong></p>
  
  <h3>Team Leader: <strong>Anshika</strong></h3>
  <h4>Team Members: <strong>Khushi Patel, Atul Upadhyay, Satyam Kumar Singh</strong></h4>
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

## 📱 Application Screens Overview

Traveloop has been designed with an intuitive, user-first workflow. Here is a detailed breakdown of the core screens:

### 1. Authentication (Login/Signup/Forgot Password)
The gateway to the platform. Features a split-screen design with engaging travel imagery. Employs real-time field validation, secure JWT token handling, and a complete forgot-password flow allowing users to safely recover their accounts.

### 2. The Dashboard
The central command hub. Features a personalized greeting and summarizes the user's travel life. It prominently displays the "Plan New Trip" CTA alongside a dynamically generated carousel of "Popular Destinations" pulled from the database to inspire travelers.

### 3. Trip Management (My Trips)
A beautifully organized grid displaying all trips (Upcoming, Ongoing, Completed). Users can instantly see the status, destination count, and budget of each trip. Hovering over a trip card reveals quick-action buttons to **Edit** or **Delete** the trip seamlessly.

### 4. The Itinerary Builder (The Engine)
The most powerful screen in the app. A drag-and-drop interface where users add "Stops" (cities) and then assign local "Activities" to those stops. The builder handles complex date logic and seamlessly associates expenses with the overarching trip budget.

### 5. Timeline View (The Output)
Once a trip is built, this screen generates a chronological, day-by-day roadmap of the entire journey. It clearly displays city transitions, scheduled activities, and daily cost breakdowns in an elegant, responsive vertical timeline.

### 6. The Budget & Checklist Dashboards
**Budget:** A financial overview featuring dynamic Recharts pie charts breaking down expenses by category (Transport, Meals, Activities). Users can also generate and download a professional PDF invoice of their trip.
**Checklist:** A categorized, interactive packing list with a dynamic progress bar ensuring travelers are fully prepared.

### 7. Public Shared View
A read-only, public-facing version of the itinerary timeline. It includes one-click social sharing buttons (Twitter, WhatsApp) and a powerful **"Copy This Trip"** button that allows viewers to clone the exact itinerary into their own account.

---

## 🏗️ Architecture & Database Design

Traveloop was built using a **highly normalized, relational database architecture** to maintain strict data integrity and enable complex queries without redundancy. 

### Backend Architecture (FastAPI + SQLAlchemy)
The backend follows a strict Service-Oriented Architecture (SOA):
- **Routers:** Handle HTTP requests and input validation (Pydantic).
- **Services:** Contain the core business logic (e.g., calculating total trip budgets, handling file uploads, generating PDFs).
- **Models:** Map directly to the SQLite database via SQLAlchemy.

### Relational Entity Mapping
The database is structured to support cascading updates and deletions:
* **`User`** ↔️ Has many **`Trips`**
* **`Trip`** ↔️ Has many **`Stops`** (Represents a city visit during specific dates)
* **`Stop`** ↔️ Has many **`StopActivities`** (Specific things to do in that city)
* **`Trip`** ↔️ Has many **`Expenses`**, **`ChecklistItems`**, and **`Notes`**

**Why this matters:** If a user deletes a specific "Stop" (e.g., they decide not to visit Paris), the database automatically cascades that deletion to remove all Paris-related activities, which instantly recalculates and lowers the total Trip Budget.

### Frontend Architecture (React + Context API)
The React frontend avoids prop-drilling by utilizing the **Context API** for global state management (Authentication and Toast Notifications). It employs Axios interceptors to automatically attach JWT tokens to every outgoing API request, ensuring secure and seamless data fetching.

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

---

## 🎥 Submission Video

> **[Insert Link to Your 8-Minute Demo Video Here]**  
> *Note to Judges: Please watch the comprehensive video above for a full walkthrough of the application's features, architecture, and UI/UX design in action.*

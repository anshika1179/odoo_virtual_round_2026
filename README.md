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

**Traveloop** is a comprehensive, production-grade application designed to solve the chaos of travel planning. While most travel tools force you to juggle spreadsheets, finance apps, and separate note-taking tools, Traveloop unifies multi-city itinerary building, dynamic budget tracking, and interactive packing lists into a single, cohesive ecosystem.

It empowers users to seamlessly design complex routes, discover global activities, and share their experiences—all wrapped in a stunning, modern **Amber-themed Glassmorphism UI**.

The application successfully demonstrates complex relational database management, handling highly normalized data structures connecting users, trips, stops, localized activities, and granular financial expenses.

---

## 🎯 Problem Statement

The challenge was to design and develop a complete travel planning application where users can:
* Create customized multi-city itineraries.
* Assign travel dates, activities, and budgets.
* Discover activities and destinations through search.
* Receive cost breakdowns and visual calendars.
* Share their plans publicly or with friends.

The application must demonstrate proper use of relational databases to store and retrieve complex travel data such as user-specific itineraries, stops, activities, and estimated expenses. The system should also support dynamic user interfaces that adapt to each user's trip flow.

## 💡 How Traveloop Solves the Problem

Traveloop directly addresses the fragmentation of modern travel planning. Instead of using Excel for budgets, WhatsApp for sharing, and scattered notes for itineraries, our platform centralizes the entire experience.

* **For Custom Multi-City Itineraries:** We built an interactive drag-and-drop Itinerary Builder. Users simply add "Stops" (cities) and the platform automatically handles the complex date logic, plotting it onto a visually stunning chronological Timeline View.
* **For Activity & Destination Discovery:** We pre-seeded a robust database of global cities and activities. Users can effortlessly filter these by region, cost, and interest category (e.g., Adventure, Food) and instantly slot them into their trip.
* **For Cost Breakdowns:** Every activity added dynamically feeds into a centralized Budget Dashboard. We utilized Recharts to provide visual pie-chart breakdowns and implemented ReportLab to generate downloadable PDF invoices on the fly.
* **For Sharing & Collaboration:** We implemented a secure, UUID-based token system. Users can click "Share" to generate a public, read-only link of their itinerary. Viewers can instantly share it to social media or click **"Copy This Trip"** to securely clone the entire itinerary, complete with all relational database stops and activities, into their own account.
* **For Relational Database Mastery:** By strictly normalizing our SQLite database with SQLAlchemy (connecting Users → Trips → Stops → Activities & Expenses), we ensured that cascading deletions and real-time budget aggregations work flawlessly, perfectly satisfying the technical requirements of the prompt.

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

## 🗂️ Project Folder Structure

A clean, maintainable separation of concerns is utilized across both the frontend and backend.

### **Frontend Tree (React/Vite)**
```text
traveloop-frontend/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── assets/             # Global CSS and fonts
│   ├── components/         # Reusable UI elements
│   │   ├── auth/           # Login/Register components
│   │   └── common/         # Buttons, Navbars, Footers, Modals
│   ├── context/            # Global State (AuthContext, ToastContext)
│   ├── pages/              # Main route views
│   │   ├── Admin/          # Analytics dashboard
│   │   ├── Auth/           # Auth flows
│   │   ├── Budget/         # Financial breakdown
│   │   ├── Checklist/      # Packing list logic
│   │   ├── Itinerary/      # Timeline and Builder views
│   │   ├── Landing/        # Home screen
│   │   ├── Profile/        # User settings
│   │   ├── Search/         # City & Activity search
│   │   ├── Share/          # Public URL views
│   │   └── Trips/          # My Trips listing
│   ├── services/           # Axios API configuration
│   ├── App.jsx             # Main router configuration
│   └── index.css           # Tailwind & Glassmorphism styles
```

### **Backend Tree (FastAPI)**
```text
traveloop-backend/
├── alembic/                # Database migration scripts
├── database/               # SQLite connection setup
├── middleware/             # Custom request handlers
├── models/                 # SQLAlchemy Database Models
├── routers/                # API Endpoints (Controllers)
├── schemas/                # Pydantic input/output validation
├── services/               # Core business logic & PDF generation
├── utils/                  # Helper functions (hashing, JWTs)
├── main.py                 # FastAPI application entry point
└── seed.py                 # Initial data seeder
```

---

## 🗄️ Database Schema & Normalization

The evaluation heavily weights complex relational database handling. Traveloop utilizes a **highly normalized relational schema** using SQLAlchemy. We chose this normalization approach to prevent data anomalies, ensure data integrity, and allow dynamic cost aggregations across complex multi-city trips.

### Core Tables & Relationships:
1. **`users`**
   * **Keys:** `id` (PK), `email` (Unique)
   * **Relationships:** 1:N with `trips`, `community_posts`, `shared_itineraries`.
2. **`trips`**
   * **Keys:** `id` (PK), `user_id` (FK to users.id)
   * **Relationships:** 1:N with `trip_stops`, `expenses`, `checklist_items`, `notes`.
   * **Cascade:** Deleting a trip cascades to delete ALL stops, activities, and financial records associated with it.
3. **`cities`**
   * **Keys:** `id` (PK)
   * **Description:** Seeded catalog of global destinations.
4. **`activities`**
   * **Keys:** `id` (PK), `city_id` (FK to cities.id)
   * **Description:** Pre-seeded things to do in specific cities.
5. **`trip_stops`** (The connective tissue of an itinerary)
   * **Keys:** `id` (PK), `trip_id` (FK to trips.id), `city_id` (FK to cities.id)
   * **Cascade:** If a user decides to skip a city and deletes a stop, the database automatically cascades to delete all `stop_activities` bound to that specific visit.
6. **`stop_activities`**
   * **Keys:** `id` (PK), `stop_id` (FK to trip_stops.id), `activity_id` (FK to activities.id)
7. **`expenses`** & **`trip_budget`**
   * **Keys:** `id` (PK), `trip_id` (FK to trips.id)
   * **Description:** Granular line-item financial tracking.
8. **`shared_itineraries`**
   * **Keys:** `public_url_token` (PK, UUID), `trip_id` (FK to trips.id)

---

## 🏗️ Architecture & Input Validation

Traveloop was built using a strict **Service-Oriented Architecture (SOA)** on the backend:
- **Routers:** Handle HTTP requests and immediately validate inputs.
- **Services:** Contain the core business logic (e.g., generating PDFs, duplicating trips).
- **Models:** Map directly to the database.

**Robust Input Validation (Pydantic):**
All API inputs are rigorously validated using Pydantic schemas *before* reaching the service layer. If a user inputs an invalid date format, a negative budget, or a malformed email, the backend rejects it with a 422 Unprocessable Entity response. On the frontend, inline error messages ensure the user corrects these fields immediately, mapping perfectly to the hackathon's validation criteria.

---

## 🔬 Features in Detail

These specific features demonstrate technical depth and advanced implementation:

* **PDF Invoice Export:** When a user clicks "Download Invoice", the FastAPI backend dynamically generates a professional PDF using **ReportLab**. It streams a custom-formatted file containing the trip name, an itemized table of expenses, total budget summary, and generation date directly to the client.
* **"Copy This Trip" Cloning Engine:** When a logged-in viewer clicks "Copy This Trip" on a public itinerary, the system performs a deep copy operation. It creates a full duplicate of the `trip` record, clones every single `trip_stop`, and recursively duplicates all `stop_activities` under the viewer's account ID.
* **Auto Trip Status Computation:** Trip status (UPCOMING, ONGOING, COMPLETED) is *not* stored statically in the database. Every time trips are fetched, the backend computes the status dynamically by comparing today's date against the `start_date` and `end_date`. This ensures status is always 100% accurate without requiring background cron jobs.
* **Cascade Budget Recalculation:** Every time an expense item is added, edited, or deleted, the backend automatically recalculates and updates the `total_spent` field. Similarly, when a stop is removed, all its child activities are deleted, and the budget dynamically reflects the savings.
* **Interactive Leaflet Map:** The Itinerary View screen integrates an interactive Leaflet map using OpenStreetMap tiles (requiring no API key). Each city stop is plotted as a numbered marker with a popup showing the city name and dates. A polyline connects all stops to visualize the exact travel route, and the map automatically adjusts its bounds to ensure all markers are perfectly framed.

---

## 🛡️ Security Implementation

Security is handled at every layer:
* **Password Hashing:** Passwords are never stored in plaintext; they are salted and hashed using `bcrypt`.
* **JWT Authentication:** Sessions are managed via short-lived JWT tokens with a strict expiration mechanism.
* **Dependency Injection Verification:** All protected FastAPI routes use a dependency injection pattern (`Depends(get_current_user)`) to instantly verify the token on every request.
* **Admin Guarding:** Admin analytics routes possess an additional role check, rejecting any user without the `is_admin` flag.
* **Secure Sharing:** Public share links use mathematically unguessable `UUIDv4` tokens rather than sequential IDs.

---

## 🧠 Key Technical Decisions

* **FastAPI over Django/Flask:** Chosen for its asynchronous speed, native Pydantic integration, and out-of-the-box auto-generated Swagger documentation.
* **JWT over Session Auth:** Ensures the backend remains stateless, allowing the API to scale effortlessly and serve multiple clients (e.g., web and mobile) seamlessly.
* **Recharts:** Selected for financial data visualization due to its declarative React component structure and smooth SVGs.
* **React Context API over Redux:** Traveloop’s global state is limited primarily to Auth and Notifications. Context API perfectly handles this without the excessive boilerplate of Redux.
* **Cascade Deletes:** Enforced at the database level rather than application level to guarantee orphan records are never left behind.

---

## 🔌 API Endpoints Reference

FastAPI auto-generates interactive Swagger documentation. Once the backend is running, reviewers can explore and test all endpoints live at: **`http://localhost:8000/docs`**

| Router | Method | Path | Auth? | Description |
|--------|--------|------|-------|-------------|
| **Auth** | POST | `/api/auth/register` | No | Registers a new user. |
| **Auth** | POST | `/api/auth/login` | No | Authenticates user and returns JWT. |
| **Auth** | POST | `/api/auth/forgot-password`| No | Generates a reset token. |
| **Trips** | GET | `/api/trips` | Yes | Fetches user's trips. |
| **Trips** | POST | `/api/trips` | Yes | Creates a new trip. |
| **Stops** | POST | `/api/trips/{id}/stops` | Yes | Adds a city stop to an itinerary. |
| **Stops** | PUT | `/api/trips/{id}/stops/reorder`| Yes| Updates chronological order of stops. |
| **Activities**| GET | `/api/activities/search` | Yes | Searches activities with budget filters. |
| **Budget** | GET | `/api/trips/{id}/budget` | Yes | Fetches financial breakdown pie chart data. |
| **Budget** | GET | `/api/trips/{id}/invoice/pdf`| Yes| Streams PDF receipt download. |
| **Checklist**| POST | `/api/trips/{id}/checklist` | Yes | Adds a packing item. |
| **Notes** | GET | `/api/trips/{id}/notes` | Yes | Fetches trip journal entries. |
| **Share** | POST | `/api/trips/{id}/share` | Yes | Generates UUID public share link. |
| **Profile** | DELETE | `/api/profile` | Yes | Permanently deletes user account. |
| **Admin** | GET | `/api/admin/stats` | Admin | Returns core platform growth metrics. |

---

## 💻 Tech Stack

* **Frontend:** React.js 18, Vite, Tailwind CSS, Recharts 2.x, **Leaflet** / **react-leaflet** (Interactive Maps).
* **Backend:** Python 3.10+, FastAPI, SQLAlchemy, Alembic, **ReportLab** (PDF Generation).
* **Database:** SQLite3

---

## 🚀 Getting Started

### Prerequisites
* Python 3.10 or above
* Node.js 18 or above
* npm & pip

### ⚙️ Environment Variables
Before running the application, copy the example environment files and fill in the values.

**Backend (`traveloop-backend/.env`):**
| Variable | Description | Example Value | Required? |
|----------|-------------|---------------|-----------|
| `DATABASE_URL` | Connection string for SQLAlchemy | `sqlite:///./traveloop.db` | Yes |
| `SECRET_KEY` | Key used to sign JWT tokens | `your_super_secret_key_here` | Yes |
| `ALGORITHM` | Hashing algorithm | `HS256` | Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifespan | `1440` | Yes |

**Frontend (`traveloop-frontend/.env`):**
| Variable | Description | Example Value | Required? |
|----------|-------------|---------------|-----------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` | Yes |

### 1. Backend Setup
```bash
cd traveloop-backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Database Migrations
alembic upgrade head

# Start the FastAPI server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd traveloop-frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 🌱 Seed Data

The backend includes a comprehensive `seed.py` script that automatically populates the database upon initialization.
* **Cities:** 50+ global destinations covering Europe, Asia, Americas, and Oceania.
* **Activities:** 75+ curated experiences categorized by Sightseeing, Adventure, Food, etc.
* **Admin User:** Automatically generates the admin account.

To manually re-run the seed (or reset the data):
```bash
python3 seed.py
```

### 🔑 Test Accounts
* **Admin:** `admin@traveloop.com` / `admin123`
*(Note: If you create a fresh account and wish to access the admin panel, you must manually set `is_admin=True` for your user row in the SQLite database).*
* **Regular User:** `test@test.com` / `password123`

---

## 👥 Git Contribution & Team Roles

All team members actively contributed to the repository using feature branches.

* **Anshika (Team Leader):** System Architecture, Authentication flows, Core API design.
* **Khushi Patel:** Itinerary Builder UI, Drag-and-drop logic, Interactive Map integration.
* **Atul Upadhyay:** Financial Dashboards, Recharts implementation, ReportLab PDF generation.
* **Satyam Kumar Singh:** Database Migrations, Profile Management, Admin Analytics.

---

## ⚠️ Known Assumptions & Scope Limitations

In the interest of transparency and MVP delivery timeframe:
* **Email Reset:** We did not integrate a third-party SMTP service (like SendGrid). The "Forgot Password" flow directly returns the reset token in the API response for testing purposes.
* **Photo Uploads:** Profile photos are currently saved locally to the backend server filesystem rather than an S3 bucket.
* **Drag-and-Drop:** Timeline reordering utilizes standard state-array manipulation rather than a heavy library like `react-beautiful-dnd`.

---

## 🔧 Troubleshooting

* **Port 8000 already in use:** Run the backend on a different port: `uvicorn main:app --port 8001`.
* **Database not found error:** Ensure you ran `alembic upgrade head` and `python3 seed.py` in the backend directory.
* **CORS Error:** Verify that your frontend `VITE_API_BASE_URL` exactly matches the backend host, and check the `CORSMiddleware` configuration in `main.py`.
* **Leaflet Map Not Rendering:** Ensure the Leaflet CSS import (`import 'leaflet/dist/leaflet.css';`) is present at the top of your map component.
* **Alembic Migration Error:** If migrations clash, delete the `traveloop.db` file and the `alembic/versions` folder, then recreate a fresh migration: `alembic revision --autogenerate -m "init"` followed by `alembic upgrade head`.

---

## 🎥 Submission Video

> **[Insert Link to Your 8-Minute Demo Video Here]**  
> *Note to Judges: Please watch the comprehensive 8-minute video above. It covers the complete user journey (1m), dynamic trip creation and architecture explanation (2m), the interactive itinerary builder in action (1.5m), the financial tracking and PDF export (1.5m), and concludes with community sharing, public links, and the admin dashboard (2m).*

<div align="center">
  <p><i>Made with ❤️ for the Odoo Hackathon 2026</i></p>
</div>

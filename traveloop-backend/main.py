from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from routers import auth, trips, cities, activities, itinerary, budget, checklist, notes, community, share, profile, admin
from seed.cities_seed import seed_cities
from seed.activities_seed import seed_activities
from utils.password_hash import hash_password
from models.user import User

import logging

logger = logging.getLogger("traveloop")


def run_alembic_upgrade():
    """Run Alembic migrations programmatically to upgrade to head."""
    from alembic.config import Config
    from alembic import command
    import os

    alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "alembic.ini"))
    # Set the script location relative to this file
    alembic_cfg.set_main_option(
        "script_location",
        os.path.join(os.path.dirname(__file__), "alembic"),
    )
    command.upgrade(alembic_cfg, "head")
    logger.info("Alembic migrations applied successfully.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Modern lifespan handler — replaces deprecated @app.on_event("startup").

    On startup:
      1. Run Alembic migrations (upgrade to head)
      2. Seed cities & activities
      3. Create default admin user
    On shutdown:
      Cleanup resources if needed.
    """
    # ── STARTUP ───────────────────────────────────────────────────
    # 1. Run Alembic migrations (creates/updates all tables)
    run_alembic_upgrade()

    # 2. Seed data & admin user
    db = SessionLocal()
    try:
        seed_cities(db)
        seed_activities(db)
        # Create default admin user if not exists
        if not db.query(User).filter(User.email == "admin@traveloop.com").first():
            admin_user = User(
                full_name="Admin User", email="admin@traveloop.com",
                password_hash=hash_password("admin123"), is_admin=True,
                city="Mumbai", country="India"
            )
            db.add(admin_user)
            db.commit()
            logger.info("Default admin user created: admin@traveloop.com")
    finally:
        db.close()

    logger.info("Traveloop API startup complete.")

    yield  # ← App is running

    # ── SHUTDOWN ──────────────────────────────────────────────────
    logger.info("Traveloop API shutting down.")


app = FastAPI(
    title="Traveloop API",
    version="1.0.0",
    description="Travel Planning Platform API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(cities.router)
app.include_router(activities.router)
app.include_router(itinerary.router)
app.include_router(budget.router)
app.include_router(checklist.router)
app.include_router(notes.router)
app.include_router(community.router)
app.include_router(share.router)
app.include_router(profile.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Welcome to Traveloop API", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

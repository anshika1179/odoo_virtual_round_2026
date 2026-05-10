from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import auth, trips, cities, activities, itinerary, budget, checklist, notes, community, share, profile, admin
from seed.cities_seed import seed_cities
from seed.activities_seed import seed_activities
from utils.password_hash import hash_password
from models.user import User

app = FastAPI(title="Traveloop API", version="1.0.0", description="Travel Planning Platform API")

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


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_cities(db)
        seed_activities(db)
        # Create default admin user
        if not db.query(User).filter(User.email == "admin@traveloop.com").first():
            admin_user = User(
                full_name="Admin User", email="admin@traveloop.com",
                password_hash=hash_password("admin123"), is_admin=True,
                city="Mumbai", country="India"
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Welcome to Traveloop API", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

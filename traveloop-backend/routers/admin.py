from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.user import User
from models.trip import Trip
from models.city import City
from models.activity import Activity
from models.community import CommunityPost
from middleware.auth_middleware import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return {
        "total_users": db.query(User).count(),
        "total_trips": db.query(Trip).count(),
        "ongoing_trips": db.query(Trip).filter(Trip.status == "ONGOING").count(),
        "upcoming_trips": db.query(Trip).filter(Trip.status == "UPCOMING").count(),
        "completed_trips": db.query(Trip).filter(Trip.status == "COMPLETED").count(),
        "total_cities": db.query(City).count(),
        "total_activities": db.query(Activity).count(),
        "community_posts": db.query(CommunityPost).count()
    }


@router.get("/users")
def get_users(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    users = db.query(User).all()
    return [{"id": u.id, "full_name": u.full_name, "email": u.email, "city": u.city,
             "country": u.country, "is_active": u.is_active, "created_at": str(u.created_at),
             "trip_count": db.query(Trip).filter(Trip.user_id == u.id).count()} for u in users]


@router.get("/top-cities")
def top_cities(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(City).order_by(City.popularity_score.desc()).limit(10).all()


@router.get("/top-activities")
def top_activities(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Activity).order_by(Activity.estimated_cost.desc()).limit(10).all()

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case, cast, Integer
from database import get_db
from models.user import User
from models.trip import Trip
from models.city import City
from models.activity import Activity
from models.community import CommunityPost
from middleware.auth_middleware import get_admin_user
from datetime import datetime, timedelta
from collections import OrderedDict

router = APIRouter(prefix="/api/admin", tags=["Admin"])

MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


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


@router.get("/growth")
def get_growth_data(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    """
    Return monthly growth data for users and trips over the last 12 months.

    Each data point contains:
      - month: abbreviated month name (e.g. "Jan")
      - year: 4-digit year
      - label: "Mon YY" for display
      - new_users: users registered that month
      - new_trips: trips created that month
      - cumulative_users: running total of all users up to that month
      - cumulative_trips: running total of all trips up to that month
    """
    now = datetime.utcnow()

    # Build list of last 12 months (year, month) pairs
    months = []
    for i in range(11, -1, -1):
        dt = now - timedelta(days=i * 30)  # approximate
        months.append((dt.year, dt.month))
    # De-duplicate while preserving order
    seen = set()
    unique_months = []
    for ym in months:
        if ym not in seen:
            seen.add(ym)
            unique_months.append(ym)
    # Ensure exactly 12 months going back
    if len(unique_months) < 12:
        first_year, first_month = unique_months[0]
        while len(unique_months) < 12:
            first_month -= 1
            if first_month < 1:
                first_month = 12
                first_year -= 1
            unique_months.insert(0, (first_year, first_month))

    # Query new users per month using strftime (SQLite compatible)
    user_counts_raw = (
        db.query(
            func.strftime('%Y', User.created_at).label('year'),
            func.strftime('%m', User.created_at).label('month'),
            func.count(User.id).label('count'),
        )
        .filter(User.created_at.isnot(None))
        .group_by('year', 'month')
        .all()
    )
    user_counts = {(r.year, r.month.lstrip('0')): r.count for r in user_counts_raw}

    # Query new trips per month
    trip_counts_raw = (
        db.query(
            func.strftime('%Y', Trip.created_at).label('year'),
            func.strftime('%m', Trip.created_at).label('month'),
            func.count(Trip.id).label('count'),
        )
        .filter(Trip.created_at.isnot(None))
        .group_by('year', 'month')
        .all()
    )
    trip_counts = {(r.year, r.month.lstrip('0')): r.count for r in trip_counts_raw}

    # Count all users/trips created BEFORE our 12-month window
    first_year, first_month = unique_months[0]
    cutoff = datetime(first_year, first_month, 1)

    pre_users = db.query(func.count(User.id)).filter(
        User.created_at < cutoff
    ).scalar() or 0
    pre_trips = db.query(func.count(Trip.id)).filter(
        Trip.created_at < cutoff
    ).scalar() or 0

    # Build the response with cumulative totals
    result = []
    cum_users = pre_users
    cum_trips = pre_trips
    for year, month in unique_months:
        key = (str(year), str(month))
        new_u = user_counts.get(key, 0)
        new_t = trip_counts.get(key, 0)
        cum_users += new_u
        cum_trips += new_t

        month_name = MONTH_NAMES[month - 1]
        result.append({
            "month": month_name,
            "year": year,
            "label": f"{month_name} {str(year)[-2:]}",
            "new_users": new_u,
            "new_trips": new_t,
            "cumulative_users": cum_users,
            "cumulative_trips": cum_trips,
        })

    return result


@router.get("/top-cities")
def top_cities(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(City).order_by(City.popularity_score.desc()).limit(10).all()


@router.get("/top-activities")
def top_activities(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Activity).order_by(Activity.estimated_cost.desc()).limit(10).all()


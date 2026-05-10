"""Trip business logic service layer."""
from sqlalchemy.orm import Session
from models.trip import Trip
from models.stop import Stop
from fastapi import HTTPException


def get_user_trips(db: Session, user_id: int, status: str = None, sort_by: str = "created_at", order: str = "desc"):
    """Get trips for a user with optional filtering and sorting."""
    query = db.query(Trip).filter(Trip.user_id == user_id)
    if status:
        query = query.filter(Trip.status == status.upper())

    # Sorting
    sort_column = getattr(Trip, sort_by, Trip.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    return query.all()


def create_trip(db: Session, user_id: int, trip_data: dict) -> Trip:
    """Create a new trip with validation."""
    trip = Trip(user_id=user_id, **trip_data)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def get_trip_or_404(db: Session, trip_id: int, user_id: int = None) -> Trip:
    """Get a trip by ID, optionally verifying ownership."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if user_id and trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your trip")
    return trip


def update_trip(db: Session, trip_id: int, user_id: int, update_data: dict) -> Trip:
    """Update a trip with ownership check."""
    trip = get_trip_or_404(db, trip_id, user_id)
    for key, value in update_data.items():
        if value is not None and hasattr(trip, key):
            setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip


def delete_trip(db: Session, trip_id: int, user_id: int):
    """Delete a trip and all related data."""
    trip = get_trip_or_404(db, trip_id, user_id)
    # Delete stops first
    db.query(Stop).filter(Stop.trip_id == trip_id).delete()
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted"}


def get_trip_stats(db: Session, trip_id: int):
    """Get trip statistics."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        return None
    stops = db.query(Stop).filter(Stop.trip_id == trip_id).all()
    total_spent = sum(s.section_budget or 0 for s in stops)
    return {
        "total_stops": len(stops),
        "total_budget": trip.total_budget,
        "total_spent": total_spent,
        "remaining": (trip.total_budget or 0) - total_spent,
    }

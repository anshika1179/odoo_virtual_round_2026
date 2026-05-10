from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.trip import Trip
from models.stop import TripStop
from models.community import SharedItinerary
from models.user import User
from middleware.auth_middleware import get_current_user
import uuid

router = APIRouter(prefix="/api", tags=["Share"])


@router.post("/trips/{trip_id}/share")
def share_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    existing = db.query(SharedItinerary).filter(SharedItinerary.trip_id == trip_id, SharedItinerary.user_id == current_user.id).first()
    if existing:
        return {"share_token": existing.public_url_token, "share_url": f"/share/{existing.public_url_token}"}
    shared = SharedItinerary(trip_id=trip_id, user_id=current_user.id, public_url_token=str(uuid.uuid4()))
    trip.is_public = True
    db.add(shared)
    db.commit()
    db.refresh(shared)
    return {"share_token": shared.public_url_token, "share_url": f"/share/{shared.public_url_token}"}


@router.get("/shared/{token}")
def get_shared(token: str, db: Session = Depends(get_db)):
    shared = db.query(SharedItinerary).filter(SharedItinerary.public_url_token == token).first()
    if not shared:
        # Try trip share_token
        trip = db.query(Trip).filter(Trip.share_token == token).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Not found")
    else:
        shared.view_count = (shared.view_count or 0) + 1
        trip = db.query(Trip).filter(Trip.id == shared.trip_id).first()
        db.commit()

    stops = db.query(TripStop).filter(TripStop.trip_id == trip.id).order_by(TripStop.stop_order).all()
    return {
        "trip": {"id": trip.id, "title": trip.title, "description": trip.description,
                 "start_date": str(trip.start_date), "end_date": str(trip.end_date),
                 "total_budget": trip.total_budget},
        "stops": [{"id": s.id, "section_title": s.section_title, "description": s.description,
                    "arrival_date": str(s.arrival_date) if s.arrival_date else None,
                    "departure_date": str(s.departure_date) if s.departure_date else None,
                    "section_budget": s.section_budget} for s in stops],
        "owner": trip.user.full_name if trip.user else "Anonymous"
    }

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.trip import Trip
from models.stop import TripStop
from models.budget import TripBudget
from models.user import User
from schemas.trip_schema import TripCreate, TripUpdate, TripResponse, StopResponse
from middleware.auth_middleware import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/api/trips", tags=["Trips"])


def compute_trip_status(trip: Trip) -> str:
    now = datetime.now(timezone.utc)
    start = trip.start_date.replace(tzinfo=timezone.utc) if trip.start_date.tzinfo is None else trip.start_date
    end = trip.end_date.replace(tzinfo=timezone.utc) if trip.end_date.tzinfo is None else trip.end_date
    if now < start:
        return "UPCOMING"
    elif now > end:
        return "COMPLETED"
    return "ONGOING"


def trip_to_response(trip: Trip) -> dict:
    stops = []
    for s in trip.stops:
        stops.append(StopResponse(
            id=s.id,
            trip_id=s.trip_id,
            city_id=s.city_id,
            city_name=s.city.name if s.city else None,
            section_title=s.section_title,
            description=s.description,
            arrival_date=s.arrival_date,
            departure_date=s.departure_date,
            section_budget=s.section_budget,
            stop_order=s.stop_order
        ))
    return TripResponse(
        id=trip.id,
        user_id=trip.user_id,
        title=trip.title,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        cover_photo_url=trip.cover_photo_url,
        status=trip.status,
        is_public=trip.is_public,
        share_token=trip.share_token,
        total_budget=trip.total_budget,
        created_at=trip.created_at,
        updated_at=trip.updated_at,
        stops=stops
    )


@router.get("", response_model=list[TripResponse])
def list_trips(
    status: str = Query(None),
    search: str = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Trip).options(
        joinedload(Trip.stops)
    ).filter(Trip.user_id == current_user.id)

    # Auto-update statuses
    trips_all = query.all()
    for t in trips_all:
        new_status = compute_trip_status(t)
        if t.status != new_status:
            t.status = new_status
    db.commit()

    # Re-query with filters
    query = db.query(Trip).options(
        joinedload(Trip.stops)
    ).filter(Trip.user_id == current_user.id)

    if status:
        query = query.filter(Trip.status == status.upper())
    if search:
        query = query.filter(Trip.title.ilike(f"%{search}%"))

    if order.lower() == "asc":
        query = query.order_by(getattr(Trip, sort_by, Trip.created_at).asc())
    else:
        query = query.order_by(getattr(Trip, sort_by, Trip.created_at).desc())

    trips = query.all()
    return [trip_to_response(t) for t in trips]


@router.post("", response_model=TripResponse)
def create_trip(
    data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = Trip(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        cover_photo_url=data.cover_photo_url,
        total_budget=data.total_budget or 0.0,
        status=compute_trip_status(Trip(start_date=data.start_date, end_date=data.end_date))
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    # Create default budget
    budget = TripBudget(trip_id=trip.id, total_estimated=data.total_budget or 0.0)
    db.add(budget)
    db.commit()

    return trip_to_response(trip)


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).options(
        joinedload(Trip.stops)
    ).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip.status = compute_trip_status(trip)
    db.commit()
    return trip_to_response(trip)


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(trip, key, value)

    trip.status = compute_trip_status(trip)
    db.commit()
    db.refresh(trip)
    return trip_to_response(trip)


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}

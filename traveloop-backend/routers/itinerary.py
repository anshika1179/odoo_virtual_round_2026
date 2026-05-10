from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.stop import TripStop
from models.trip import Trip
from models.budget import TripActivity
from models.user import User
from schemas.trip_schema import (
    StopCreate, StopUpdate, StopResponse, StopReorder,
    TripActivityCreate, TripActivityResponse
)
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Itinerary"])


@router.post("/trips/{trip_id}/stops", response_model=StopResponse)
def create_stop(trip_id: int, data: StopCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    max_order = db.query(TripStop).filter(TripStop.trip_id == trip_id).count()
    stop = TripStop(trip_id=trip_id, city_id=data.city_id, section_title=data.section_title,
                    description=data.description, arrival_date=data.arrival_date,
                    departure_date=data.departure_date, section_budget=data.section_budget or 0.0,
                    stop_order=data.stop_order if data.stop_order else max_order)
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return StopResponse(id=stop.id, trip_id=stop.trip_id, city_id=stop.city_id,
                        city_name=stop.city.name if stop.city else None,
                        city_lat=stop.city.latitude if stop.city else None,
                        city_lng=stop.city.longitude if stop.city else None,
                        section_title=stop.section_title,
                        description=stop.description, arrival_date=stop.arrival_date,
                        departure_date=stop.departure_date, section_budget=stop.section_budget, stop_order=stop.stop_order)


@router.get("/trips/{trip_id}/stops", response_model=list[StopResponse])
def list_stops(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    stops = db.query(TripStop).filter(TripStop.trip_id == trip_id).order_by(TripStop.stop_order).all()
    return [StopResponse(id=s.id, trip_id=s.trip_id, city_id=s.city_id, 
                         city_name=s.city.name if s.city else None,
                         city_lat=s.city.latitude if s.city else None,
                         city_lng=s.city.longitude if s.city else None,
                         section_title=s.section_title, description=s.description, arrival_date=s.arrival_date,
                         departure_date=s.departure_date, section_budget=s.section_budget, stop_order=s.stop_order) for s in stops]


@router.put("/stops/{stop_id}", response_model=StopResponse)
def update_stop(stop_id: int, data: StopUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    trip = db.query(Trip).filter(Trip.id == stop.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(stop, key, value)
    db.commit()
    db.refresh(stop)
    return StopResponse(id=stop.id, trip_id=stop.trip_id, city_id=stop.city_id, 
                        city_name=stop.city.name if stop.city else None,
                        city_lat=stop.city.latitude if stop.city else None,
                        city_lng=stop.city.longitude if stop.city else None,
                        section_title=stop.section_title, description=stop.description, arrival_date=stop.arrival_date,
                        departure_date=stop.departure_date, section_budget=stop.section_budget, stop_order=stop.stop_order)


@router.delete("/stops/{stop_id}")
def delete_stop(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    trip = db.query(Trip).filter(Trip.id == stop.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(stop)
    db.commit()
    return {"message": "Stop deleted"}


@router.put("/trips/{trip_id}/stops/reorder")
def reorder_stops(trip_id: int, data: StopReorder, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    for idx, sid in enumerate(data.stop_ids):
        s = db.query(TripStop).filter(TripStop.id == sid, TripStop.trip_id == trip_id).first()
        if s:
            s.stop_order = idx
    db.commit()
    return {"message": "Reordered"}


@router.post("/stops/{stop_id}/activities", response_model=TripActivityResponse)
def add_activity(stop_id: int, data: TripActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    a = TripActivity(trip_stop_id=stop_id, activity_id=data.activity_id, custom_name=data.custom_name,
                     planned_date=data.planned_date, planned_time=data.planned_time, actual_cost=data.actual_cost or 0.0, notes=data.notes)
    db.add(a)
    db.commit()
    db.refresh(a)
    return TripActivityResponse(id=a.id, trip_stop_id=a.trip_stop_id, activity_id=a.activity_id,
                                activity_name=a.activity.name if a.activity else None, custom_name=a.custom_name,
                                planned_date=a.planned_date, planned_time=a.planned_time, actual_cost=a.actual_cost, notes=a.notes)


@router.get("/stops/{stop_id}/activities", response_model=list[TripActivityResponse])
def list_activities(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    acts = db.query(TripActivity).filter(TripActivity.trip_stop_id == stop_id).all()
    return [TripActivityResponse(id=a.id, trip_stop_id=a.trip_stop_id, activity_id=a.activity_id,
                                 activity_name=a.activity.name if a.activity else None, custom_name=a.custom_name,
                                 planned_date=a.planned_date, planned_time=a.planned_time, actual_cost=a.actual_cost, notes=a.notes) for a in acts]


@router.delete("/stop-activities/{activity_id}")
def remove_activity(activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    a = db.query(TripActivity).filter(TripActivity.id == activity_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(a)
    db.commit()
    return {"message": "Removed"}

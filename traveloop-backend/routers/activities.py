from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.activity import Activity
from models.city import City
from schemas.trip_schema import ActivityResponse

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("/search", response_model=list[ActivityResponse])
def search_activities(
    q: str = Query(""),
    type: str = Query(None),
    city_id: int = Query(None),
    max_cost: float = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if q:
        query = query.filter(Activity.name.ilike(f"%{q}%"))
    if type:
        query = query.filter(Activity.type == type.upper())
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if max_cost:
        query = query.filter(Activity.estimated_cost <= max_cost)

    activities = query.limit(50).all()
    result = []
    for a in activities:
        city = db.query(City).filter(City.id == a.city_id).first()
        result.append(ActivityResponse(
            id=a.id,
            city_id=a.city_id,
            city_name=city.name if city else None,
            name=a.name,
            type=a.type,
            estimated_cost=a.estimated_cost,
            duration_hours=a.duration_hours,
            description=a.description,
            image_url=a.image_url
        ))
    return result

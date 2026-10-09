from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.city import City
from schemas.trip_schema import CityResponse

router = APIRouter(prefix="/api/cities", tags=["Cities"])


@router.get("/search", response_model=list[CityResponse])
def search_cities(
    q: str = Query(""),
    country: str = Query(None),
    region: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(City)
    if q:
        query = query.filter(City.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    if region:
        query = query.filter(City.region.ilike(f"%{region}%"))
    return query.order_by(City.popularity_score.desc()).limit(50).all()


@router.get("/popular", response_model=list[CityResponse])
def popular_cities(db: Session = Depends(get_db)):
    return db.query(City).order_by(City.popularity_score.desc()).limit(12).all()


@router.get("/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

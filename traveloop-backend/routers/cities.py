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
    city_id: int = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(City)
    if city_id:
        query = query.filter(City.id == city_id)
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


@router.get("/countries", response_model=list[str])
def list_countries(db: Session = Depends(get_db)):
    rows = db.query(City.country).distinct().order_by(City.country).all()
    return [r[0] for r in rows]


@router.get("/regions", response_model=list[str])
def list_regions(country: str | None = None, db: Session = Depends(get_db)):
    q = db.query(City.region).distinct()
    if country:
        q = q.filter(City.country == country)
    rows = q.order_by(City.region).all()
    return [r[0] for r in rows if r[0]]


@router.get("/options")
def city_options(country: str | None = None, db: Session = Depends(get_db)):
    q = db.query(City.id, City.name)
    if country:
        q = q.filter(City.country == country)
    rows = q.order_by(City.name).all()
    return [{"id": r[0], "name": r[1]} for r in rows]


@router.get("/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

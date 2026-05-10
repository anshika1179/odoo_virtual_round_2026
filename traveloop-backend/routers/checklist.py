from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.trip import Trip
from models.checklist import PackingChecklist
from models.user import User
from schemas.trip_schema import ChecklistCreate, ChecklistUpdate, ChecklistResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Checklist"])

# Default checklist items grouped by category
DEFAULT_CHECKLIST = {
    "Documents": [
        "Passport", "Visa", "Travel insurance", "Flight tickets",
        "Hotel reservations", "ID card", "Copies of documents"
    ],
    "Clothing": [
        "T-shirts", "Pants/jeans", "Underwear", "Socks",
        "Comfortable shoes", "Rain jacket", "Sleepwear", "Swimwear"
    ],
    "Toiletries": [
        "Toothbrush & toothpaste", "Shampoo", "Sunscreen",
        "Deodorant", "Razor", "Medications"
    ],
    "Electronics": [
        "Phone charger", "Power bank", "Universal adapter",
        "Headphones", "Camera"
    ],
    "Health & Safety": [
        "First aid kit", "Hand sanitizer", "Face masks",
        "Insect repellent", "Prescription medicines"
    ],
    "Miscellaneous": [
        "Reusable water bottle", "Snacks", "Travel pillow",
        "Daypack/backpack", "Locks", "Pen (for customs forms)"
    ],
}


@router.get("/trips/{trip_id}/checklist", response_model=list[ChecklistResponse])
def list_checklist(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db.query(PackingChecklist).filter(PackingChecklist.trip_id == trip_id).all()


@router.post("/trips/{trip_id}/checklist", response_model=ChecklistResponse)
def create_item(trip_id: int, data: ChecklistCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    item = PackingChecklist(trip_id=trip_id, item_name=data.item_name, category=data.category)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/trips/{trip_id}/checklist/defaults", response_model=list[ChecklistResponse])
def load_default_checklist(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Load default checklist items for a trip.

    Only adds items if the checklist is currently empty.
    Returns the full checklist after loading defaults.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    existing_count = db.query(PackingChecklist).filter(PackingChecklist.trip_id == trip_id).count()
    if existing_count > 0:
        raise HTTPException(status_code=400, detail="Checklist already has items. Clear it first to load defaults.")

    items = []
    for category, item_names in DEFAULT_CHECKLIST.items():
        for name in item_names:
            item = PackingChecklist(trip_id=trip_id, item_name=name, category=category)
            db.add(item)
            items.append(item)

    db.commit()
    for item in items:
        db.refresh(item)

    return items


@router.put("/checklist/{item_id}", response_model=ChecklistResponse)
def update_item(item_id: int, data: ChecklistUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(PackingChecklist).filter(PackingChecklist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/checklist/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(PackingChecklist).filter(PackingChecklist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}


@router.post("/trips/{trip_id}/checklist/reset")
def reset_checklist(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.query(PackingChecklist).filter(PackingChecklist.trip_id == trip_id).update({"is_packed": False})
    db.commit()
    return {"message": "Checklist reset"}


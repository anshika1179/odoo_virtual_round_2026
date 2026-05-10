from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.trip import Trip
from models.checklist import PackingChecklist
from models.user import User
from schemas.trip_schema import ChecklistCreate, ChecklistUpdate, ChecklistResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Checklist"])


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

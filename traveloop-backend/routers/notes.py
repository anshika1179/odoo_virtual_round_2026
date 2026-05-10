from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.trip import Trip
from models.note import TripNote
from models.user import User
from schemas.trip_schema import NoteCreate, NoteUpdate, NoteResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Notes"])


@router.get("/trips/{trip_id}/notes", response_model=list[NoteResponse])
def list_notes(trip_id: int, filter: str = Query("ALL"), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    query = db.query(TripNote).filter(TripNote.trip_id == trip_id)
    if filter != "ALL":
        query = query.filter(TripNote.filter_type == filter)
    return query.order_by(TripNote.created_at.desc()).all()


@router.post("/trips/{trip_id}/notes", response_model=NoteResponse)
def create_note(trip_id: int, data: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    note = TripNote(trip_id=trip_id, trip_stop_id=data.trip_stop_id, note_date=data.note_date,
                    title=data.title, content=data.content, filter_type=data.filter_type or "ALL")
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(TripNote).filter(TripNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(note, key, value)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(TripNote).filter(TripNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}

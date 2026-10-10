from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models.trip import Trip
from models.user import User
from models.trip_member import TripMember, MemberStatus
from models.budget import TripBudget, ExpenseItem
from schemas.trip_schema import MemberInvite, TripMemberResponse, TripInvitationResponse, GroupSplitResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Group Trips"])


def get_owned_trip(trip_id: int, user: User, db: Session) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


def member_to_response(m: TripMember, owner_id: int) -> TripMemberResponse:
    return TripMemberResponse(
        id=m.id, trip_id=m.trip_id, user_id=m.user_id,
        full_name=m.user.full_name if m.user else None,
        email=m.user.email if m.user else None,
        status=m.status, is_owner=(m.user_id == owner_id),
        invited_at=m.invited_at, responded_at=m.responded_at
    )


def compute_split(trip: Trip, db: Session) -> GroupSplitResponse:
    accepted = db.query(TripMember).filter(
        TripMember.trip_id == trip.id,
        TripMember.status == MemberStatus.ACCEPTED.value
    ).count()
    member_count = accepted + 1  # owner + accepted members
    budget = db.query(TripBudget).filter(TripBudget.trip_id == trip.id).first()
    total_budget = (budget.total_estimated if budget else trip.total_budget) or 0.0
    total_spent = sum(e.total_amount or 0 for e in db.query(ExpenseItem).filter(ExpenseItem.trip_id == trip.id).all())
    return GroupSplitResponse(
        member_count=member_count,
        total_budget=total_budget,
        total_spent=total_spent,
        per_person_budget=round(total_budget / member_count, 2) if member_count else 0.0,
        per_person_spent=round(total_spent / member_count, 2) if member_count else 0.0
    )


@router.get("/trips/{trip_id}/members", response_model=dict)
def list_members(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    is_owner = trip.user_id == current_user.id
    if not is_owner:
        membership = db.query(TripMember).filter(
            TripMember.trip_id == trip_id,
            TripMember.user_id == current_user.id,
            TripMember.status == MemberStatus.ACCEPTED.value
        ).first()
        if not membership:
            raise HTTPException(status_code=404, detail="Trip not found")
    owner = db.query(User).filter(User.id == trip.user_id).first()
    members = [TripMemberResponse(
        id=0, trip_id=trip.id, user_id=trip.user_id,
        full_name=owner.full_name if owner else None,
        email=owner.email if owner else None,
        status="OWNER", is_owner=True, invited_at=trip.created_at, responded_at=None
    )]
    rows = db.query(TripMember).filter(TripMember.trip_id == trip_id).order_by(TripMember.invited_at).all()
    members += [member_to_response(m, trip.user_id) for m in rows]
    return {
        "my_role": "OWNER" if is_owner else "MEMBER",
        "members": members,
        "split": compute_split(trip, db)
    }


@router.post("/trips/{trip_id}/members", response_model=TripMemberResponse)
def invite_member(trip_id: int, data: MemberInvite, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_owned_trip(trip_id, current_user, db)
    invited = db.query(User).filter(User.email == data.email).first()
    if not invited:
        raise HTTPException(status_code=404, detail="No Traveloop account found with this email. Ask your friend to sign up first.")
    if invited.id == current_user.id:
        raise HTTPException(status_code=400, detail="You are already the trip owner")
    existing = db.query(TripMember).filter(
        TripMember.trip_id == trip_id, TripMember.user_id == invited.id
    ).first()
    if existing:
        if existing.status == MemberStatus.DECLINED.value:
            existing.status = MemberStatus.PENDING.value
            existing.invited_at = datetime.now(timezone.utc)
            existing.responded_at = None
            db.commit()
            db.refresh(existing)
            return member_to_response(existing, trip.user_id)
        raise HTTPException(status_code=400, detail=f"This person is already {existing.status.lower()} on this trip")
    member = TripMember(trip_id=trip_id, user_id=invited.id, status=MemberStatus.PENDING.value)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member_to_response(member, trip.user_id)


@router.delete("/trips/{trip_id}/members/{member_id}")
def remove_member(trip_id: int, member_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_owned_trip(trip_id, current_user, db)
    member = db.query(TripMember).filter(TripMember.id == member_id, TripMember.trip_id == trip_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"message": "Member removed"}


@router.get("/me/invitations", response_model=list[TripInvitationResponse])
def my_invitations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.query(TripMember).filter(
        TripMember.user_id == current_user.id,
        TripMember.status == MemberStatus.PENDING.value
    ).order_by(TripMember.invited_at.desc()).all()
    result = []
    for m in rows:
        trip = db.query(Trip).filter(Trip.id == m.trip_id).first()
        if not trip:
            continue
        owner = db.query(User).filter(User.id == trip.user_id).first()
        result.append(TripInvitationResponse(
            id=m.id, trip_id=trip.id, trip_title=trip.title,
            owner_name=owner.full_name if owner else None,
            start_date=trip.start_date, end_date=trip.end_date,
            status=m.status, invited_at=m.invited_at
        ))
    return result


def respond_invitation(member_id: int, new_status: str, db: Session, current_user: User):
    member = db.query(TripMember).filter(
        TripMember.id == member_id,
        TripMember.user_id == current_user.id,
        TripMember.status == MemberStatus.PENDING.value
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Invitation not found")
    member.status = new_status
    member.responded_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": f"Invitation {new_status.lower()}"}


@router.post("/me/invitations/{member_id}/accept")
def accept_invitation(member_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return respond_invitation(member_id, MemberStatus.ACCEPTED.value, db, current_user)


@router.post("/me/invitations/{member_id}/decline")
def decline_invitation(member_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return respond_invitation(member_id, MemberStatus.DECLINED.value, db, current_user)

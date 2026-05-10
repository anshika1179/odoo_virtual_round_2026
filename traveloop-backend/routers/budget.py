from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.trip import Trip
from models.budget import TripBudget, ExpenseItem
from models.user import User
from schemas.trip_schema import BudgetUpdate, BudgetResponse, ExpenseCreate, ExpenseUpdate, ExpenseResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api", tags=["Budget & Expenses"])


@router.get("/trips/{trip_id}/budget", response_model=BudgetResponse)
def get_budget(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    budget = db.query(TripBudget).filter(TripBudget.trip_id == trip_id).first()
    if not budget:
        budget = TripBudget(trip_id=trip_id)
        db.add(budget)
        db.commit()
        db.refresh(budget)
    return budget


@router.put("/trips/{trip_id}/budget", response_model=BudgetResponse)
def update_budget(trip_id: int, data: BudgetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    budget = db.query(TripBudget).filter(TripBudget.trip_id == trip_id).first()
    if not budget:
        budget = TripBudget(trip_id=trip_id)
        db.add(budget)
        db.commit()
        db.refresh(budget)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(budget, key, value)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/trips/{trip_id}/expenses", response_model=list[ExpenseResponse])
def list_expenses(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db.query(ExpenseItem).filter(ExpenseItem.trip_id == trip_id).all()


@router.post("/trips/{trip_id}/expenses", response_model=ExpenseResponse)
def create_expense(trip_id: int, data: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    expense = ExpenseItem(
        trip_id=trip_id, category=data.category, description=data.description,
        quantity=data.quantity or 1, unit_cost=data.unit_cost,
        total_amount=(data.quantity or 1) * data.unit_cost, date_incurred=data.date_incurred
    )
    db.add(expense)
    # Update budget total_spent
    budget = db.query(TripBudget).filter(TripBudget.trip_id == trip_id).first()
    if budget:
        budget.total_spent = (budget.total_spent or 0) + expense.total_amount
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, data: ExpenseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(ExpenseItem).filter(ExpenseItem.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    trip = db.query(Trip).filter(Trip.id == expense.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Not authorized")
    old_amount = expense.total_amount
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(expense, key, value)
    expense.total_amount = expense.quantity * expense.unit_cost
    budget = db.query(TripBudget).filter(TripBudget.trip_id == expense.trip_id).first()
    if budget:
        budget.total_spent = (budget.total_spent or 0) - old_amount + expense.total_amount
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expense = db.query(ExpenseItem).filter(ExpenseItem.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    trip = db.query(Trip).filter(Trip.id == expense.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=403, detail="Not authorized")
    budget = db.query(TripBudget).filter(TripBudget.trip_id == expense.trip_id).first()
    if budget:
        budget.total_spent = max(0, (budget.total_spent or 0) - expense.total_amount)
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}


@router.get("/trips/{trip_id}/invoice")
def get_invoice(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    expenses = db.query(ExpenseItem).filter(ExpenseItem.trip_id == trip_id).all()
    budget = db.query(TripBudget).filter(TripBudget.trip_id == trip_id).first()
    categories = {}
    for e in expenses:
        categories[e.category] = categories.get(e.category, 0) + e.total_amount
    total_spent = sum(e.total_amount for e in expenses)
    return {
        "trip": {"id": trip.id, "title": trip.title, "start_date": str(trip.start_date), "end_date": str(trip.end_date)},
        "expenses": [ExpenseResponse.model_validate(e) for e in expenses],
        "budget_summary": {
            "total_budget": budget.total_estimated if budget else trip.total_budget,
            "total_spent": total_spent,
            "remaining": (budget.total_estimated if budget else trip.total_budget) - total_spent
        },
        "category_breakdown": categories
    }

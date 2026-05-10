from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class TripActivity(Base):
    __tablename__ = "trip_activities"

    id = Column(Integer, primary_key=True, index=True)
    trip_stop_id = Column(Integer, ForeignKey("trip_stops.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True)
    custom_name = Column(String(300), nullable=True)
    planned_date = Column(DateTime, nullable=True)
    planned_time = Column(String(10), nullable=True)
    actual_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)

    # Relationships
    trip_stop = relationship("TripStop", back_populates="activities")
    activity = relationship("Activity", back_populates="trip_activities")


class TripBudget(Base):
    __tablename__ = "trip_budgets"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), unique=True, nullable=False)
    transport_cost = Column(Float, default=0.0)
    accommodation_cost = Column(Float, default=0.0)
    food_cost = Column(Float, default=0.0)
    activity_cost = Column(Float, default=0.0)
    misc_cost = Column(Float, default=0.0)
    total_estimated = Column(Float, default=0.0)
    total_spent = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trip = relationship("Trip", back_populates="budget")


class ExpenseItem(Base):
    __tablename__ = "expense_items"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    category = Column(String(30), nullable=False)  # HOTEL/FLIGHT/FOOD/ACTIVITY/MISC
    description = Column(String(500), nullable=False)
    quantity = Column(Integer, default=1)
    unit_cost = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    date_incurred = Column(DateTime, nullable=True)

    # Relationships
    trip = relationship("Trip", back_populates="expenses")

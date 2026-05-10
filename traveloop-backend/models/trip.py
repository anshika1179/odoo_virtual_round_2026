from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
import uuid


class TripStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    cover_photo_url = Column(String(500), nullable=True)
    status = Column(String(20), default=TripStatus.UPCOMING.value)
    is_public = Column(Boolean, default=False)
    share_token = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True)
    total_budget = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.stop_order")
    budget = relationship("TripBudget", back_populates="trip", uselist=False, cascade="all, delete-orphan")
    expenses = relationship("ExpenseItem", back_populates="trip", cascade="all, delete-orphan")
    checklist = relationship("PackingChecklist", back_populates="trip", cascade="all, delete-orphan")
    notes = relationship("TripNote", back_populates="trip", cascade="all, delete-orphan")
    community_posts = relationship("CommunityPost", back_populates="trip")

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
import enum


class ActivityType(str, enum.Enum):
    SIGHTSEEING = "SIGHTSEEING"
    FOOD = "FOOD"
    ADVENTURE = "ADVENTURE"
    CULTURE = "CULTURE"
    SHOPPING = "SHOPPING"
    NIGHTLIFE = "NIGHTLIFE"
    NATURE = "NATURE"
    WELLNESS = "WELLNESS"


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    name = Column(String(300), nullable=False, index=True)
    type = Column(String(30), nullable=False)
    estimated_cost = Column(Float, default=0.0)
    duration_hours = Column(Float, default=1.0)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)

    # Relationships
    city = relationship("City", back_populates="activities")
    trip_activities = relationship("TripActivity", back_populates="activity")

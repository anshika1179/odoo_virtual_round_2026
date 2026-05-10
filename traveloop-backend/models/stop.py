from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base


class TripStop(Base):
    __tablename__ = "trip_stops"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    section_title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    arrival_date = Column(DateTime, nullable=True)
    departure_date = Column(DateTime, nullable=True)
    section_budget = Column(Float, default=0.0)
    stop_order = Column(Integer, default=0)

    # Relationships
    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="trip_stops")
    activities = relationship("TripActivity", back_populates="trip_stop", cascade="all, delete-orphan")
    notes = relationship("TripNote", back_populates="trip_stop")

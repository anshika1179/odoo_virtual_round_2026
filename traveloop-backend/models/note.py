from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class TripNote(Base):
    __tablename__ = "trip_notes"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    trip_stop_id = Column(Integer, ForeignKey("trip_stops.id"), nullable=True)
    note_date = Column(DateTime, nullable=True)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=True)
    filter_type = Column(String(20), default="ALL")  # ALL/BY_DAY/BY_STOP
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    trip = relationship("Trip", back_populates="notes")
    trip_stop = relationship("TripStop", back_populates="notes")

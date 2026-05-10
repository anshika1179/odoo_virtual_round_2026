from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    country = Column(String(100), nullable=False)
    region = Column(String(100), nullable=True)
    cost_index = Column(Float, default=1.0)
    popularity_score = Column(Float, default=0.0)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationships
    activities = relationship("Activity", back_populates="city")
    trip_stops = relationship("TripStop", back_populates="city")

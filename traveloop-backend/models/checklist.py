from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class PackingChecklist(Base):
    __tablename__ = "packing_checklist"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    item_name = Column(String(300), nullable=False)
    category = Column(String(50), nullable=False)  # CLOTHING/DOCUMENTS/ELECTRONICS/TOILETRIES/OTHER
    is_packed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trip = relationship("Trip", back_populates="checklist")

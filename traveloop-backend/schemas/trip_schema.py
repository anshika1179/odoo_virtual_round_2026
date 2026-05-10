from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ===== Trip Schemas =====
class TripCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    cover_photo_url: Optional[str] = None
    total_budget: Optional[float] = 0.0


class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cover_photo_url: Optional[str] = None
    total_budget: Optional[float] = None
    status: Optional[str] = None
    is_public: Optional[bool] = None


class StopResponse(BaseModel):
    id: int
    trip_id: int
    city_id: Optional[int] = None
    city_name: Optional[str] = None
    section_title: str
    description: Optional[str] = None
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    section_budget: float
    stop_order: int

    class Config:
        from_attributes = True


class TripResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    cover_photo_url: Optional[str] = None
    status: str
    is_public: bool
    share_token: Optional[str] = None
    total_budget: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    stops: Optional[List[StopResponse]] = []

    class Config:
        from_attributes = True


# ===== Stop Schemas =====
class StopCreate(BaseModel):
    city_id: Optional[int] = None
    section_title: str
    description: Optional[str] = None
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    section_budget: Optional[float] = 0.0
    stop_order: Optional[int] = 0


class StopUpdate(BaseModel):
    city_id: Optional[int] = None
    section_title: Optional[str] = None
    description: Optional[str] = None
    arrival_date: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    section_budget: Optional[float] = None
    stop_order: Optional[int] = None


class StopReorder(BaseModel):
    stop_ids: List[int]


# ===== Activity Schemas =====
class TripActivityCreate(BaseModel):
    activity_id: Optional[int] = None
    custom_name: Optional[str] = None
    planned_date: Optional[datetime] = None
    planned_time: Optional[str] = None
    actual_cost: Optional[float] = 0.0
    notes: Optional[str] = None


class TripActivityResponse(BaseModel):
    id: int
    trip_stop_id: int
    activity_id: Optional[int] = None
    activity_name: Optional[str] = None
    custom_name: Optional[str] = None
    planned_date: Optional[datetime] = None
    planned_time: Optional[str] = None
    actual_cost: float
    notes: Optional[str] = None

    class Config:
        from_attributes = True


# ===== Budget Schemas =====
class BudgetUpdate(BaseModel):
    transport_cost: Optional[float] = None
    accommodation_cost: Optional[float] = None
    food_cost: Optional[float] = None
    activity_cost: Optional[float] = None
    misc_cost: Optional[float] = None
    total_estimated: Optional[float] = None
    total_spent: Optional[float] = None
    currency: Optional[str] = None


class BudgetResponse(BaseModel):
    id: int
    trip_id: int
    transport_cost: float
    accommodation_cost: float
    food_cost: float
    activity_cost: float
    misc_cost: float
    total_estimated: float
    total_spent: float
    currency: str

    class Config:
        from_attributes = True


# ===== Expense Schemas =====
class ExpenseCreate(BaseModel):
    category: str
    description: str
    quantity: Optional[int] = 1
    unit_cost: float
    date_incurred: Optional[datetime] = None


class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit_cost: Optional[float] = None
    date_incurred: Optional[datetime] = None


class ExpenseResponse(BaseModel):
    id: int
    trip_id: int
    category: str
    description: str
    quantity: int
    unit_cost: float
    total_amount: float
    date_incurred: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== Checklist Schemas =====
class ChecklistCreate(BaseModel):
    item_name: str
    category: str


class ChecklistUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    is_packed: Optional[bool] = None


class ChecklistResponse(BaseModel):
    id: int
    trip_id: int
    item_name: str
    category: str
    is_packed: bool

    class Config:
        from_attributes = True


# ===== Note Schemas =====
class NoteCreate(BaseModel):
    trip_stop_id: Optional[int] = None
    note_date: Optional[datetime] = None
    title: str
    content: Optional[str] = None
    filter_type: Optional[str] = "ALL"


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_date: Optional[datetime] = None
    filter_type: Optional[str] = None
    is_active: Optional[bool] = None


class NoteResponse(BaseModel):
    id: int
    trip_id: int
    trip_stop_id: Optional[int] = None
    note_date: Optional[datetime] = None
    title: str
    content: Optional[str] = None
    filter_type: str
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== Community Schemas =====
class CommunityPostCreate(BaseModel):
    trip_id: Optional[int] = None
    title: str
    experience_text: Optional[str] = None
    image_url: Optional[str] = None


class CommunityPostResponse(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    trip_id: Optional[int] = None
    title: str
    experience_text: Optional[str] = None
    image_url: Optional[str] = None
    likes_count: int
    is_published: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== City & Activity Schemas =====
class CityResponse(BaseModel):
    id: int
    name: str
    country: str
    region: Optional[str] = None
    cost_index: float
    popularity_score: float
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class ActivityResponse(BaseModel):
    id: int
    city_id: int
    city_name: Optional[str] = None
    name: str
    type: str
    estimated_cost: float
    duration_hours: float
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

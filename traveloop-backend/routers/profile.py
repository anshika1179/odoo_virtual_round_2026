import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user_schema import UserResponse, UserUpdate
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

# Allowed image formats and max size (5MB)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")


@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("", response_model=UserResponse)
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/photo", response_model=UserResponse)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a profile photo for the authenticated user.

    - Accepts: .jpg, .jpeg, .png, .gif, .webp
    - Max size: 5 MB
    - Saves to: static/uploads/profile_{user_id}_{uuid}.{ext}
    - Deletes previous photo file if exists
    - Returns updated user object with profile_photo_url set
    """
    # Validate file extension
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    # Delete old photo if exists
    if current_user.profile_photo_url:
        old_path = current_user.profile_photo_url.replace("/static/", "")
        old_full_path = os.path.join(os.path.dirname(UPLOAD_DIR), old_path)
        if os.path.isfile(old_full_path):
            os.remove(old_full_path)

    # Generate unique filename
    unique_name = f"profile_{current_user.id}_{uuid.uuid4().hex[:12]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)

    # Update user record
    current_user.profile_photo_url = f"/static/uploads/{unique_name}"
    db.commit()
    db.refresh(current_user)

    return UserResponse.model_validate(current_user)


@router.delete("/photo", response_model=UserResponse)
def delete_profile_photo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove the user's profile photo."""
    if current_user.profile_photo_url:
        old_path = current_user.profile_photo_url.replace("/static/", "")
        old_full_path = os.path.join(os.path.dirname(UPLOAD_DIR), old_path)
        if os.path.isfile(old_full_path):
            os.remove(old_full_path)

    current_user.profile_photo_url = None
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.delete("")
def delete_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Clean up photo file before deleting account
    if current_user.profile_photo_url:
        old_path = current_user.profile_photo_url.replace("/static/", "")
        old_full_path = os.path.join(os.path.dirname(UPLOAD_DIR), old_path)
        if os.path.isfile(old_full_path):
            os.remove(old_full_path)
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted"}

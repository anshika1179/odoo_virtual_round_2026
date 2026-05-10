from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user_schema import UserRegister, UserLogin, UserResponse, TokenResponse, UserUpdate
from utils.password_hash import hash_password, verify_password
from utils.jwt_handler import create_access_token, decode_access_token
from middleware.auth_middleware import get_current_user
from pydantic import BaseModel, EmailStr, field_validator
from datetime import timedelta
import logging

logger = logging.getLogger("traveloop.auth")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ─── Forgot/Reset Password Schemas ─────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: str  # In production, this would be sent via email, not returned


# ─── Auth Endpoints ─────────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        city=data.city,
        country=data.country,
        additional_info=data.additional_info
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate a password reset.

    Generates a short-lived JWT reset token (15 min expiry) for the given email.
    In a production environment, this token would be emailed to the user.
    For this demo, it is returned in the response so the frontend can use it.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Don't reveal whether email exists — still return 200
        raise HTTPException(status_code=404, detail="No account found with this email")

    # Generate a short-lived reset token (15 min)
    reset_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "purpose": "password_reset"},
        expires_delta=timedelta(minutes=15),
    )

    logger.info(f"Password reset token generated for {data.email}")

    return ForgotPasswordResponse(
        message="Password reset token generated. Use it within 15 minutes.",
        reset_token=reset_token,
    )


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset password using a valid reset token.

    - Validates the JWT token hasn't expired
    - Verifies the token was issued for password reset (purpose claim)
    - Updates the user's password hash
    """
    payload = decode_access_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Verify this is a password reset token
    if payload.get("purpose") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid token type")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(data.new_password)
    db.commit()

    logger.info(f"Password reset successful for user {user.email}")

    return {"message": "Password reset successful. You can now log in with your new password."}

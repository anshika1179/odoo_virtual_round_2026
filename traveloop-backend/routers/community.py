import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.community import CommunityPost, PostLike
from models.user import User
from schemas.trip_schema import CommunityPostCreate, CommunityPostResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/community", tags=["Community"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def post_to_response(p, current_user_id=None):
    """Convert a CommunityPost ORM object to a response dict, including user_liked status."""
    liked_by_me = False
    if current_user_id:
        liked_by_me = any(like.user_id == current_user_id for like in (p.likes or []))
    return CommunityPostResponse(
        id=p.id, user_id=p.user_id, user_name=p.user.full_name if p.user else None,
        trip_id=p.trip_id, title=p.title, experience_text=p.experience_text,
        image_url=p.image_url, likes_count=p.likes_count, is_published=p.is_published,
        created_at=p.created_at, user_liked=liked_by_me
    )


@router.get("", response_model=list[CommunityPostResponse])
def list_posts(
    search: str = Query(None),
    sort_by: str = Query("created_at"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(CommunityPost).filter(CommunityPost.is_published == True)
    if search:
        query = query.filter(CommunityPost.title.ilike(f"%{search}%"))

    # Sort options
    if sort_by == "likes":
        query = query.order_by(CommunityPost.likes_count.desc())
    elif sort_by == "oldest":
        query = query.order_by(CommunityPost.created_at.asc())
    else:
        query = query.order_by(CommunityPost.created_at.desc())

    posts = query.limit(50).all()
    return [post_to_response(p, current_user.id) for p in posts]


@router.post("", response_model=CommunityPostResponse)
def create_post(data: CommunityPostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = CommunityPost(user_id=current_user.id, trip_id=data.trip_id, title=data.title,
                         experience_text=data.experience_text, image_url=data.image_url)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post_to_response(post, current_user.id)


@router.post("/upload-image")
async def upload_community_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload an image for a community post. Returns the URL to use in post creation."""
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 5 MB.")

    unique_name = f"community_{current_user.id}_{uuid.uuid4().hex[:12]}{ext}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    return {"image_url": f"/static/uploads/{unique_name}"}


@router.get("/{post_id}", response_model=CommunityPostResponse)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return post_to_response(p, current_user.id)


@router.put("/{post_id}/like")
def toggle_like(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Toggle like on a community post.

    - If the user hasn't liked the post → adds a like
    - If the user already liked the post → removes the like
    - Updates likes_count on the post accordingly
    - Returns current like count and whether the user now likes it
    """
    p = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if user already liked this post
    existing_like = db.query(PostLike).filter(
        PostLike.user_id == current_user.id,
        PostLike.post_id == post_id,
    ).first()

    if existing_like:
        # Unlike — remove the like
        db.delete(existing_like)
        p.likes_count = max(0, (p.likes_count or 0) - 1)
        db.commit()
        return {"likes_count": p.likes_count, "user_liked": False}
    else:
        # Like — add new like
        new_like = PostLike(user_id=current_user.id, post_id=post_id)
        db.add(new_like)
        p.likes_count = (p.likes_count or 0) + 1
        db.commit()
        return {"likes_count": p.likes_count, "user_liked": True}

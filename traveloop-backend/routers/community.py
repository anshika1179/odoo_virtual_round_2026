from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.community import CommunityPost
from models.user import User
from schemas.trip_schema import CommunityPostCreate, CommunityPostResponse
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/community", tags=["Community"])


@router.get("", response_model=list[CommunityPostResponse])
def list_posts(search: str = Query(None), sort_by: str = Query("created_at"), db: Session = Depends(get_db)):
    query = db.query(CommunityPost).filter(CommunityPost.is_published == True)
    if search:
        query = query.filter(CommunityPost.title.ilike(f"%{search}%"))
    posts = query.order_by(CommunityPost.created_at.desc()).limit(50).all()
    result = []
    for p in posts:
        result.append(CommunityPostResponse(
            id=p.id, user_id=p.user_id, user_name=p.user.full_name if p.user else None,
            trip_id=p.trip_id, title=p.title, experience_text=p.experience_text,
            image_url=p.image_url, likes_count=p.likes_count, is_published=p.is_published, created_at=p.created_at
        ))
    return result


@router.post("", response_model=CommunityPostResponse)
def create_post(data: CommunityPostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = CommunityPost(user_id=current_user.id, trip_id=data.trip_id, title=data.title,
                         experience_text=data.experience_text, image_url=data.image_url)
    db.add(post)
    db.commit()
    db.refresh(post)
    return CommunityPostResponse(
        id=post.id, user_id=post.user_id, user_name=current_user.full_name,
        trip_id=post.trip_id, title=post.title, experience_text=post.experience_text,
        image_url=post.image_url, likes_count=post.likes_count, is_published=post.is_published, created_at=post.created_at
    )


@router.get("/{post_id}", response_model=CommunityPostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    p = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return CommunityPostResponse(
        id=p.id, user_id=p.user_id, user_name=p.user.full_name if p.user else None,
        trip_id=p.trip_id, title=p.title, experience_text=p.experience_text,
        image_url=p.image_url, likes_count=p.likes_count, is_published=p.is_published, created_at=p.created_at
    )


@router.put("/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    p = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    p.likes_count = (p.likes_count or 0) + 1
    db.commit()
    return {"likes_count": p.likes_count}

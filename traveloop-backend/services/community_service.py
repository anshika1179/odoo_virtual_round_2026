"""Community business logic service layer."""
from sqlalchemy.orm import Session
from models.community import CommunityPost, PostLike
from fastapi import HTTPException


def get_posts(db: Session, skip: int = 0, limit: int = 20, user_id: int = None):
    """Get community posts with like status for current user."""
    posts = db.query(CommunityPost).order_by(
        CommunityPost.created_at.desc()
    ).offset(skip).limit(limit).all()

    result = []
    for post in posts:
        post_dict = {
            "id": post.id,
            "user_id": post.user_id,
            "author_name": post.author_name,
            "title": post.title,
            "content": post.content,
            "image_url": post.image_url,
            "likes_count": post.likes_count,
            "created_at": str(post.created_at),
            "user_liked": False,
        }
        if user_id:
            like = db.query(PostLike).filter(
                PostLike.post_id == post.id,
                PostLike.user_id == user_id
            ).first()
            post_dict["user_liked"] = like is not None
        result.append(post_dict)
    return result


def create_post(db: Session, user_id: int, author_name: str, post_data: dict) -> CommunityPost:
    """Create a new community post."""
    post = CommunityPost(
        user_id=user_id,
        author_name=author_name,
        title=post_data.get("title", ""),
        content=post_data["content"],
        image_url=post_data.get("image_url"),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def toggle_like(db: Session, post_id: int, user_id: int) -> dict:
    """Toggle like on a post. Returns updated like state."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == user_id
    ).first()

    if existing:
        db.delete(existing)
        post.likes_count = max(0, (post.likes_count or 1) - 1)
        user_liked = False
    else:
        db.add(PostLike(post_id=post_id, user_id=user_id))
        post.likes_count = (post.likes_count or 0) + 1
        user_liked = True

    db.commit()
    return {"likes_count": post.likes_count, "user_liked": user_liked}

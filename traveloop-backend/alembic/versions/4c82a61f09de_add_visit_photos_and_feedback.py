"""Add visit photos and community feedback.

Revision ID: 4c82a61f09de
Revises: 39e0654a6ac2
"""
from alembic import op
import sqlalchemy as sa

revision = '4c82a61f09de'
down_revision = '39e0654a6ac2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('post_photos',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('post_id', sa.Integer(), sa.ForeignKey('community_posts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('image_url', sa.String(500), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False, server_default='0'))
    op.create_index('ix_post_photos_id', 'post_photos', ['id'])
    op.create_table('post_comments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('post_id', sa.Integer(), sa.ForeignKey('community_posts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index('ix_post_comments_id', 'post_comments', ['id'])


def downgrade():
    op.drop_index('ix_post_comments_id', table_name='post_comments')
    op.drop_table('post_comments')
    op.drop_index('ix_post_photos_id', table_name='post_photos')
    op.drop_table('post_photos')

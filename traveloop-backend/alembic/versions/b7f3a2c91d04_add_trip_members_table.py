"""Add trip members (group trip invitations).

Revision ID: b7f3a2c91d04
Revises: 4c82a61f09de
"""
from alembic import op
import sqlalchemy as sa

revision = 'b7f3a2c91d04'
down_revision = '4c82a61f09de'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('trip_members',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('trip_id', sa.Integer(), sa.ForeignKey('trips.id'), nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('status', sa.String(20), nullable=True, server_default='PENDING'),
        sa.Column('invited_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('trip_id', 'user_id', name='uq_trip_member'))
    op.create_index('ix_trip_members_id', 'trip_members', ['id'])


def downgrade():
    op.drop_index('ix_trip_members_id', table_name='trip_members')
    op.drop_table('trip_members')

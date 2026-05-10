"""
Alembic Environment Configuration for Traveloop.

This file connects Alembic to our SQLAlchemy models and database,
enabling auto-generation of migrations from model changes.
"""

import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Ensure the project root is on sys.path ────────────────────────
# This allows importing database.py and models from the backend root.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ── Import our project's Base and DATABASE_URL ────────────────────
from database import Base, DATABASE_URL

# Import ALL models so that Base.metadata knows about every table.
# Without these imports, autogenerate won't detect any tables.
import models.user
import models.trip
import models.city
import models.activity
import models.stop
import models.budget
import models.checklist
import models.note
import models.community

# ── Alembic Config object ────────────────────────────────────────
config = context.config

# Set the sqlalchemy.url programmatically from our database.py
# This avoids hardcoding credentials in alembic.ini
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Target metadata for autogenerate ─────────────────────────────
# This is our DeclarativeBase.metadata — Alembic will diff this
# against the actual database schema to auto-generate migrations.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine,
    though an Engine is acceptable here as well. By skipping the Engine
    creation we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Compare types to detect column type changes
        compare_type=True,
        # Render items with proper naming conventions
        render_as_batch=True,  # Required for SQLite ALTER TABLE support
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine and associate a
    connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # Compare types to detect column type changes
            compare_type=True,
            # render_as_batch=True is critical for SQLite support.
            # SQLite doesn't support ALTER TABLE for most operations,
            # so Alembic uses batch mode (recreate table) instead.
            render_as_batch=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

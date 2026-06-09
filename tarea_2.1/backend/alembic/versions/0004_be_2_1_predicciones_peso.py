"""BE-2.1 predicciones de peso por IA

Revision ID: 0004_be_2_1
Revises: 0003_be_2_2
Create Date: 2026-06-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0004_be_2_1"
down_revision = "0003_be_2_2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "predicciones_peso",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id"), nullable=True),
        sa.Column("snapshot_url", sa.Text(), nullable=True),
        sa.Column("image_hash", sa.String(length=64), nullable=False),
        sa.Column("peso_estimado", sa.Numeric(8, 2), nullable=False),
        sa.Column("confidence", sa.Numeric(4, 2), nullable=False),
        sa.Column("model_version", sa.String(length=80), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_predicciones_peso_animal_id", "predicciones_peso", ["animal_id"])
    op.create_index("ix_predicciones_peso_image_hash", "predicciones_peso", ["image_hash"])


def downgrade() -> None:
    op.drop_index("ix_predicciones_peso_image_hash", table_name="predicciones_peso")
    op.drop_index("ix_predicciones_peso_animal_id", table_name="predicciones_peso")
    op.drop_table("predicciones_peso")

"""BE-2.2 motor de reglas para alertas automaticas

Revision ID: 0003_be_2_2
Revises: 0002_be_1_2
Create Date: 2026-06-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0003_be_2_2"
down_revision = "0002_be_1_2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "reglas_alerta",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("tipo_evento", sa.String(length=100), nullable=True),
        sa.Column("condicion", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("severidad", sa.String(length=30), nullable=False, server_default="media"),
        sa.Column("canal", sa.String(length=80), nullable=False, server_default="dashboard"),
        sa.Column("mensaje", sa.Text(), nullable=True),
        sa.Column("activa", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_reglas_alerta_tipo_evento", "reglas_alerta", ["tipo_evento"])


def downgrade() -> None:
    op.drop_index("ix_reglas_alerta_tipo_evento", table_name="reglas_alerta")
    op.drop_table("reglas_alerta")

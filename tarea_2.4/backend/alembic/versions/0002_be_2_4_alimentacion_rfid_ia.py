"""BE-2.4 alimentacion RFID IA

Revision ID: 0002_be_2_4_alimentacion
Revises: 0001_modelo_inicial
Create Date: 2026-06-11
"""
from alembic import op
import sqlalchemy as sa


revision = "0002_be_2_4_alimentacion"
down_revision = "0001_modelo_inicial"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "eventos_rfid",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id"), nullable=False),
        sa.Column("rfid", sa.String(length=80), nullable=False),
        sa.Column("tipo_evento", sa.String(length=20), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ubicacion", sa.String(length=180), nullable=False),
        sa.CheckConstraint("tipo_evento IN ('entrada', 'salida')", name="ck_eventos_rfid_tipo_evento"),
    )
    op.create_index("ix_eventos_rfid_animal_id", "eventos_rfid", ["animal_id"])
    op.create_index("ix_eventos_rfid_timestamp", "eventos_rfid", ["timestamp"])

    op.create_table(
        "detecciones_ia_alimentacion",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id"), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ubicacion", sa.String(length=180), nullable=False),
        sa.Column("comiendo", sa.Boolean(), nullable=False),
        sa.Column("confidence", sa.Numeric(5, 4), nullable=True),
        sa.CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 1)",
            name="ck_detecciones_ia_alimentacion_confidence",
        ),
    )
    op.create_index("ix_detecciones_ia_alimentacion_animal_id", "detecciones_ia_alimentacion", ["animal_id"])
    op.create_index("ix_detecciones_ia_alimentacion_timestamp", "detecciones_ia_alimentacion", ["timestamp"])

    op.create_table(
        "eventos_alimentacion",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id"), nullable=False),
        sa.Column("lote_id", sa.Integer(), sa.ForeignKey("lotes.id"), nullable=False),
        sa.Column("rfid_in", sa.DateTime(timezone=True), nullable=False),
        sa.Column("rfid_out", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duracion_segundos", sa.Integer(), nullable=True),
        sa.Column("ubicacion", sa.String(length=180), nullable=True),
        sa.Column("confidence", sa.Numeric(5, 4), nullable=True),
        sa.Column("estado", sa.String(length=20), nullable=False, server_default="abierto"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("estado IN ('abierto', 'cerrado', 'anomalia')", name="ck_eventos_alimentacion_estado"),
        sa.CheckConstraint(
            "confidence IS NULL OR (confidence >= 0 AND confidence <= 1)",
            name="ck_eventos_alimentacion_confidence",
        ),
    )
    op.create_index("ix_eventos_alimentacion_animal_id", "eventos_alimentacion", ["animal_id"])
    op.create_index("ix_eventos_alimentacion_lote_id", "eventos_alimentacion", ["lote_id"])
    op.create_index("ix_eventos_alimentacion_rfid_in", "eventos_alimentacion", ["rfid_in"])


def downgrade():
    op.drop_index("ix_eventos_alimentacion_rfid_in", table_name="eventos_alimentacion")
    op.drop_index("ix_eventos_alimentacion_lote_id", table_name="eventos_alimentacion")
    op.drop_index("ix_eventos_alimentacion_animal_id", table_name="eventos_alimentacion")
    op.drop_table("eventos_alimentacion")

    op.drop_index("ix_detecciones_ia_alimentacion_timestamp", table_name="detecciones_ia_alimentacion")
    op.drop_index("ix_detecciones_ia_alimentacion_animal_id", table_name="detecciones_ia_alimentacion")
    op.drop_table("detecciones_ia_alimentacion")

    op.drop_index("ix_eventos_rfid_timestamp", table_name="eventos_rfid")
    op.drop_index("ix_eventos_rfid_animal_id", table_name="eventos_rfid")
    op.drop_table("eventos_rfid")

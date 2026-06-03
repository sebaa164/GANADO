"""BE-1.2 camaras y frames capturados

Revision ID: be_1_2_camaras_frames
Revises: be_0_4_modelo_inicial
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa


revision = "be_1_2_camaras_frames"
down_revision = "be_0_4_modelo_inicial"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "camaras",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nombre", sa.String(length=120), nullable=False),
        sa.Column("ubicacion", sa.String(length=180), nullable=False),
        sa.Column("rtsp_url", sa.Text(), nullable=False),
        sa.Column("fps_captura", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("resolucion", sa.String(length=30), nullable=True, server_default="1280x720"),
        sa.Column("activa", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("last_frame_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "frames_camaras",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("camara_id", sa.Integer(), sa.ForeignKey("camaras.id"), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("snapshot_path", sa.Text(), nullable=False),
        sa.Column("snapshot_url", sa.Text(), nullable=False),
        sa.Column("estado", sa.String(length=30), nullable=False, server_default="capturado"),
    )
    op.create_index("ix_frames_camaras_camara_id", "frames_camaras", ["camara_id"])


def downgrade():
    op.drop_index("ix_frames_camaras_camara_id", table_name="frames_camaras")
    op.drop_table("frames_camaras")
    op.drop_table("camaras")

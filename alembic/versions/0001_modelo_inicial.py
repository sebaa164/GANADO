"""modelo inicial fase 0

Revision ID: 0001_modelo_inicial
Revises:
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_modelo_inicial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("empresas", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("nombre", sa.String(150), nullable=False), sa.Column("cuit", sa.String(20), unique=True), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("roles", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("nombre", sa.String(80), unique=True, nullable=False), sa.Column("descripcion", sa.String(255)))
    op.create_table("permisos", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("codigo", sa.String(120), unique=True, nullable=False), sa.Column("descripcion", sa.String(255)))
    op.create_table("establecimientos", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("empresas.id"), nullable=False), sa.Column("nombre", sa.String(150), nullable=False), sa.Column("latitud", sa.Numeric(10,7)), sa.Column("longitud", sa.Numeric(10,7)), sa.Column("descripcion", sa.Text()))
    op.create_table("usuarios", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("empresas.id"), nullable=False), sa.Column("nombre", sa.String(100), nullable=False), sa.Column("email", sa.String(150), unique=True, nullable=False), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("activo", sa.Boolean(), server_default="true", nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("usuario_rol", sa.Column("usuario_id", sa.Integer(), sa.ForeignKey("usuarios.id"), primary_key=True), sa.Column("rol_id", sa.Integer(), sa.ForeignKey("roles.id"), primary_key=True))
    op.create_table("rol_permiso", sa.Column("rol_id", sa.Integer(), sa.ForeignKey("roles.id"), primary_key=True), sa.Column("permiso_id", sa.Integer(), sa.ForeignKey("permisos.id"), primary_key=True))
    op.create_table("corrales", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("establecimiento_id", sa.Integer(), sa.ForeignKey("establecimientos.id"), nullable=False), sa.Column("codigo", sa.String(50), nullable=False), sa.Column("capacidad", sa.Integer()), sa.Column("superficie_m2", sa.Numeric(10,2)), sa.Column("frente_comedero_m", sa.Numeric(10,2)))
    op.create_table("lotes", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("corral_id", sa.Integer(), sa.ForeignKey("corrales.id"), nullable=False), sa.Column("nombre", sa.String(100), nullable=False), sa.Column("categoria", sa.String(80)), sa.Column("fecha_inicio", sa.DateTime(timezone=True)))
    op.create_table("animales", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("lote_id", sa.Integer(), sa.ForeignKey("lotes.id"), nullable=False), sa.Column("rfid", sa.String(80), nullable=False), sa.Column("numero_caravana", sa.String(80)), sa.Column("raza", sa.String(100)), sa.Column("sexo", sa.String(20)), sa.Column("estado", sa.String(50), server_default="activo", nullable=False), sa.Column("peso_ingreso", sa.Numeric(8,2)), sa.Column("fecha_ingreso", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.UniqueConstraint("rfid", name="uq_animales_rfid"))
    op.create_table("pesajes", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id"), nullable=False), sa.Column("fecha", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("peso_estimado", sa.Numeric(8,2), nullable=False), sa.Column("metodo", sa.String(50), nullable=False), sa.Column("margen_error", sa.Numeric(5,2)))
    op.create_table("alertas", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("animal_id", sa.Integer(), sa.ForeignKey("animales.id")), sa.Column("corral_id", sa.Integer(), sa.ForeignKey("corrales.id")), sa.Column("tipo", sa.String(80), nullable=False), sa.Column("severidad", sa.String(30), nullable=False), sa.Column("estado", sa.String(30), server_default="abierta", nullable=False), sa.Column("descripcion", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("auditoria_logs", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("usuario_id", sa.Integer()), sa.Column("accion", sa.String(120), nullable=False), sa.Column("entidad", sa.String(120), nullable=False), sa.Column("entidad_id", sa.String(80)), sa.Column("datos", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))


def downgrade():
    for table in ["auditoria_logs", "alertas", "pesajes", "animales", "lotes", "corrales", "rol_permiso", "usuario_rol", "usuarios", "establecimientos", "permisos", "roles", "empresas"]:
        op.drop_table(table)

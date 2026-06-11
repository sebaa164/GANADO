from alembic import op
import sqlalchemy as sa

revision = "0005_be_2_5_stock_insumos"
down_revision = "0004_be_2_1_predicciones_peso"
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "proveedores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("telefono", sa.String(length=80), nullable=True),
        sa.Column("email", sa.String(length=150), nullable=True),
        sa.Column("direccion", sa.String(length=250), nullable=True),
    )

    op.create_table(
        "insumos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("tipo", sa.String(length=50), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("stock_actual", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("stock_minimo", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("unidad_medida", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )

    op.create_table(
        "movimientos_stock",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("insumo_id", sa.Integer(), sa.ForeignKey("insumos.id"), nullable=False),
        sa.Column("tipo_movimiento", sa.String(length=20), nullable=False),
        sa.Column("cantidad", sa.Numeric(12, 2), nullable=False),
        sa.Column("observacion", sa.Text(), nullable=True),
        sa.Column("fecha_movimiento", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade():
    op.drop_table("movimientos_stock")
    op.drop_table("insumos")
    op.drop_table("proveedores")

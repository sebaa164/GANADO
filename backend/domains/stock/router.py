from fastapi import APIRouter, Depends
from core.db import get_db
from domains.stock.schemas import *
from domains.stock.service import *
router=APIRouter(prefix="/api/v1/stock",tags=["Stock"])

@router.get("/proveedores")
async def proveedores(db=Depends(get_db)): return await listar_proveedores(db)
@router.get("/proveedores/{proveedor_id}")
async def proveedor(proveedor_id:int,db=Depends(get_db)): return await obtener_proveedor(db,proveedor_id)
@router.post("/proveedores")
async def proveedor_crear(data:ProveedorCreate,db=Depends(get_db)): return await crear_proveedor(db,data)
@router.put("/proveedores/{proveedor_id}")
async def proveedor_upd(proveedor_id:int,data:ProveedorUpdate,db=Depends(get_db)): return await actualizar_proveedor(db,proveedor_id,data)
@router.delete("/proveedores/{proveedor_id}")
async def proveedor_del(proveedor_id:int,db=Depends(get_db)): return await eliminar_proveedor(db,proveedor_id)

@router.get("/insumos")
async def get_insumos(db=Depends(get_db)): return await listar_insumos(db)
@router.get("/insumos/{insumo_id}")
async def get_insumo(insumo_id:int,db=Depends(get_db)): return await obtener_insumo(db,insumo_id)
@router.post("/insumos")
async def post_insumo(data:InsumoCreate,db=Depends(get_db)): return await crear_insumo(db,data)
@router.put("/insumos/{insumo_id}")
async def put_insumo(insumo_id:int,data:InsumoUpdate,db=Depends(get_db)): return await actualizar_insumo(db,insumo_id,data)
@router.delete("/insumos/{insumo_id}")
async def del_insumo(insumo_id:int,db=Depends(get_db)): return await eliminar_insumo(db,insumo_id)
@router.post("/movimientos")
async def mov(data:MovimientoCreate,db=Depends(get_db)): return await registrar_movimiento(db,data)
@router.get("/saldos")
async def saldos(db=Depends(get_db)): return await saldos_stock(db)

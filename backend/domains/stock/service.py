from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy import select
from domains.stock.models import Insumo, MovimientoStock, Proveedor

async def listar_proveedores(db):
    r=await db.execute(select(Proveedor))
    return r.scalars().all()

async def obtener_proveedor(db,id):
    x=await db.get(Proveedor,id)
    if not x: raise HTTPException(404,"Proveedor no encontrado")
    return x

async def crear_proveedor(db,data):
    x=Proveedor(**data.model_dump())
    db.add(x); await db.commit(); await db.refresh(x); return x

async def actualizar_proveedor(db,id,data):
    x=await obtener_proveedor(db,id)
    for k,v in data.model_dump(exclude_unset=True).items(): setattr(x,k,v)
    await db.commit(); await db.refresh(x); return x

async def eliminar_proveedor(db,id):
    x=await obtener_proveedor(db,id)
    await db.delete(x); await db.commit(); return {"ok":True}

async def listar_insumos(db):
    r=await db.execute(select(Insumo)); return r.scalars().all()

async def obtener_insumo(db,id):
    x=await db.get(Insumo,id)
    if not x: raise HTTPException(404,"Insumo no encontrado")
    return x

async def crear_insumo(db,data):
    x=Insumo(**data.model_dump()); db.add(x); await db.commit(); await db.refresh(x); return x

async def actualizar_insumo(db,id,data):
    x=await obtener_insumo(db,id)
    for k,v in data.model_dump(exclude_unset=True).items(): setattr(x,k,v)
    await db.commit(); await db.refresh(x); return x

async def eliminar_insumo(db,id):
    x=await obtener_insumo(db,id); await db.delete(x); await db.commit(); return {"ok":True}

async def registrar_movimiento(db,data):
    if data.cantidad<=0: raise HTTPException(400,"Cantidad inválida")
    if data.tipo_movimiento not in ["ingreso","egreso","ajuste"]: raise HTTPException(400,"Tipo inválido")
    insumo=await obtener_insumo(db,data.insumo_id)
    cantidad=Decimal(str(data.cantidad))
    if data.tipo_movimiento=="ingreso":
        insumo.stock_actual=Decimal(str(insumo.stock_actual))+cantidad
    elif data.tipo_movimiento=="egreso":
        nuevo=Decimal(str(insumo.stock_actual))-cantidad
        if nuevo<0: raise HTTPException(400,"Stock insuficiente")
        insumo.stock_actual=nuevo
    else:
        if not data.observacion: raise HTTPException(400,"El ajuste requiere observación")
        insumo.stock_actual=cantidad
    mov=MovimientoStock(**data.model_dump())
    db.add(mov); await db.commit(); await db.refresh(mov); return mov

async def saldos_stock(db):
    r=await db.execute(select(Insumo))
    insumos=r.scalars().all()
    return [{"id":i.id,"nombre":i.nombre,"stock_actual":float(i.stock_actual),"stock_minimo":float(i.stock_minimo),"stock_bajo":i.stock_actual<i.stock_minimo,"faltante":max(float(i.stock_minimo-i.stock_actual),0)} for i in insumos]

from sqlalchemy import select
from domains.stock.models import Insumo
async def verificar_stock_minimo(db):
    r=await db.execute(select(Insumo))
    return [{"insumo_id":i.id,"nombre":i.nombre,"stock_actual":float(i.stock_actual),"stock_minimo":float(i.stock_minimo),"mensaje":"Stock por debajo del mínimo"} for i in r.scalars().all() if i.stock_actual<i.stock_minimo]

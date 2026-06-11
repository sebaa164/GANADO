from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from domains.alimentacion.schemas import (
    AnomaliasMarcadasRead,
    AnomaliaConsumoRead,
    EventoAlimentacionRead,
    IaDeteccionCreate,
    MensajeCorrelacionRead,
    PromedioDiarioLoteRead,
    RfidEventoCreate,
)
from domains.alimentacion.service import (
    crear_deteccion_ia,
    crear_evento_rfid,
    listar_anomalias_animal,
    listar_eventos_animal,
    marcar_anomalias_animal,
    normalizar_datetime,
    obtener_promedios_diarios_lote,
)
from domains.alimentacion.worker import correlacionar_eventos_alimentacion

router = APIRouter(prefix="/api/v1/alimentacion", tags=["Alimentación"])


def validar_rango_fechas(desde: datetime | None, hasta: datetime | None) -> None:
    if desde is not None and hasta is not None and normalizar_datetime(desde) > normalizar_datetime(hasta):
        raise HTTPException(status_code=422, detail="desde no puede ser mayor que hasta")


@router.post("/rfid", status_code=201)
async def registrar_evento_rfid(data: RfidEventoCreate, db: AsyncSession = Depends(get_db)):
    return await crear_evento_rfid(db, data)


@router.post("/ia", status_code=201)
async def registrar_deteccion_ia(data: IaDeteccionCreate, db: AsyncSession = Depends(get_db)):
    return await crear_deteccion_ia(db, data)


@router.post("/correlacionar", response_model=MensajeCorrelacionRead)
async def correlacionar(db: AsyncSession = Depends(get_db)):
    return await correlacionar_eventos_alimentacion(db)


@router.get("/animal/{id}", response_model=list[EventoAlimentacionRead])
async def obtener_consumo_animal(
    id: int = Path(..., gt=0),
    desde: datetime | None = Query(default=None),
    hasta: datetime | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    validar_rango_fechas(desde, hasta)
    return await listar_eventos_animal(db, id, desde, hasta)


@router.get("/lotes/promedios-diarios", response_model=list[PromedioDiarioLoteRead])
async def obtener_promedios_diarios(
    desde: datetime | None = Query(default=None),
    hasta: datetime | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    validar_rango_fechas(desde, hasta)
    return await obtener_promedios_diarios_lote(db, desde, hasta)


@router.get("/animal/{id}/anomalias", response_model=list[AnomaliaConsumoRead])
async def obtener_anomalias_animal(
    id: int = Path(..., gt=0),
    desde: datetime | None = Query(default=None),
    hasta: datetime | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    validar_rango_fechas(desde, hasta)
    return await listar_anomalias_animal(db, id, desde, hasta)


@router.post("/animal/{id}/detectar-anomalias", response_model=AnomaliasMarcadasRead)
async def detectar_y_marcar_anomalias_animal(
    id: int = Path(..., gt=0),
    desde: datetime | None = Query(default=None),
    hasta: datetime | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    validar_rango_fechas(desde, hasta)
    return await marcar_anomalias_animal(db, id, desde, hasta)

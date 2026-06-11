from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import get_db
from domains.alertas.models import ReglaAlerta
from domains.alertas.schemas import (
    AlertaRead,
    EventoParaEvaluar,
    EvaluacionResultado,
    ReglaAlertaCreate,
    ReglaAlertaRead,
    ReglaAlertaUpdate,
)
from domains.alertas.service import evaluar_evento_y_generar_alertas
from domains.ganado.models import Alerta

router = APIRouter(prefix="/api/v1/alertas", tags=["Alertas"])


@router.post("/reglas", response_model=ReglaAlertaRead, status_code=201)
async def crear_regla(data: ReglaAlertaCreate, db: AsyncSession = Depends(get_db)):
    regla = ReglaAlerta(**data.model_dump())
    db.add(regla)
    await db.commit()
    await db.refresh(regla)
    return regla


@router.get("/reglas", response_model=list[ReglaAlertaRead])
async def listar_reglas(
    activa: Optional[bool] = Query(default=None),
    tipo_evento: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    filtros = []
    if activa is not None:
        filtros.append(ReglaAlerta.activa == activa)
    if tipo_evento:
        filtros.append(ReglaAlerta.tipo_evento == tipo_evento)

    stmt = select(ReglaAlerta)
    if filtros:
        stmt = stmt.where(and_(*filtros))
    stmt = stmt.order_by(ReglaAlerta.id.asc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/reglas/{regla_id}", response_model=ReglaAlertaRead)
async def actualizar_regla(regla_id: int, data: ReglaAlertaUpdate, db: AsyncSession = Depends(get_db)):
    regla = await db.get(ReglaAlerta, regla_id)
    if not regla:
        raise HTTPException(status_code=404, detail="Regla no encontrada")

    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(regla, campo, valor)

    await db.commit()
    await db.refresh(regla)
    return regla


@router.delete("/reglas/{regla_id}", response_model=ReglaAlertaRead)
async def desactivar_regla(regla_id: int, db: AsyncSession = Depends(get_db)):
    regla = await db.get(ReglaAlerta, regla_id)
    if not regla:
        raise HTTPException(status_code=404, detail="Regla no encontrada")

    regla.activa = False
    await db.commit()
    await db.refresh(regla)
    return regla


@router.post("/evaluar-evento", response_model=EvaluacionResultado)
async def evaluar_evento(evento: EventoParaEvaluar, db: AsyncSession = Depends(get_db)):
    reglas_evaluadas, alertas_creadas = await evaluar_evento_y_generar_alertas(
        tipo_evento=evento.tipo_evento,
        payload=evento.payload,
        db=db,
    )
    return EvaluacionResultado(
        evento=evento.tipo_evento,
        reglas_evaluadas=reglas_evaluadas,
        alertas_creadas=len(alertas_creadas),
        alertas=alertas_creadas,
    )


@router.get("", response_model=list[AlertaRead])
async def listar_alertas(
    severidad: Optional[str] = Query(default=None),
    estado: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    filtros = []
    if severidad:
        filtros.append(Alerta.severidad == severidad)
    if estado:
        filtros.append(Alerta.estado == estado)

    stmt = select(Alerta)
    if filtros:
        stmt = stmt.where(and_(*filtros))
    stmt = stmt.order_by(Alerta.created_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/{alerta_id}/resolver", response_model=AlertaRead)
async def resolver_alerta(alerta_id: int, db: AsyncSession = Depends(get_db)):
    alerta = await db.get(Alerta, alerta_id)
    if not alerta:
        raise HTTPException(status_code=404, detail="Alerta no encontrada")

    alerta.estado = "resuelta"
    await db.commit()
    await db.refresh(alerta)
    return alerta

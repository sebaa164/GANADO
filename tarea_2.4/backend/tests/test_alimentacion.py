import asyncio
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete, select

from api_gateway.main import app
from core.db import AsyncSessionLocal
from domains.alimentacion.models import DeteccionIaAlimentacion, EventoAlimentacion, EventoRfid
from domains.estructura.models import Corral, Empresa, Establecimiento, Lote
from domains.ganado.models import Animal


client = TestClient(app)


async def crear_datos_base():
    suffix = uuid4().hex[:8]
    async with AsyncSessionLocal() as db:
        empresa = Empresa(nombre=f"Empresa Test BE24 {suffix}", cuit=f"BE24-{suffix}")
        db.add(empresa)
        await db.flush()

        establecimiento = Establecimiento(empresa_id=empresa.id, nombre=f"Establecimiento Test {suffix}")
        db.add(establecimiento)
        await db.flush()

        corral = Corral(establecimiento_id=establecimiento.id, codigo=f"COR-{suffix}")
        db.add(corral)
        await db.flush()

        lote = Lote(corral_id=corral.id, nombre=f"Lote Test {suffix}", categoria="test")
        db.add(lote)
        await db.flush()

        animal = Animal(lote_id=lote.id, rfid=f"RFID-BE24-{suffix}", numero_caravana=f"CAR-{suffix}")
        db.add(animal)
        await db.flush()
        await db.commit()

        return {
            "empresa_id": empresa.id,
            "establecimiento_id": establecimiento.id,
            "corral_id": corral.id,
            "lote_id": lote.id,
            "animal_id": animal.id,
            "rfid": animal.rfid,
        }


async def limpiar_datos_base(data):
    async with AsyncSessionLocal() as db:
        await db.execute(delete(EventoAlimentacion).where(EventoAlimentacion.animal_id == data["animal_id"]))
        await db.execute(delete(EventoRfid).where(EventoRfid.animal_id == data["animal_id"]))
        await db.execute(delete(DeteccionIaAlimentacion).where(DeteccionIaAlimentacion.animal_id == data["animal_id"]))
        await db.execute(delete(Animal).where(Animal.id == data["animal_id"]))
        await db.execute(delete(Lote).where(Lote.id == data["lote_id"]))
        await db.execute(delete(Corral).where(Corral.id == data["corral_id"]))
        await db.execute(delete(Establecimiento).where(Establecimiento.id == data["establecimiento_id"]))
        await db.execute(delete(Empresa).where(Empresa.id == data["empresa_id"]))
        await db.commit()


async def obtener_eventos_consumo(animal_id):
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(EventoAlimentacion)
            .where(EventoAlimentacion.animal_id == animal_id)
            .order_by(EventoAlimentacion.rfid_in)
        )
        return list(result.scalars().all())


@pytest.fixture()
def datos_base():
    data = asyncio.run(crear_datos_base())
    try:
        yield data
    finally:
        asyncio.run(limpiar_datos_base(data))


def test_flujo_alimentacion_rfid_ia_y_anomalias(datos_base):
    animal_id = datos_base["animal_id"]
    lote_id = datos_base["lote_id"]
    rfid = datos_base["rfid"]
    ubicacion = "comedero_test_be24"

    response = client.post(
        "/api/v1/alimentacion/rfid",
        json={
            "animal_id": animal_id,
            "rfid": "RFID-INCORRECTO",
            "tipo_evento": "entrada",
            "timestamp": "2026-06-11T09:50:00Z",
            "ubicacion": ubicacion,
        },
    )
    assert response.status_code == 422, response.text
    assert "no coincide" in response.json()["detail"]

    response = client.post(
        "/api/v1/alimentacion/rfid",
        json={
            "animal_id": animal_id,
            "rfid": rfid,
            "tipo_evento": "entrada",
            "timestamp": "2026-06-11T10:00:00Z",
            "ubicacion": ubicacion,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post(
        "/api/v1/alimentacion/ia",
        json={
            "animal_id": animal_id,
            "timestamp": "2026-06-11T10:02:00Z",
            "ubicacion": ubicacion,
            "comiendo": True,
            "confidence": 0.91,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post("/api/v1/alimentacion/correlacionar")
    assert response.status_code == 200, response.text
    assert response.json()["eventos_abiertos"] == 1

    response = client.post("/api/v1/alimentacion/correlacionar")
    assert response.status_code == 200, response.text
    assert response.json()["eventos_abiertos"] == 0

    eventos_db = asyncio.run(obtener_eventos_consumo(animal_id))
    assert len([evento for evento in eventos_db if evento.estado == "abierto"]) == 1

    response = client.post(
        "/api/v1/alimentacion/rfid",
        json={
            "animal_id": animal_id,
            "rfid": rfid,
            "tipo_evento": "salida",
            "timestamp": "2026-06-11T10:10:00Z",
            "ubicacion": ubicacion,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post("/api/v1/alimentacion/correlacionar")
    assert response.status_code == 200, response.text
    assert response.json()["eventos_cerrados"] == 1

    response = client.get(
        f"/api/v1/alimentacion/animal/{animal_id}",
        params={"desde": "2026-06-11T00:00:00Z", "hasta": "2026-06-11T23:59:59Z"},
    )
    assert response.status_code == 200, response.text
    eventos = response.json()
    assert len(eventos) == 1
    assert eventos[0]["animal_id"] == animal_id
    assert eventos[0]["duracion_segundos"] == 600

    response = client.post(
        "/api/v1/alimentacion/rfid",
        json={
            "animal_id": animal_id,
            "rfid": rfid,
            "tipo_evento": "entrada",
            "timestamp": "2026-06-11T11:00:00Z",
            "ubicacion": ubicacion,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post(
        "/api/v1/alimentacion/ia",
        json={
            "animal_id": animal_id,
            "timestamp": "2026-06-11T11:00:20Z",
            "ubicacion": ubicacion,
            "comiendo": True,
            "confidence": 0.88,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post("/api/v1/alimentacion/correlacionar")
    assert response.status_code == 200, response.text
    assert response.json()["eventos_abiertos"] == 1

    response = client.post(
        "/api/v1/alimentacion/rfid",
        json={
            "animal_id": animal_id,
            "rfid": rfid,
            "tipo_evento": "salida",
            "timestamp": "2026-06-11T11:01:40Z",
            "ubicacion": ubicacion,
        },
    )
    assert response.status_code == 201, response.text

    response = client.post("/api/v1/alimentacion/correlacionar")
    assert response.status_code == 200, response.text
    assert response.json()["eventos_cerrados"] == 1

    response = client.get(
        "/api/v1/alimentacion/lotes/promedios-diarios",
        params={"desde": "2026-06-11T00:00:00Z", "hasta": "2026-06-11T23:59:59Z"},
    )
    assert response.status_code == 200, response.text
    promedio = next(item for item in response.json() if item["lote_id"] == lote_id and item["fecha"] == "2026-06-11")
    assert promedio["cantidad_eventos"] == 2
    assert promedio["total_segundos"] == 700
    assert promedio["promedio_segundos"] == 350

    response = client.get(
        f"/api/v1/alimentacion/animal/{animal_id}/anomalias",
        params={"desde": "2026-06-11T00:00:00Z", "hasta": "2026-06-11T23:59:59Z"},
    )
    assert response.status_code == 200, response.text
    anomalias = response.json()
    assert any(item["duracion_segundos"] == 100 and item["promedio_historico"] == 350 for item in anomalias)

    eventos_db = asyncio.run(obtener_eventos_consumo(animal_id))
    estado_por_duracion = {evento.duracion_segundos: evento.estado for evento in eventos_db}
    assert estado_por_duracion[100] == "cerrado"

    response = client.post(
        f"/api/v1/alimentacion/animal/{animal_id}/detectar-anomalias",
        params={"desde": "2026-06-11T00:00:00Z", "hasta": "2026-06-11T23:59:59Z"},
    )
    assert response.status_code == 200, response.text
    assert response.json()["anomalias_marcadas"] == 1
    assert response.json()["promedio_historico"] == 350

    eventos_db = asyncio.run(obtener_eventos_consumo(animal_id))
    estado_por_duracion = {evento.duracion_segundos: evento.estado for evento in eventos_db}
    assert estado_por_duracion[600] == "cerrado"
    assert estado_por_duracion[100] == "anomalia"

    response = client.get(
        f"/api/v1/alimentacion/animal/{animal_id}",
        params={"desde": "2026-06-12T00:00:00Z", "hasta": "2026-06-11T00:00:00Z"},
    )
    assert response.status_code == 422, response.text
    assert response.json()["detail"] == "desde no puede ser mayor que hasta"

    response = client.get(
        f"/api/v1/alimentacion/animal/{animal_id}/anomalias",
        params={"desde": "2026-06-12T00:00:00Z", "hasta": "2026-06-11T00:00:00Z"},
    )
    assert response.status_code == 422, response.text

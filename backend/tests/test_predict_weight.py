import asyncio
import base64
import hashlib
import os

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from fastapi.testclient import TestClient

from api_gateway.main import app
from domains.ia import service

PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)
SNAPSHOT_URL = "https://example.com/snapshots/bovino-1.png"


def test_calcular_hash_bytes_estable_y_sensible_a_contenido():
    content = PNG_BYTES
    other_content = PNG_BYTES + b"otro-byte"

    assert service.calcular_hash_bytes(content) == hashlib.sha256(content).hexdigest()
    assert service.calcular_hash_bytes(content) == service.calcular_hash_bytes(content)
    assert service.calcular_hash_bytes(content) != service.calcular_hash_bytes(other_content)


def test_generar_prediccion_fake_estable():
    image_hash = service.calcular_hash_bytes(PNG_BYTES)

    prediccion_1 = service.generar_prediccion_fake(image_hash=image_hash, source="snapshot_url", animal_id=1)
    prediccion_2 = service.generar_prediccion_fake(image_hash=image_hash, source="snapshot_url", animal_id=1)

    assert prediccion_1 == prediccion_2
    assert 250 <= prediccion_1["peso_estimado"] <= 550
    assert 0.70 <= prediccion_1["confidence"] <= 0.95
    assert prediccion_1["model_version"] == "fake-local-v1"


def test_descargar_imagen_snapshot_usa_bytes_descargados(monkeypatch):
    class FakeSnapshotResponse:
        status_code = 200
        headers = {"content-type": "image/png", "content-length": str(len(PNG_BYTES))}

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        async def aiter_bytes(self):
            yield PNG_BYTES[:10]
            yield PNG_BYTES[10:]

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        def stream(self, method, url):
            assert method == "GET"
            assert url == SNAPSHOT_URL
            return FakeSnapshotResponse()

    monkeypatch.setattr(service.httpx, "AsyncClient", FakeAsyncClient)

    image_content = asyncio.run(service.descargar_imagen_snapshot(SNAPSHOT_URL))

    assert image_content == PNG_BYTES
    assert service.calcular_hash_bytes(image_content) != hashlib.sha256(SNAPSHOT_URL.encode("utf-8")).hexdigest()


def test_predict_weight_con_snapshot_url(monkeypatch):
    db_calls = []

    async def fake_descargar(snapshot_url):
        assert snapshot_url == SNAPSHOT_URL
        return PNG_BYTES

    async def no_cache(image_hash):
        return None

    async def no_guardar_cache(image_hash, prediction):
        return None

    async def no_guardar_db(**kwargs):
        db_calls.append(kwargs)
        return None

    monkeypatch.setattr(service, "descargar_imagen_snapshot", fake_descargar)
    monkeypatch.setattr(service, "buscar_prediccion_cache", no_cache)
    monkeypatch.setattr(service, "guardar_prediccion_cache", no_guardar_cache)
    monkeypatch.setattr(service, "guardar_prediccion_db", no_guardar_db)

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/ai/predict/weight",
            json={"snapshot_url": SNAPSHOT_URL, "animal_id": 1},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["cached"] is False
    assert data["image_hash"] == service.calcular_hash_bytes(PNG_BYTES)
    assert data["image_hash"] != hashlib.sha256(SNAPSHOT_URL.encode("utf-8")).hexdigest()
    assert data["metadata"] == {"source": "snapshot_url", "animal_id": 1}
    assert db_calls[0]["animal_id"] == 1
    assert db_calls[0]["snapshot_url"] == SNAPSHOT_URL
    assert db_calls[0]["image_hash"] == service.calcular_hash_bytes(PNG_BYTES)


def test_predict_weight_con_archivo_png(monkeypatch):
    async def no_cache(image_hash):
        return None

    async def no_guardar_cache(image_hash, prediction):
        return None

    async def no_guardar_db(**kwargs):
        return None

    monkeypatch.setattr(service, "buscar_prediccion_cache", no_cache)
    monkeypatch.setattr(service, "guardar_prediccion_cache", no_guardar_cache)
    monkeypatch.setattr(service, "guardar_prediccion_db", no_guardar_db)

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/ai/predict/weight",
            data={"animal_id": "2"},
            files={"file": ("bovino.png", PNG_BYTES, "image/png")},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["cached"] is False
    assert data["image_hash"] == service.calcular_hash_bytes(PNG_BYTES)
    assert data["metadata"] == {"source": "upload", "animal_id": 2}


def test_predict_weight_rechaza_multipart_invalido():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/ai/predict/weight",
            files={"file": ("bovino.txt", b"no es imagen", "text/plain")},
        )

    assert response.status_code == 400
    assert "imagen" in response.json()["detail"].lower()


def test_predict_weight_rechaza_imagen_muy_grande(monkeypatch):
    monkeypatch.setattr(service.settings, "ai_max_image_size_mb", 0)

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/ai/predict/weight",
            files={"file": ("bovino.png", PNG_BYTES, "image/png")},
        )

    assert response.status_code == 400
    assert "tamano maximo" in response.json()["detail"].lower()


def test_predecir_peso_cache_hit(monkeypatch):
    image_hash = service.calcular_hash_bytes(PNG_BYTES)
    cached_prediction = {
        "peso_estimado": 301.25,
        "confidence": 0.81,
        "model_version": "fake-local-v1",
        "image_hash": image_hash,
        "metadata": {"source": "upload", "animal_id": 4},
    }

    async def fake_cache(hash_value):
        assert hash_value == image_hash
        return cached_prediction.copy()

    async def fail_db(**kwargs):
        raise AssertionError("No debe guardar DB si hay cache hit")

    monkeypatch.setattr(service, "buscar_prediccion_cache", fake_cache)
    monkeypatch.setattr(service, "guardar_prediccion_db", fail_db)

    response = asyncio.run(
        service.predecir_peso(
            db=object(),
            image_hash=image_hash,
            source="upload",
            animal_id=4,
            file_content=PNG_BYTES,
        )
    )

    assert response.cached is True
    assert response.image_hash == image_hash


def test_predecir_peso_con_tensorflow_serving_mock(monkeypatch):
    image_hash = service.calcular_hash_bytes(PNG_BYTES)
    db_calls = []

    class FakeTfResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {
                "predictions": [
                    {
                        "peso_estimado": 390.5,
                        "confidence": 0.88,
                    }
                ],
                "model_version": "test-model-v1",
            }

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        async def post(self, url, json):
            assert url == service.settings.tf_serving_weight_url
            assert json["instances"][0]["image_hash"] == image_hash
            return FakeTfResponse()

    async def no_cache(hash_value):
        return None

    async def no_guardar_cache(image_hash, prediction):
        return None

    async def fake_guardar_db(**kwargs):
        db_calls.append(kwargs)
        return None

    monkeypatch.setattr(service.settings, "ai_fake_mode", False)
    monkeypatch.setattr(service.httpx, "AsyncClient", FakeAsyncClient)
    monkeypatch.setattr(service, "buscar_prediccion_cache", no_cache)
    monkeypatch.setattr(service, "guardar_prediccion_cache", no_guardar_cache)
    monkeypatch.setattr(service, "guardar_prediccion_db", fake_guardar_db)

    response = asyncio.run(
        service.predecir_peso(
            db=object(),
            image_hash=image_hash,
            source="upload",
            animal_id=5,
            file_content=PNG_BYTES,
        )
    )

    assert response.cached is False
    assert response.peso_estimado == 390.5
    assert response.confidence == 0.88
    assert response.model_version == "test-model-v1"
    assert db_calls[0]["animal_id"] == 5
    assert db_calls[0]["image_hash"] == image_hash

from fastapi import FastAPI
from app.api.v1.router import router as api_router

app = FastAPI(
    title="Lookin' at Cows — AI Service",
    description="Microservicio de procesamiento de imágenes y detección de comportamiento bovino mediante YOLO.",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GanadoVision Backend"
    app_env: str = "local"
    app_port: int = 8000
    database_url: str
    redis_url: str
    log_level: str = "INFO"
    tf_serving_weight_url: str = "http://tf-serving:8501/v1/models/weight:predict"
    ai_fake_mode: bool = True
    ai_cache_ttl_seconds: int = 3600
    ai_max_image_size_mb: int = 5

    model_config = SettingsConfigDict(env_file=".env.example", env_file_encoding="utf-8")


settings = Settings()

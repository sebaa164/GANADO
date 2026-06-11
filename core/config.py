from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GanadoVision Backend"
    app_env: str = "local"
    app_port: int = 8000
    database_url: str
    redis_url: str
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env.example", env_file_encoding="utf-8")


settings = Settings()

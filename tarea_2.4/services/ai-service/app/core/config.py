from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8001

    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "sistema_vacas_ai"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""

    LARAVEL_API_URL: str = "http://localhost:8000/api"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    class Config:
        env_file = ".env"


settings = Settings()

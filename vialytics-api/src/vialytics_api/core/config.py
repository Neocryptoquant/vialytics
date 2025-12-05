from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vialytics API"
    DATABASE_URL: str = "sqlite:////home/eaa/sol-quant/hackathon/vialytics/vialytics-core/wallet.db"
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

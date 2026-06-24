import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Credit Scoring MVP"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://admin:adminpassword@localhost:5432/credit_scoring")
    
    # JWT Auth Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-dev-secret-key-change-in-prod-123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    # Plaid Configuration
    PLAID_CLIENT_ID: str = os.getenv("PLAID_CLIENT_ID", "")
    PLAID_SECRET: str = os.getenv("PLAID_SECRET", "")
    PLAID_ENV: str = os.getenv("PLAID_ENV", "sandbox")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

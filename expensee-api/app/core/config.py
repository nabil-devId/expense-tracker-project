import os
import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App settings
    API_V1_PREFIX: str
    PROJECT_NAME: str
    GEMINI_API_KEY: str
    SECRET_KEY: str = secrets.token_urlsafe(32) # A default secret is good practice
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["https://*.elasticbeanstalk.com", "http://localhost:3000"]
    
    # Server Host (optional)
    SERVER_HOST: Optional[str] = None

    # Tesseract configuration
    TESSERACT_CMD: str = "/usr/bin/tesseract"
    TEMP_DIR: str = "/app/temp"

    @field_validator("BACKEND_CORS_ORIGINS", mode='before')
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    DATABASE_URL: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str

    # AWS Configuration
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    RECEIPT_IMAGES_BUCKET: str
    
    # AWS SES Configuration
    SES_SENDER_EMAIL: str
    SES_SENDER_NAME: str = "Expense Tracker"

    class Config:
        # This tells pydantic-settings to load variables from a .env file
        env_file = ".env"
        # This makes matching case-sensitive (e.g., 'DB_HOST' != 'db_host')
        case_sensitive = True


# Create a single instance of the settings to be used throughout your app
settings = Settings()
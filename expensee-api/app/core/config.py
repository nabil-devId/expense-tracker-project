import os
import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_PREFIX: str = os.getenv("API_V1_PREFIX")
    PROJECT_NAME: str = os.getenv("PROJECT_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["https://*.elasticbeanstalk.com", "http://localhost:3000"]
    SERVER_HOST: Optional[str] = None

    # Tesseract configuration
    TESSERACT_CMD: str = "/usr/bin/tesseract"
    TEMP_DIR: str = "/app/temp"

    @field_validator("BACKEND_CORS_ORIGINS")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT")

    @model_validator(mode='before')
    def validate_database_url(cls, data: dict) -> dict:
        # Static database URL string
        db_url = os.getenv("DATABASE_URL")
        data['DATABASE_URL'] = db_url
        
        return data

    # AWS Configuration
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION")
    RECEIPT_IMAGES_BUCKET: str = os.getenv("RECEIPT_IMAGES_BUCKET")
    
    # AWS SES Configuration
    SES_SENDER_EMAIL: str = os.getenv("SES_SENDER_EMAIL")
    SES_SENDER_NAME: str = "Expense Tracker"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
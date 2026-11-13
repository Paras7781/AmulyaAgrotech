from urllib.parse import urlsplit
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./amulya.db"
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
    company_name: str = "AMULYA AGROTECH (P) LTD"
    environment: str = "development"
    public_enquiry_rate_limit: int = Field(default=10, ge=1, le=1000)
    public_enquiry_rate_window_seconds: int = Field(default=60, ge=1, le=3600)

    # Email notifications
    email_provider: Literal["smtp", "resend"] = "smtp"
    resend_api_key: str = ""
    email_from: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    notification_email: str = ""
    smtp_mock_mode: bool = False
    
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.environment.strip().lower() in {"prod", "production"}:
            if self.smtp_mock_mode:
                raise ValueError("SMTP_MOCK_MODE cannot be enabled in production")

            origins = [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]
            parsed_origins = [urlsplit(origin) for origin in origins]
            if not origins or any(
                origin == "*"
                or parsed.scheme != "https"
                or not parsed.hostname
                or parsed.path not in {"", "/"}
                or parsed.query
                or parsed.fragment
                or parsed.username
                or parsed.password
                for origin, parsed in zip(origins, parsed_origins)
            ):
                raise ValueError("Production ALLOWED_ORIGINS must contain HTTPS origins only")

        return self


settings = Settings()

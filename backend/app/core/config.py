from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # This matches the key in your .env file
    HF_API_KEY: str

    class Config:
        env_file = ".env"
        # Use '=' here, not ':' or commas
        extra = "ignore" 

settings = Settings()
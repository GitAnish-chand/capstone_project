from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.auth import schemas, service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(data: schemas.UserRegister, db: Session = Depends(get_db)):
    try:
        user = service.register_user(db, data.email, data.password, data.full_name,data.role)
        return {"message": "User registered successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    token = service.authenticate_user(db, data.email, data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": token, "token_type": "bearer"}

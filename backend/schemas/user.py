from pydantic import BaseModel, EmailStr, ConfigDict
import uuid
from datetime import datetime
from models.user import UserRole

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

import enum
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column
from models.base import BaseModel

class UserRole(str, enum.Enum):
    admin = "admin"
    analyst = "analyst"
    customer = "customer"

class User(BaseModel):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", create_type=False), 
        nullable=False, 
        default=UserRole.customer
    )
    plaid_access_token: Mapped[str] = mapped_column(String, nullable=True)

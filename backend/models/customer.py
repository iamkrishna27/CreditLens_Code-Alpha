from sqlalchemy import String, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from models.base import BaseModel

class Customer(BaseModel):
    __tablename__ = "customers"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    income: Mapped[float] = mapped_column(Float, nullable=False)
    debt: Mapped[float] = mapped_column(Float, nullable=False)
    loan_amount: Mapped[float] = mapped_column(Float, nullable=False)
    employment_status: Mapped[str] = mapped_column(String, nullable=False)
    credit_history_length_months: Mapped[int] = mapped_column(Integer, nullable=False)
    previous_defaults: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

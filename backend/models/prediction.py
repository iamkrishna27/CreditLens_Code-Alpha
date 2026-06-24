import enum
import uuid
from sqlalchemy import Integer, Float, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from models.base import BaseModel

class RiskLevel(str, enum.Enum):
    Excellent = "Excellent"
    Good = "Good"
    Average = "Average"
    Risky = "Risky"
    Very_Risky = "Very Risky"

class Prediction(BaseModel):
    __tablename__ = "predictions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False
    )
    credit_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_level: Mapped[RiskLevel] = mapped_column(
        Enum(RiskLevel, name="risk_level_enum", create_type=False), nullable=False
    )
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    xai_summary: Mapped[dict] = mapped_column(JSONB, nullable=True)

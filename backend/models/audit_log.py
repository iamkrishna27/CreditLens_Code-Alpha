import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from models.base import BaseModel

class AuditLog(BaseModel):
    __tablename__ = "audit_logs"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    model_version: Mapped[str] = mapped_column(String, nullable=False)
    input_features: Mapped[dict] = mapped_column(JSONB, nullable=False)
    predicted_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_tier: Mapped[str] = mapped_column(String, nullable=False)

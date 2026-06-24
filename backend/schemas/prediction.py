from pydantic import BaseModel, ConfigDict, Field
from typing import Any, Dict, Optional
import uuid
from datetime import datetime
from models.prediction import RiskLevel

class PredictionBase(BaseModel):
    customer_id: uuid.UUID
    credit_score: int = Field(..., ge=0, le=1000)
    risk_level: RiskLevel
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    xai_summary: Optional[Dict[str, Any]] = None

class PredictionCreate(PredictionBase):
    pass

class PredictionRead(PredictionBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

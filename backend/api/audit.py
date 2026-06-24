from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_db
from models.user import User
from models.audit_log import AuditLog
from api.auth import get_current_user

router = APIRouter()

@router.get("/my-logs", tags=["Audit"])
async def get_my_audit_logs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retrieve all immutable audit logs for the current user's AI decisions.
    Supports GDPR/CCPA compliance for User Data Rights.
    """
    result = await db.execute(
        select(AuditLog)
        .where(AuditLog.user_id == current_user.id)
        .order_by(AuditLog.timestamp.desc())
    )
    logs = result.scalars().all()
    
    return {
        "count": len(logs),
        "audit_logs": [
            {
                "id": str(log.id),
                "timestamp": log.timestamp,
                "model_version": log.model_version,
                "input_features": log.input_features,
                "predicted_score": log.predicted_score,
                "risk_tier": log.risk_tier
            }
            for log in logs
        ]
    }

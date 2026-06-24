from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from core.database import get_db
from api import predict, auth

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth")
app.include_router(predict.router, prefix="/api")

from api import plaid_routes, audit
app.include_router(plaid_routes.router, prefix="/api/plaid", tags=["Plaid"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])

@app.get("/health", tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    return {"status": "ok", "message": "API and Database are reachable"}

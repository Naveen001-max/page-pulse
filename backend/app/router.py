# Developed by Naveen Choudhary
# Project: Page Pulse
# Built for Digital Heroes Training Task

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models import AnalyzeRequest, AuditResult
from app.auditor import audit_url

router = APIRouter()


@router.post("/analyze", response_model=AuditResult)
async def analyze(request: AnalyzeRequest):
    result = await audit_url(request.url)
    return JSONResponse(content=result)

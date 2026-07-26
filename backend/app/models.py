# Developed by Naveen Choudhary
# Project: Page Pulse
# Built for Digital Heroes Training Task

from pydantic import BaseModel, HttpUrl, field_validator
from typing import Literal


class AnalyzeRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty")
        if not v.startswith(("http://", "https://")):
            v = "https://" + v
        return v


class AuditResult(BaseModel):
    url: str
    http_status: int
    response_time_ms: float
    title: str
    meta_description: str
    h1_count: int
    images_missing_alt: int
    word_count: int
    health: Literal["Excellent", "Good", "Average", "Poor"]
    error: str | None = None

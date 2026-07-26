# Developed by Naveen Choudhary
# Project: Page Pulse
# Built for Digital Heroes Training Task

import pytest
import httpx
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from app.auditor import audit_url, _calculate_health

client = TestClient(app)


# ─── Unit: health scoring ────────────────────────────────────────────────────

def test_health_excellent():
    score = _calculate_health(200, "My Page Title", "A great meta description here", 0, 500)
    assert score == "Excellent"


def test_health_poor_no_content():
    score = _calculate_health(500, "", "", 10, 0)
    assert score == "Poor"


def test_health_good():
    score = _calculate_health(200, "Title", "Description here for testing purposes", 2, 200)
    assert score in ("Good", "Average")


def test_health_redirect_status():
    score = _calculate_health(301, "Title", "Some description text that is meaningful", 0, 400)
    assert score in ("Good", "Average")


# ─── Integration: POST /analyze ──────────────────────────────────────────────

def test_missing_body():
    resp = client.post("/analyze", json={})
    assert resp.status_code == 422


def test_empty_url():
    resp = client.post("/analyze", json={"url": ""})
    assert resp.status_code == 422


def test_invalid_url_returns_error_json():
    resp = client.post("/analyze", json={"url": "not-a-real-url-xyz123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "health" in data
    # Should not crash — error field or poor health expected
    assert data["health"] in ("Excellent", "Good", "Average", "Poor")


# ─── Mocked network scenarios ────────────────────────────────────────────────

SAMPLE_HTML = """<!doctype html>
<html lang="en">
<head>
  <title>Example Domain</title>
  <meta name="description" content="This domain is for use in illustrative examples in documents." />
</head>
<body>
  <h1>Example Domain</h1>
  <img src="logo.png" alt="Logo" />
  <img src="hero.jpg" />
  <p>This domain is established to be used for illustrative examples in documents.
     You may use this domain in literature without prior coordination or asking for permission.
     More information can be found at IANA.</p>
</body>
</html>"""


@pytest.mark.asyncio
async def test_happy_path():
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "text/html; charset=utf-8"}
    mock_response.text = SAMPLE_HTML

    with patch("app.auditor.httpx.AsyncClient") as mock_client_cls:
        mock_ctx = AsyncMock()
        mock_ctx.__aenter__ = AsyncMock(return_value=mock_ctx)
        mock_ctx.__aexit__ = AsyncMock(return_value=False)
        mock_ctx.get = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value = mock_ctx

        result = await audit_url("https://example.com")

    assert result["http_status"] == 200
    assert result["title"] == "Example Domain"
    assert result["meta_description"] != ""
    assert result["h1_count"] == 1
    assert result["images_missing_alt"] == 1
    assert result["word_count"] > 0
    assert result["error"] is None
    assert result["health"] in ("Excellent", "Good", "Average", "Poor")


@pytest.mark.asyncio
async def test_timeout():
    with patch("app.auditor.httpx.AsyncClient") as mock_client_cls:
        mock_ctx = AsyncMock()
        mock_ctx.__aenter__ = AsyncMock(return_value=mock_ctx)
        mock_ctx.__aexit__ = AsyncMock(return_value=False)
        mock_ctx.get = AsyncMock(side_effect=httpx.TimeoutException("timed out"))
        mock_client_cls.return_value = mock_ctx

        result = await audit_url("https://slow-site.example.com")

    assert result["http_status"] == 0
    assert result["health"] == "Poor"
    assert result["error"] is not None
    assert "timed out" in result["error"].lower() or "time" in result["error"].lower()


@pytest.mark.asyncio
async def test_non_html_response():
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/json"}
    mock_response.text = '{"key": "value"}'

    with patch("app.auditor.httpx.AsyncClient") as mock_client_cls:
        mock_ctx = AsyncMock()
        mock_ctx.__aenter__ = AsyncMock(return_value=mock_ctx)
        mock_ctx.__aexit__ = AsyncMock(return_value=False)
        mock_ctx.get = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value = mock_ctx

        result = await audit_url("https://api.example.com/data")

    assert result["http_status"] == 200
    assert result["error"] is not None
    assert "non-html" in result["error"].lower() or "application/json" in result["error"]


@pytest.mark.asyncio
async def test_connect_error():
    with patch("app.auditor.httpx.AsyncClient") as mock_client_cls:
        mock_ctx = AsyncMock()
        mock_ctx.__aenter__ = AsyncMock(return_value=mock_ctx)
        mock_ctx.__aexit__ = AsyncMock(return_value=False)
        mock_ctx.get = AsyncMock(side_effect=httpx.ConnectError("name resolution failed"))
        mock_client_cls.return_value = mock_ctx

        result = await audit_url("https://this-domain-does-not-exist-xyz.com")

    assert result["http_status"] == 0
    assert result["health"] == "Poor"
    assert result["error"] is not None


@pytest.mark.asyncio
async def test_http_error_status():
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_response.headers = {"content-type": "text/html"}
    mock_response.text = "<html><head><title>Not Found</title></head><body><h1>404</h1></body></html>"

    with patch("app.auditor.httpx.AsyncClient") as mock_client_cls:
        mock_ctx = AsyncMock()
        mock_ctx.__aenter__ = AsyncMock(return_value=mock_ctx)
        mock_ctx.__aexit__ = AsyncMock(return_value=False)
        mock_ctx.get = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value = mock_ctx

        result = await audit_url("https://example.com/missing-page")

    assert result["http_status"] == 404
    assert result["health"] == "Poor"

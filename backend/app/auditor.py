# Developed by Naveen Choudhary
# Project: Page Pulse
# Built for Digital Heroes Training Task

import time
import re
from typing import Literal

import httpx
from bs4 import BeautifulSoup

TIMEOUT_SECONDS = 15
USER_AGENT = "PagePulse/1.0 (+https://pagepulse.app)"


def _calculate_health(
    http_status: int,
    title: str,
    meta_description: str,
    images_missing_alt: int,
    word_count: int,
) -> Literal["Excellent", "Good", "Average", "Poor"]:
    score = 0

    # HTTP status
    if 200 <= http_status < 300:
        score += 30
    elif 300 <= http_status < 400:
        score += 15
    else:
        score += 0

    # Title
    if title and len(title) > 5:
        score += 20

    # Meta description
    if meta_description and len(meta_description) > 10:
        score += 20

    # Missing ALT images
    if images_missing_alt == 0:
        score += 15
    elif images_missing_alt <= 3:
        score += 8
    elif images_missing_alt <= 7:
        score += 3

    # Word count
    if word_count >= 300:
        score += 15
    elif word_count >= 100:
        score += 8
    elif word_count > 0:
        score += 3

    if score >= 85:
        return "Excellent"
    elif score >= 65:
        return "Good"
    elif score >= 40:
        return "Average"
    else:
        return "Poor"


def _extract_word_count(soup: BeautifulSoup) -> int:
    for tag in soup(["script", "style", "noscript", "head"]):
        tag.decompose()
    text = soup.get_text(separator=" ")
    words = re.findall(r"\b\w+\b", text)
    return len(words)


async def audit_url(url: str) -> dict:
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    start = time.monotonic()

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=httpx.Timeout(TIMEOUT_SECONDS),
            verify=False,
            headers=headers,
        ) as client:
            response = await client.get(url)

        elapsed_ms = round((time.monotonic() - start) * 1000, 2)
        http_status = response.status_code

        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type and "application/xhtml" not in content_type:
            return {
                "url": url,
                "http_status": http_status,
                "response_time_ms": elapsed_ms,
                "title": "",
                "meta_description": "",
                "h1_count": 0,
                "images_missing_alt": 0,
                "word_count": 0,
                "health": "Poor",
                "error": f"Non-HTML response: {content_type}",
            }

        soup = BeautifulSoup(response.text, "lxml")

        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else ""

        meta_desc_tag = soup.find("meta", attrs={"name": re.compile("description", re.I)})
        meta_description = ""
        if meta_desc_tag and meta_desc_tag.get("content"):
            meta_description = meta_desc_tag["content"].strip()

        h1_tags = soup.find_all("h1")
        h1_count = len(h1_tags)

        images = soup.find_all("img")
        images_missing_alt = sum(
            1 for img in images
            if not img.get("alt") or not img["alt"].strip()
        )

        word_count = _extract_word_count(soup)

        health = _calculate_health(
            http_status, title, meta_description, images_missing_alt, word_count
        )

        return {
            "url": url,
            "http_status": http_status,
            "response_time_ms": elapsed_ms,
            "title": title,
            "meta_description": meta_description,
            "h1_count": h1_count,
            "images_missing_alt": images_missing_alt,
            "word_count": word_count,
            "health": health,
            "error": None,
        }

    except httpx.TimeoutException:
        elapsed_ms = round((time.monotonic() - start) * 1000, 2)
        return {
            "url": url,
            "http_status": 0,
            "response_time_ms": elapsed_ms,
            "title": "",
            "meta_description": "",
            "h1_count": 0,
            "images_missing_alt": 0,
            "word_count": 0,
            "health": "Poor",
            "error": "Request timed out. The server took too long to respond.",
        }

    except httpx.ConnectError:
        elapsed_ms = round((time.monotonic() - start) * 1000, 2)
        return {
            "url": url,
            "http_status": 0,
            "response_time_ms": elapsed_ms,
            "title": "",
            "meta_description": "",
            "h1_count": 0,
            "images_missing_alt": 0,
            "word_count": 0,
            "health": "Poor",
            "error": "Could not connect. Check the URL or try again later.",
        }

    except httpx.InvalidURL:
        return {
            "url": url,
            "http_status": 0,
            "response_time_ms": 0,
            "title": "",
            "meta_description": "",
            "h1_count": 0,
            "images_missing_alt": 0,
            "word_count": 0,
            "health": "Poor",
            "error": "Invalid URL format.",
        }

    except Exception as exc:
        elapsed_ms = round((time.monotonic() - start) * 1000, 2)
        return {
            "url": url,
            "http_status": 0,
            "response_time_ms": elapsed_ms,
            "title": "",
            "meta_description": "",
            "h1_count": 0,
            "images_missing_alt": 0,
            "word_count": 0,
            "health": "Poor",
            "error": f"Unexpected error: {str(exc)[:120]}",
        }

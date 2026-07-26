# Page Pulse

> Instant website health analysis — built for Digital Heroes Training Task  
> Created and Developed by **Naveen Choudhary**

---

## Overview

Page Pulse is a full-stack website audit tool. Enter any public URL and receive a comprehensive health report including HTTP status, response time, SEO metadata quality, H1 heading count, images missing ALT text, approximate word count, and an intelligent overall health score.

The UI is inspired by Linear, Vercel, Stripe, and Raycast — dark, minimal, premium, and fast.

---

## Architecture

```
Browser ──► React (Vite) ──► FastAPI Backend ──► Target Website
                │                    │
                │                    └── httpx (async fetch)
                │                    └── BeautifulSoup4 (parse)
                └── Framer Motion (UI)
                └── React Three Fiber (3D)
```

**Frontend** (React 19 + TypeScript + Vite + TailwindCSS)
- Lazy-loads the 3D scene and dashboard chunks
- Validates URLs client-side before hitting the API
- Fully responsive from 360px to 1440px

**Backend** (Python 3.12 + FastAPI + httpx + BeautifulSoup4)
- Async end-to-end — never blocks
- Handles timeouts, DNS failures, SSL errors, redirects, non-HTML gracefully
- Pydantic v2 validation on all inputs and outputs

---

## Folder Structure

```
page-pulse/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auditor.py       # Core crawl + parse logic
│   │   ├── models.py        # Pydantic request/response schemas
│   │   └── router.py        # FastAPI route definitions
│   ├── main.py              # App factory + CORS
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedNumber.tsx
│   │   │   ├── AuditDashboard.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HealthBadge.tsx
│   │   │   ├── HeroScene.tsx
│   │   │   ├── ScanLoader.tsx
│   │   │   └── UrlInput.tsx
│   │   ├── hooks/
│   │   │   └── useAudit.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── tests/
│   └── test_analyze.py
├── README.md
├── LICENSE
└── .gitignore
```

---

## Installation

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

---

## Running

### Backend (development)

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend (development)

```bash
cd frontend
cp .env.example .env             # Set VITE_API_URL if needed
npm run dev
```

### Tests

```bash
# From project root
python -m pytest tests/ -v
```

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: none required by default

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. **Framework Preset**: Vite
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```
5. Deploy

---

## API Contract

### `POST /analyze`

**Request**
```json
{
  "url": "https://example.com"
}
```

**Response**
```json
{
  "url": "https://example.com",
  "http_status": 200,
  "response_time_ms": 143.5,
  "title": "Example Domain",
  "meta_description": "This domain is for use in illustrative examples.",
  "h1_count": 1,
  "images_missing_alt": 0,
  "word_count": 651,
  "health": "Excellent",
  "error": null
}
```

**Health values**: `"Excellent"` | `"Good"` | `"Average"` | `"Poor"`

**Error response** (never HTTP 5xx — always 200 with error field populated):
```json
{
  "url": "https://unreachable.example",
  "http_status": 0,
  "response_time_ms": 15001.0,
  "title": "",
  "meta_description": "",
  "h1_count": 0,
  "images_missing_alt": 0,
  "word_count": 0,
  "health": "Poor",
  "error": "Request timed out. The server took too long to respond."
}
```

---

## Three Design Decisions

### 1. Never crash, always return JSON

The backend wraps every possible failure mode (timeouts, DNS errors, SSL failures, non-HTML responses, unexpected exceptions) and returns a well-formed JSON response. This means the frontend can always parse a result and the UX degrades gracefully with a human-readable error message.

### 2. Lazy-loaded 3D scene

React Three Fiber + Three.js is powerful but heavy. The `HeroScene` component is lazy-loaded as a separate chunk, meaning the critical path (URL input + hero text) renders immediately and Three.js initialises in the background. Users on slow connections get a functional experience before the 3D scene appears.

### 3. Health score as a weighted signal, not an average

Rather than averaging individual metrics, health scoring uses a weighted point system (HTTP status: 30pts, title: 20pts, meta description: 20pts, ALT images: 15pts, word count: 15pts). This means a site with a working status code and good content gets "Good" even with minor accessibility issues — matching how a human SEO auditor would assess priority.

---

## Future Improvements

- **More SEO signals**: canonical tags, Open Graph, structured data, robots.txt
- **Lighthouse integration**: pull real Core Web Vitals via Lighthouse API
- **Historical audits**: store results per domain and track changes over time
- **PDF export**: generate a printable audit report
- **Bulk auditing**: submit a sitemap and audit all pages in parallel
- **Browser-rendered audit**: use Playwright to audit JS-heavy SPAs that don't serve HTML
- **Rate limiting**: protect the backend from abuse with per-IP throttling

---

*Created and Developed by Naveen Choudhary — Built for Digital Heroes Training Task*  
*[digitalheroesco.com](https://digitalheroesco.com)*

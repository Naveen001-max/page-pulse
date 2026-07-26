# Deployment Guide — Page Pulse

---

## Backend → Render (Free Tier Compatible)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Page Pulse release"
git remote add origin https://github.com/YOUR_USERNAME/page-pulse.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `page-pulse-api`
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

### Step 3: Note your Render URL

After deploy, your API will be at:
```
https://page-pulse-api.onrender.com
```

---

## Frontend → Vercel

### Step 1: Import project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Framework Preset: **Vite** (auto-detected)

### Step 2: Set environment variables

In **Project Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://page-pulse-api.onrender.com` |

### Step 3: Deploy

Click **Deploy**. Vercel builds and deploys automatically.

Your frontend URL:
```
https://page-pulse.vercel.app
```

---

## CORS Configuration

The backend allows all origins by default (`allow_origins=["*"]`). For production, update `main.py` to restrict to your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://page-pulse.vercel.app"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)
```

---

## Health Check

After deployment, verify:

```bash
# Backend health
curl https://page-pulse-api.onrender.com/

# Test analyze endpoint
curl -X POST https://page-pulse-api.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

## Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "feat: initial Page Pulse release by Naveen Choudhary"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/page-pulse.git
git branch -M main
git push -u origin main

# Subsequent deploys (auto-deploy via Render/Vercel on push)
git add .
git commit -m "fix: your change description"
git push
```

---

## Final Verification Checklist

### Backend
- [ ] `POST /analyze` returns valid JSON for a live URL
- [ ] `POST /analyze` with empty URL returns 422
- [ ] `POST /analyze` with unreachable URL returns 200 with `error` field
- [ ] Server never returns 500
- [ ] CORS allows frontend origin
- [ ] All 12 pytest tests pass

### Frontend
- [ ] URL input validates before submission
- [ ] Loading skeleton appears during fetch
- [ ] Dashboard renders all 7 metric cards
- [ ] Health badge displays correct colour
- [ ] Animated numbers count up on load
- [ ] Copy JSON button works
- [ ] New Audit button resets state
- [ ] 3D scene renders without GPU crash
- [ ] Responsive at 360px, 768px, 1024px, 1440px
- [ ] Browser tab title reads "Page Pulse • Built by Naveen Choudhary"
- [ ] Footer links to digitalheroesco.com

### Attribution
- [ ] Every source file starts with Naveen Choudhary header comment
- [ ] package.json author: Naveen Choudhary
- [ ] pyproject.toml author: Naveen Choudhary
- [ ] LICENSE copyright: Naveen Choudhary
- [ ] Footer: "Built by Naveen Choudhary — Built for Digital Heroes Training Task"
- [ ] README: "Created and Developed by Naveen Choudhary"

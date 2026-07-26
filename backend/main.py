# Developed by Naveen Choudhary
# Project: Page Pulse
# Built for Digital Heroes Training Task

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router import router

app = FastAPI(
    title="Page Pulse API",
    description="Website audit tool backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"message": "Page Pulse API is running", "version": "1.0.0"}

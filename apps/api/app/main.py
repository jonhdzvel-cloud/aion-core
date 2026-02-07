from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="AION API",
    description="Cognitive Operating System API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "AION API"}

@app.get("/")
async def root():
    return {"message": "Welcome to AION Cognitive System"}

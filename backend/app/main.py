from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import predict, export, health
from middleware.upload_limit import limit_upload_size

import os

is_local = os.getenv("ENV") == "local"

app = FastAPI(
    docs_url="/api/docs" if is_local else None,
    redoc_url="/api/redoc" if is_local else None,
    openapi_url="/api/openapi.json" if is_local else None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.middleware("http")(limit_upload_size)

app.include_router(health.router, prefix="/api")
app.include_router(predict.router, prefix="/api")
app.include_router(export.router, prefix="/api")

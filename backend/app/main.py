from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from database import SessionLocal
from sqlalchemy import text


app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

api_router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# Health check
@api_router.get("/health", response_class=JSONResponse)
async def health():
    return {"status": "ok"}

@api_router.get("/db-check", response_class=JSONResponse)
async def db_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Database connected"}
    except OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")
    finally:
        db.close()


app.include_router(api_router, prefix="/api")

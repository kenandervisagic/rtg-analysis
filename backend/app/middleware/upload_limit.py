from fastapi import Request
from fastapi.responses import JSONResponse

async def limit_upload_size(request: Request, call_next):
    max_size = 20 * 1024 * 1024  # 20MB
    content_length = request.headers.get("Content-Length")
    if content_length and int(content_length) > max_size:
        return JSONResponse(content={"detail": "File too large"}, status_code=413)
    return await call_next(request)

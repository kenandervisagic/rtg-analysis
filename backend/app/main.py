from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import keras
from fastapi import File, UploadFile
from io import BytesIO
from PIL import Image
import numpy as np
from fastapi import Request
import os
import requests
from openai import OpenAI
import traceback

is_local = os.getenv("ENV") == "local"

client = OpenAI()
app = FastAPI(
    docs_url="/api/docs" if is_local else None,
    redoc_url="/api/redoc" if is_local else None,
    openapi_url="/api/openapi.json" if is_local else None
)
api_router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MODEL_URL = "https://minio.kdidp.art/model/resnet50_pneumonia_optimized.keras"
MODEL_PATH = "resnet50_pneumonia_optimized.keras"


def download_model_if_needed():
    if not os.path.exists(MODEL_PATH):
        print("📥 Downloading model from MinIO...")
        response = requests.get(MODEL_URL)
        response.raise_for_status()
        with open(MODEL_PATH, 'wb') as f:
            f.write(response.content)
        print("✅ Model downloaded successfully.")
    else:
        print("✅ Model already exists, skipping download.")


download_model_if_needed()

model = keras.models.load_model("resnet50_pneumonia_optimized.keras")

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


def allowed_file(filename: str) -> bool:
    return filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS


def preprocess_image(file: bytes) -> np.ndarray:
    img = Image.open(BytesIO(file)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img).astype("float32") / 255.0
    return np.expand_dims(img_array, axis=0)


# Health check
@api_router.get("/health", response_class=JSONResponse)
async def health():
    return {"status": "ok"}


@api_router.post("/predict", response_class=JSONResponse)
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG/PNG allowed.")

        img_tensor = preprocess_image(contents)
        prediction = model.predict(img_tensor)[0][0]

        result = "PNEUMONIA" if prediction > 0.5 else "NORMAL"
        confidence = float(prediction) if prediction > 0.5 else 1 - float(prediction)
        confidence_percent = round(confidence * 100, 1)
        llm_prompt = (
            f"Duboko učenje je analiziralo snimak grudnog koša i dijagnosticiralo **{result}** "
            f"sa sigurnošću od **{confidence_percent:.1f}%**. "
            f"Molimo napišite sažet profesionalni klinički izvještaj za radiologa ili pulmologa. "
            f"Sažmite nalaz, interpretirajte nivo sigurnosti, navedite relevantne daljnje pretrage ili snimanja "
            f"i predložite kliničke preporuke – sve u jedinstvenom koherentnom pasusu bez nabrajanja ili naslova."
            f"Molim sažeti nalaz u kraćem, jasnom odlomku bez nepotrebnih detalja."

        )

        chat_response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system",
                 "content": "Vi ste radiolog koji pruža profesionalne dijagnostičke nalaze za druge ljekare."},
                {"role": "user", "content": llm_prompt}
            ],
            temperature=0.3,
            max_tokens=300,  # smaller to encourage brevity
        )

        insight = chat_response.choices[0].message.content.strip()

        return {
            "result": result,
            "confidence": round(confidence, 3),
            "insights": [insight],
        }
    except Exception as e:
        print("Exception in /predict:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


app.include_router(api_router, prefix="/api")


@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    max_size = 5 * 1024 * 1024  # 5MB
    content_length = request.headers.get("Content-Length")
    if content_length and int(content_length) > max_size:
        return JSONResponse(content={"detail": "File too large"}, status_code=413)
    return await call_next(request)

import os
import traceback
from io import BytesIO
import keras
import numpy as np
import requests
from PIL import Image
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi import File, UploadFile
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
from openai import OpenAI
from weasyprint import HTML

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
async def predict_api(file: UploadFile = File(...)):
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
            model="gpt-4o",
            messages=[
                {"role": "system",
                 "content": "Vi ste radiolog koji pruža profesionalne dijagnostičke nalaze za druge ljekare."},
                {"role": "user", "content": llm_prompt}
            ],
            temperature=0.5,
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





@api_router.post("/export-pdf")
async def export_pdf(data: dict):
    """
    Accepts JSON data with keys:
    - diagnosis (str)
    - confidence (float)
    - insights (list of str)
    - imageBase64 (str) (optional)  <-- base64 encoded image data URI

    Returns a PDF file generated from the data.
    """

    try:
        diagnosis = data.get("diagnosis", "N/A")
        confidence = data.get("confidence", 0)
        insights = data.get("insights", [])
        image_base64 = data.get("imageBase64", "")  # expect data URI string

        # Image tag placed at the top
        img_tag = f'<img src="{image_base64}" alt="Analizirana X-zraka" />' if image_base64 else ""

        html_content = f"""
            <!DOCTYPE html>
            <html lang="hr">
            <head>
                <meta charset="UTF-8" />
                <title>Klinički Nalaz - PneumoAI</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
                <style>
                    @page {{
                        margin: 0;
                    }}
                    /* Reset */
                    * {{
                        box-sizing: border-box;
                    }}

                    body {{
                        font-family: 'Poppins', Arial, sans-serif;
                        padding: 2.5rem 3rem;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        color: #222222;
                        position: relative;
                        min-height: 100vh;
                    }}

                    header {{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #7c3aed;
                        padding-bottom: 0.5rem;
                        margin-bottom: 2rem;
                    }}

                    .title {{
                        font-weight: 600;
                        font-size: 2.5rem;
                        color: #7c3aed;
                        letter-spacing: 1px;
                        user-select: none;
                        text-shadow: 0 2px 5px rgba(124, 58, 237, 0.4);
                    }}

                    .brand {{
                        font-weight: 700;
                        font-size: 1.4rem;
                        color: #4c1d95;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        user-select: none;
                        text-shadow: 0 1px 3px rgba(76, 29, 149, 0.5);
                    }}

                    section {{
                        margin-bottom: 2.5rem;
                    }}

                    h1, h2 {{
                        color: #4c1d95;
                        font-weight: 600;
                        margin-bottom: 0.7rem;
                        border-bottom: 2px solid #7c3aed;
                        padding-bottom: 0.25rem;
                    }}

                    p {{
                        font-weight: 300;
                        line-height: 1.5;
                        font-size: 1rem;
                        margin-top: 0.4rem;
                    }}

                    .confidence {{
                        font-weight: 600;
                        color: #7c3aed;
                        font-size: 1.25rem;
                        margin-top: 0.3rem;
                    }}

                    .insight {{
                        margin-top: 0.75rem;
                        font-size: 1rem;
                        line-height: 1.6;
                        color: #3b3b3b;
                        background-color: #f0ebff;
                        padding: 12px 15px;
                        border-left: 5px solid #7c3aed;
                        border-radius: 6px;
                    }}

                    img {{
                        display: block;
                        max-width: 60%;
                        margin: 0 auto 2rem auto;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                        border: 1px solid #7c3aed88;
                    }}

                    footer {{
                        position: absolute;
                        bottom: 2rem;
                        left: 3rem;
                        right: 3rem;
                        font-size: 0.75rem;
                        font-style: italic;
                        color: #666666;
                        border-top: 1px solid #ddd;
                        padding-top: 0.75rem;
                        text-align: center;
                        user-select: none;
                    }}
                </style>
            </head>
            <body>
                <header>
                    <div class="title">Klinički Nalaz</div>
                    <div class="brand">PneumoAI</div>
                </header>
                    {img_tag}
                <section>
                    <h2>Dijagnoza</h2>
                    <p>{diagnosis}</p>
                </section>

                <section>
                    <h2>Stepen sigurnosti</h2>
                    <p class="confidence">{confidence:.1f}%</p>
                </section>

                <section>
                    <h2>Interpretacija</h2>
                    {"".join(f'<div class="insight">{ins}</div>' for ins in insights)}
                </section>

                <footer>
                    Napomena: Ovaj nalaz je generisan korištenjem umjetne inteligencije kao podrška medicinskoj dijagnostici. 
                    Ne zamjenjuje profesionalni medicinski pregled i mišljenje ljekara.
                </footer>
            </body>
            </html>
        """

        pdf_file = BytesIO()
        HTML(string=html_content).write_pdf(pdf_file)
        pdf_file.seek(0)

        headers = {
            "Content-Disposition": 'attachment; filename="nalaz.pdf"'
        }
        return StreamingResponse(pdf_file, media_type="application/pdf", headers=headers)

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Export failed: {str(e)}"})

@api_router.post("/export-html", response_class=HTMLResponse)
async def export_html(data: dict):
    """
    Accepts JSON data with keys:
    - diagnosis (str)
    - confidence (float)
    - insights (list of str)
    - imageBase64 (str) (optional)  <-- base64 encoded image data URI

    Returns HTML string rendered from provided data.
    """
    try:
        diagnosis = data.get("diagnosis", "N/A")
        confidence = data.get("confidence", 0)
        insights = data.get("insights", [])
        image_base64 = data.get("imageBase64", "")

        img_tag = f'<img src="{image_base64}" alt="Analizirana X-zraka" />' if image_base64 else ""

        html_content = f"""
        <!DOCTYPE html>
        <html lang="hr">
        <head>
            <meta charset="UTF-8" />
            <title>Klinički Nalaz - PneumoAI</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
            <style>
                @page {{
                    margin: 0;
                }}
                * {{
                    box-sizing: border-box;
                }}
                body {{
                    font-family: 'Poppins', Arial, sans-serif;
                    padding: 2.5rem 3rem;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    color: #222222;
                    position: relative;
                    min-height: 100vh;
                }}
                header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #7c3aed;
                    padding-bottom: 0.5rem;
                    margin-bottom: 2rem;
                }}
                .title {{
                    font-weight: 600;
                    font-size: 2.5rem;
                    color: #7c3aed;
                    letter-spacing: 1px;
                    user-select: none;
                    text-shadow: 0 2px 5px rgba(124, 58, 237, 0.4);
                }}
                .brand {{
                    font-weight: 700;
                    font-size: 1.4rem;
                    color: #4c1d95;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    user-select: none;
                    text-shadow: 0 1px 3px rgba(76, 29, 149, 0.5);
                }}
                section {{
                    margin-bottom: 2.5rem;
                }}
                h1, h2 {{
                    color: #4c1d95;
                    font-weight: 600;
                    margin-bottom: 0.7rem;
                    border-bottom: 2px solid #7c3aed;
                    padding-bottom: 0.25rem;
                }}
                p {{
                    font-weight: 300;
                    line-height: 1.5;
                    font-size: 1rem;
                    margin-top: 0.4rem;
                }}
                .confidence {{
                    font-weight: 600;
                    color: #7c3aed;
                    font-size: 1.25rem;
                    margin-top: 0.3rem;
                }}
                .insight {{
                    margin-top: 0.75rem;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #3b3b3b;
                    background-color: #f0ebff;
                    padding: 12px 15px;
                    border-left: 5px solid #7c3aed;
                    border-radius: 6px;
                }}
                img {{
                    display: block;
                    max-width: 60%;
                    margin: 0 auto 2rem auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                    border: 1px solid #7c3aed88;
                }}
                footer {{
                    position: absolute;
                    bottom: 2rem;
                    left: 3rem;
                    right: 3rem;
                    font-size: 0.75rem;
                    font-style: italic;
                    color: #666666;
                    border-top: 1px solid #ddd;
                    padding-top: 0.75rem;
                    text-align: center;
                    user-select: none;
                }}
            </style>
        </head>
        <body>
            <header>
                <div class="title">Klinički Nalaz</div>
                <div class="brand">PneumoAI</div>
            </header>
            {img_tag}
            <section>
                <h2>Dijagnoza</h2>
                <p>{diagnosis}</p>
            </section>

            <section>
                <h2>Stepen sigurnosti</h2>
                <p class="confidence">{confidence:.1f}%</p>
            </section>

            <section>
                <h2>Interpretacija</h2>
                {"".join(f'<div class="insight">{ins}</div>' for ins in insights)}
            </section>

            <footer>
                Napomena: Ovaj nalaz je generisan korištenjem umjetne inteligencije kao podrška medicinskoj dijagnostici.
                Ne zamjenjuje profesionalni medicinski pregled i mišljenje ljekara.
            </footer>
        </body>
        </html>
        """
        return HTMLResponse(content=html_content, status_code=200)
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"HTML export failed: {str(e)}"})

app.include_router(api_router, prefix="/api")

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    max_size = 5 * 1024 * 1024  # 5MB
    content_length = request.headers.get("Content-Length")
    if content_length and int(content_length) > max_size:
        return JSONResponse(content={"detail": "File too large"}, status_code=413)
    return await call_next(request)

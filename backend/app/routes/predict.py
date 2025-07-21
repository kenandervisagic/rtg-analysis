from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from services.utils import allowed_file, preprocess_image
from services.llm import generate_clinical_summary
from model.loader import model
import traceback

router = APIRouter()

@router.post("/predict", response_class=JSONResponse)
async def predict_api(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG/PNG allowed.")

        img_tensor = preprocess_image(contents)
        prediction = model.predict(img_tensor)[0][0]

        result = "PNEUMONIA" if prediction > 0.5 else "NORMAL"
        confidence = float(prediction) if prediction > 0.5 else 1 - float(prediction)

        insight = generate_clinical_summary(result, confidence)

        return {
            "result": result,
            "confidence": round(confidence, 3),
            "insights": [insight],
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

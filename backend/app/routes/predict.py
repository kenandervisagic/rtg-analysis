from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from services.utils import allowed_file, preprocess_image, preprocess_dicom
from services.llm import generate_clinical_summary
from model.loader import model
from pydicom.errors import InvalidDicomError
from PIL import UnidentifiedImageError

router = APIRouter()

@router.post("/predict", response_class=JSONResponse)
async def predict_api(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG or DICOM allowed.")

        # Optional size check
        MAX_MB = 10
        if len(contents) > MAX_MB * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Datoteka je prevelika. Maksimalna veličina je 10 MB.")

        # DICOM or image
        if file.filename.lower().endswith(".dcm"):
            try:
                img_tensor = preprocess_dicom(contents)
            except InvalidDicomError:
                raise HTTPException(status_code=400, detail="Neispravna DICOM datoteka.")
        else:
            try:
                img_tensor = preprocess_image(contents)
            except UnidentifiedImageError:
                raise HTTPException(status_code=400, detail="Neispravna slika. Pokušajte s JPG/PNG formatom.")

        prediction = model.predict(img_tensor)[0][0]
        result = "PNEUMONIA" if prediction > 0.5 else "NORMAL"
        confidence = float(prediction) if prediction > 0.5 else 1 - float(prediction)
        insight = generate_clinical_summary(result, confidence)

        return {
            "result": result,
            "confidence": round(confidence, 3),
            "insights": [insight],
        }

    except HTTPException as http_exc:
        raise http_exc  
    except Exception as e:
        raise HTTPException(status_code=500, detail="Došlo je do greške tokom analize snimka. Pokušajte ponovo.")


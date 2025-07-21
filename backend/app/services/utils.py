from PIL import Image
import numpy as np
from io import BytesIO

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

def allowed_file(filename: str) -> bool:
    return filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(file: bytes) -> np.ndarray:
    img = Image.open(BytesIO(file)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img).astype("float32") / 255.0
    return np.expand_dims(img_array, axis=0)

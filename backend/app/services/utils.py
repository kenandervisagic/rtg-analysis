import io
from io import BytesIO

import numpy as np
import pydicom
import torchvision.transforms as transforms
from PIL import Image


def preprocess_dicom(contents: bytes):
    dicom_file = pydicom.dcmread(io.BytesIO(contents))
    pixel_array = dicom_file.pixel_array.astype(np.float32)

    # Normalize to 0-255
    pixel_array -= pixel_array.min()
    pixel_array /= pixel_array.max()
    pixel_array *= 255.0
    pixel_array = pixel_array.astype(np.uint8)

    # Convert to RGB if grayscale
    if len(pixel_array.shape) == 2:
        image = Image.fromarray(pixel_array).convert("RGB")
    else:
        image = Image.fromarray(pixel_array)

    # Resize + convert to np array in channels-last
    image = image.resize((224, 224))
    img_array = np.array(image).astype("float32") / 255.0  # shape: (224, 224, 3)
    return np.expand_dims(img_array, axis=0)  # shape: (1, 224, 224, 3)



def allowed_file(filename: str) -> bool:
    return filename.lower().endswith((".jpg", ".jpeg", ".png", ".dcm"))


def preprocess_image(file: bytes) -> np.ndarray:
    img = Image.open(BytesIO(file)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img).astype("float32") / 255.0
    return np.expand_dims(img_array, axis=0)

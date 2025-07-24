import os
import requests
import keras

MODEL_URL = "https://minio.kdidp.art/model/resnet50_pneumonia_new.keras"
MODEL_PATH = "resnet50_pneumonia_new.keras"

def download_model_if_needed():
    if not os.path.exists(MODEL_PATH):
        print("📥 Downloading model...")
        response = requests.get(MODEL_URL)
        response.raise_for_status()
        with open(MODEL_PATH, 'wb') as f:
            f.write(response.content)
        print("✅ Model downloaded.")
    else:
        print("✅ Model already exists.")

download_model_if_needed()
model = keras.models.load_model(MODEL_PATH)

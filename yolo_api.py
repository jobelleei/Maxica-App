
from pathlib import Path
import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best2.pt"

if not MODEL_PATH.is_file():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

app = FastAPI(title="Maxica Waste Detection API")

# Load the trained model once when the server starts.
model = YOLO(str(MODEL_PATH))


@app.get("/")
def home():
    return {
        "message": "Maxica Waste Detection API is running",
        "model": MODEL_PATH.name,
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_PATH.name,
        "classes": model.names,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload an image file.")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Image is empty.")

        image = Image.open(io.BytesIO(contents)).convert("RGB")

    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file.")
    finally:
        await file.close()

    try:
        results = model.predict(image, conf=0.25, verbose=False)
        result = results[0]
        detections = []

        if result.boxes is not None:
            for box in result.boxes:
                class_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())

                detections.append({
                    "label": model.names[class_id],
                    "confidence": round(confidence, 4),
                    "class_id": class_id,
                    "box": [
                        round(float(value), 2)
                        for value in box.xyxy[0].tolist()
                    ],
                })

        detections.sort(
            key=lambda item: item["confidence"],
            reverse=True,
        )

        best = detections[0] if detections else None

        return {
            "success": True,
            "label": best["label"] if best else "Unknown item",
            "confidence": best["confidence"] if best else 0.0,
            "detections": detections,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {error}",
        )

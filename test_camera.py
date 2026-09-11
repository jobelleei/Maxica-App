# test_camera.py
from ultralytics import YOLO

# Load your trained model (best.pt is usually preferred)
model = YOLO("C:/DATASCIENCE/Maxica-App/runs/detect/train/weights/best.pt")

# Run inference using your webcam
model.predict(source=0, show=True, conf=0.5)

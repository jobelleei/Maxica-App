# test_camera.py
from ultralytics import YOLO

# Colab-trained model (copy best2.pt into the models/ folder first)
model = YOLO("C:/DATASCIENCE/Maxica-App/models/best2.pt")

# stream=True returns frames one at a time so we can print each prediction
for result in model.predict(source=0, show=True, conf=0.25, stream=True):
    boxes = result.boxes
    if len(boxes):
        top = int(boxes.conf.argmax())
        print(model.names[int(boxes.cls[top])], round(float(boxes.conf[top]), 2))
# train_yolov8.py
from ultralytics import YOLO

# Load a pretrained YOLOv8 model (nano version for speed)
model = YOLO("yolov8n.pt")

# Train the model
results = model.train(
    data="C:/DATASCIENCE/Maxica-App/datasets/garbage_classification/data.yaml",  # dataset path
    epochs=50,          # number of training epochs
    imgsz=640,          # image size
    batch=16,           # batch size
    max_det=400,        # max detections per image
    lr0=0.001,          # initial learning rate
    optimizer="AdamW",  # optimizer
    save_period=1       # save checkpoints every epoch
)

# Validate the model after training
model.val()

# Export the trained model (optional)
model.export(format="onnx")  # you can also use 'torchscript', 'tflite', etc.



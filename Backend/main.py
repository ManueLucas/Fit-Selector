from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.post("/api/add_image")
def add_image():
    return {"Hello": "World"}


@app.get("/api/{image_id}")
def get_image(image_id: str):
    return {"image_id": image_id}
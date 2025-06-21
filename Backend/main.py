from typing import Union

from fastapi import FastAPI
from fastapi import File, UploadFile, Form
from google import genai
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

app = FastAPI()
client = genai.Client(api_key=api_key)  # ← pass the variable here

@app.post("/api/add_image")
def add_image(file: UploadFile = File(...)):
    return {"filename": file.filename, "content_type": file.content_type}


@app.get("/api/{image_id}")
def get_image(image_id: str):
    return {"image_id": image_id}

@app.post("/api/query")
async def query(text: str = Form(...), file: UploadFile = File(...)):
    print(f'api key: {api_key}')
    result = client.models.embed_content(
        model="gemini-embedding-exp-03-07",
        contents=text)

    return {
        "question": text,
        "answer": result,
        "filename": file.filename,
        "content_type": file.content_type,
        "message" : "Thanks for playing!"
    }
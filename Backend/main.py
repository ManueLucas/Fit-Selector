from typing import Union

from fastapi import FastAPI
from fastapi import File, UploadFile, Form
from google import genai
import os
from dotenv import load_dotenv
load_dotenv()
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

api_key = os.getenv("GEMINI_API_KEY")
mongo_uri = os.getenv("MONGO_URI")
# Create a new client and connect to the server
client = MongoClient(mongo_uri, server_api=ServerApi('1'))


app = FastAPI()
client = genai.Client(api_key=api_key)

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
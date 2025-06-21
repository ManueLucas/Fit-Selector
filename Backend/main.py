from typing import Union, Annotated

from fastapi import FastAPI, Depends
from fastapi import File, UploadFile, Form
from google import genai
# import os
# from dotenv import load_dotenv
# load_dotenv()
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


from auth import authenticated_user

from pydantic import BaseModel

import config
from PIL import Image
import io


class UserResponse(BaseModel):
    userId: str


settings = config.Settings(_env_file='.env', _env_file_encoding='utf-8')

# api_key = os.getenv("GEMINI_API_KEY")
# mongo_uri = os.getenv("MONGO_URI")
# Create a new client and connect to the server
client = MongoClient(settings.mongo_uri, server_api=ServerApi('1'))


app = FastAPI()
client = genai.Client(api_key=settings.gemini_api_key)

@app.post("/api/add_image")
def add_image(file: UploadFile = File(...)):
    # Open the uploaded file as an image
    try:
        image = Image.open(io.BytesIO(file.file.read()))
        image.verify()  # Verify that it is, in fact, an image
        image.save(image, format='JPEG')
        img_bytes = image.getvalue()

    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}

    # Process the image (e.g., convert to text or extract features)
    result = client.models.embed_content(
    model="gemini-embedding-exp-03-07",
    contents={"image": img_bytes},
    task_type="retrieval_document")
    # Print the embedding vector (list of floats)
    embedding_vector = result["embedding"]
    print(f"Embedding vector length: {len(embedding_vector)}")
    print(embedding_vector[:10])  # Show first few values

    return {"filename": file.filename, "content_type": file.content_type, "embedding": result}

@app.get("/image/{image_id}")
def get_image(image_id: str, _: Annotated[str, Depends(authenticated_user)]):
    return {"image_id": image_id}

@app.post("/api/query")
async def query(text: str = Form(...), file: UploadFile = File(...)):
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


@app.get("/clerk_jwt/", response_model=UserResponse)
async def clerk_jwt(current_user: Annotated[str, Depends(authenticated_user)]):
    return UserResponse(userId=current_user)
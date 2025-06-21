from typing import Union, Annotated

from fastapi import FastAPI, Depends
from fastapi import File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

from google import genai
from google.genai import types

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

# --- CORS Configuration ---
# You need to ensure this is present and correctly configured in your FastAPI app
origins = [
    "http://localhost:5173",  # <--- IMPORTANT: This MUST match your React app's URL
    # Add your production frontend URL here when deployed, e.g.:
    # "https://www.your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allows requests from these origins
    allow_credentials=True,         # Allows cookies/authorization headers to be sent
    allow_methods=["*"],            # Allows all methods (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],            # Allows all headers, including 'Authorization'
)


@app.post("/api/add_image")
async def add_image(file: UploadFile = File(...)):
    try:
        # Load image from uploaded file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Create Gemini Part (multimodal input expects dict with MIME type)
    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}

    # Get the embedding from Gemini
    response = client.models.embed_content(
        model="models/embedding-001",
        contents=str(image_data),
    )

    return {"embedding": response}


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

@app.get("/api/protected")
def get_image(uid: Annotated[str, Depends(authenticated_user)]):
    return {"uid": uid}
from typing import Union, Annotated

from fastapi import FastAPI, Depends
from fastapi import File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import ReturnDocument

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

import base64

class UserResponse(BaseModel):
    userId: str
    
productTypes = ["Shirt", "Pants", "Jacket", "Accessory", "Shoes"]


settings = config.Settings(_env_file='.env', _env_file_encoding='utf-8')

# Create a new client and connect to the server
mongo_client = MongoClient(settings.mongo_uri, server_api=ServerApi('1'))
mongo_db = mongo_client["my_database"]
clothing = mongo_db["clothing"]


def query_results(query, k, userid):
    results = clothing.aggregate([
        {'$vectorSearch': {
            "index": "embedding_vector_index",
            "path": "embeddings",
            "queryVector": generate_embedding(query),
            "numCandidates": 50,
            "limit": k,
            "filter": {"user_id": userid}
        }},
        {"$project": {"_id": 0}}
    ])
    
    return results
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
async def add_image(
    userid: Annotated[str, Depends(authenticated_user)], 
    file: UploadFile = File(...), 
    product_type: str = Form(...)
):
    print(userid)
    try:
        # Load image from uploaded file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Create Gemini Part (multimodal input expects dict with MIME type)
    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}
    
    image_bytestring = str(image_data)
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    # Get the embedding from Gemini
    response = generate_embedding(image_bytestring)
        
    new_record = {
        "user_id": userid,                  # UUID as string
        "image_id": get_next_image_id(),    # Sequential integer
        "image_base64": image_base64,   # Placeholder
        "product_type": product_type,           # e.g. Shirt, Pants
        "embeddings": response     # List of 1536 random floats
    }
    clothing.insert_one(new_record)


    return {"embedding": response, "product_type": product_type}


@app.get("/api/get_inventory")
def get_inventory(userid: Annotated[str, Depends(authenticated_user)]):
    results = clothing.find(
        {"user_id": userid},
        {"_id": 0, "image_id": 1, "image_base64": 1, "product_type": 1}
    )

    return list(results)
    
    
@app.get("/api/random_outfit/{product_type}")
def random_outfit(product_type: str, userid: Annotated[str, Depends(authenticated_user)]):

    filter_criteria = {
        "product_type": product_type,
        "user_id": userid
    }

    pipeline = [
        {"$match": filter_criteria},
        {"$sample": {"size": 1}}
    ]

    random_doc_cursor = clothing.aggregate(pipeline)
    random_doc_list = list(random_doc_cursor)  # Convert cursor to a list


    if random_doc_list:
        return random_doc_list[0]['image_base64']

    # if random_doc_list:
    #     doc = random_doc_list[0]
    #     # Convert ObjectId to string here!
    #     doc['_id'] = str(doc['_id'])
    #     return doc
    # else:
    #     return None # No document found matching criteria

    # print(random_doc_list)
    # random_doc = random_doc_list[0] if random_doc_list else None  # Get the first document or None

    # return {"product_type": random_doc_list}
        # print("Random document pulled using $sample:")
        # pprint.pprint(random_doc)
    # else:
    #     print("No documents found in the collection.")

@app.post("/api/search")
def search(userid: Annotated[str, Depends(authenticated_user)], query: str = Form(...)):
    results = query_results(query, 5, userid)
    return list(results)
    
    
    
@app.get("/image/{image_id}")
def get_image(image_id: str, userid: Annotated[str, Depends(authenticated_user)]):

    filter_criteria = {
        "image_id": image_id,
        "user_id": userid
    }

    pipeline = [
        {"$match": filter_criteria}
    ]

    random_doc_cursor = clothing.aggregate(pipeline)
    random_doc_list = list(random_doc_cursor)  # Convert cursor to a list


    if random_doc_list:
        return random_doc_list[0]['image_base64']


    # return {"image_id": image_id}


def get_shirts(style_description: str) -> dict:
    """Get the shirts in the wardrobe that most closely fit the description given.

    Args:
        style_description: A brief description of the style of shirt we want for the outfit.

    Returns:
        A list containing the ids of the top 3 matches in the wardrobe.
    """

    return [1, 2, 3] # TODO: Search vector database

def get_pants(style_description: str) -> dict:
    """Get the pants in the wardrobe that most closely fit the description given.

    Args:
        style_description: A brief description of the style of pants we want for the outfit.

    Returns:
        A list containing the ids of the top 3 matches in the wardrobe.
    """

    return [4, 5, 6] # TODO: Search vector database

def get_shoes(style_description: str) -> dict:
    """Get the shoes in the wardrobe that most closely fit the description given.

    Args:
        style_description: A brief description of the style of shoes we want for the outfit.

    Returns:
        A list containing the ids of the top 3 matches in the wardrobe.
    """

    return [7, 8, 9] # TODO: Search vector database

def get_accessories(style_description: str) -> dict:
    """Get the accessories in the wardrobe that most closely fit the description given.

    Args:
        style_description: A brief description of the style of accessory we want for the outfit.

    Returns:
        A list containing the ids of the top 3 matches in the wardrobe.
    """
    # ... (implementation) ...

    return [10, 11, 12] # TODO: Search vector database

def get_jackets(style_description: str) -> dict:
    """Get the jackets in the wardrobe that most closely fit the description given.

    Args:
        style_description: A brief description of the style of jacket we want for the outfit.

    Returns:
        A list containing the ids of the top 3 matches in the wardrobe.
    """
    # ... (implementation) ...

    return [13, 14, 15] # TODO: Search vector database


@app.post("/api/query")
def query(userid: Annotated[str, Depends(authenticated_user)], text: str = Form(...)):

    config = types.GenerateContentConfig(
        tools=[get_shirts, get_pants, get_shoes, get_accessories, get_jackets]
    )  # Pass the function itself

    # Make the request
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=text,
        config=config,
    )

    return response.text

    # response = model.generate_content(
    #     contents = [
    #       Content(
    #         role="user",
    #           parts=[
    #               Part.from_text(text),
    #           ],
    #       )
    #     ],
    #     generation_config = GenerationConfig(temperature=0),
    #     tools = [
    #       Tool(
    #         function_declarations=[get_shirts, get_pants, get_shoes, get_accessories, get_jackets],
    #       )
    #     ]
    # )


# @app.post("/api/query")
# async def query(text: str = Form(...), file: UploadFile = File(...)):
#     result = client.models.embed_content(
#         model="gemini-embedding-exp-03-07",
#         contents=text)

#     return {
#         "question": text,
#         "answer": result,
#         "filename": file.filename,
#         "content_type": file.content_type,
#         "message" : "Thanks for playing!"
#     }


@app.get("/clerk_jwt/", response_model=UserResponse)
async def clerk_jwt(current_user: Annotated[str, Depends(authenticated_user)]):
    return UserResponse(userId=current_user)

@app.get("/api/protected")
def get_image(uid: Annotated[str, Depends(authenticated_user)]):
    return {"uid": uid}

def generate_embedding(query):
    return client.models.embed_content(
        model="gemini-embedding-exp-03-07",
        contents=query).embeddings[0].values 

def get_next_image_id():
    counter = mongo_db.counters.find_one_and_update(
        {"_id": "image_id"},
        {"$inc": {"sequence_value": 1}},
        return_document=ReturnDocument.AFTER,
        upsert=True  # Creates the document if it doesn't exist
    )
    return counter["sequence_value"]

from pymongo import MongoClient, ASCENDING
import uuid
import os
from dotenv import load_dotenv
load_dotenv()
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import random

api_key = os.getenv("GEMINI_API_KEY")
mongo_uri = os.getenv("MONGO_URI")
# Create a new client and connect to the server
client = MongoClient(mongo_uri, server_api=ServerApi('1'))

# Connect to MongoDB (adjust URI if remote)
client = MongoClient(mongo_uri)

# Create / connect to database
db = client["my_database"]

# Create / access the collection
clothing = db["clothing"]

# Optional: Drop existing collection if you want a clean slate
# clothing.drop()

# Create indexes
clothing.create_index([("user_id", ASCENDING)])
clothing.create_index([("image_id", ASCENDING)], unique=True)
clothing.create_index([("product_type", ASCENDING)])
# Generate a list of 1536 random floats
sample_embedding = [random.uniform(0, 1) for _ in range(1536)]

# Insert a sample document
sample_doc = {
    "user_id": str(uuid.uuid4()),                  # UUID as string
    "image_id": 1,                                 # Sequential integer
    "image_base64": "base64-encoded-image-string", # Placeholder
    "product_type": "Shirt",                       # e.g. Shirt, Pants
    "embeddings": sample_embedding                 # List of 1536 random floats
}

clothing.insert_one(sample_doc)

print("Initialized clothing collection and inserted sample document.")

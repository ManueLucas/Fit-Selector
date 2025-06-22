from pymongo import MongoClient, ASCENDING
import uuid
# import os
# from dotenv import load_dotenv
# load_dotenv()
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import random

import config

# api_key = os.getenv("GEMINI_API_KEY")
# mongo_uri = os.getenv("MONGO_URI")

settings = config.Settings(_env_file='.env', _env_file_encoding='utf-8')

# Create a new client and connect to the server
client = MongoClient(settings.mongo_uri, server_api=ServerApi('1'))

# Create / connect to database
db = client["my_database"]

db.counters.update_one({"_id": "image_id"}, {"$set": {"sequence_value": 0}}, upsert=True)

# Create / access the collection
clothing = db["clothing"]

# Optional: Drop existing collection if you want a clean slate
clothing.drop()

# Create indexes
clothing.create_index([("user_id", ASCENDING)])
clothing.create_index([("image_id", ASCENDING)], unique=True)
clothing.create_index([("product_type", ASCENDING)])
clothing.create_search_index(
    {
        "definition": {
            "mappings": {
                "dynamic": True,
                "fields": {
                    "embeddings": {
                        "type": "knnVector",
                        "dimensions": 3072,
                        "similarity": "dotProduct"
                    }
                }
            }
        },
        "name": "embedding_vector_index"
    }
)
# Generate a list of 1536 random floats
sample_embedding = [random.uniform(0, 1) for _ in range(3072)]

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

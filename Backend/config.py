from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    # Gemini env variables
    gemini_api_key: str
    mongo_uri: str

    # Clerk env variables 
    clerk_api_secret_key: str
    clerk_authorized_parties: str

    # override property to return list from comma separated string
    @property
    def clerk_authorized_parties(self) -> List[str]:
        return self.clerk_authorized_parties.split(",")
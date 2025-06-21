from clerk_backend_api import authenticate_request, AuthenticateRequestOptions
from fastapi import HTTPException, Request
from starlette import status

import config

settings = config.Settings(_env_file='.env', _env_file_encoding='utf-8')


async def authenticated_user(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # from app.main import settings  # to prevent circular import
        request_state = authenticate_request(
            request,
            AuthenticateRequestOptions(
                secret_key=settings.clerk_api_secret_key,
                authorized_parties=settings.clerk_authorized_parties,
            ),
        )
        if not request_state.is_signed_in:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=request_state.message,
                headers={"WWW-Authenticate": "Bearer"},
            )
        username: str = request_state.payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception as e:
        raise e
    return username
from pydantic import BaseModel

class MovieAskRequest(BaseModel):
    message: str
from pydantic import BaseModel
from typing import List

class MusicRecommendRequest(BaseModel):
    text: str

class MusicSearchBlock(BaseModel):
    searchTerms: List[str]
    limit:int

class MusicRecommendResponse(BaseModel):
    tempo: str
    korean : MusicSearchBlock
    global_: MusicSearchBlock
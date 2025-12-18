from fastapi import APIRouter
from ai.schemas.movie_schema import MovieAskRequest
from ai.services.movie_logic import route_movie_request

router = APIRouter()

@router.post("/ai")
def ask_movie_ai(req: MovieAskRequest):

    result = route_movie_request(req.message)

    return {
        "question": req.message,
        "result": result
    }

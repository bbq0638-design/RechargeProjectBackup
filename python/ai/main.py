from fastapi import FastAPI
from .routers.music_ai import router as music_router
from ai.routers.movie_ai import router as movie_router


app = FastAPI()
app.include_router(music_router)
app.include_router(movie_router, prefix="/movie")
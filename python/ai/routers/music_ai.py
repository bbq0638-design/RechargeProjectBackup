from fastapi import APIRouter
from ..schemas.music_schema import MusicRecommendRequest
from ..services.music_logic import (
    analyze_intent_with_confidence,
    build_music_recommendation
)
from ..services.music_itunes import (
    fetch_music_by_strategy,
    normalize_tracks,
    filter_by_artist
)
from ..services.music_llm import analyze_music_intent_llm


router = APIRouter(
    prefix="/ai/music",
    tags=["Music AI"]
)


@router.post("/recommend")
def recommend_music(req: MusicRecommendRequest):
    analysis = analyze_intent_with_confidence(req.text)

    if analysis["need_llm"]:
        intents = analyze_music_intent_llm(req.text)
    else:
        intents = analysis["intents"]

    print("LLM intents:", intents)

    strategy = build_music_recommendation(intents)

    print("FINAL strategy:", strategy)

    # 1️⃣ iTunes 검색
    raw_tracks = fetch_music_by_strategy(strategy)

    print("artists in raw_tracks:", set(t.get("artistName") for t in raw_tracks))

    # 2️⃣ 아티스트 지정 요청이면 강제 필터링
    if strategy.get("artist"):
        raw_tracks = filter_by_artist(raw_tracks, strategy["artist"])

    # 3️⃣ 중복 제거 + 랜덤 섞기
    tracks = normalize_tracks(raw_tracks)

    return {
        "tempo": strategy.get("tempo"),
        "tracks": tracks
    }

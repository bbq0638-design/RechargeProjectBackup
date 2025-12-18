import requests
from typing import List
import random

ITUNES_SEARCH_URL = "https://itunes.apple.com/search"

def search_itunes(
    term: str,
    limit: int = 20,
    country: str = "KR",
    attribute: str | None = None
) -> List[dict]:
    params = {
        "term": term,
        "media": "music",
        "entity": "song",
        "limit": limit,
        "country": country,
        "lang": "ko_kr",
    }

    if attribute:
        params["attribute"] = attribute

    res = requests.get(ITUNES_SEARCH_URL, params=params, timeout=5)
    res.raise_for_status()
    return res.json().get("results", [])



def fetch_music_by_strategy(strategy: dict) -> List[dict]:
    tracks = []

    # 🇰🇷 Korean 검색
    for term in strategy.get("korean", {}).get("searchTerms", []):

        # 🔥 한글 가수 이름 → artistTerm
        if any('가' <= ch <= '힣' for ch in term):
            results = search_itunes(
                term=term,
                limit=strategy["korean"]["limit"],
                country="KR",
                attribute="artistTerm"
            )
        else:
            # 장르/느낌 → attribute 없이
            results = search_itunes(
                term=term,
                limit=strategy["korean"]["limit"],
                country="KR"
            )

        tracks.extend(results)

    # 🌍 Global 검색 (그냥 term 검색)
    for term in strategy.get("global", {}).get("searchTerms", []):
        results = search_itunes(
            term=term,
            limit=strategy["global"]["limit"],
            country="US"
        )
        tracks.extend(results)

    return tracks


# python/ai/services/music_itunes.py

def normalize_itunes_track(track: dict) -> dict:
    artwork = track.get("artworkUrl100")

    if artwork and artwork.startswith("http://"):
        artwork = artwork.replace("http://", "https://")

    return {
        "trackId": track.get("trackId"),
        "title": track.get("trackName"),
        "artist": track.get("artistName"),
        "album": track.get("collectionName"),
        "artwork": artwork,
        "previewUrl": track.get("previewUrl"),
        "genre": track.get("primaryGenreName"),
    }


def resolve_itunes_artist_name(artist: str) -> str | None:
    """
    사용자 입력 → iTunes 기준 artistName으로 정규화
    """
    results = search_itunes(
        term=artist,
        limit=10,
        country="KR"
    )

    artist_names = [
        t.get("artistName")
        for t in results
        if t.get("artistName")
    ]

    if not artist_names:
        return None

    # 가장 많이 등장하는 artistName = canonical
    return max(set(artist_names), key=artist_names.count)


def filter_by_artist(tracks: list[dict], artist: str) -> list[dict]:
    if not artist:
        return tracks

    artist_lower = artist.lower()
    return [
        t for t in tracks
        if artist_lower in (t.get("artistName") or "").lower()
    ]



def normalize_tracks(tracks: List[dict]) -> List[dict]:
    seen = set()
    result = []

    for t in tracks:
        tid = t.get("trackId")
        if not tid or tid in seen:
            continue
        seen.add(tid)
        result.append(normalize_itunes_track(t))

    random.shuffle(result)
    return result

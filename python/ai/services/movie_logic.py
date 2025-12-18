from ai.services.movie_llm import analyze_movie_intent_llm

import re
import random
import traceback
from enum import Enum
from typing import Optional, Dict, Any

# 최소 평점 6점 이상, 인기순, 평점순, 평가 수 순
MIN_VOTE = 6.0
SORT_POOL = [
    "popularity.desc",
    "vote_average.desc",
    "vote_count.desc"
]



class Intent(str, Enum):
    SIMILAR_BY_TITLE = "SIMILAR_BY_TITLE"
    WEATHER = "WEATHER"
    MOOD = "MOOD"
    RECHARGE_IMMERSIVE_CONTINUE = "RECHARGE_IMMERSIVE_CONTINUE"
    LLM_FALLBACK = "LLM_FALLBACK"

# 제목 검색 기반
def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


SIMILAR_PATTERNS = [
    r"(.+)\s*같은\s*영화",
    r"(.+)\s*비슷한\s*영화",
    r"(.+)\s*이랑\s*비슷",
    r"(.+)\s*랑\s*비슷",
    r"(.+)\s*과\s*비슷",
    r"(.+)\s*같은\s*느낌",
    r"(.+)\s*같은\s*분위기",
]

def extract_seed_title(text: str) -> Optional[str]:
    for pattern in SIMILAR_PATTERNS:
        match = re.search(pattern, text)
        if match:
            seed = match.group(1).strip()
            return seed if len(seed) >= 2 else None
    return None

# 날씨 기반 -> 1단계적으로 날씨 연상 단어에 장르 매핑

WEATHER_KEYWORDS = {
    "rain": {
        "keywords": ["비", "비가", "비오는", "장마"],
        "genres": ["18", "10749"]
    },
    "snow": {
        "keywords": ["눈", "설경"],
        "genres": ["35", "10751", "14"]
    },
    "sunny": {
        "keywords": ["맑", "화창", "쨍쨍"],
        "genres": ["35", "12"]
    },
    "cloudy": {
        "keywords": ["흐린", "우중충"],
        "genres": ["18", "10749"]
    },
    "hot": {
        "keywords": ["더워", "폭염"],
        "genres": ["35", "28"]
    },
    "cold": {
        "keywords": ["추워", "한겨울"],
        "genres": ["18", "14"]
    }
}

def extract_weather(text: str) -> Optional[str]:
    for key, rule in WEATHER_KEYWORDS.items():
        if any(k in text for k in rule["keywords"]):
            return key
    return None
# 기분 분기 -> 감정단어 표현에 영화 장르 매핑
MOOD_KEYWORDS = {
    "happy": {
        "keywords": ["행복", "신나", "기분 좋아"],
        "genres": ["35", "12"]
    },
    "sad": {
        "keywords": ["우울", "슬퍼", "눈물"],
        "genres": ["18", "10749"]
    },
    "tired": {
        "keywords": ["피곤", "지쳤어"],
        "genres": ["16", "10751"]
    },
    "healing": {
        "keywords": ["힐링", "편하게", "잔잔한"],
        "genres": ["18", "10402"]
    },
    "excited": {
        "keywords": ["짜릿", "스릴"],
        "genres": ["28", "53"]
    }
}

def extract_mood(text: str) -> Optional[str]:
    for key, rule in MOOD_KEYWORDS.items():
        if any(k in text for k in rule["keywords"]):
            return key
    return None

# RechargeApp에 맞게 충전 중 차 안에서 핸드폰으로 가볍게 보다가 충전
# 완료 후 집 가서 또 보고 싶은 영화
# 즉, 호불호 없는 검증된 영화

RECHARGE_KEYWORDS = [
    "충전", "전기차",
    "차에서", "차 안",
    "기다리", "대기",
    "작은 화면", "가볍게",
    "집에 가서", "이어", "마저", "몰입"
]

def is_recharge_request(text: str) -> bool:
    return any(k in text for k in RECHARGE_KEYWORDS)


# 메인 라우터

def route_movie_request(user_text: str) -> Dict[str, Any]:
    print("ROUTER 요청 수신:", user_text)

    text = normalize_text(user_text)

    # Rule 기반
    seed = extract_seed_title(text)
    weather = extract_weather(text)
    mood = extract_mood(text)
    recharge = is_recharge_request(text)

    if seed:
        return {
            "intent": Intent.SIMILAR_BY_TITLE,
            "route": "tmdb",
            "payload": {"seedTitle": seed}
        }

    if recharge:
        return {
            "intent": Intent.RECHARGE_IMMERSIVE_CONTINUE,
            "route": "tmdb",
            "payload": {
                "fast_start": True,
                "mobile_friendly": True,
                "low_cognitive_load": True,
                "likely_to_continue": True,
                "min_vote": MIN_VOTE,
                "sort_by": "popularity.desc",
                "page": random.randint(1, 5)
            }
        }

    if weather:
        return {
            "intent": Intent.WEATHER,
            "route": "tmdb",
            "payload": {
                "weather": weather,
                "prefer_genres": WEATHER_KEYWORDS[weather]["genres"],
                "min_vote": MIN_VOTE,
                "sort_by": random.choice(SORT_POOL),
                "page": random.randint(1, 5)
            }
        }

    if mood:
        return {
            "intent": Intent.MOOD,
            "route": "tmdb",
            "payload": {
                "mood": mood,
                "prefer_genres": MOOD_KEYWORDS[mood]["genres"],
                "min_vote": MIN_VOTE,
                "sort_by": random.choice(SORT_POOL),
                "page": random.randint(1, 5)
            }
        }

    # LLM fallback
    try:
        llm = analyze_movie_intent_llm(user_text)
    except Exception:
        llm = None

    if llm and llm.get("is_movie_related"):
        if llm.get("reference_title"):
            return {
                "intent": Intent.SIMILAR_BY_TITLE,
                "route": "tmdb",
                "payload": {"seedTitle": llm["reference_title"]}
            }

        if llm.get("situation") == "charging":
            return {
                "intent": Intent.RECHARGE_IMMERSIVE_CONTINUE,
                "route": "tmdb",
                "payload": {
                    "fast_start": True,
                    "mobile_friendly": True,
                    "low_cognitive_load": True,
                    "likely_to_continue": True,
                    "min_vote": MIN_VOTE,
                    "sort_by": "popularity.desc",
                    "page": random.randint(1, 5)
                }
            }

        if llm.get("weather"):
            key = llm["weather"]
            return {
                "intent": Intent.WEATHER,
                "route": "tmdb",
                "payload": {
                    "weather": key,
                    "prefer_genres": WEATHER_KEYWORDS.get(key, {}).get("genres", []),
                    "min_vote": MIN_VOTE,
                    "sort_by": random.choice(SORT_POOL),
                    "page": random.randint(1, 5)
                }
            }

        if llm.get("mood"):
            key = llm["mood"]
            return {
                "intent": Intent.MOOD,
                "route": "tmdb",
                "payload": {
                    "mood": key,
                    "prefer_genres": MOOD_KEYWORDS.get(key, {}).get("genres", []),
                    "min_vote": MIN_VOTE,
                    "sort_by": random.choice(SORT_POOL),
                    "page": random.randint(1, 5)
                }
            }

    # 최종 fallback
    return {
        "intent": Intent.LLM_FALLBACK,
        "route": "llm",
        "payload": {
            "userText": user_text,
            "reason": "Rule + LLM 전부 실패"
        }
    }

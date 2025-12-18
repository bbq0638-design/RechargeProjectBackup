from .music_itunes import resolve_itunes_artist_name

CONTEXT_RULES = {
    "charging": ["충전", "대기", "기다림", "잠깐", "쉬는 중"],
    "commute": ["출근", "퇴근", "집 가는", "회사"],
    "drive": ["드라이브", "운전", "고속도로", "차 안"],
    "travel": ["여행", "휴가", "바다", "공항"],
    "focus": ["집중", "작업", "코딩", "공부"],
    "workout": ["운동", "헬스", "러닝", "텐션"],
    "rest": ["휴식", "쉬고", "멍하니", "가만히"],
}

MOOD_RULES = {
    "tired": ["피곤", "지침", "힘들다", "졸림"],
    "calm": ["편안", "차분", "잔잔"],
    "happy": ["기분 좋", "행복", "좋다"],
    "excited": ["신나", "설렘", "두근"],
    "sad": ["우울", "슬픔", "외로"],
}

WEATHER_RULES = {
    "rainy": ["비", "비 오는", "비오는 날"],
    "sunny": ["맑은", "화창", "날씨 좋"],
    "cloudy": ["흐림", "구름"],
    "snowy": ["눈", "눈 오는"],
    "hot": ["더움", "더운 날"],
    "cold": ["추움", "추운 날"],
}


def analyze_music_intent(text: str) -> dict:
    text = (text or "").strip()

    context_scores = {}
    mood_scores = {}
    weather_scores = {}

    for context, keywords in CONTEXT_RULES.items():
        score = sum(1 for k in keywords if k in text)
        if score > 0:
            context_scores[context] = score

    for mood, keywords in MOOD_RULES.items():
        score = sum(1 for k in keywords if k in text)
        if score > 0:
            mood_scores[mood] = score

    for weather, keywords in WEATHER_RULES.items():
        score = sum(1 for k in keywords if k in text)
        if score > 0:
            weather_scores[weather] = score

    return {
        "context": reduce_scores(context_scores),
        "mood": reduce_scores(mood_scores),
        "weather": reduce_scores(weather_scores),
    }

def reduce_scores(scores: dict):
    if not scores:
        return None

    return max(scores, key=scores.get)

def calculate_confidence(intents: dict) -> int:
    confidence = 0

    if intents.get("context"):
        confidence += 3

    if intents.get("mood"):
        confidence += 2

    if intents.get("weather"):
        confidence +=1

    return confidence

def need_llm(intents: dict) -> bool:
    return not (
        intents.get("context")
        or intents.get("mood")
        or intents.get("weather")
    )


def analyze_intent_with_confidence(text:str) -> dict:
    intents = analyze_music_intent(text)
    confidence = calculate_confidence(intents)

    return {
        "intents": intents,
        "confidence": confidence,
        "need_llm": need_llm(intents)
    }

GENRE_POOL = {
    # 🇰🇷 Korea-heavy terms (iTunes에 잘 걸리는 편)
    "kpop": ["K-pop", "Korean", "아이돌", "가요"],
    "k_ballad": ["Korean Ballad", "발라드"],
    "k_rnb": ["Korean R&B", "R&B"],
    "k_indie": ["K-Indie", "Korean Indie", "인디"],
    "k_hiphop": ["Korean Hip-Hop", "K-Hip Hop", "힙합"],

    # 🌍 Global terms
    "pop": ["Pop"],
    "indie": ["Indie", "Indie Pop"],
    "rnb": ["R&B"],
    "hiphop": ["Hip-Hop"],
    "edm": ["EDM", "Dance"],

    # 🎹 Jazz / Classical (글로벌·국내 혼합 검색용)
    "jazz": ["Jazz", "Smooth Jazz", "Jazz Instrumental"],
    "k_jazz": ["Korean Jazz", "재즈"],
    "classical": ["Classical", "Piano", "Instrumental"],
    "k_classical": ["Korean Classical", "클래식", "피아노"],

    # 🎧 Chill / Focus
    "lofi": ["Lo-fi", "Lofi", "Chill", "Chillhop"],
    "ambient": ["Ambient", "Calm", "Relaxing"],
    "instrumental": ["Instrumental", "Study", "Focus"],
    "acoustic": ["Acoustic", "Singer-Songwriter"],

    "carol": ["Christmas", "Holiday", "Carol", "Xmas"],
    "k_carol": ["크리스마스", "캐롤", "성탄절"],
}

CONTEXT_POLICY = {
    "charging": {
        "tempo": "slow",
        "korean": ["lofi", "k_rnb", "k_ballad", "k_jazz", "k_classical"],
        "global": ["ambient", "jazz", "classical"]
    },
    "commute": {
        "tempo": "medium",
        "korean": ["k_ballad", "k_rnb", "kpop"],
        "global": ["pop", "rnb"]
    },
    "drive": {
        "tempo": "medium",
        "korean": ["kpop", "k_indie"],
        "global": ["pop", "indie"]
    },
    "travel": {
        "tempo": "medium",
        "korean": ["kpop", "k_indie"],
        "global": ["pop", "indie"]
    },
    "focus": {
        "tempo": "medium",
        "korean": ["lofi", "k_classical", "k_jazz"],
        "global": ["instrumental", "classical", "jazz"]
    },
    "workout": {
        "tempo": "fast",
        "korean": ["k_hiphop", "kpop"],
        "global": ["edm", "hiphop"]
    },
    "rest": {
        "tempo": "slow",
        "korean": ["k_ballad", "k_classical"],
        "global": ["acoustic", "classical", "ambient"]
    },
}

MOOD_POLICY = {
    "sad": ["k_ballad", "classical", "piano"],
    "tired": ["lofi", "ambient", "jazz"],
    "calm": ["lofi", "ambient", "jazz", "classical"],
    "happy": ["kpop", "pop"],
    "excited": ["kpop", "pop", "edm"],
}

WEATHER_POLICY = {
    "rainy": ["k_ballad", "lofi", "jazz", "classical"],
    "sunny": ["kpop", "pop", "acoustic"],
    "cloudy": ["k_indie", "indie", "jazz"],
    "snowy": ["pop", "k_ballad", "carol", "k_carol"],
    "hot": ["kpop", "edm"],
    "cold": ["k_ballad", "pop", "acoustic", "carol", "k_carol"],
}


def build_music_recommendation(intents: dict, limit: int = 20) -> dict:
    intent_type = intents.get("intent_type")
    artist = intents.get("artist")
    seed_track = intents.get("seed_track")

    korean_limit = int(round(limit * 0.7))
    global_limit = limit - korean_limit

    # ======================================================
    # ✅ 0️⃣ 아티스트 단독 추천
    # ======================================================
    if intent_type == "artist" and artist:
        canonical = resolve_itunes_artist_name(artist)
        canonical_artist = canonical or artist

        return {
            "tempo": "medium",
            "artist": canonical_artist,
            "korean": {
                "searchTerms": [canonical_artist],
                "limit": limit
            },
            "global": {
                "searchTerms": [],
                "limit": 0
            }
        }

    # ======================================================
    # ✅ 1️⃣ 특정 곡 기반 유사 추천
    # ======================================================
    if intent_type == "similar" and seed_track:
        search_terms = []

        if artist:
            search_terms.extend([
                f"{artist} {seed_track}",
                artist,
                seed_track
            ])
        else:
            search_terms.append(seed_track)

        return {
            "tempo": "medium",
            "artist": artist,   # ← canonical 쓰지 마!
            "korean": {
                "searchTerms": search_terms,
                "limit": korean_limit
            },
            "global": {
                "searchTerms": ["Pop"],
                "limit": global_limit
            }
        }

    # ======================================================
    # 🔹 2️⃣ 일반 추천 (신나는 노래 등)
    # ======================================================
    context = intents.get("context")
    mood = intents.get("mood")
    weather = intents.get("weather")

    tempo = "medium"
    korean_terms = []
    global_terms = []

    # (이하 기존 로직 그대로)


    def expand_terms(genre_key: str):
        if genre_key == "piano":
            return GENRE_POOL.get("classical", [])
        return GENRE_POOL.get(genre_key, [])

    def add_terms_by_region(genre_key: str):
        terms = expand_terms(genre_key)
        if genre_key.startswith("k_"):
            korean_terms.extend(terms)
        else:
            global_terms.extend(terms)

    # 1️⃣ 상황(Context)
    if context and context in CONTEXT_POLICY:
        policy = CONTEXT_POLICY[context]
        tempo = policy.get("tempo", "medium")

        for g in policy.get("korean", []):
            add_terms_by_region(g)
        for g in policy.get("global", []):
            add_terms_by_region(g)

    # 2️⃣ 기분(Mood)
    if mood and mood in MOOD_POLICY:
        for g in MOOD_POLICY[mood]:
            add_terms_by_region(g)

    # 3️⃣ 날씨(Weather)
    if weather and weather in WEATHER_POLICY:
        for g in WEATHER_POLICY[weather]:
            add_terms_by_region(g)

    korean_terms = list(dict.fromkeys(korean_terms))
    global_terms = list(dict.fromkeys(global_terms))

    if not korean_terms and not global_terms:
        korean_terms = GENRE_POOL["kpop"]
        global_terms = GENRE_POOL["pop"]

    return {
        "tempo": tempo,
        "korean": {
            "searchTerms": korean_terms,
            "limit": korean_limit
        },
        "global": {
            "searchTerms": global_terms,
            "limit": global_limit
        }
    }

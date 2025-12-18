import os
import json
import re
import google.generativeai as genai

# 🔐 환경변수
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ v1beta에서 실제로 되는 모델
MODEL_NAME = "models/gemini-2.5-flash-lite"
model = genai.GenerativeModel(MODEL_NAME)

def _safe_json_parse(text: str) -> dict:
    text = text.strip()

    if text.startswith("```"):
        text = re.sub(r"^```json", "", text)
        text = re.sub(r"^```", "", text)
        text = re.sub(r"```$", "", text)
        text = text.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"LLM JSON 파싱 실패: {text}")

    return json.loads(match.group())


def analyze_music_intent_llm(text: str) -> dict:
    prompt = f"""
사용자 입력을 분석해서 아래 JSON 형식으로만 응답해라.
다른 설명은 절대 하지 마.

1. 먼저 음악 추천과 관련된 요청인지 판단해라.
   - 음악 추천과 관련이 없으면 is_music_related=false 로 설정하고
     나머지 필드는 전부 null 로 설정해라.

2. 음악 추천 요청이라면 intent_type 을 반드시 아래 중 하나로 설정해라.
   - general : 일반적인 음악 추천
   - artist  : 특정 가수/아티스트의 노래 추천
   - similar : 특정 노래와 비슷한 음악 추천

3. intent_type 이 artist 인 경우:
   - artist 필드에 가수명을 반드시 채워라.

4. intent_type 이 similar 인 경우:
   - seed_track 필드에 기준이 되는 노래 제목을 반드시 채워라.
   - artist 가 명시되어 있다면 artist 필드도 채워라.

반드시 아래 JSON 형식으로만 응답해라.

{{
  "is_music_related": true,
  "intent_type": "general" | "artist" | "similar",
  "artist": string | null,
  "seed_track": string | null,
  "context": charging | commute | drive | travel | focus | workout | rest | null,
  "mood": tired | calm | happy | excited | sad | null,
  "weather": rainy | sunny | cloudy | snowy | hot | cold | null
}}

입력:
{text}
"""
    response = model.generate_content(prompt)
    return _safe_json_parse(response.text)
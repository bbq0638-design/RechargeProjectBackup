import os
import json
import re
import traceback
from typing import Dict, Any

from dotenv import load_dotenv
import google.generativeai as genai


# 환경 설정

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY가 설정되지 않았습니다.")

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "models/gemini-2.5-flash-lite"
model = genai.GenerativeModel(MODEL_NAME)

def _safe_json_parse(text: str) -> Dict[str, Any]:
    print("LLM JSON 파싱 원문 ↓↓↓")
    print(text)
    print("LLM JSON 파싱 시작 ↑↑↑")

    text = text.strip()

    if text.startswith("```"):
        text = re.sub(r"^```json", "", text)
        text = re.sub(r"^```", "", text)
        text = re.sub(r"```$", "", text)
        text = text.strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"❌ LLM JSON 파싱 실패\n원문:\n{text}")

    parsed = json.loads(match.group())
    print("LLM JSON 파싱 성공:", parsed)

    return parsed



def analyze_movie_intent_llm(user_text: str) -> Dict[str, Any]:
    """
    역할
    - 사용자의 자연어를 '의미 구조(JSON)'로 변환
    - 추천/판단/전략 결정은 하지 않는다
    """

    print("LLM analyze_movie_intent_llm 호출")
    print("LLM user_text:", user_text)

    prompt = f"""
너는 영화 추천 시스템의 보조 분석기이다.
설명하지 말고 JSON만 출력해라.

영화 관련 요청이 아니면
is_movie_related=false 로 설정해라.

{{
  "is_movie_related": true,
  "reference_title": string | null,
  "situation": "charging" | "commute" | "home" | "travel" | null,
  "mood": "happy" | "sad" | "tired" | "healing" | "excited" | null,
  "weather": "rain" | "sunny" | "cloudy" | "snow" | "hot" | "cold" | null
}}

입력:
{user_text}
"""

    try:
        response = model.generate_content(prompt)
        print("LLM raw response:")
        print(response.text)

        return _safe_json_parse(response.text)

    except Exception as e:
        print("LLM호출 또는 파싱 중 예외 발생")
        print("예외 메시지:", e)
        traceback.print_exc()
        raise

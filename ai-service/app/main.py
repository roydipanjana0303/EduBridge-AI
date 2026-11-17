
import os
import logging
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("EduBridgeAI")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

client = None

if API_KEY:
    client = genai.Client(
        api_key=API_KEY,
        http_options=types.HttpOptions(timeout=60000)
    )
else:
    logger.warning("Gemini API key is missing! Set GEMINI_API_KEY in ai-service/.env")

app = FastAPI(
    title="EduBridge AI - LLM Service",
    description="AI-powered educational assistant using Google Gemini",
    version="1.2.0"
)

# --------------------------------------------------
# CORS — Allow frontend on port 3000 and 5173
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# EDUBRIDGE AI SYSTEM PROMPT
# --------------------------------------------------

SYSTEM_PROMPT = """
You are EduBridge AI, an intelligent all-in-one
educational assistant.

YOUR ROLES:

1. AI TEACHER:
- Explain concepts step by step.
- Use simple language and practical examples.
- Explain difficult topics clearly.

2. QUICK DOUBT SOLVER:
- Answer questions directly.
- Avoid unnecessary explanations.
- Give accurate and relevant answers.

3. ADAPTIVE LEARNING ASSISTANT:
- Adapt explanations to the student's level.
- Start with fundamentals when needed.
- Increase complexity gradually.
- Encourage independent learning.

4. STUDY GUIDE:
- Create study plans and revision schedules.
- Generate practice questions and MCQs.
- Help students prepare for examinations.

5. PROGRAMMING ASSISTANT:
- Explain programming concepts.
- Debug code and explain errors.
- Provide working examples.
- Explain solutions step by step.

RESPONSE RULES:

- Understand the student's intention first.
- Choose the most suitable teaching approach.
- Use headings and bullet points when useful.
- Include examples wherever appropriate.
- Keep simple answers concise.
- Give detailed explanations when requested.
- Never invent academic facts.
- Admit uncertainty when necessary.
- Maintain a friendly and encouraging tone.

YOUR MISSION:

Help every student learn, understand, practice
and improve at their own pace.
"""

# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class ChatTurn(BaseModel):
    role: Literal["user", "model", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatTurn] = Field(
        default_factory=list,
        max_length=10
    )
    system_prompt: str | None = Field(default=None, max_length=2000)


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "running",
        "service": "EduBridge AI LLM",
        "provider": "Google Gemini",
        "model": MODEL,
        "api_configured": client is not None
    }


# --------------------------------------------------
# INTERNAL CHAT LOGIC
# --------------------------------------------------

def _do_chat(request: ChatRequest) -> dict:
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured. Add GEMINI_API_KEY to ai-service/.env"
        )

    try:
        logger.info("Received student question")

        contents = []

        # Add conversation history
        for turn in request.history:
            role = (
                "model"
                if turn.role == "assistant"
                else turn.role
            )

            contents.append(
                types.Content(
                    role=role,
                    parts=[
                        types.Part.from_text(
                            text=turn.content
                        )
                    ]
                )
            )

        # Add current message
        contents.append(
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=request.message
                    )
                ]
            )
        )

        logger.info("Sending request to Gemini: %s", MODEL)

        # Generate AI response
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=request.system_prompt or SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=1500
            )
        )

        answer = response.text

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an empty response."
            )

        logger.info("Gemini response generated successfully")

        return {
            "success": True,
            "provider": "Google Gemini",
            "model": MODEL,
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.exception(
            "Gemini API request failed: %s",
            type(e).__name__
        )

        raise HTTPException(
            status_code=502,
            detail=f"Gemini API request failed: {type(e).__name__}. Check server logs."
        )


# --------------------------------------------------
# PRIMARY CHAT ENDPOINT
# --------------------------------------------------

@app.post("/llm/chat")
def chat(request: ChatRequest):
    return _do_chat(request)


# --------------------------------------------------
# ALIAS ENDPOINT (frontend calls /ai/chat)
# --------------------------------------------------

@app.post("/ai/chat")
def chat_alias(request: ChatRequest):
    return _do_chat(request)


# --------------------------------------------------
# ROOT ENDPOINT
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to EduBridge AI LLM Service",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "chat": "/llm/chat  or  /ai/chat",
            "docs": "/docs"
        }
    }

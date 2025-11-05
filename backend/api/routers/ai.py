from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

# Lazy import so app can still start without the package in some environments
try:
    import google.generativeai as genai
except Exception:  # pragma: no cover
    genai = None

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatRequest(BaseModel):
    prompt: str
    context: str | None = None
    model: str | None = None  # allow override if needed

class ChatResponse(BaseModel):
    reply: str
    model: str


def _get_client(model_preference: str | None = None):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is not configured on the server")
    if genai is None:
        raise HTTPException(status_code=500, detail="google-generativeai package is not installed on the server")
    genai.configure(api_key=api_key)
    model = model_preference or os.environ.get("GOOGLE_AI_MODEL", "gemini-1.5-flash")
    return genai.GenerativeModel(model)


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    prompt = body.prompt.strip() if body.prompt else ""
    if not prompt:
        raise HTTPException(status_code=400, detail="prompt is required")

    try:
        model = _get_client(body.model)
        # Construct final prompt with optional context
        full_prompt = prompt
        if body.context:
            full_prompt = f"Context:\n{body.context}\n\nQuestion:\n{prompt}"
        result = model.generate_content(full_prompt)
        text = (result.text or "").strip() if result else ""
        if not text:
            text = "(No response from model.)"
        return ChatResponse(reply=text, model=model.model_name if hasattr(model, "model_name") else (body.model or "gemini-1.5-flash"))
    except HTTPException:
        raise
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")

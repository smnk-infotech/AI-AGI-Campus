from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
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


def _normalize_model_name(name: str) -> str:
    # google-generativeai often expects the 'models/' prefix
    return name if name.startswith("models/") else f"models/{name}"


def _get_client(model_preference: str | None = None):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is not configured on the server")
    if genai is None:
        raise HTTPException(status_code=500, detail="google-generativeai package is not installed on the server")
    genai.configure(api_key=api_key)
    # Prefer explicitly set model; otherwise use a broadly available default
    raw = model_preference or os.environ.get("GOOGLE_AI_MODEL", "gemini-2.0-flash-exp")
    model_name = _normalize_model_name(raw)
    return genai.GenerativeModel(model_name)


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
        return ChatResponse(reply=text, model=getattr(model, "model_name", None) or (body.model or "models/gemini-2.0-flash-exp"))
    except HTTPException:
        raise
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


# ---- Multi-turn chat endpoint ----
class Message(BaseModel):
    role: str = Field(..., description="'user' | 'assistant' | 'system'")
    content: str


class ChatMessagesRequest(BaseModel):
    messages: list[Message]
    model: str | None = None


class ChatMessagesResponse(BaseModel):
    reply: str
    model: str


def _to_gemini_role(role: str) -> str:
    r = (role or '').lower().strip()
    if r == 'assistant':
        return 'model'
    # gemini supports 'user' and 'model'; map others to 'user'
    return 'user'


@router.post("/messages", response_model=ChatMessagesResponse)
async def chat_messages(body: ChatMessagesRequest):
    if not body.messages or not isinstance(body.messages, list):
        raise HTTPException(status_code=400, detail="messages array is required")

    try:
        model = _get_client(body.model)

        # Build history from all but the last message; last should be the current user prompt
        history = []
        if len(body.messages) > 1:
            for m in body.messages[:-1]:
                content = (m.content or '').strip()
                if not content:
                    continue
                history.append({
                    'role': _to_gemini_role(m.role),
                    'parts': [content]
                })

        last = body.messages[-1]
        last_content = (last.content or '').strip()
        if not last_content:
            raise HTTPException(status_code=400, detail="last message has empty content")

        # Start a chat session with history, then send the latest message
        chat = model.start_chat(history=history)
        result = chat.send_message(last_content)
        text = (getattr(result, 'text', None) or '').strip()
        if not text:
            text = "(No response from model.)"
        model_name = getattr(model, 'model_name', None) or (body.model or 'models/gemini-2.0-flash-exp')
        return ChatMessagesResponse(reply=text, model=model_name)
    except HTTPException:
        raise
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"AI chat failed: {e}")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os
import json
from urllib.parse import quote_plus

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


# ---- Learning kit endpoint (multi-format output with images) ----
class TeachRequest(BaseModel):
    topic: str = Field(..., description="Learning topic, e.g., 'Photosynthesis' or 'Binary Search'")
    level: str | None = Field(None, description="Audience level, e.g., 'grade 8', 'college', 'beginner'")
    style: str | None = Field(None, description="Optional tone or style preferences")
    model: str | None = None


class Visual(BaseModel):
    title: str
    url: str


class Flashcard(BaseModel):
    front: str
    back: str


class QuizItem(BaseModel):
    question: str
    options: list[str]
    correctIndex: int


class Resource(BaseModel):
    title: str
    url: str


class TeachResponse(BaseModel):
    topic: str
    summary_md: str
    steps_md: str
    visuals: list[Visual]
    flashcards: list[Flashcard]
    quiz: list[QuizItem]
    resources: list[Resource]
    model: str


@router.post("/teach", response_model=TeachResponse)
async def teach(body: TeachRequest):
    topic = (body.topic or "").strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")

    try:
        model = _get_client(body.model)
        audience = f"Audience level: {body.level}." if body.level else ""
        style = f"Style: {body.style}." if body.style else ""
        prompt = f"""
You are a brilliant teacher assistant. Create a compact learning kit for the topic: "{topic}".
Return STRICT JSON only (no markdown fences), with this schema:
{{
  "image_queries": ["string", ... 3-6 items],
  "summary_md": "markdown string",
  "steps_md": "markdown string with a short step-by-step guide",
  "flashcards": [{{"front":"string","back":"string"}}, ... up to 8],
  "quiz": [{{"question":"string","options":["A","B","C","D"],"correctIndex":0}}, ... up to 5],
  "resources": [{{"title":"string","url":"https://..."}}, ... up to 5]
}}

Guidelines:
- Make the summary concise but rigorous; use markdown lists or tables when apt.
- Steps should be actionable and short.
- Flashcards must be factual; keep front/back crisp.
- Quiz options must be plausible; exactly one correctIndex.
- Prefer high-quality, general image search queries; avoid brand names.
{audience}
{style}
"""
        result = model.generate_content(prompt)
        text = (getattr(result, 'text', None) or '').strip()

        def try_parse_json(s: str):
            # attempt direct parse
            try:
                return json.loads(s)
            except Exception:
                pass
            # strip code fences
            if '```' in s:
                s2 = s.replace('```json', '```')
                parts = s2.split('```')
                for p in parts:
                    p = p.strip()
                    if p.startswith('{') and p.endswith('}'):
                        try:
                            return json.loads(p)
                        except Exception:
                            continue
            # extract outermost braces
            start = s.find('{')
            end = s.rfind('}')
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(s[start:end+1])
                except Exception:
                    pass
            return None

        data = try_parse_json(text) or {
            "image_queries": [topic, f"{topic} diagram", f"{topic} process", f"{topic} example"],
            "summary_md": f"## {topic}\n\nNo structured JSON returned by the model. Here's a brief note: {text[:500]}",
            "steps_md": "1. Define the topic\n2. Identify key concepts\n3. Practice with examples",
            "flashcards": [],
            "quiz": [],
            "resources": []
        }

        # Build visuals using Unsplash Source endpoint (no API key required)
        queries = [q for q in (data.get("image_queries") or []) if isinstance(q, str) and q.strip()]
        visuals: list[Visual] = []
        for q in queries[:6]:
            qp = quote_plus(q)
            # try unsplash source; front-end will have onError fallback too
            url = f"https://source.unsplash.com/featured/800x600/?{qp}"
            visuals.append(Visual(title=q, url=url))
        if not visuals:
            # ensure at least a couple visuals
            seeds = [topic, f"{topic} diagram", f"{topic} concept"]
            for q in seeds:
                qp = quote_plus(q)
                visuals.append(Visual(title=q, url=f"https://source.unsplash.com/featured/800x600/?{qp}"))

        flashcards = []
        for fc in (data.get("flashcards") or [])[:8]:
            if isinstance(fc, dict) and fc.get("front") and fc.get("back"):
                flashcards.append(Flashcard(front=str(fc["front"]), back=str(fc["back"])) )

        quiz = []
        for item in (data.get("quiz") or [])[:5]:
            if isinstance(item, dict) and item.get("question") and isinstance(item.get("options"), list):
                try:
                    ci = int(item.get("correctIndex", 0))
                except Exception:
                    ci = 0
                quiz.append(QuizItem(question=str(item["question"]), options=[str(o) for o in item["options"]][:4], correctIndex=ci))
        if not quiz:
            quiz = [
                QuizItem(question=f"What is a key property required by {topic}?", options=["Sorted input", "Random input", "Unsorted only", "Graph input"], correctIndex=0),
                QuizItem(question=f"Which strategy best describes {topic}?", options=["Brute force", "Divide and conquer", "Dynamic programming", "Greedy"], correctIndex=1),
                QuizItem(question=f"What is the average time complexity of {topic}?", options=["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctIndex=2),
            ]

        resources = []
        for r in (data.get("resources") or [])[:5]:
            if isinstance(r, dict) and r.get("title") and r.get("url"):
                resources.append(Resource(title=str(r["title"]), url=str(r["url"])) )
        if not resources:
            resources = [
                Resource(title=f"Wikipedia: {topic}", url=f"https://en.wikipedia.org/wiki/{quote_plus(topic)}"),
                Resource(title=f"Khan Academy search: {topic}", url=f"https://www.khanacademy.org/search?page_search_query={quote_plus(topic)}"),
            ]

        model_name = getattr(model, 'model_name', None) or (body.model or 'models/gemini-2.0-flash-exp')
        return TeachResponse(
            topic=topic,
            summary_md=str(data.get("summary_md") or f"## {topic}\n\nNo summary available."),
            steps_md=str(data.get("steps_md") or "1. Define the topic\n2. Identify key concepts\n3. Practice with examples"),
            visuals=visuals,
            flashcards=flashcards or [
                Flashcard(front=f"Define {topic}", back=f"A short definition of {topic} and its purpose."),
                Flashcard(front=f"When to use {topic}?", back=f"Typical scenarios where {topic} is effective."),
            ],
            quiz=quiz,
            resources=resources,
            model=model_name
        )
    except HTTPException:
        raise
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"AI teach failed: {e}")

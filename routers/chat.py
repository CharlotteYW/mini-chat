from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.chat import ChatRequest
from services.llm import stream_chat

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat")
async def chat(request: ChatRequest):
    def generate():
        for chunk in stream_chat([m.model_dump() for m in request.messages], model=request.model):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")
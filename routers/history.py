from fastapi import APIRouter
from pydantic import BaseModel
from services.history import save_message, get_message

router = APIRouter(prefix="/api", tags=["history"])

class SaveMessageRequest(BaseModel):
    session_id: str
    role: str
    content: str

@router.post("/messages")
async def save(req: SaveMessageRequest):
    save_message(req.session_id, req.role, req.content)
    return {"ok": True}

@router.get("/messages/{session_id}")
async def get(session_id: str):
    return get_message(session_id)
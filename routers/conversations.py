from fastapi import APIRouter
from pydantic import BaseModel
from services.conversations import create_conversation, list_conversations, update_title

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

class CreateRequest(BaseModel):
    title: str = "New Chat"

class UpdateTitleRequest(BaseModel):
    title: str


@router.get("")
async def list_all():
    return list_conversations()

@router.post("")
async def create(req: CreateRequest):
    return create_conversation(req.title)

@router.patch("{conversation_id}")
async def update(conversation_id: str, req: UpdateTitleRequest):
    update_title(conversation_id, req.title)
    return {"ok": True}
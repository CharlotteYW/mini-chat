from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str
    content: str
class ChatRequest(BaseModel):
    model: str = "qwen3-coder:30b"
    messages: List[Message]
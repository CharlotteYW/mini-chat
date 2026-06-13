from openai import OpenAI
from typing import Iterator

ollama_client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

def stream_chat(messages: list, model: str) -> Iterator[str]:
    stream = ollama_client.chat.completions.create(
        model=model,
        messages=[{"role": msg["role"], "content": msg["content"]} for msg in messages],
        stream=True
    )
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
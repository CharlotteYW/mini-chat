import os
from openai import OpenAI
from typing import Iterator
from dotenv import load_dotenv

load_dotenv()

def get_client(provider: str) -> OpenAI:
    if provider == "groq":
        return OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.getenv("GROQ_API_KEY")   
        )
    return OpenAI(
        base_url="http://localhost:11434/v1",
        api_key=os.getenv("OLLAMA_API_KEY") or "ollama"
    )



def stream_chat(messages: list, model: str, provider: str = "ollama") -> Iterator[str]:
    client = get_client(provider)
    try:
        stream = client.chat.completions.create(
            model=model,
            messages=[{"role": msg["role"], "content": msg["content"]} for msg in messages],
            stream=True
        )
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        yield f"Error: {str(e)}"
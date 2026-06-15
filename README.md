# mini-chat

## Required
- Local testing:
  - https://console.groq.com/ For LLM online
  - supabase.com For PostgreSQL database online to store the metadata and chat history
- Deployment:
  - Backend: railway.com
  - Frontend Vercel
- Environment variables in local:
  - Frontend:
    - VITE_API_URL=http://localhost:8000(.env.local )
  - Backend:
    - OLLAMA_API_KEY
    - GROQ_API_KEY
    - SUPABASE_URL
    - SUPABASE_SERVICE_KEY
- Environment variables in deployment to server:
  - Frontend(Vercel):
    - VITE_API_URL(To Railway)
  - Backend(Railway):
    - GROQ_API_KEY
    - SUPABASE_URL
    - SUPABASE_SERVICE_KEY
    - OLLAMA_BASE_URL(Placeholder)
    - Start command(uvicorn main:app --host 0.0.0.0 --port $PORT)
  
## What we can learn from it
- LLM stateless
- Streaming: readableStream + TextDecoder
- FastAPI
- Frontend and backend communicated through http requests
- Supabase
- Deployment in Railway(Python backend) and Vercel(React Frontend)
- Monorepo. We have multiple services within one repor. This is also what I have in my company's repo.

## Test frontend and backend
- `curl localhost:5173/api/conversations` Test frontend to backend
- `curl localhost:8000/api/conversations` Test backend
- Local test Post to backend 
```
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [
      {
        "role": "user",
        "content": "Who are you?"
      }
    ]
  }'
```
- In railway to test to call locally backend
```
python -c "
import urllib.request
print(urllib.request.urlopen('http://127.0.0.1:8080/').read())
"
```
- Test railway in production From laptop
```curl -X POST \
  https://mini-chat-production-175d.up.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```
- We can also test vercel, but there is not necessary because we can view it directly
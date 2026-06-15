# mini-chat

## Require
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
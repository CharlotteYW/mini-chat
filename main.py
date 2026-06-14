from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router
from routers.history import router as history_router
from routers.conversations import router as conversations_router

app = FastAPI(title="Mini Chat API")

# Add middleware for CORS - make sure this is properly configured
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Add this to be safe
    expose_headers=["*"]
)   

app.include_router(router)
app.include_router(history_router)
app.include_router(conversations_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Welcome to the Mini Chat!"}

# Add health check endpoint to verify server is running correctly
@app.get("/health")
def health():
    return {"status": "healthy"}

# Don't include __main__ for now since there are environment issues
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router
from routers.history import router as history_router
from routers.conversations import router as conversations_router

app = FastAPI(title="Mini Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)   

app.include_router(router)
app.include_router(history_router)
app.include_router(conversations_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Welcome to the Mini Chat!"}
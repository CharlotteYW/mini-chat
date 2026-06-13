from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router

app = FastAPI(title="Mini Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)   

app.include_router(router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Welcome to the Mini Chat!"}
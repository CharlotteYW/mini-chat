from database.supabase_client import supabase

def save_message(session_id: str, role: str, content: str):
    supabase.table("messages").insert({
        "session_id": session_id,
        "role": role,
        "content": content
    }).execute()

def get_message(session_id: str) -> list:
    result =(
        supabase.table("messages")
        .select("id", "role", "content")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )
    return result.data
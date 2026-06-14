from database.supabase_client import supabase

def create_conversation(title: str="New Chat") -> dict:
    result = supabase.table("conversations").insert({
        "title": title,
    }).execute()
    return result.data[0]

def list_conversations() -> list:

    result = (
        supabase.table("conversations")
        .select("id, title, created_at")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data

def update_title(conversation_id: str, title: str):
    supabase.table("conversations").update({
        "title": title
    }).eq("id", conversation_id).execute()
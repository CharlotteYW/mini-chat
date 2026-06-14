from database.supabase_client import supabase
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_conversation(title: str="New Chat") -> dict:
    try:
        logger.info(f"Creating conversation with title: {title}")
        result = supabase.table("conversations").insert({
            "title": title,
        }).execute()
        logger.info(f"Conversation created successfully: {result.data}")
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        raise e

def list_conversations() -> list:
    try:
        logger.info("Listing conversations")
        result = (
            supabase.table("conversations")
            .select("id, title, created_at")
            .order("created_at", desc=True)
            .execute()
        )
        logger.info(f"Found {len(result.data or [])} conversations")
        return result.data or []
    except Exception as e:
        logger.error(f"Error listing conversations: {e}")
        return []

def update_title(conversation_id: str, title: str):
    try:
        logger.info(f"Updating conversation {conversation_id} with title: {title}")
        supabase.table("conversations").update({
            "title": title
        }).eq("id", conversation_id).execute()
        logger.info("Conversation title updated successfully")
    except Exception as e:
        logger.error(f"Error updating conversation title: {e}")
        raise e
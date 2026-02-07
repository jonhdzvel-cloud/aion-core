from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import StreamingResponse
from app.services.llm_factory import LLMFactory
from app.services.memory_service import memory

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    messages: List[Message]
    model: Optional[str] = "gpt-4-turbo-preview"
    provider: Optional[str] = "openai"

@router.post("/message")
async def send_message(request: ChatRequest, background_tasks: BackgroundTasks):
    provider = LLMFactory.get_provider(request.provider)
    
    # 1. Recuperar contexto (RAG)
    user_query = request.messages[-1].content
    relevant_memories = memory.search_memories(user_query)
    
    # 2. Inyectar contexto en los mensajes
    messages_dicts = [{"role": m.role, "content": m.content} for m in request.messages]
    
    if relevant_memories:
        system_context = f"MEMORIA A LARGO PLAZO RECUPERADA:\n{relevant_memories}\n\nUsa esta información si es relevante."
        # Insert or append system message
        if messages_dicts[0]['role'] == 'system':
            messages_dicts[0]['content'] += f"\n\n{system_context}"
        else:
            messages_dicts.insert(0, {"role": "system", "content": system_context})

    # 3. Guardar en memoria (Background)
    # Guardamos lo que el usuario dijo para el futuro
    background_tasks.add_task(memory.add_memory, user_query, {"role": "user"})
    
    # Generate stream
    stream = provider.generate_stream(messages_dicts, model=request.model)
    
    return StreamingResponse(stream, media_type="text/event-stream")

from .base import BaseLLMProvider
from openai import AsyncOpenAI

class OllamaProvider(BaseLLMProvider):
    def __init__(self, model: str = "llama3"):
        # Ollama is compatible with OpenAI API
        self.client = AsyncOpenAI(
            base_url="http://localhost:11434/v1",
            api_key="ollama",  # Ollama doesn't require a key, but the client does
        )
        self.default_model = model

    async def generate_stream(self, messages: list[dict], model: str = None):
        stream = await self.client.chat.completions.create(
            model=model or self.default_model,
            messages=messages,
            stream=True,
        )
        
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

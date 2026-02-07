import os
from typing import AsyncGenerator
from openai import AsyncOpenAI
from .base import BaseLLMProvider

class OpenAIProvider(BaseLLMProvider):
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("🔴 CRITICAL: OPENAI_API_KEY is missing in environment!")
        else:
            print(f"🟢 OpenAI Provider Initialized (Key length: {len(api_key)})")
            
        self.client = AsyncOpenAI(api_key=api_key)

    async def generate_stream(self, messages: list[dict], model: str = "gpt-4-turbo-preview") -> AsyncGenerator[str, None]:
        stream = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

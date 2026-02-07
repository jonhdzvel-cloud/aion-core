import os
from typing import AsyncGenerator
from anthropic import AsyncAnthropic
from .base import BaseLLMProvider

class AnthropicProvider(BaseLLMProvider):
    def __init__(self):
        self.client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def generate_stream(self, messages: list[dict], model: str = "claude-3-sonnet-20240229") -> AsyncGenerator[str, None]:
        async with self.client.messages.stream(
            max_tokens=1024,
            messages=messages,
            model=model,
        ) as stream:
            async for text in stream.text_stream:
                yield text

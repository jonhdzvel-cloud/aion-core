from abc import ABC, abstractmethod
from typing import AsyncGenerator, Any

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_stream(self, messages: list[dict], model: str) -> AsyncGenerator[str, None]:
        """Generates a streaming response from the LLM."""
        pass

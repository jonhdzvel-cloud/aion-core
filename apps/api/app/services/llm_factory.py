from .providers.openai_provider import OpenAIProvider
from .providers.ollama_provider import OllamaProvider
from .providers.base import BaseLLMProvider

class LLMFactory:
    @staticmethod
    def get_provider(provider_name: str) -> BaseLLMProvider:
        if provider_name.lower() == "ollama":
            return OllamaProvider()
        # Default to OpenAI
        return OpenAIProvider()

import os
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv("/Users/user1/Documents/Agente de IA/aion-core/apps/api/.env")

async def test_openai():
    import urllib3
    print(f"📦 urllib3 version: {urllib3.__version__}")
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"🔑 Testing API Key: {api_key[:5]}...{api_key[-4:] if api_key else 'None'}")
    
    try:
        client = AsyncOpenAI(api_key=api_key)
        print("🌐 Connecting to OpenAI...")
        stream = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Ping"}],
            stream=True,
        )
        print("✅ Connection Established. Receiving stream:")
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                print(content, end="", flush=True)
        print("\n✅ Stream Finished Successfully.")
    except Exception as e:
        print(f"\n🔴 ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_openai())

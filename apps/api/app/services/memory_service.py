import chromadb
from chromadb.config import Settings
import os
import uuid
from typing import List

class MemoryService:
    def __init__(self):
        # Persistent Client
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        db_path = os.path.join(base_dir, "chroma_db")
        
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(name="aion_memories")

    def add_memory(self, content: str, metadata: dict = None):
        if metadata is None:
            metadata = {}
            
        self.collection.add(
            documents=[content],
            metadatas=[metadata],
            ids=[str(uuid.uuid4())]
        )

    def search_memories(self, query: str, n_results: int = 3) -> List[str]:
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []

# Singleton instance
memory = MemoryService()

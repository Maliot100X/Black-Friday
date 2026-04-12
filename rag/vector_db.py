#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - Vector Database System
Uses ChromaDB for RAG (Retrieval Augmented Generation)
"""

import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any, Optional
import json

class VectorDatabase:
    """ChromaDB wrapper for deal embeddings and search"""

    def __init__(self, persist_directory: str = "/root/mk-black-friday-radar/rag/chroma"):
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)

        # Initialize ChromaDB client with persistence (new API)
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )

        # Create or get collections
        self.deals_collection = self.client.get_or_create_collection(
            name="deals",
            metadata={"hnsw:space": "cosine"}
        )

        self.products_collection = self.client.get_or_create_collection(
            name="products",
            metadata={"hnsw:space": "cosine"}
        )

        self.stores_collection = self.client.get_or_create_collection(
            name="stores",
            metadata={"hnsw:space": "cosine"}
        )

        print(f"✓ ChromaDB initialized at {persist_directory}")
        print(f"  - Deals collection: {self.deals_collection.count()} documents")
        print(f"  - Products collection: {self.products_collection.count()} documents")
        print(f"  - Stores collection: {self.stores_collection.count()} documents")

    def add_deal(self, deal_id: str, title: str, description: str, category: str,
                 store_name: str, price: float, discount: float, metadata: Dict = None):
        """Add a deal to the vector database"""
        # Combine text for embedding
        text = f"{title}. {description}. Category: {category}. Store: {store_name}. "
        text += f"Price: ${price}. Discount: {discount}%."

        doc_metadata = {
            "deal_id": deal_id,
            "title": title,
            "category": category,
            "store_name": store_name,
            "price": price,
            "discount": discount,
            **(metadata or {})
        }

        self.deals_collection.add(
            ids=[deal_id],
            documents=[text],
            metadatas=[doc_metadata]
        )

        return True

    def add_product(self, product_id: str, name: str, description: str,
                    category: str, brand: str, price: float, metadata: Dict = None):
        """Add a product to the vector database"""
        text = f"{name}. {description}. Category: {category}. Brand: {brand}. Price: ${price}."

        doc_metadata = {
            "product_id": product_id,
            "name": name,
            "category": category,
            "brand": brand,
            "price": price,
            **(metadata or {})
        }

        self.products_collection.add(
            ids=[product_id],
            documents=[text],
            metadatas=[doc_metadata]
        )

        return True

    def add_store(self, store_id: str, name: str, description: str, category: str,
                  address: str, city: str = "Skopje", metadata: Dict = None):
        """Add a store to the vector database"""
        text = f"{name}. {description}. Category: {category}. Address: {address}, {city}."

        doc_metadata = {
            "store_id": store_id,
            "name": name,
            "category": category,
            "address": address,
            "city": city,
            **(metadata or {})
        }

        self.stores_collection.add(
            ids=[store_id],
            documents=[text],
            metadatas=[doc_metadata]
        )

        return True

    def search_deals(self, query: str, n_results: int = 10,
                     filter_dict: Optional[Dict] = None) -> List[Dict]:
        """Search for deals using natural language query"""
        results = self.deals_collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_dict
        )

        return self._format_results(results)

    def search_products(self, query: str, n_results: int = 10,
                        filter_dict: Optional[Dict] = None) -> List[Dict]:
        """Search for products using natural language query"""
        results = self.products_collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_dict
        )

        return self._format_results(results)

    def search_stores(self, query: str, n_results: int = 10,
                      filter_dict: Optional[Dict] = None) -> List[Dict]:
        """Search for stores using natural language query"""
        results = self.stores_collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_dict
        )

        return self._format_results(results)

    def _format_results(self, results: Dict) -> List[Dict]:
        """Format ChromaDB results into a clean list"""
        formatted = []

        if not results['ids'][0]:
            return formatted

        for i, doc_id in enumerate(results['ids'][0]):
            formatted.append({
                'id': doc_id,
                'text': results['documents'][0][i] if results['documents'] else None,
                'metadata': results['metadatas'][0][i] if results['metadatas'] else None,
                'distance': results['distances'][0][i] if results['distances'] else None
            })

        return formatted

    def get_deal_by_id(self, deal_id: str) -> Optional[Dict]:
        """Get a specific deal by ID"""
        try:
            result = self.deals_collection.get(ids=[deal_id])
            if result and result['ids']:
                return {
                    'id': result['ids'][0],
                    'text': result['documents'][0] if result['documents'] else None,
                    'metadata': result['metadatas'][0] if result['metadatas'] else None
                }
        except Exception as e:
            print(f"Error getting deal {deal_id}: {e}")
        return None

    def delete_deal(self, deal_id: str) -> bool:
        """Delete a deal from the vector database"""
        try:
            self.deals_collection.delete(ids=[deal_id])
            return True
        except Exception as e:
            print(f"Error deleting deal {deal_id}: {e}")
            return False

    def persist(self):
        """Persist the database to disk"""
        # ChromaDB with duckdb+parquet auto-persists
        pass

    def get_stats(self) -> Dict[str, int]:
        """Get collection statistics"""
        return {
            "deals": self.deals_collection.count(),
            "products": self.products_collection.count(),
            "stores": self.stores_collection.count()
        }


def initialize_from_postgres(db_url: str = None):
    """Initialize ChromaDB with data from PostgreSQL"""
    import psycopg2

    if db_url is None:
        # Use peer authentication or default postgres user
        db_url = "postgresql:///?dbname=mkbf_deals&user=postgres"

    print("\n=== Initializing Vector Database from PostgreSQL ===\n")

    # Initialize vector DB
    vector_db = VectorDatabase()

    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Load stores
        cursor.execute("SELECT id, name, address, category, phone FROM stores")
        stores = cursor.fetchall()

        for store in stores:
            store_id, name, address, category, phone = store
            vector_db.add_store(
                store_id=str(store_id),
                name=name,
                description=f"Store in Skopje. Contact: {phone}",
                category=category,
                address=address or "Skopje",
                metadata={"source": "postgresql"}
            )

        print(f"✓ Loaded {len(stores)} stores")

        # Load deals
        cursor.execute("""
            SELECT d.id, d.title, d.description, d.original_price,
                   d.discount_price, d.discount_percentage, d.category, s.name
            FROM deals d
            JOIN stores s ON d.store_id = s.id
        """)
        deals = cursor.fetchall()

        for deal in deals:
            deal_id, title, description, original, discount_price, pct, category, store_name = deal
            vector_db.add_deal(
                deal_id=str(deal_id),
                title=title,
                description=description or "",
                category=category or "General",
                store_name=store_name,
                price=float(discount_price) if discount_price else 0,
                discount=float(pct) if pct else 0,
                metadata={"source": "postgresql", "original_price": float(original) if original else 0}
            )

        print(f"✓ Loaded {len(deals)} deals")

        cursor.close()
        conn.close()

        print(f"\n=== Vector Database Ready ===")
        print(f"Stats: {vector_db.get_stats()}")

        return vector_db

    except Exception as e:
        print(f"Error initializing from PostgreSQL: {e}")
        return vector_db


if __name__ == "__main__":
    # Test the vector database
    print("Testing Vector Database...")

    # Initialize with sample data
    vdb = initialize_from_postgres()

    # Test search
    print("\n=== Testing Searches ===\n")

    # Search for laptop deals
    results = vdb.search_deals("best laptop deals", n_results=3)
    print(f"Query: 'best laptop deals'")
    for r in results:
        print(f"  - {r['metadata'].get('title', 'N/A')} at {r['metadata'].get('store_name', 'N/A')} "
              f"(${r['metadata'].get('price', 0)})")

    # Search for TV deals
    results = vdb.search_deals("TV under 800", n_results=3)
    print(f"\nQuery: 'TV under 800'")
    for r in results:
        print(f"  - {r['metadata'].get('title', 'N/A')} "
              f"(${r['metadata'].get('price', 0)})")

    print("\n✓ Vector Database test complete")

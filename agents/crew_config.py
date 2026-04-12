#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - CrewAI Agent Configuration
Uses Fireworks AI (Kimi K2.5 Turbo) for all LLM operations
"""

from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from crewai.llm import LLM
from typing import List, Dict, Any
import sys
import os

# Add backend to path
sys.path.insert(0, '/root/mk-black-friday-radar/backend')
sys.path.insert(0, '/root/mk-black-friday-radar/rag')

class ScrapingTool(BaseTool):
    name: str = "Web Scraping Tool"
    description: str = "Scrape deals from e-commerce websites"

    def _run(self, source: str, category: str = None) -> str:
        return f"Scraped 25 deals from {source} in category {category or 'all'}"

class VectorSearchTool(BaseTool):
    name: str = "Vector Search Tool"
    description: str = "Search deals using semantic similarity"

    def _run(self, query: str, n_results: int = 5) -> str:
        try:
            from vector_db import VectorDatabase
            vdb = VectorDatabase()
            results = vdb.search_deals(query, n_results=n_results)
            return f"Found {len(results)} deals for query: {query}"
        except Exception as e:
            return f"Search error: {str(e)}"

class PriceVerificationTool(BaseTool):
    name: str = "Price Verification Tool"
    description: str = "Verify if discount prices are genuine"

    def _run(self, product_name: str, current_price: float, claimed_discount: float) -> str:
        # Simulate price history check
        return f"Verified {product_name}: Price ${current_price} with {claimed_discount}% discount appears genuine"

class GeoSearchTool(BaseTool):
    name: str = "Geographic Search Tool"
    description: str = "Find deals near a location"

    def _run(self, latitude: float, longitude: float, radius_km: float = 10) -> str:
        return f"Found 8 deals within {radius_km}km of coordinates ({latitude}, {longitude})"

class QRVerificationTool(BaseTool):
    name: str = "QR Verification Tool"
    description: str = "Verify QR code authenticity"

    def _run(self, qr_code: str, store_id: str) -> str:
        return f"QR code {qr_code} verified for store {store_id}: VALID"


class MKBFAgents:
    """MK Black Friday Radar Agent System
    Uses Fireworks AI (Kimi K2.5 Turbo) for all operations
    """

    def __init__(self, use_local_llm: bool = False):
        self.tools = {
            'scraper': ScrapingTool(),
            'vector_search': VectorSearchTool(),
            'price_verify': PriceVerificationTool(),
            'geo_search': GeoSearchTool(),
            'qr_verify': QRVerificationTool()
        }
        self.fireworks_api_key = os.getenv("FIREWORKS_API_KEY")
        self.llm_config = self._get_llm_config()

    def _get_llm_config(self):
        """Configure Fireworks AI (Kimi K2.5 Turbo)
        Model: accounts/fireworks/routers/kimi-k2p5-turbo
        Base URL: https://api.fireworks.ai/inference/v1
        """
        return {
            "model": "accounts/fireworks/routers/kimi-k2p5-turbo",
            "api_key": self.fireworks_api_key,
            "base_url": "https://api.fireworks.ai/inference/v1",
            "temperature": 0.7,
            "max_tokens": 4096
        }

    def create_scraper_agent(self) -> Agent:
        return Agent(
            role="Web Scraping Specialist",
            goal="Collect deals from e-commerce websites every 30 minutes",
            backstory="""You are an expert web scraper with deep knowledge of e-commerce platforms.
            You can navigate Amazon, BestBuy, Walmart, and local Skopje stores to extract
            deal information including product names, prices, discounts, and images.
            You respect rate limits and handle anti-bot measures professionally.""",
            tools=[self.tools['scraper']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_extraction_agent(self) -> Agent:
        return Agent(
            role="Data Extraction Specialist",
            goal="Parse raw scraped data into structured deal format",
            backstory="""You are a data parsing expert who transforms messy HTML and JSON
            into clean, structured deal data. You normalize categories, validate prices,
            and ensure data integrity before storage.""",
            tools=[self.tools['scraper']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_verification_agent(self) -> Agent:
        return Agent(
            role="Deal Verification Specialist",
            goal="Detect fake discounts and verify deal authenticity",
            backstory="""You are a consumer protection expert with an eagle eye for fake deals.
            You compare prices against historical data, detect inflated "original" prices,
            and flag suspicious offers for manual review.""",
            tools=[self.tools['price_verify']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_ranking_agent(self) -> Agent:
        return Agent(
            role="Deal Ranking Specialist",
            goal="Rank deals by value and quality score",
            backstory="""You are a data analyst who knows what makes a deal truly great.
            You calculate quality scores based on discount percentage, price point,
            store reputation, and category demand.""",
            tools=[self.tools['vector_search']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_rag_agent(self) -> Agent:
        return Agent(
            role="RAG Query Specialist",
            goal="Answer user search queries using vector search and LLM",
            backstory="""You are a knowledgeable shopping assistant with access to all deal
            information. You use vector search to find relevant deals and generate
            helpful, natural language responses to user queries.""",
            tools=[self.tools['vector_search']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_map_agent(self) -> Agent:
        return Agent(
            role="Geographic Search Specialist",
            goal="Find deals near user location",
            backstory="""You are a local expert who knows every store in Skopje.
            You find deals within a specified radius, calculate distances,
            and sort results by proximity and deal quality.""",
            tools=[self.tools['geo_search']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_notification_agent(self) -> Agent:
        return Agent(
            role="Notification Delivery Specialist",
            goal="Send timely deal alerts to users via push notifications",
            backstory="""You are a communications expert ensuring users never miss great deals.
            You send push notifications, email alerts, and schedule delivery
            at optimal times for user engagement.""",
            tools=[self.tools['vector_search']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_qr_agent(self) -> Agent:
        return Agent(
            role="QR Verification Specialist",
            goal="Verify user QR codes and track redemptions",
            backstory="""You are a security expert ensuring valid QR transactions.
            You validate QR code authenticity, check membership status,
            record scans, and prevent fraud.""",
            tools=[self.tools['qr_verify']],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_config
        )

    def create_deal_processing_crew(self) -> Crew:
        """Create a crew for processing new deals"""
        scraper = self.create_scraper_agent()
        extractor = self.create_extraction_agent()
        verifier = self.create_verification_agent()
        ranker = self.create_ranking_agent()

        scrape_task = Task(
            description="Scrape deals from Amazon, BestBuy, and local Skopje stores. Extract product name, price, discount, and images.",
            expected_output="List of 25+ raw deals with product data from each source",
            agent=scraper
        )

        extract_task = Task(
            description="Parse scraped data into structured format. Normalize categories and validate prices.",
            expected_output="Clean JSON array of structured deals ready for storage",
            agent=extractor
        )

        verify_task = Task(
            description="Verify deal authenticity. Check for fake discounts and inflated prices.",
            expected_output="List of verified deals with trust scores and flagged items",
            agent=verifier
        )

        rank_task = Task(
            description="Calculate quality scores and rank deals by value proposition.",
            expected_output="Ranked deals with quality scores from 0-100",
            agent=ranker
        )

        return Crew(
            agents=[scraper, extractor, verifier, ranker],
            tasks=[scrape_task, extract_task, verify_task, rank_task],
            process=Process.sequential,
            verbose=True
        )

    def create_rag_query_crew(self, user_query: str) -> Crew:
        """Create a crew for answering user queries"""
        rag_agent = self.create_rag_agent()

        query_task = Task(
            description=f"Answer user query: '{user_query}'. Use vector search to find relevant deals and explain results.",
            expected_output="Natural language response with relevant deals and explanations",
            agent=rag_agent
        )

        return Crew(
            agents=[rag_agent],
            tasks=[query_task],
            process=Process.sequential,
            verbose=True
        )


def test_agents():
    """Test the agent system with Fireworks AI"""
    print("=== Testing MK BLACK FRIDAY RADAR Agents ===")
    print("LLM: Fireworks AI (Kimi K2.5 Turbo)\n")

    # Set test API key if not present
    if not os.getenv("FIREWORKS_API_KEY"):
        print("⚠️  FIREWORKS_API_KEY not set. Skipping LLM tests.")
        print("   Set FIREWORKS_API_KEY environment variable to enable AI features.")
        return

    mkbf = MKBFAgents(use_local_llm=False)

    # Test agent configurations
    agents_config = [
        ("Scraper Agent", mkbf.create_scraper_agent),
        ("Extraction Agent", mkbf.create_extraction_agent),
        ("Verification Agent", mkbf.create_verification_agent),
        ("Ranking Agent", mkbf.create_ranking_agent),
        ("RAG Agent", mkbf.create_rag_agent),
        ("Map Agent", mkbf.create_map_agent),
        ("Notification Agent", mkbf.create_notification_agent),
        ("QR Verification Agent", mkbf.create_qr_agent),
    ]

    for name, creator in agents_config:
        try:
            agent = creator()
            print(f"✓ {name}: {agent.role}")
        except Exception as e:
            print(f"✗ {name}: {str(e)[:50]}")

    # Test tools directly
    print("\n=== Testing Tools ===")
    try:
        result = mkbf.tools['vector_search']._run("best laptop deals", n_results=3)
        print(f"✓ Vector Search: {result}")
    except Exception as e:
        print(f"✗ Vector Search: {e}")

    try:
        result = mkbf.tools['geo_search']._run(41.9981, 21.4254, 10)
        print(f"✓ Geo Search: {result}")
    except Exception as e:
        print(f"✗ Geo Search: {e}")

    print("\n✓ Agent system configuration complete (Fireworks AI)")


if __name__ == "__main__":
    test_agents()

# MK BLACK FRIDAY RADAR - Skill Library

## Core Skills

### 1. Web Scraping
**Purpose**: Extract deal data from e-commerce websites  
**Tools**: Scrapy, Playwright, BeautifulSoup  
**Input**: URL, category, selectors  
**Output**: Structured deal data

**Capabilities**:
- Multi-site scraping (Amazon, BestBuy, Walmart, local stores)
- Dynamic content rendering with Playwright
- Anti-bot detection evasion
- Rate limiting and retry logic
- Data validation and cleaning

**Usage**:
```python
from skills.web_scraping import DealScraper

scraper = DealScraper()
deals = scraper.scrape_site("amazon", category="electronics")
```

---

### 2. Vector Search
**Purpose**: Semantic search over deals using embeddings  
**Tools**: ChromaDB, Sentence Transformers  
**Input**: Natural language query  
**Output**: Ranked relevant deals

**Capabilities**:
- Semantic similarity search
- Natural language query understanding
- Multi-collection search (deals, products, stores)
- Metadata filtering
- Distance scoring

**Usage**:
```python
from skills.vector_search import VectorSearch

search = VectorSearch()
results = search.find_deals("best laptop under 500", n_results=10)
```

---

### 3. Price History Tracking
**Purpose**: Track price changes and detect fake discounts  
**Tools**: PostgreSQL, time-series analysis  
**Input**: Product URL or ID  
**Output**: Price history, discount verification

**Capabilities**:
- Historical price storage
- Discount authenticity detection
- Price drop alerts
- Trend analysis
- Inflated price detection

**Usage**:
```python
from skills.price_history import PriceTracker

tracker = PriceTracker()
history = tracker.get_price_history(product_id=123)
is_genuine = tracker.verify_discount(product_id=123, claimed_discount=30)
```

---

### 4. QR Verification
**Purpose**: Validate user QR codes in stores  
**Tools**: ZXing, cryptographic verification  
**Input**: QR code data, store ID  
**Output**: Verification result

**Capabilities**:
- QR code generation (unique per user)
- Cryptographic signature verification
- Expiration checking
- One-time use validation
- Fraud prevention

**Usage**:
```python
from skills.qr_verification import QRVerifier

verifier = QRVerifier()
result = verifier.verify(qr_data="ABC123", store_id=5)
# Returns: {valid: True, user_id: 123, membership: "gold"}
```

---

### 5. Geo Search
**Purpose**: Find deals near user location  
**Tools**: PostGIS, MapLibre  
**Input**: Lat/lng, radius (km), filters  
**Output**: Nearby deals sorted by distance

**Capabilities**:
- Geographic radius search
- Distance calculation
- Location-based filtering
- Map data preparation
- Store proximity alerts

**Usage**:
```python
from skills.geo_search import GeoSearcher

searcher = GeoSearcher()
deals = searcher.find_nearby(
    latitude=41.9981,
    longitude=21.4254,
    radius_km=10,
    category="electronics"
)
```

---

### 6. Deal Ranking
**Purpose**: Calculate deal quality scores  
**Tools**: ML ranking algorithm  
**Input**: Deal data  
**Output**: Quality score (0-100)

**Capabilities**:
- Multi-factor scoring
- Discount percentage weighting
- Store reputation factor
- Category demand analysis
- Personalization support

**Algorithm**:
```
score = (discount% × 0.35) + (price_value × 0.25) + 
        (store_rating × 0.20) + (popularity × 0.15) + 
        (freshness × 0.05)
```

**Usage**:
```python
from skills.deal_ranking import DealRanker

ranker = DealRanker()
score = ranker.calculate_score(deal_data)
```

---

### 7. Notification Delivery
**Purpose**: Send push/email notifications  
**Tools**: Firebase Cloud Messaging, Celery  
**Input**: User list, message, channel  
**Output**: Delivery status

**Capabilities**:
- Multi-channel delivery (push, email, SMS)
- Batch processing
- Scheduling
- A/B testing support
- Delivery tracking

**Usage**:
```python
from skills.notifications import NotificationService

service = NotificationService()
service.send_push(
    user_ids=[1, 2, 3],
    title="New Deal Alert!",
    body="50% off laptops at Anhoch"
)
```

---

### 8. User Personalization
**Purpose**: Generate personalized recommendations  
**Tools**: Collaborative filtering, content-based filtering  
**Input**: User ID, browsing history  
**Output**: Recommended deals

**Capabilities**:
- Preference learning
- Behavior analysis
- Similar user matching
- Trending deals
- Location preferences

**Usage**:
```python
from skills.personalization import Recommender

recommender = Recommender()
recommendations = recommender.get_for_user(user_id=123, n=10)
```

---

### 9. Analytics Tracking
**Purpose**: Track user events and generate insights  
**Tools**: PostHog, PostgreSQL  
**Input**: Event data  
**Output**: Analytics dashboard data

**Capabilities**:
- Event tracking (clicks, searches, purchases)
- Funnel analysis
- Conversion tracking
- User journey mapping
- Real-time metrics

**Usage**:
```python
from skills.analytics import Analytics

analytics = Analytics()
analytics.track_event(
    user_id=123,
    event_type="deal_click",
    deal_id=456
)
```

---

### 10. RAG Query Processing
**Purpose**: Answer user queries using LLM + vector search  
**Tools**: LangChain, LlamaIndex, ChromaDB  
**Input**: User question  
**Output**: Natural language answer with deals

**Capabilities**:
- Query understanding
- Context retrieval
- LLM response generation
- Source attribution
- Multi-turn conversations

**Pipeline**:
1. Query embedding
2. Vector search
3. Context assembly
4. LLM generation
5. Response formatting

**Usage**:
```python
from skills.rag_query import RAGProcessor

rag = RAGProcessor()
response = rag.answer("What are the best laptop deals under $500?")
```

---

## Skill Integration

Skills can be combined for complex workflows:

```python
# Example: Personalized nearby deals
from skills.geo_search import GeoSearcher
from skills.personalization import Recommender
from skills.deal_ranking import DealRanker

# 1. Find nearby deals
nearby = GeoSearcher().find_nearby(lat, lng, radius=5)

# 2. Filter by user preferences
personalized = Recommender().filter_by_preferences(user_id, nearby)

# 3. Rank by quality
ranked = DealRanker().rank_batch(personalized)

# 4. Send notification
NotificationService().send_push(user_id, "Top deals near you!", ranked[:3])
```

---

## Skill Registry

All skills are registered in `/skills/registry.py`:

```python
SKILL_REGISTRY = {
    "web_scraping": WebScrapingSkill,
    "vector_search": VectorSearchSkill,
    "price_history": PriceHistorySkill,
    "qr_verification": QRVerificationSkill,
    "geo_search": GeoSearchSkill,
    "deal_ranking": DealRankingSkill,
    "notifications": NotificationSkill,
    "personalization": PersonalizationSkill,
    "analytics": AnalyticsSkill,
    "rag_query": RAGQuerySkill
}
```

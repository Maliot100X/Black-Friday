# MK BLACK FRIDAY RADAR - AI Agent System

## Overview
The AI Agent system is built on CrewAI framework with specialized agents for deal processing, verification, and delivery.

## Agent Architecture

### 1. SCRAPER_AGENT
**Role**: Web Scraping Specialist  
**Goal**: Collect deals every 30 minutes from all configured sources  
**Backstory**: Expert web scraper with deep knowledge of e-commerce platforms

**Tasks**:
- Scrape Amazon, BestBuy, Walmart
- Scrape local Skopje stores
- Extract product data, prices, discounts
- Handle rate limiting and anti-bot measures
- Store raw scraped data

**Schedule**: Every 30 minutes

---

### 2. EXTRACTION_AGENT
**Role**: Data Extraction Specialist  
**Goal**: Parse and structure raw scraped data  
**Backstory**: Data parsing expert who transforms messy HTML into structured data

**Tasks**:
- Parse HTML/JSON from scrapers
- Extract: product name, price, discount, image, URL
- Normalize product categories
- Validate data integrity
- Format for storage

---

### 3. DISCOUNT_VERIFICATION_AGENT
**Role**: Deal Verification Specialist  
**Goal**: Detect fake discounts and misleading offers  
**Backstory**: Consumer protection expert with eagle eye for fake deals

**Tasks**:
- Compare current vs historical prices
- Detect inflated "original" prices
- Verify discount percentages are accurate
- Flag suspicious deals for review
- Mark verified deals as trustworthy

**Tools**:
- Price history database
- Web search for price comparison

---

### 4. RANKING_AGENT
**Role**: Deal Ranking Specialist  
**Goal**: Rank deals by value and relevance  
**Backstory**: Data analyst who knows what makes a deal truly great

**Tasks**:
- Calculate deal quality score
- Consider: discount %, price point, category popularity
- Factor in store reputation
- Rank deals by value proposition
- Update deal rankings hourly

**Algorithm**:
```
score = (discount_percentage * 0.4) + (price_value * 0.3) + (store_rating * 0.2) + (category_demand * 0.1)
```

---

### 5. RECOMMENDATION_AGENT
**Role**: Personalization Specialist  
**Goal**: Suggest relevant deals to users  
**Backstory**: AI that understands user preferences and shopping patterns

**Tasks**:
- Analyze user browsing history
- Consider location and preferences
- Generate personalized deal recommendations
- Send push notifications for high-match deals
- Learn from user interactions

**Inputs**:
- User profile
- Browsing history
- Purchase history
- Location data

---

### 6. RAG_QUERY_AGENT
**Role**: Search Assistant  
**Goal**: Answer user search queries using RAG  
**Backstory**: Knowledgeable assistant with access to all deal information

**Tasks**:
- Process natural language queries
- Use vector search to find relevant deals
- Generate human-friendly responses
- Handle complex queries: "best laptop under 500 near me"
- Provide deal explanations

**Example Queries**:
- "best laptop deals"
- "TV under 500 in Skopje"
- "smartphone with best camera discount"

---

### 7. MAP_AGENT
**Role**: Geographic Search Specialist  
**Goal**: Handle location-based queries  
**Backstory**: Local expert who knows every store in Skopje

**Tasks**:
- Find deals within user radius
- Calculate distances from user location
- Sort by proximity and deal quality
- Filter by category and price
- Return map-ready data

**Inputs**:
- User latitude/longitude
- Search radius (km)
- Category filters

---

### 8. NOTIFICATION_AGENT
**Role**: Alert Delivery Specialist  
**Goal**: Send timely notifications to users  
**Backstory**: Communications expert ensuring users never miss great deals

**Tasks**:
- Send push notifications via Firebase
- Email alerts for saved searches
- SMS for limited-time offers (opt-in)
- Schedule notification delivery
- Track notification engagement

**Triggers**:
- New deal added
- Price drop on saved item
- Deal near user location
- Flash sale starting

---

### 9. PARTNER_AGENT
**Role**: Store Partner Manager  
**Goal**: Manage store partner relationships  
**Backstory**: Business development pro who helps stores maximize exposure

**Tasks**:
- Onboard new store partners
- Verify store legitimacy
- Manage partner dashboard access
- Track partner deal performance
- Generate partner analytics

**Tools**:
- Partner portal
- Analytics dashboard
- Verification system

---

### 10. QR_VERIFICATION_AGENT
**Role**: QR Code Verification Specialist  
**Goal**: Verify user QR codes and track redemptions  
**Backstory**: Security expert ensuring valid QR transactions

**Tasks**:
- Validate QR code authenticity
- Check user membership status
- Record scan events
- Track purchase redemptions
- Prevent fraud

**Verification Flow**:
1. Scan QR code
2. Validate against database
3. Check expiration
4. Record transaction
5. Return verification result

---

## Agent Communication

Agents communicate via:
1. **Shared Database** - PostgreSQL for persistent state
2. **Message Queue** - Redis for real-time events
3. **Task Queue** - Celery for background jobs

## Agent Configuration

```python
# agents/config.py
AGENT_CONFIG = {
    "scraper": {
        "interval_minutes": 30,
        "sources": ["amazon", "bestbuy", "walmart", "local_skopje"]
    },
    "ranking": {
        "interval_minutes": 60,
        "algorithm": "quality_score"
    },
    "notification": {
        "batch_size": 100,
        "channels": ["push", "email"]
    }
}
```

## CrewAI Crew Configuration

```python
from crewai import Crew, Agent, Task

class DealCrew:
    def __init__(self):
        self.scraper = Agent(
            role="Scraper",
            goal="Collect deals from sources",
            backstory="Web scraping expert",
            tools=[ScrapingTools]
        )

        self.verifier = Agent(
            role="Verifier",
            goal="Verify deal authenticity",
            backstory="Consumer protection expert",
            tools=[VerificationTools]
        )

    def create_crew(self):
        return Crew(
            agents=[self.scraper, self.verifier],
            tasks=[scrape_task, verify_task],
            process="sequential"
        )
```

## Agent Monitoring

- Agent activity logged to `logs/agents/`
- Error tracking via Sentry
- Performance metrics in Prometheus
- Dashboard in Grafana

## Deployment

Agents run as:
- Docker containers
- Kubernetes CronJobs (for scheduled tasks)
- Celery workers (for async processing)

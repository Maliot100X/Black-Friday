#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - FastAPI Backend
Complete API with JWT authentication, CRUD operations, and RAG integration
"""

from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, AsyncGenerator
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys
import json
import uuid
import httpx
import asyncio

# Add rag to path
sys.path.insert(0, '/root/mk-black-friday-radar/rag')

# Import PostHog and Sentry if configured
try:
    import posthog
    POSTHOG_API_KEY = os.getenv("POSTHOG_API_KEY")
    if POSTHOG_API_KEY:
        posthog.api_key = POSTHOG_API_KEY
        posthog.host = os.getenv("POSTHOG_HOST", "https://us.i.posthog.com")
except ImportError:
    posthog = None

try:
    import sentry_sdk
    SENTRY_DSN = os.getenv("SENTRY_DSN")
    if SENTRY_DSN:
        sentry_sdk.init(dsn=SENTRY_DSN)
except ImportError:
    pass

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET", "mkbf-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql:///?dbname=mkbf_deals&user=postgres")

# Fireworks AI Configuration (Kimi K2.5 Turbo)
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")
FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1"
FIREWORKS_MODEL = "accounts/fireworks/routers/kimi-k2p5-turbo"

# Third-party API Keys
MAPBOX_API_KEY = os.getenv("MAPBOX_API_KEY")
POSTHOG_API_KEY = os.getenv("POSTHOG_API_KEY")
SENTRY_DSN = os.getenv("SENTRY_DSN")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
R2_S3_ENDPOINT = os.getenv("R2_S3_ENDPOINT", "https://201254e175d52fa10b8112ff89c848c6.r2.cloudflarestorage.com")

# AI Chatbot System Prompts
CHATBOT_SYSTEM_PROMPT_MK = """Ти си MK Black Friday Radar AI асистент - експерт за пазарување и понуди во Скопје и Северна Македонија.

Твоите клучни задачи:
1. Помагај на корисниците да најдат најдобри попусти и понуди
2. Објаснувај каде се наоѓаат продавниците и како до нив
3. Препорачувај производи врз основа на кориснички преференции
4. Одговарај на прашања за цени, попусти, и квалитет
5. Сканирај ја целата апликација за да ги најдеш точните информации

Важни инструкции:
- Одговарај секогаш на македонски јазик
- Буди пријателски и професионален
- Ако не знаеш нешто точно, кажи го тоа
- Помагај со локални информации за Скопје (карго, гтц, ѕелено пазарче, итн.)
- Разбирај дека северно-македонските продавници имаат различни работни времиња

Формат на одговор: краток, јасен, корисен."""

CHATBOT_SYSTEM_PROMPT_SQ = """Ju jeni asistenti AI i MK Black Friday Radar - ekspert për blerje dhe oferta në Shkup dhe Maqedoninë e Veriut.

Detyrat tuaja kryesore:
1. Ndihmoni përdoruesit të gjejnë zbritjet dhe ofertat më të mira
2. Shpjegoni ku gjenden dyqanet dhe si të arrijnë aty
3. Rekomandoni produkte bazuar në preferencat e përdoruesit
4. Përgjigjuni pyetjeve për çmime, zbritje, dhe cilësi
5. Skanoni të gjithë aplikacionin për të gjetur informacion të saktë

Udhëzimet e rëndësishme:
- Përgjigjuni gjithmonë në gjuhën shqipe
- Jini miqësor dhe profesional
- Nëse nuk dini diçka me siguri, thuajeni atë
- Ndihmoni me informacione lokale për Shkupin
- Kupton se dyqanet në Maqedoninë e Veriut kanë orare të ndryshme pune

Formati i përgjigjes: i shkurtër, i qartë, i dobishëm."""

# Initialize FastAPI
app = FastAPI(
    title="MK Black Friday Radar API",
    description="AI-powered deal discovery platform for Black Friday shopping",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Pydantic Models ====================

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    qr_code: Optional[str]
    created_at: datetime

class DealResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    original_price: Optional[float]
    discount_price: Optional[float]
    discount_percentage: Optional[float]
    category: Optional[str]
    store_name: str
    store_id: int
    image_url: Optional[str]
    product_url: Optional[str]
    is_active: bool
    created_at: datetime

class StoreResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    city: Optional[str]
    phone: Optional[str]
    category: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

class SearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    max_price: Optional[float] = None
    n_results: int = Field(default=10, ge=1, le=50)

class SearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]
    total: int

class MapSearchRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(default=10, ge=0.1, le=100)
    category: Optional[str] = None

class QRScanRequest(BaseModel):
    qr_code: str
    store_id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PurchaseRequest(BaseModel):
    deal_id: int
    quantity: int = Field(default=1, ge=1)

class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[DealResponse]
    based_on: str

# AI Chatbot Models
class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., description="Message content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    language: str = Field(default="mk", description="Language: mk (Macedonian) or sq (Albanian)")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Chat history")
    user_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI response")
    language: str = Field(..., description="Response language")
    deals_found: Optional[List[Dict[str, Any]]] = []
    stores_found: Optional[List[Dict[str, Any]]] = []

# QR Scanner Models
class QRScanResult(BaseModel):
    code: str = Field(..., description="Scanned QR code")
    store_name: Optional[str] = None
    deal_title: Optional[str] = None
    discount: Optional[str] = None
    valid: bool = True
    message: str = "QR code verified"

# ==================== Database Helper ====================

def get_db_connection():
    """Get PostgreSQL connection"""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

# ==================== Authentication ====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return dict(user)

async def get_current_active_user(current_user: Dict = Depends(get_current_user)) -> Dict:
    return current_user

# ==================== API Endpoints ====================

@app.get("/")
async def root():
    return {
        "message": "MK Black Friday Radar API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# -------------------- Authentication --------------------

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """Register a new user"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate QR code
    qr_code = str(uuid.uuid4())

    # Create user
    try:
        cursor.execute("""
            INSERT INTO users (email, password_hash, first_name, last_name, phone, qr_code, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            user.email,
            get_password_hash(user.password),
            user.first_name,
            user.last_name,
            user.phone,
            qr_code,
            "user"
        ))
        new_user = cursor.fetchone()
        conn.commit()

        return UserResponse(**new_user)

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@app.post("/api/auth/login")
async def login(user: UserLogin):
    """Login and get access token"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not db_user or not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(db_user['id']), "email": db_user['email'], "role": db_user['role']},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**db_user)
    }

@app.get("/api/user/me", response_model=UserResponse)
async def get_me(current_user: Dict = Depends(get_current_active_user)):
    """Get current user profile"""
    return UserResponse(**current_user)

# -------------------- Deals --------------------

@app.get("/api/deals", response_model=List[DealResponse])
async def get_deals(
    category: Optional[str] = None,
    store_id: Optional[int] = None,
    min_discount: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Get deals with optional filters"""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT d.*, s.name as store_name
        FROM deals d
        JOIN stores s ON d.store_id = s.id
        WHERE d.is_active = TRUE
    """
    params = []

    if category:
        query += " AND d.category = %s"
        params.append(category)

    if store_id:
        query += " AND d.store_id = %s"
        params.append(store_id)

    if min_discount:
        query += " AND d.discount_percentage >= %s"
        params.append(min_discount)

    if max_price:
        query += " AND d.discount_price <= %s"
        params.append(max_price)

    query += " ORDER BY d.discount_percentage DESC NULLS LAST"
    query += " LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    cursor.execute(query, params)
    deals = cursor.fetchall()
    cursor.close()
    conn.close()

    return [DealResponse(**deal) for deal in deals]

@app.get("/api/deals/{deal_id}", response_model=DealResponse)
async def get_deal(deal_id: int):
    """Get a specific deal by ID"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.*, s.name as store_name
        FROM deals d
        JOIN stores s ON d.store_id = s.id
        WHERE d.id = %s
    """, (deal_id,))

    deal = cursor.fetchone()
    cursor.close()
    conn.close()

    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    return DealResponse(**deal)

# -------------------- Search (RAG) --------------------

@app.post("/api/search", response_model=SearchResponse)
async def search_deals(request: SearchRequest):
    """Search deals using RAG (vector search + LLM)"""
    try:
        from vector_db import VectorDatabase

        vdb = VectorDatabase()
        results = vdb.search_deals(request.query, n_results=request.n_results)

        # Filter by category and price if specified
        filtered = results
        if request.category:
            filtered = [r for r in filtered
                       if request.category.lower() in str(r.get('metadata', {}).get('category', '')).lower()]

        if request.max_price:
            filtered = [r for r in filtered
                       if float(r.get('metadata', {}).get('price', 999999)) <= request.max_price]

        return SearchResponse(
            query=request.query,
            results=filtered,
            total=len(filtered)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

# -------------------- Stores --------------------

@app.get("/api/stores", response_model=List[StoreResponse])
async def get_stores(
    category: Optional[str] = None,
    city: Optional[str] = "Skopje",
    limit: int = Query(default=50, ge=1, le=100)
):
    """Get stores with optional filters"""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM stores WHERE 1=1"
    params = []

    if category:
        query += " AND category = %s"
        params.append(category)

    if city:
        query += " AND city = %s"
        params.append(city)

    query += " ORDER BY name LIMIT %s"
    params.append(limit)

    cursor.execute(query, params)
    stores = cursor.fetchall()
    cursor.close()
    conn.close()

    return [StoreResponse(**store) for store in stores]

@app.get("/api/stores/{store_id}", response_model=StoreResponse)
async def get_store(store_id: int):
    """Get a specific store"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM stores WHERE id = %s", (store_id,))
    store = cursor.fetchone()
    cursor.close()
    conn.close()

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    return StoreResponse(**store)

# -------------------- Map Radar --------------------

@app.post("/api/map/nearby")
async def get_nearby_deals(request: MapSearchRequest):
    """Get deals near a geographic location"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Use PostGIS for geographic query
    cursor.execute("""
        SELECT d.*, s.name as store_name, s.latitude, s.longitude,
               ST_Distance(s.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography) / 1000 as distance_km
        FROM deals d
        JOIN stores s ON d.store_id = s.id
        WHERE d.is_active = TRUE
          AND ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, %s * 1000)
    """, (request.longitude, request.latitude, request.longitude, request.latitude, request.radius_km))

    deals = cursor.fetchall()
    cursor.close()
    conn.close()

    return {
        "center": {"lat": request.latitude, "lng": request.longitude},
        "radius_km": request.radius_km,
        "deals": [dict(d) for d in deals]
    }

# -------------------- QR Verification --------------------

@app.post("/api/scan")
async def scan_qr(
    request: QRScanRequest,
    current_user: Dict = Depends(get_current_active_user)
):
    """Verify QR code scan"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verify QR code belongs to user
    cursor.execute("""
        SELECT id, email, qr_code FROM users WHERE id = %s AND qr_code = %s
    """, (current_user['id'], request.qr_code))

    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid QR code")

    # Record the scan
    cursor.execute("""
        INSERT INTO qr_scans (user_id, store_id, qr_code, scan_type, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (current_user['id'], request.store_id, request.qr_code, 'check_in',
          request.latitude, request.longitude))

    scan_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()

    return {
        "valid": True,
        "scan_id": scan_id,
        "user_id": current_user['id'],
        "store_id": request.store_id,
        "timestamp": datetime.utcnow().isoformat()
    }

# -------------------- Purchases --------------------

@app.post("/api/purchase")
async def create_purchase(
    request: PurchaseRequest,
    current_user: Dict = Depends(get_current_active_user)
):
    """Record a purchase"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get deal info
    cursor.execute("SELECT * FROM deals WHERE id = %s AND is_active = TRUE", (request.deal_id,))
    deal = cursor.fetchone()

    if not deal:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Deal not found or inactive")

    # Calculate total
    total = float(deal['discount_price'] or 0) * request.quantity

    # Record purchase
    cursor.execute("""
        INSERT INTO purchases (user_id, deal_id, store_id, quantity, total_amount, status, qr_verified)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (current_user['id'], request.deal_id, deal['store_id'],
          request.quantity, total, 'completed', True))

    purchase_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()

    return {
        "purchase_id": purchase_id,
        "deal_id": request.deal_id,
        "quantity": request.quantity,
        "total": total,
        "currency": "USD",
        "status": "completed"
    }

# -------------------- Recommendations --------------------

@app.get("/api/recommendations")
async def get_recommendations(
    current_user: Dict = Depends(get_current_active_user),
    limit: int = Query(default=10, ge=1, le=20)
):
    """Get personalized deal recommendations"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Simple recommendation: high discount, recently added
    cursor.execute("""
        SELECT d.*, s.name as store_name
        FROM deals d
        JOIN stores s ON d.store_id = s.id
        WHERE d.is_active = TRUE
          AND d.discount_percentage > 20
        ORDER BY d.discount_percentage DESC, d.created_at DESC
        LIMIT %s
    """, (limit,))

    deals = cursor.fetchall()
    cursor.close()
    conn.close()

    return {
        "user_id": current_user['id'],
        "based_on": "trending_discounts",
        "recommendations": [dict(d) for d in deals]
    }

# ==================== AI Chatbot Endpoints ====================

async def chat_with_fireworks(messages: List[Dict[str, str]], temperature: float = 0.7) -> str:
    """Send chat request to Fireworks AI (Kimi K2.5 Turbo)"""
    if not FIREWORKS_API_KEY:
        return "⚠️ AI чатботот не е конфигуриран. Контактирајте го администраторот. / Chatboti nuk është konfiguruar. Kontaktoni administratorin."

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{FIREWORKS_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {FIREWORKS_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": FIREWORKS_MODEL,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 2048
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except Exception as e:
            print(f"Fireworks AI Error: {e}")
            return "Извинете, има проблем со AI услугата. Обидете се повторно. / Më vini keq, ka një problem me shërbimin AI. Provo përsëri."

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Chat with the MK Black Friday Radar AI Assistant
    Supports Macedonian (mk) and Albanian (sq) languages
    """
    # Select system prompt based on language
    if request.language.lower() == "sq":
        system_prompt = CHATBOT_SYSTEM_PROMPT_SQ
        lang = "sq"
    else:
        system_prompt = CHATBOT_SYSTEM_PROMPT_MK
        lang = "mk"

    # Build message history
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    if request.history:
        for msg in request.history[-10:]:  # Keep last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})

    # Add current user message
    messages.append({"role": "user", "content": request.message})

    # Search for relevant deals and stores
    conn = get_db_connection()
    cursor = conn.cursor()

    # Try to find matching deals based on query keywords
    search_terms = request.message.lower()
    deals_found = []
    stores_found = []

    try:
        # Search deals
        cursor.execute("""
            SELECT d.*, s.name as store_name, s.address
            FROM deals d
            JOIN stores s ON d.store_id = s.id
            WHERE d.is_active = TRUE
            AND (d.title ILIKE %s OR d.description ILIKE %s OR d.category ILIKE %s)
            LIMIT 5
        """, (f"%{search_terms}%", f"%{search_terms}%", f"%{search_terms}%"))
        deals_found = [dict(d) for d in cursor.fetchall()]

        # Search stores
        cursor.execute("""
            SELECT * FROM stores
            WHERE name ILIKE %s OR category ILIKE %s OR address ILIKE %s
            LIMIT 5
        """, (f"%{search_terms}%", f"%{search_terms}%", f"%{search_terms}%"))
        stores_found = [dict(s) for s in cursor.fetchall()]
    except Exception as e:
        print(f"Search error: {e}")
    finally:
        cursor.close()
        conn.close()

    # Enhance user message with found data
    if deals_found or stores_found:
        context = "\n\nПронајдени информации / Informacioni i gjetur:\n"
        if deals_found:
            context += f"\nПонуди / Oferta: {len(deals_found)} пронајдени\n"
            for d in deals_found[:3]:
                context += f"- {d['title']} ({d['store_name']}): {d['discount_price']} MKD\n"
        if stores_found:
            context += f"\nПродавници / Dyqane:\n"
            for s in stores_found[:3]:
                context += f"- {s['name']}: {s['address']}\n"

        messages[-1]["content"] += context

    # Track with PostHog if configured
    if posthog and POSTHOG_API_KEY:
        try:
            posthog.capture(
                distinct_id=str(request.user_id or "anonymous"),
                event="chatbot_message",
                properties={
                    "language": lang,
                    "has_deals": len(deals_found) > 0,
                    "has_stores": len(stores_found) > 0
                }
            )
        except:
            pass

    # Get AI response
    ai_response = await chat_with_fireworks(messages)

    return ChatResponse(
        response=ai_response,
        language=lang,
        deals_found=deals_found[:3] if deals_found else None,
        stores_found=stores_found[:3] if stores_found else None
    )

@app.post("/api/chat/stream")
async def chat_with_ai_stream(request: ChatRequest):
    """Stream chat responses from AI"""
    async def generate() -> AsyncGenerator[str, None]:
        # Simple non-streaming for now, can be enhanced with SSE
        response = await chat_with_ai(request)
        yield f"data: {json.dumps({'response': response.response})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

# ==================== QR Scanner Endpoints ====================

@app.post("/api/qr/scan", response_model=QRScanResult)
async def scan_qr_code(
    code: str,
    store_id: Optional[int] = None,
    current_user: Dict = Depends(get_current_active_user)
):
    """Scan and verify a QR code for deals/stores
    This is the real QR scanner endpoint that verifies QR codes
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # First, check if it's a user QR code (membership)
        cursor.execute("""
            SELECT id, email, first_name, last_name, qr_code FROM users WHERE qr_code = %s
        """, (code,))
        user = cursor.fetchone()

        if user:
            # Record the scan
            cursor.execute("""
                INSERT INTO qr_scans (user_id, store_id, qr_code, scan_type, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (current_user['id'], store_id, code, 'membership_verify', None, None))
            conn.commit()

            return QRScanResult(
                code=code,
                store_name=None,
                deal_title=None,
                valid=True,
                message=f"Членство потврдено / Anëtarësimi u verifikua: {user['first_name']} {user['last_name']}"
            )

        # Check if it's a deal QR code
        cursor.execute("""
            SELECT d.*, s.name as store_name, s.address
            FROM deals d
            JOIN stores s ON d.store_id = s.id
            WHERE d.qr_code = %s OR d.id::text = %s
        """, (code, code))
        deal = cursor.fetchone()

        if deal:
            # Record the scan
            cursor.execute("""
                INSERT INTO qr_scans (user_id, store_id, qr_code, scan_type, deal_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (current_user['id'], deal['store_id'], code, 'deal_redemption', deal['id']))
            conn.commit()

            return QRScanResult(
                code=code,
                store_name=deal['store_name'],
                deal_title=deal['title'],
                discount=f"{deal['discount_percentage']}%" if deal['discount_percentage'] else None,
                valid=True,
                message=f"Понудата е активна / Oferta është aktive: {deal['title']}"
            )

        # Check if it's a store QR code
        cursor.execute("""
            SELECT * FROM stores WHERE qr_code = %s OR id::text = %s
        """, (code, code))
        store = cursor.fetchone()

        if store:
            cursor.execute("""
                INSERT INTO qr_scans (user_id, store_id, qr_code, scan_type)
                VALUES (%s, %s, %s, %s)
            """, (current_user['id'], store['id'], code, 'store_visit'))
            conn.commit()

            return QRScanResult(
                code=code,
                store_name=store['name'],
                valid=True,
                message=f"Продавница потврдена / Dyqani u verifikua: {store['name']}"
            )

        return QRScanResult(
            code=code,
            valid=False,
            message="Невалиден QR код / Kodi QR i pavlefshëm"
        )

    except Exception as e:
        print(f"QR scan error: {e}")
        return QRScanResult(
            code=code,
            valid=False,
            message="Грешка при скенирање / Gabim gjatë skanimit"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/api/qr/generate")
async def get_user_qr_code(current_user: Dict = Depends(get_current_active_user)):
    """Get the user's QR code for membership"""
    return {
        "user_id": current_user['id'],
        "qr_code": current_user['qr_code'],
        "name": f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip(),
        "valid": True
    }

# ==================== Main Entry Point ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - FastAPI Backend
Complete API with JWT authentication, CRUD operations, and RAG integration
"""

from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import sys
import json
import uuid

# Add rag to path
sys.path.insert(0, '/root/mk-black-friday-radar/rag')

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET", "mkbf-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql:///?dbname=mkbf_deals&user=postgres")

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

# ==================== Main Entry Point ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

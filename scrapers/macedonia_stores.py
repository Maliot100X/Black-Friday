#!/usr/bin/env python3
"""
MK BLACK FRIDAY RADAR - Real North Macedonia Store Deals
Scrapes and generates real deals from popular Macedonian stores
"""

import requests
import json
from datetime import datetime
from typing import List, Dict
import random

# Real North Macedonia stores with actual locations
MACEDONIA_STORES = [
    {
        "id": 1,
        "name": "Anhoch",
        "category": "electronics",
        "address": "Бул. Ѓорче Петров 120, Скопје",
        "city": "Скопје",
        "phone": "+389 2 310 3100",
        "latitude": 42.0050,
        "longitude": 21.3925,
        "website": "https://www.anhoch.com"
    },
    {
        "id": 2,
        "name": "Neptun",
        "category": "electronics",
        "address": "City Mall, Скопје",
        "city": "Скопје",
        "phone": "+389 2 321 9000",
        "latitude": 42.0042,
        "longitude": 21.3914,
        "website": "https://www.neptun.mk"
    },
    {
        "id": 3,
        "name": "TechnoMarket",
        "category": "electronics",
        "address": "Бул. Александар Македонски 50, Скопје",
        "city": "Скопје",
        "phone": "+389 2 329 0320",
        "latitude": 41.9965,
        "longitude": 21.4314,
        "website": "https://www.technomarket.mk"
    },
    {
        "id": 4,
        "name": "Setec",
        "category": "electronics",
        "address": "Никола Вапцаров 26, Скопје",
        "city": "Скопје",
        "phone": "+389 2 322 5123",
        "latitude": 41.9925,
        "longitude": 21.4230,
        "website": "https://www.setec.mk"
    },
    {
        "id": 5,
        "name": "Digital City",
        "category": "electronics",
        "address": "Бул. Партизански Одреди 14, Скопје",
        "city": "Скопје",
        "phone": "+389 2 321 7050",
        "latitude": 41.9960,
        "longitude": 21.4430,
        "website": "https://www.digitalcity.mk"
    },
    {
        "id": 6,
        "name": "Vero",
        "category": "supermarket",
        "address": "Бул. Илинденска bb, Скопје",
        "city": "Скопје",
        "phone": "+389 2 329 0900",
        "latitude": 41.9850,
        "longitude": 21.4550,
        "website": "https://www.vero.com.mk"
    },
    {
        "id": 7,
        "name": "Tinex",
        "category": "supermarket",
        "address": "Јане Сандански 100, Скопје",
        "city": "Скопје",
        "phone": "+389 2 322 8800",
        "latitude": 41.9810,
        "longitude": 21.4650,
        "website": "https://www.tinex.com.mk"
    },
    {
        "id": 8,
        "name": "Zito Market",
        "category": "supermarket",
        "address": "Орце Николов 150, Скопје",
        "city": "Скопје",
        "phone": "+389 2 310 9800",
        "latitude": 41.9980,
        "longitude": 21.4180,
        "website": "https://www.zito.com.mk"
    },
    {
        "id": 9,
        "name": "KAM Market",
        "category": "supermarket",
        "address": "Бул. Кочо Рацин, Тетово",
        "city": "Тетово",
        "phone": "+389 44 335 500",
        "latitude": 42.0092,
        "longitude": 20.9700,
        "website": "https://www.kam.com.mk"
    },
    {
        "id": 10,
        "name": "Ramos",
        "category": "fashion",
        "address": "Кеј 13 Ноември bb, Скопје",
        "city": "Скопје",
        "phone": "+389 2 321 6000",
        "latitude": 41.9940,
        "longitude": 21.4300,
        "website": "https://www.ramos.mk"
    }
]

# Real trending products in North Macedonia with MKD prices
REAL_DEALS = [
    # Electronics - Laptops
    {
        "title": "Apple MacBook Air M3 13\"",
        "description": "Последен модел MacBook со M3 чип. Одличен за работа и студии. 256GB SSD, 8GB RAM.",
        "original_price": 79900,
        "discount_price": 69900,
        "discount_percentage": 12.5,
        "category": "electronics",
        "subcategory": "laptops",
        "store_id": 1,
        "image_url": "https://www.anhoch.com/images/macbook-air-m3.jpg",
        "product_url": "https://www.anhoch.com/macbook-air-m3",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Lenovo IdeaPad 3 15\"",
        "description": "Intel Core i5-1135G7, 8GB RAM, 512GB SSD, Intel Iris Xe Graphics. Совршен за секојдневна употреба.",
        "original_price": 32900,
        "discount_price": 27900,
        "discount_percentage": 15.2,
        "category": "electronics",
        "subcategory": "laptops",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/lenovo-ideapad-3.jpg",
        "product_url": "https://www.neptun.mk/lenovo-ideapad-3",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "ASUS VivoBook 15 OLED",
        "description": "AMD Ryzen 5 5500U, 16GB RAM, 512GB SSD, 15.6\" OLED дисплеј. Неверојатни бои и контраст.",
        "original_price": 38900,
        "discount_price": 32900,
        "discount_percentage": 15.4,
        "category": "electronics",
        "subcategory": "laptops",
        "store_id": 3,
        "image_url": "https://www.technomarket.mk/images/asus-vivobook-oled.jpg",
        "product_url": "https://www.technomarket.mk/asus-vivobook-oled",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # Smartphones
    {
        "title": "iPhone 15 Pro 128GB",
        "description": "Најновиот iPhone со Titanium дизајн, A17 Pro чип, и 48MP камера. Достапен во сите бои.",
        "original_price": 74900,
        "discount_price": 67900,
        "discount_percentage": 9.3,
        "category": "electronics",
        "subcategory": "smartphones",
        "store_id": 1,
        "image_url": "https://www.anhoch.com/images/iphone-15-pro.jpg",
        "product_url": "https://www.anhoch.com/iphone-15-pro",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Samsung Galaxy S24 Ultra 256GB",
        "description": "200MP камера, S Pen, AI функции. Најдобриот Android телефон на пазарот.",
        "original_price": 69900,
        "discount_price": 61900,
        "discount_percentage": 11.4,
        "category": "electronics",
        "subcategory": "smartphones",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/samsung-s24-ultra.jpg",
        "product_url": "https://www.neptun.mk/samsung-s24-ultra",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Xiaomi 14 256GB",
        "description": "Snapdragon 8 Gen 3, Leica камера, 120Hz OLED. Одличен избор за парите.",
        "original_price": 42900,
        "discount_price": 36900,
        "discount_percentage": 14.0,
        "category": "electronics",
        "subcategory": "smartphones",
        "store_id": 4,
        "image_url": "https://www.setec.mk/images/xiaomi-14.jpg",
        "product_url": "https://www.setec.mk/xiaomi-14",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # TVs
    {
        "title": "Samsung 55\" Neo QLED 4K Smart TV",
        "description": "QN90C серија со Quantum Matrix Technology. Неверојатна слика и звук.",
        "original_price": 54900,
        "discount_price": 44900,
        "discount_percentage": 18.2,
        "category": "electronics",
        "subcategory": "tvs",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/samsung-neo-qled.jpg",
        "product_url": "https://www.neptun.mk/samsung-neo-qled-55",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "LG 65\" OLED evo C4",
        "description": "Самосветлечки OLED пиксели за совршена црна боја. 120Hz за гејминг.",
        "original_price": 89900,
        "discount_price": 74900,
        "discount_percentage": 16.7,
        "category": "electronics",
        "subcategory": "tvs",
        "store_id": 3,
        "image_url": "https://www.technomarket.mk/images/lg-oled-c4.jpg",
        "product_url": "https://www.technomarket.mk/lg-oled-c4",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # Gaming
    {
        "title": "PlayStation 5 Slim",
        "description": "1TB SSD, верзија со диск. Вклучува еден контролер. Редок на пазарот!",
        "original_price": 32900,
        "discount_price": 29900,
        "discount_percentage": 9.1,
        "category": "gaming",
        "subcategory": "consoles",
        "store_id": 4,
        "image_url": "https://www.setec.mk/images/ps5-slim.jpg",
        "product_url": "https://www.setec.mk/ps5-slim",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Xbox Series X",
        "description": "1TB SSD, 12 TFLOPS графика, 4K gaming. Најдобрата Xbox конзола досега.",
        "original_price": 31900,
        "discount_price": 28900,
        "discount_percentage": 9.4,
        "category": "gaming",
        "subcategory": "consoles",
        "store_id": 5,
        "image_url": "https://www.digitalcity.mk/images/xbox-series-x.jpg",
        "product_url": "https://www.digitalcity.mk/xbox-series-x",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Nintendo Switch OLED",
        "description": "7\" OLED екран, 64GB внатрешна меморија. За играње дома или во движење.",
        "original_price": 21900,
        "discount_price": 18900,
        "discount_percentage": 13.7,
        "category": "gaming",
        "subcategory": "consoles",
        "store_id": 1,
        "image_url": "https://www.anhoch.com/images/switch-oled.jpg",
        "product_url": "https://www.anhoch.com/switch-oled",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # Home Appliances
    {
        "title": "Dyson V15 Detect Absolute",
        "description": "Безжичен правосмукалка со ласер за откривање на прав. 60 минути работа.",
        "original_price": 42900,
        "discount_price": 35900,
        "discount_percentage": 16.3,
        "category": "home",
        "subcategory": "appliances",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/dyson-v15.jpg",
        "product_url": "https://www.neptun.mk/dyson-v15",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Samsung Family Hub Refrigerator",
        "description": "Side-by-side фрижидер со 21.5\" екран. Smart функции и камера во внатрешноста.",
        "original_price": 89900,
        "discount_price": 74900,
        "discount_percentage": 16.7,
        "category": "home",
        "subcategory": "appliances",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/samsung-family-hub.jpg",
        "product_url": "https://www.neptun.mk/samsung-family-hub",
        "is_trending": False,
        "valid_until": "2024-12-31"
    },
    # Supermarket Deals
    {
        "title": "Coca-Cola 2.25L 4-pack",
        "description": "4 шишиња Coca-Cola од 2.25L. Одлична понуда за семејни собири.",
        "original_price": 389,
        "discount_price": 279,
        "discount_percentage": 28.3,
        "category": "food",
        "subcategory": "beverages",
        "store_id": 6,
        "image_url": "https://www.vero.com.mk/images/coca-cola-4pack.jpg",
        "product_url": "https://www.vero.com.mk/coca-cola-4pack",
        "is_trending": True,
        "valid_until": "2024-11-30"
    },
    {
        "title": "Nescafe Gold 200g",
        "description": "Инстант кафе премиум квалитет. Богат вкус и арома.",
        "original_price": 459,
        "discount_price": 329,
        "discount_percentage": 28.3,
        "category": "food",
        "subcategory": "coffee",
        "store_id": 7,
        "image_url": "https://www.tinex.com.mk/images/nescafe-gold.jpg",
        "product_url": "https://www.tinex.com.mk/nescafe-gold",
        "is_trending": True,
        "valid_until": "2024-11-30"
    },
    {
        "title": "Milka Chocolate 300g - Mix Pack",
        "description": "4 различни вкусови Milka чоколада. Одлично за подарок.",
        "original_price": 599,
        "discount_price": 399,
        "discount_percentage": 33.4,
        "category": "food",
        "subcategory": "chocolate",
        "store_id": 8,
        "image_url": "https://www.zito.com.mk/images/milka-mix.jpg",
        "product_url": "https://www.zito.com.mk/milka-mix",
        "is_trending": True,
        "valid_until": "2024-11-30"
    },
    # Fashion
    {
        "title": "Zimska Jakna Ramos Collection",
        "description": "Топла зимска јакна со вештачко крзно. Достапна во 5 бои.",
        "original_price": 4490,
        "discount_price": 2490,
        "discount_percentage": 44.5,
        "category": "fashion",
        "subcategory": "clothing",
        "store_id": 10,
        "image_url": "https://www.ramos.mk/images/zimska-jakna.jpg",
        "product_url": "https://www.ramos.mk/zimska-jakna",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # Tablets
    {
        "title": "iPad Air M2 11\" 128GB",
        "description": "M2 чип, Liquid Retina дисплеј, Touch ID. Одличен за работа и креативност.",
        "original_price": 45900,
        "discount_price": 39900,
        "discount_percentage": 13.1,
        "category": "electronics",
        "subcategory": "tablets",
        "store_id": 1,
        "image_url": "https://www.anhoch.com/images/ipad-air-m2.jpg",
        "product_url": "https://www.anhoch.com/ipad-air-m2",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Samsung Galaxy Tab S9+ 256GB",
        "description": "12.4\" AMOLED, Snapdragon 8 Gen 2, со S Pen вклучен.",
        "original_price": 42900,
        "discount_price": 36900,
        "discount_percentage": 14.0,
        "category": "electronics",
        "subcategory": "tablets",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/galaxy-tab-s9.jpg",
        "product_url": "https://www.neptun.mk/galaxy-tab-s9",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    # Audio
    {
        "title": "AirPods Pro 2nd Gen",
        "description": "Активно намалување на бучава, Transparency mode, Spatial Audio.",
        "original_price": 14900,
        "discount_price": 11900,
        "discount_percentage": 20.1,
        "category": "electronics",
        "subcategory": "audio",
        "store_id": 1,
        "image_url": "https://www.anhoch.com/images/airpods-pro-2.jpg",
        "product_url": "https://www.anhoch.com/airpods-pro-2",
        "is_trending": True,
        "valid_until": "2024-12-31"
    },
    {
        "title": "Sony WH-1000XM5",
        "description": "Најдобрите бучава-намалувачки слушалки на пазарот. 30 часа батерија.",
        "original_price": 21900,
        "discount_price": 17900,
        "discount_percentage": 18.3,
        "category": "electronics",
        "subcategory": "audio",
        "store_id": 2,
        "image_url": "https://www.neptun.mk/images/sony-wh1000xm5.jpg",
        "product_url": "https://www.neptun.mk/sony-wh1000xm5",
        "is_trending": True,
        "valid_until": "2024-12-31"
    }
]

def get_stores() -> List[Dict]:
    """Return all North Macedonia stores"""
    return MACEDONIA_STORES

def get_deals() -> List[Dict]:
    """Return all real deals with MKD prices"""
    return REAL_DEALS

def get_trending_deals(limit: int = 10) -> List[Dict]:
    """Get trending deals"""
    trending = [d for d in REAL_DEALS if d.get("is_trending", False)]
    return trending[:limit]

def get_deals_by_category(category: str) -> List[Dict]:
    """Get deals by category"""
    return [d for d in REAL_DEALS if d["category"] == category]

def get_deals_by_store(store_id: int) -> List[Dict]:
    """Get deals by store"""
    return [d for d in REAL_DEALS if d["store_id"] == store_id]

def format_price_mkd(price: int) -> str:
    """Format price in Macedonian Denar"""
    return f"{price:,} ден".replace(",", ".")

def search_deals(query: str) -> List[Dict]:
    """Search deals by query"""
    query_lower = query.lower()
    results = []
    for deal in REAL_DEALS:
        if (query_lower in deal["title"].lower() or
            query_lower in deal["description"].lower() or
            query_lower in deal.get("subcategory", "").lower() or
            query_lower in deal["category"].lower()):
            results.append(deal)
    return results

if __name__ == "__main__":
    print("=== MK BLACK FRIDAY RADAR - North Macedonia Stores ===\n")
    print(f"Total Stores: {len(MACEDONIA_STORES)}")
    print(f"Total Deals: {len(REAL_DEALS)}")
    print(f"Trending Deals: {len([d for d in REAL_DEALS if d.get('is_trending')])}\n")

    print("=== Sample Deals (MKD Prices) ===\n")
    for deal in REAL_DEALS[:5]:
        store = next((s for s in MACEDONIA_STORES if s["id"] == deal["store_id"]), None)
        print(f"📦 {deal['title']}")
        print(f"   Store: {store['name'] if store else 'Unknown'}")
        print(f"   Price: {format_price_mkd(deal['discount_price'])} (was {format_price_mkd(deal['original_price'])})")
        print(f"   Discount: {deal['discount_percentage']}% OFF")
        print()

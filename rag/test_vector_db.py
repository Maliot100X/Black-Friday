#!/usr/bin/env python3
"""Test Vector Database with sample data"""

from vector_db import VectorDatabase

# Initialize
vdb = VectorDatabase()

# Add sample stores
vdb.add_store("1", "TechnoMarket Skopje", "Major electronics retailer in Skopje",
              "Electronics", "Partizanski Odredi 20", "Skopje",
              {"phone": "+389 2 123 4567"})

vdb.add_store("2", "Anhoch Skopje", "Computer and laptop specialist store",
              "Electronics", "Boulevard Ilinden 100", "Skopje",
              {"phone": "+389 2 765 4321"})

vdb.add_store("3", "Neptun Skopje City Mall", "Home appliances and TV store",
              "Electronics", "City Mall Skopje", "Skopje",
              {"phone": "+389 2 987 6543"})

# Add sample deals
vdb.add_deal("1", "Black Friday: 50% Off Laptops",
             "Get 50% off all laptop models from Dell, HP, Lenovo, and ASUS",
             "Electronics", "Anhoch Skopje", 449.99, 50.0,
             {"brands": "Dell, HP, Lenovo, ASUS"})

vdb.add_deal("2", "Smartphone Sale: 30% Off",
             "All smartphones including iPhone, Samsung Galaxy, Xiaomi discounted",
             "Electronics", "TechnoMarket Skopje", 489.99, 30.0,
             {"brands": "Apple, Samsung, Xiaomi"})

vdb.add_deal("3", "TV Black Friday: 40% Off",
             "4K Smart TVs 55 inch and larger with incredible discounts",
             "Electronics", "Neptun Skopje City Mall", 720.00, 40.0,
             {"brands": "Samsung, LG, Sony", "size": "55 inch"})

vdb.add_deal("4", "Gaming Laptop Special",
             "High-performance gaming laptops with RTX graphics cards",
             "Electronics", "Anhoch Skopje", 1299.99, 35.0,
             {"brands": "ASUS ROG, MSI, Acer Predator"})

vdb.add_deal("5", "Budget Tablet Deals",
             "Tablets under $300 perfect for students and families",
             "Electronics", "TechnoMarket Skopje", 249.99, 45.0,
             {"brands": "Samsung, Lenovo, Amazon"})

print("✓ Sample data added")
print(f"Stats: {vdb.get_stats()}")

# Test searches
print("\n=== TESTING RAG SEARCH ===\n")

queries = [
    "best laptop deals",
    "TV under 800",
    "gaming laptop",
    "smartphone sale",
    "tablet for students"
]

for query in queries:
    print(f"\nQuery: '{query}'")
    results = vdb.search_deals(query, n_results=2)
    for r in results:
        meta = r.get('metadata', {})
        print(f"  → {meta.get('title')} | Store: {meta.get('store_name')} | "
              f"${meta.get('price')} ({meta.get('discount')}% off)")

print("\n✓ RAG Search test complete")

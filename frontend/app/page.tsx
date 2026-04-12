"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Tag, TrendingDown, Store, User, Menu, X, ShoppingBag } from "lucide-react";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";

interface Deal {
  id: number;
  title: string;
  description?: string;
  original_price?: number;
  discount_price?: number;
  discount_percentage?: number;
  category?: string;
  store_name: string;
  image_url?: string;
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch deals from API
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // In production, this would call the FastAPI backend
      // const response = await fetch("http://localhost:8000/api/deals");
      // const data = await response.json();

      // Mock data for demo
      const mockDeals: Deal[] = [
        {
          id: 1,
          title: "Black Friday: 50% Off Laptops",
          description: "Get 50% off all laptop models from Dell, HP, Lenovo, and ASUS",
          original_price: 899.99,
          discount_price: 449.99,
          discount_percentage: 50,
          category: "Electronics",
          store_name: "Anhoch Skopje",
        },
        {
          id: 2,
          title: "Smartphone Sale: 30% Off",
          description: "All smartphones including iPhone, Samsung Galaxy, Xiaomi discounted",
          original_price: 699.99,
          discount_price: 489.99,
          discount_percentage: 30,
          category: "Electronics",
          store_name: "TechnoMarket Skopje",
        },
        {
          id: 3,
          title: "TV Black Friday: 40% Off",
          description: "4K Smart TVs 55 inch and larger with incredible discounts",
          original_price: 1200.00,
          discount_price: 720.00,
          discount_percentage: 40,
          category: "Electronics",
          store_name: "Neptun Skopje City Mall",
        },
        {
          id: 4,
          title: "Gaming Laptop Special",
          description: "High-performance gaming laptops with RTX graphics cards",
          original_price: 1999.99,
          discount_price: 1299.99,
          discount_percentage: 35,
          category: "Gaming",
          store_name: "Anhoch Skopje",
        },
        {
          id: 5,
          title: "Budget Tablet Deals",
          description: "Tablets under $300 perfect for students and families",
          original_price: 449.99,
          discount_price: 249.99,
          discount_percentage: 45,
          category: "Electronics",
          store_name: "TechnoMarket Skopje",
        },
      ];

      setDeals(mockDeals);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call the RAG search API
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">MK Black Friday</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/deals" className="text-gray-600 hover:text-gray-900 font-medium">
                Deals
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-gray-900 font-medium">
                Map Radar
              </Link>
              <Link href="/stores" className="text-gray-600 hover:text-gray-900 font-medium">
                Stores
              </Link>
              <Link href="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link href="/deals" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Deals
              </Link>
              <Link href="/map" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Map Radar
              </Link>
              <Link href="/stores" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Stores
              </Link>
              <Link href="/profile" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Profile
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find the Best Black Friday Deals
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              AI-powered deal discovery in Skopje
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for deals: 'laptop under 500', 'TV deals', etc."
                  className="flex-1 px-4 py-4 text-gray-900 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-red-200">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-red-200">Stores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">70%</div>
                <div className="text-red-200">Max Discount</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Deals</h2>
          <Link href="/deals" className="text-red-600 hover:text-red-700 font-medium">
            View All Deals →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border"
              >
                {/* Deal Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-gray-400" />
                </div>

                <div className="p-6">
                  {/* Store & Category */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Store className="h-4 w-4" />
                    <span>{deal.store_name}</span>
                    <span>•</span>
                    <span>{deal.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {deal.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-end space-x-3 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      {formatPrice(deal.discount_price || 0)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(deal.original_price || 0)}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {formatDiscount(deal.discount_percentage || 0)}
                    </span>

                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                      View Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
              <p className="text-gray-600">
                Ask naturally: "Best laptop under $500" and get personalized results
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Map Radar</h3>
              <p className="text-gray-600">
                See deals near you on an interactive map with real-time updates
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Verification</h3>
              <p className="text-gray-600">
                Show your unique QR code in stores for exclusive member discounts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MK Black Friday Radar</h3>
              <p className="text-gray-400 text-sm">
                AI-powered deal discovery platform for Black Friday shopping in Skopje, North Macedonia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/deals" className="hover:text-white">Deals</Link></li>
                <li><Link href="/map" className="hover:text-white">Map Radar</Link></li>
                <li><Link href="/stores" className="hover:text-white">Stores</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Stores</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/partner" className="hover:text-white">Partner with Us</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Store Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                Skopje, North Macedonia<br />
                support@mkblackfriday.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 MK Black Friday Radar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

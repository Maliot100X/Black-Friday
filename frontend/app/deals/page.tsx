"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Tag, TrendingDown, Store } from "lucide-react";
import { formatPrice, formatDiscount } from "@/lib/utils";

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
  end_date?: string;
}

const allDeals: Deal[] = [
  { id: 1, title: "Black Friday: 50% Off Laptops", description: "Get 50% off all laptop models from Dell, HP, Lenovo, and ASUS", original_price: 899.99, discount_price: 449.99, discount_percentage: 50, category: "Electronics", store_name: "Anhoch Skopje", end_date: "2024-11-30" },
  { id: 2, title: "Smartphone Sale: 30% Off", description: "All smartphones including iPhone, Samsung Galaxy, Xiaomi discounted", original_price: 699.99, discount_price: 489.99, discount_percentage: 30, category: "Electronics", store_name: "TechnoMarket Skopje", end_date: "2024-11-25" },
  { id: 3, title: "TV Black Friday: 40% Off", description: "4K Smart TVs 55 inch and larger with incredible discounts", original_price: 1200.00, discount_price: 720.00, discount_percentage: 40, category: "Electronics", store_name: "Neptun Skopje City Mall", end_date: "2024-11-28" },
  { id: 4, title: "Gaming Laptop Special", description: "High-performance gaming laptops with RTX graphics cards", original_price: 1999.99, discount_price: 1299.99, discount_percentage: 35, category: "Gaming", store_name: "Anhoch Skopje", end_date: "2024-12-01" },
  { id: 5, title: "Budget Tablet Deals", description: "Tablets under $300 perfect for students and families", original_price: 449.99, discount_price: 249.99, discount_percentage: 45, category: "Electronics", store_name: "TechnoMarket Skopje", end_date: "2024-11-27" },
  { id: 6, title: "Kitchen Appliances Sale", description: "Blenders, mixers, and coffee makers at discounted prices", original_price: 199.99, discount_price: 99.99, discount_percentage: 50, category: "Home", store_name: "Neptun Skopje City Mall", end_date: "2024-11-26" },
];

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minDiscount, setMinDiscount] = useState(0);

  const categories = ["all", "Electronics", "Gaming", "Home", "Supermarket"];

  const filteredDeals = allDeals.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory;
    const matchesDiscount = (deal.discount_percentage || 0) >= minDiscount;

    return matchesSearch && matchesCategory && matchesDiscount;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">All Deals</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Discount */}
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-gray-400" />
              <select
                value={minDiscount}
                onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={0}>Any Discount</option>
                <option value={20}>20%+ OFF</option>
                <option value={30}>30%+ OFF</option>
                <option value={40}>40%+ OFF</option>
                <option value={50}>50%+ OFF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          Showing {filteredDeals.length} of {allDeals.length} deals
        </p>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border"
            >
              {/* Image Placeholder */}
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

                {/* Discount Badge & Expiry */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {formatDiscount(deal.discount_percentage || 0)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Ends: {deal.end_date}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                    View Deal
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

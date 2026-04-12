"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, MapPin, Phone, ArrowLeft, Search } from "lucide-react";

interface StoreData {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  dealCount: number;
}

const stores: StoreData[] = [
  { id: 1, name: "TechnoMarket Skopje", category: "Electronics", address: "Boulevard Partizanski Odredi 20", phone: "+389 2 123 4567", dealCount: 12 },
  { id: 2, name: "Anhoch Skopje", category: "Electronics", address: "Boulevard Ilinden 100", phone: "+389 2 765 4321", dealCount: 8 },
  { id: 3, name: "Neptun Skopje City Mall", category: "Electronics", address: "Boulevard Partizanski Odredi 14", phone: "+389 2 987 6543", dealCount: 15 },
  { id: 4, name: "Super Vero Skopje", category: "Supermarket", address: "Boulevard Goce Delcev 40", phone: "+389 2 345 6789", dealCount: 5 },
  { id: 5, name: "Ramstore Mall", category: "Mall", address: "Boulevard Aleksandar Makedonski 10", phone: "+389 2 567 8901", dealCount: 25 },
];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-xl font-bold text-gray-900">Partner Stores</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <span className="text-sm text-gray-500">{store.category}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {store.address}
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {store.phone}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-500">{store.dealCount} active deals</span>
                <Link
                  href={`/stores/${store.id}`}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  View Deals
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

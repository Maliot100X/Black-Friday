"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Search, Filter, Store, ArrowLeft } from "lucide-react";

// Skopje coordinates
const SKOPJE_CENTER = {
  lat: 41.9981,
  lng: 21.4254
};

interface DealLocation {
  id: number;
  title: string;
  store_name: string;
  lat: number;
  lng: number;
  price: number;
  discount: number;
  category: string;
}

export default function MapRadar() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLibreLoaded, setMapLibreLoaded] = useState(false);
  const [radius, setRadius] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [nearbyDeals, setNearbyDeals] = useState<DealLocation[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<DealLocation | null>(null);

  // Mock deal locations in Skopje
  const dealLocations: DealLocation[] = [
    { id: 1, title: "50% Off Laptops", store_name: "Anhoch", lat: 41.9949, lng: 21.4310, price: 449.99, discount: 50, category: "Electronics" },
    { id: 2, title: "30% Off Smartphones", store_name: "TechnoMarket", lat: 41.9981, lng: 21.4254, price: 489.99, discount: 30, category: "Electronics" },
    { id: 3, title: "40% Off TVs", store_name: "Neptun", lat: 41.9865, lng: 21.4380, price: 720.00, discount: 40, category: "Electronics" },
    { id: 4, title: "Grocery Special", store_name: "Super Vero", lat: 42.0005, lng: 21.4130, price: 33.33, discount: 33, category: "Groceries" },
    { id: 5, title: "Mall Sale", store_name: "Ramstore", lat: 41.9910, lng: 21.4450, price: 60.00, discount: 70, category: "Various" },
  ];

  useEffect(() => {
    // Load MapLibre GL
    const loadMapLibre = async () => {
      try {
        const maplibregl = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        setMapLibreLoaded(true);

        if (mapContainer.current && !map.current) {
          map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
              version: 8,
              sources: {
                "osm": {
                  type: "raster",
                  tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                  tileSize: 256,
                  attribution: "© OpenStreetMap contributors"
                }
              },
              layers: [{
                id: "osm",
                type: "raster",
                source: "osm"
              }]
            },
            center: [SKOPJE_CENTER.lng, SKOPJE_CENTER.lat],
            zoom: 13
          });

          // Add markers for deals
          dealLocations.forEach((deal) => {
            const marker = new maplibregl.Marker({ color: "#DC2626" })
              .setLngLat([deal.lng, deal.lat])
              .setPopup(
                new maplibregl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 10px; max-width: 200px;">
                    <h3 style="font-weight: bold; margin-bottom: 5px;">${deal.title}</h3>
                    <p style="color: #666; font-size: 14px;">${deal.store_name}</p>
                    <p style="color: #DC2626; font-weight: bold;">$${deal.price} (${deal.discount}% OFF)</p>
                  </div>
                `)
              )
              .addTo(map.current);
          });
        }
      } catch (error) {
        console.error("Error loading MapLibre:", error);
      }
    };

    loadMapLibre();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Filter deals based on radius and category
  useEffect(() => {
    let filtered = dealLocations;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Simple distance filter (in real app, use proper geo calculation)
    setNearbyDeals(filtered);
  }, [radius, selectedCategory]);

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
              <h1 className="text-xl font-bold text-gray-900">Map Radar</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Find Deals Near You</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search location..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Radius Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Radius: {radius} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Groceries">Groceries</option>
                <option value="Various">Various</option>
              </select>
            </div>

            {/* Nearby Deals List */}
            <h3 className="font-semibold text-gray-900 mb-3">
              {nearbyDeals.length} Deals Found
            </h3>

            <div className="space-y-3">
              {nearbyDeals.map((deal) => (
                <div
                  key={deal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedDeal?.id === deal.id
                      ? "border-red-500 bg-red-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDeal(deal)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{deal.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Store className="h-4 w-4 mr-1" />
                        {deal.store_name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {deal.discount}% OFF
                    </span>
                  </div>
                  <p className="text-red-600 font-bold mt-2">${deal.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />

          {!mapLibreLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <h4 className="font-medium text-sm mb-2">Legend</h4>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Active Deal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

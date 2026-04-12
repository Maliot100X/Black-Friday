"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Search, Store, ArrowLeft, Navigation, QrCode } from "lucide-react";

// Skopje center coordinates
const SKOPJE_CENTER = {
  lat: 41.9981,
  lng: 21.4254
};

interface DealLocation {
  id: number;
  title: string;
  store_name: string;
  store_address: string;
  lat: number;
  lng: number;
  price: number;
  original_price: number;
  discount: number;
  category: string;
}

const REAL_DEAL_LOCATIONS: DealLocation[] = [
  {
    id: 1,
    title: "iPhone 15 Pro - 67.900 ден",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120",
    lat: 42.0050,
    lng: 21.3925,
    price: 67900,
    original_price: 74900,
    discount: 9.3,
    category: "electronics"
  },
  {
    id: 2,
    title: "Samsung S24 Ultra - 61.900 ден",
    store_name: "Neptun",
    store_address: "City Mall",
    lat: 42.0042,
    lng: 21.3914,
    price: 61900,
    original_price: 69900,
    discount: 11.4,
    category: "electronics"
  },
  {
    id: 3,
    title: "MacBook Air M3 - 69.900 ден",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120",
    lat: 41.9949,
    lng: 21.4310,
    price: 69900,
    original_price: 79900,
    discount: 12.5,
    category: "electronics"
  },
  {
    id: 4,
    title: "Lenovo Laptop - 27.900 ден",
    store_name: "Neptun",
    store_address: "City Mall",
    lat: 41.9981,
    lng: 21.4254,
    price: 27900,
    original_price: 32900,
    discount: 15.2,
    category: "electronics"
  },
  {
    id: 5,
    title: "Samsung TV 55\" - 44.900 ден",
    store_name: "Neptun",
    store_address: "City Mall",
    lat: 41.9865,
    lng: 21.4380,
    price: 44900,
    original_price: 54900,
    discount: 18.2,
    category: "electronics"
  },
  {
    id: 6,
    title: "PlayStation 5 - 29.900 ден",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26",
    lat: 41.9925,
    lng: 21.4230,
    price: 29900,
    original_price: 32900,
    discount: 9.1,
    category: "gaming"
  },
  {
    id: 7,
    title: "AirPods Pro 2 - 11.900 ден",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120",
    lat: 42.0005,
    lng: 21.4130,
    price: 11900,
    original_price: 14900,
    discount: 20.1,
    category: "electronics"
  },
  {
    id: 8,
    title: "Coca-Cola 4-pack - 279 ден",
    store_name: "Vero",
    store_address: "Илинденска",
    lat: 41.9850,
    lng: 21.4550,
    price: 279,
    original_price: 389,
    discount: 28.3,
    category: "food"
  },
  {
    id: 9,
    title: "Xiaomi 14 - 36.900 ден",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26",
    lat: 41.9960,
    lng: 21.4430,
    price: 36900,
    original_price: 42900,
    discount: 14.0,
    category: "electronics"
  },
  {
    id: 10,
    title: "Winter Jacket - 2.490 ден",
    store_name: "Ramos",
    store_address: "Кеј 13 Ноември",
    lat: 41.9940,
    lng: 21.4300,
    price: 2490,
    original_price: 4490,
    discount: 44.5,
    category: "fashion"
  }
];

function formatMKD(price: number): string {
  return `${price.toLocaleString('mk-MK')} ден`;
}

export default function MapRadar() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLibreLoaded, setMapLibreLoaded] = useState(false);
  const [radius, setRadius] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [nearbyDeals, setNearbyDeals] = useState<DealLocation[]>(REAL_DEAL_LOCATIONS);
  const [selectedDeal, setSelectedDeal] = useState<DealLocation | null>(null);

  useEffect(() => {
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
                  attribution: "© OpenStreetMap"
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
          REAL_DEAL_LOCATIONS.forEach((deal) => {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.innerHTML = `<div style="
              background: #DC2626;
              color: white;
              padding: 4px 8px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              white-space: nowrap;
            ">${deal.discount}%</div>`;

            new maplibregl.Marker(el)
              .setLngLat([deal.lng, deal.lat])
              .setPopup(
                new maplibregl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
                    <h3 style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">${deal.title}</h3>
                    <p style="color: #666; font-size: 13px; margin-bottom: 5px;">${deal.store_name}</p>
                    <p style="color: #666; font-size: 12px; margin-bottom: 8px;">${deal.store_address}</p>
                    <p style="color: #DC2626; font-weight: bold; font-size: 16px;">${formatMKD(deal.price)}</p>
                    <p style="color: #999; font-size: 12px; text-decoration: line-through;">${formatMKD(deal.original_price)}</p>
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

  // Filter deals
  useEffect(() => {
    let filtered = REAL_DEAL_LOCATIONS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    setNearbyDeals(filtered);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад
              </Link>
              <h1 className="text-xl font-bold text-gray-900">🗺️ Мапа со Понуди</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Понуди во близина</h2>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Категорија</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Сите категории</option>
                <option value="electronics">Електроника</option>
                <option value="gaming">Гејминг</option>
                <option value="food">Храна</option>
                <option value="fashion">Мода</option>
              </select>
            </div>

            {/* Radius Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Радиус: {radius} км
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

            {/* Deals List */}
            <h3 className="font-bold text-gray-900 mb-3">{nearbyDeals.length} Понуди</h3>

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
                      <h4 className="font-bold text-gray-900 text-sm">{deal.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Store className="h-3 w-3 mr-1" />
                        {deal.store_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{deal.store_address}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                      {deal.discount}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-red-600 font-bold">{formatMKD(deal.price)}</p>
                    <p className="text-gray-400 text-xs line-through">{formatMKD(deal.original_price)}</p>
                  </div>
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
                <p className="mt-2 text-gray-600">Вчитување мапа...</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <h4 className="font-bold text-sm mb-2">Легенда</h4>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Активна понуда</span>
            </div>
          </div>

          {/* QR Button */}
          <div className="absolute top-4 right-4">
            <Link
              href="/stores"
              className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium hover:bg-gray-50"
            >
              <QrCode className="h-4 w-4" />
              <span>QR Кодови</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

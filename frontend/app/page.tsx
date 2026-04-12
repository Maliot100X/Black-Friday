"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Tag, TrendingDown, Store, User, Menu, X, ShoppingBag, Smartphone, Laptop, Tv, Gamepad2, Headphones } from "lucide-react";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";
import FloatingAIChatbot from "@/components/FloatingAIChatbot";

interface Deal {
  id: number;
  title: string;
  description?: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  category: string;
  subcategory?: string;
  store_name: string;
  store_address?: string;
  image_url?: string;
  product_url?: string;
  is_trending?: boolean;
}

// Real North Macedonia stores
const STORES = [
  { id: 1, name: "Anhoch", address: "Ѓорче Петров 120, Скопје", category: "electronics" },
  { id: 2, name: "Neptun", address: "City Mall, Скопје", category: "electronics" },
  { id: 3, name: "TechnoMarket", address: "Александар Македонски 50, Скопје", category: "electronics" },
  { id: 4, name: "Setec", address: "Никола Вапцаров 26, Скопје", category: "electronics" },
  { id: 5, name: "Digital City", address: "Партизански Одреди 14, Скопје", category: "electronics" },
  { id: 6, name: "Vero", address: "Илинденска, Скопје", category: "supermarket" },
  { id: 7, name: "Tinex", address: "Јане Сандански 100, Скопје", category: "supermarket" },
  { id: 8, name: "Zito Market", address: "Орце Николов 150, Скопје", category: "supermarket" },
];

// Real deals with MKD prices
const REAL_DEALS: Deal[] = [
  {
    id: 1,
    title: "iPhone 15 Pro 128GB",
    description: "Најновиот iPhone со Titanium дизајн, A17 Pro чип, и 48MP камера.",
    original_price: 74900,
    discount_price: 67900,
    discount_percentage: 9.3,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692895703312",
    is_trending: true,
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra 256GB",
    description: "200MP камера, S Pen, AI функции. Најдобриот Android телефон.",
    original_price: 69900,
    discount_price: 61900,
    discount_percentage: 11.4,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    image_url: "https://images.samsung.com/is/image/samsung/p6pim/mk/2401/gallery/mk-galaxy-s24-s928-sm-s928bztgeuc-539323636?$624_624_PNG$",
    is_trending: true,
  },
  {
    id: 3,
    title: "Apple MacBook Air M3 13\"",
    description: "Последен модел MacBook со M3 чип. 256GB SSD, 8GB RAM.",
    original_price: 79900,
    discount_price: 69900,
    discount_percentage: 12.5,
    category: "electronics",
    subcategory: "laptops",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665",
    is_trending: true,
  },
  {
    id: 4,
    title: "PlayStation 5 Slim 1TB",
    description: "Новата Slim верзија со 1TB SSD. Вклучува контролер. Редок на пазарот!",
    original_price: 32900,
    discount_price: 29900,
    discount_percentage: 9.1,
    category: "gaming",
    subcategory: "consoles",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26, Скопје",
    image_url: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-image-block-01-en-16nov23?$facebook$",
    is_trending: true,
  },
  {
    id: 5,
    title: "Samsung 55\" Neo QLED 4K",
    description: "QN90C серија со Quantum Matrix Technology. Неверојатна слика.",
    original_price: 54900,
    discount_price: 44900,
    discount_percentage: 18.2,
    category: "electronics",
    subcategory: "tvs",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    image_url: "https://images.samsung.com/is/image/samsung/p6pim/mk/qn55qn90cafxkn/gallery/mk-qled-qn90c-qn55qn90cafxkn-538720865?$624_624_PNG$",
    is_trending: true,
  },
  {
    id: 6,
    title: "AirPods Pro 2nd Gen",
    description: "Активно намалување на бучава, Transparency mode, Spatial Audio.",
    original_price: 14900,
    discount_price: 11900,
    discount_percentage: 20.1,
    category: "electronics",
    subcategory: "audio",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FV1?wid=976&hei=1000&fmt=jpeg&qlt=90&.v=1725494508823",
    is_trending: true,
  },
  {
    id: 7,
    title: "Coca-Cola 2.25L 4-pack",
    description: "4 шишиња Coca-Cola од 2.25L. Одлична понуда за семејни собири.",
    original_price: 389,
    discount_price: 279,
    discount_percentage: 28.3,
    category: "food",
    subcategory: "beverages",
    store_name: "Vero",
    store_address: "Илинденска, Скопје",
    is_trending: true,
  },
  {
    id: 8,
    title: "Xiaomi 14 256GB",
    description: "Snapdragon 8 Gen 3, Leica камера, 120Hz OLED. Одличен избор!",
    original_price: 42900,
    discount_price: 36900,
    discount_percentage: 14.0,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26, Скопје",
    image_url: "https://i02.appmifile.com/313_operatorx_operatorx_opx/13/12/2023/fab3313ad9844ad237e5763a964b3b1f.png",
    is_trending: true,
  },
];

function formatMKD(price: number): string {
  return new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency: "MKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace("MKD", "ден");
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load deals
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // In production, this would call the FastAPI backend
      // const response = await fetch("http://localhost:8000/api/deals");
      // const data = await response.json();

      // Using real MK deals for now
      setDeals(REAL_DEALS);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter deals by search query
    const filtered = REAL_DEALS.filter(
      (deal) =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.store_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDeals(filtered);
  };

  const filteredDeals = activeCategory === "all"
    ? deals
    : deals.filter((d) => d.category === activeCategory);

  const categories = [
    { id: "all", name: "Сите / All", icon: Tag },
    { id: "electronics", name: "Електроника", icon: Laptop },
    { id: "smartphones", name: "Телефони", icon: Smartphone },
    { id: "gaming", name: "Гејминг", icon: Gamepad2 },
    { id: "audio", name: "Аудио", icon: Headphones },
    { id: "food", name: "Храна", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-red-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">MK Black Friday</span>
                  <span className="block text-xs text-red-600 font-medium">Radar</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/deals" className="text-gray-600 hover:text-red-600 font-medium transition">
                Понуди / Deals
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-red-600 font-medium transition">
                Мапа / Map
              </Link>
              <Link href="/stores" className="text-gray-600 hover:text-red-600 font-medium transition">
                Продавници / Stores
              </Link>
              {user ? (
                <Link href="/profile" className="flex items-center space-x-2 text-red-600 font-medium">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user.first_name || user.email.split("@")[0]}</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-600 hover:text-red-600 font-medium transition">
                    Најава / Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Регистрација
                  </Link>
                </div>
              )}
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
                Понуди / Deals
              </Link>
              <Link href="/map" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Мапа / Map
              </Link>
              <Link href="/stores" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                Продавници / Stores
              </Link>
              {user ? (
                <Link href="/profile" className="block px-3 py-2 text-red-600 hover:bg-red-50 rounded font-medium">
                  Мој Профил / Profile
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                    Најава / Login
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-red-600 hover:bg-red-50 rounded font-medium">
                    Регистрација / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Најдобри Понуди во<br />Северна Македонија 🇲🇰
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              AI-owered за наоѓање на попусти во Скопје и Тетово
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
                <Search className="h-6 w-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Пребарувај: 'iPhone', 'laptop', 'TV'..."
                  className="flex-1 px-4 py-4 text-gray-900 focus:outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                >
                  Барај
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-12 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold">{REAL_DEALS.length}+</div>
                <div className="text-red-200">Активни Понуди</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{STORES.length}+</div>
                <div className="text-red-200">Продавници</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">до 44%</div>
                <div className="text-red-200">Попуст</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Топ Понуди / Top Deals</h2>
            <p className="text-gray-500">Реални понуди со цени во денари (MKD)</p>
          </div>
          <Link href="/deals" className="text-red-600 hover:text-red-700 font-medium flex items-center">
            Сите понуди →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Вчитување понуди...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border group"
              >
                {/* Deal Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {deal.image_url ? (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Tag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {deal.is_trending && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔥 Трендинг
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{Math.round(deal.discount_percentage)}%
                  </div>
                </div>

                <div className="p-5">
                  {/* Store Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Store className="h-4 w-4 text-red-600" />
                    <span className="font-medium">{deal.store_name}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {deal.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Location */}
                  {deal.store_address && (
                    <div className="flex items-start space-x-1 text-xs text-gray-500 mb-3">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{deal.store_address}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-end space-x-3 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      {formatMKD(deal.discount_price)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatMKD(deal.original_price)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center space-x-2">
                    <span>Види Понуда</span>
                    <TrendingDown className="h-4 w-4" />
                  </button>
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
            Како Функционира
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Пребарувај Понуди</h3>
              <p className="text-gray-600">
                Најди ги најдобрите попусти во Скопје и Тетово со AI пребарување
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Мапа со Понуди</h3>
              <p className="text-gray-600">
                Види каде се наоѓаат продавниците на интерактивна мапа
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Членство</h3>
              <p className="text-gray-600">
                Скенирај QR код за ексклузивни попусти во продавниците
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Преземија ја Апликацијата</h2>
              <p className="text-gray-400 mb-6 max-w-lg">
                Инсталирај ја мобилната апликација за да добиваш известувања за нови понуди и
                да скенираш QR кодови во продавниците.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Maliot100X/Black-Friday/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center space-x-2"
                >
                  <Smartphone className="h-5 w-5" />
                  <span>Преземи APK</span>
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">4.8★</div>
                <div className="text-gray-400">Рејтинг</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">1000+</div>
                <div className="text-gray-400">Превземања</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-6 w-6 text-red-600" />
                <span className="text-lg font-bold">MK Black Friday Radar</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered платформа за наоѓање на најдобри понуди во Северна Македонија.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продавници</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Anhoch - Скопје</li>
                <li>Neptun - City Mall</li>
                <li>TechnoMarket</li>
                <li>Setec</li>
                <li>Digital City</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Линкови</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/deals" className="hover:text-white">Понуди</Link></li>
                <li><Link href="/map" className="hover:text-white">Мапа</Link></li>
                <li><Link href="/stores" className="hover:text-white">Продавници</Link></li>
                <li><Link href="/login" className="hover:text-white">Најава</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакт</h4>
              <p className="text-sm text-gray-400">
                Скопје, Северна Македонија<br />
                support@mkblackfriday.mk
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 MK Black Friday Radar. Сите права се задржани.
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <FloatingAIChatbot />
    </div>
  );
}

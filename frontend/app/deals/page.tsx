"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Tag, TrendingDown, Store, MapPin, Smartphone, Laptop, Tv, Gamepad2, Headphones, ShoppingBag, Coffee } from "lucide-react";

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
  is_trending?: boolean;
  valid_until?: string;
}

// Real North Macedonia stores with addresses
const STORES = [
  { id: 1, name: "Anhoch", address: "Ѓорче Петров 120, Скопје", phone: "+389 2 310 3100", category: "electronics" },
  { id: 2, name: "Neptun", address: "City Mall, Скопје", phone: "+389 2 321 9000", category: "electronics" },
  { id: 3, name: "TechnoMarket", address: "Александар Македонски 50, Скопје", phone: "+389 2 329 0320", category: "electronics" },
  { id: 4, name: "Setec", address: "Никола Вапцаров 26, Скопје", phone: "+389 2 322 5123", category: "electronics" },
  { id: 5, name: "Digital City", address: "Партизански Одреди 14, Скопје", phone: "+389 2 321 7050", category: "electronics" },
  { id: 6, name: "Vero", address: "Илинденска, Скопје", phone: "+389 2 329 0900", category: "supermarket" },
  { id: 7, name: "Tinex", address: "Јане Сандански 100, Скопје", phone: "+389 2 322 8800", category: "supermarket" },
  { id: 8, name: "Zito Market", address: "Орце Николов 150, Скопје", phone: "+389 2 310 9800", category: "supermarket" },
  { id: 9, name: "KAM Market", address: "Кочо Рацин, Тетово", phone: "+389 44 335 500", category: "supermarket" },
  { id: 10, name: "Ramos", address: "Кеј 13 Ноември, Скопје", phone: "+389 2 321 6000", category: "fashion" },
];

// Real deals with MKD prices from North Macedonia stores
const REAL_DEALS: Deal[] = [
  {
    id: 1,
    title: "Apple MacBook Air M3 13\"",
    description: "Последен модел MacBook со M3 чип. 256GB SSD, 8GB RAM. Одличен за работа и студии.",
    original_price: 79900,
    discount_price: 69900,
    discount_percentage: 12.5,
    category: "electronics",
    subcategory: "laptops",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 2,
    title: "Lenovo IdeaPad 3 15\"",
    description: "Intel Core i5, 8GB RAM, 512GB SSD. Совршен за секојдневна употреба.",
    original_price: 32900,
    discount_price: 27900,
    discount_percentage: 15.2,
    category: "electronics",
    subcategory: "laptops",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 3,
    title: "ASUS VivoBook 15 OLED",
    description: "AMD Ryzen 5, 16GB RAM, 512GB SSD. Неверојатен OLED дисплеј.",
    original_price: 38900,
    discount_price: 32900,
    discount_percentage: 15.4,
    category: "electronics",
    subcategory: "laptops",
    store_name: "TechnoMarket",
    store_address: "Александар Македонски 50, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 4,
    title: "iPhone 15 Pro 128GB",
    description: "Најновиот iPhone со Titanium дизајн, A17 Pro чип, 48MP камера.",
    original_price: 74900,
    discount_price: 67900,
    discount_percentage: 9.3,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 5,
    title: "Samsung Galaxy S24 Ultra 256GB",
    description: "200MP камера, S Pen, AI функции. Најдобриот Android телефон.",
    original_price: 69900,
    discount_price: 61900,
    discount_percentage: 11.4,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 6,
    title: "Samsung 55\" Neo QLED 4K",
    description: "QN90C серија со Quantum Matrix Technology. Неверојатна слика.",
    original_price: 54900,
    discount_price: 44900,
    discount_percentage: 18.2,
    category: "electronics",
    subcategory: "tvs",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 7,
    title: "LG 65\" OLED evo C4",
    description: "Самосветлечки OLED пиксели. 120Hz за гејминг. Совршена црна боја.",
    original_price: 89900,
    discount_price: 74900,
    discount_percentage: 16.7,
    category: "electronics",
    subcategory: "tvs",
    store_name: "TechnoMarket",
    store_address: "Александар Македонски 50, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 8,
    title: "PlayStation 5 Slim 1TB",
    description: "Новата Slim верзија со 1TB SSD. Вклучува контролер. Редок на пазарот!",
    original_price: 32900,
    discount_price: 29900,
    discount_percentage: 9.1,
    category: "gaming",
    subcategory: "consoles",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 9,
    title: "Xbox Series X",
    description: "1TB SSD, 12 TFLOPS графика, 4K gaming. Најдобрата Xbox конзола.",
    original_price: 31900,
    discount_price: 28900,
    discount_percentage: 9.4,
    category: "gaming",
    subcategory: "consoles",
    store_name: "Digital City",
    store_address: "Партизански Одреди 14, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 10,
    title: "Nintendo Switch OLED",
    description: "7\" OLED екран, 64GB меморија. За играње дома или во движење.",
    original_price: 21900,
    discount_price: 18900,
    discount_percentage: 13.7,
    category: "gaming",
    subcategory: "consoles",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 11,
    title: "Dyson V15 Detect Absolute",
    description: "Безжичен правосмукалка со ласер. 60 минути работа.",
    original_price: 42900,
    discount_price: 35900,
    discount_percentage: 16.3,
    category: "home",
    subcategory: "appliances",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: false,
    valid_until: "2024-12-31",
  },
  {
    id: 12,
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
    valid_until: "2024-11-30",
  },
  {
    id: 13,
    title: "Nescafe Gold 200g",
    description: "Инстант кафе премиум квалитет. Богат вкус и арома.",
    original_price: 459,
    discount_price: 329,
    discount_percentage: 28.3,
    category: "food",
    subcategory: "coffee",
    store_name: "Tinex",
    store_address: "Јане Сандански 100, Скопје",
    is_trending: true,
    valid_until: "2024-11-30",
  },
  {
    id: 14,
    title: "Milka Chocolate 300g Mix",
    description: "4 различни вкусови Milka чоколада. Одлично за подарок.",
    original_price: 599,
    discount_price: 399,
    discount_percentage: 33.4,
    category: "food",
    subcategory: "chocolate",
    store_name: "Zito Market",
    store_address: "Орце Николов 150, Скопје",
    is_trending: true,
    valid_until: "2024-11-30",
  },
  {
    id: 15,
    title: "Zimska Jakna Ramos Collection",
    description: "Топла зимска јакна со вештачко крзно. 5 бои достапни.",
    original_price: 4490,
    discount_price: 2490,
    discount_percentage: 44.5,
    category: "fashion",
    subcategory: "clothing",
    store_name: "Ramos",
    store_address: "Кеј 13 Ноември, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 16,
    title: "iPad Air M2 11\" 128GB",
    description: "M2 чип, Liquid Retina дисплеј, Touch ID. За работа и креативност.",
    original_price: 45900,
    discount_price: 39900,
    discount_percentage: 13.1,
    category: "electronics",
    subcategory: "tablets",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 17,
    title: "Samsung Galaxy Tab S9+ 256GB",
    description: "12.4\" AMOLED, Snapdragon 8 Gen 2, со S Pen вклучен.",
    original_price: 42900,
    discount_price: 36900,
    discount_percentage: 14.0,
    category: "electronics",
    subcategory: "tablets",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 18,
    title: "AirPods Pro 2nd Gen",
    description: "Активно намалување на бучава, Spatial Audio, MagSafe.",
    original_price: 14900,
    discount_price: 11900,
    discount_percentage: 20.1,
    category: "electronics",
    subcategory: "audio",
    store_name: "Anhoch",
    store_address: "Ѓорче Петров 120, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 19,
    title: "Sony WH-1000XM5",
    description: "Најдобрите бучава-намалувачки слушалки. 30 часа батерија.",
    original_price: 21900,
    discount_price: 17900,
    discount_percentage: 18.3,
    category: "electronics",
    subcategory: "audio",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 20,
    title: "Xiaomi 14 256GB",
    description: "Snapdragon 8 Gen 3, Leica камера, 120Hz OLED. Одличен избор!",
    original_price: 42900,
    discount_price: 36900,
    discount_percentage: 14.0,
    category: "electronics",
    subcategory: "smartphones",
    store_name: "Setec",
    store_address: "Никола Вапцаров 26, Скопје",
    is_trending: true,
    valid_until: "2024-12-31",
  },
  {
    id: 21,
    title: "Samsung Family Hub Refrigerator",
    description: "Side-by-side фрижидер со 21.5\" екран. Smart функции.",
    original_price: 89900,
    discount_price: 74900,
    discount_percentage: 16.7,
    category: "home",
    subcategory: "appliances",
    store_name: "Neptun",
    store_address: "City Mall, Скопје",
    is_trending: false,
    valid_until: "2024-12-31",
  },
];

function formatMKD(price: number): string {
  return `${price.toLocaleString('mk-MK')} ден`;
}

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [minDiscount, setMinDiscount] = useState(0);

  const categories = [
    { id: "all", name: "Сите / All", icon: Tag },
    { id: "electronics", name: "Електроника", icon: Laptop },
    { id: "smartphones", name: "Телефони", icon: Smartphone },
    { id: "gaming", name: "Гејминг", icon: Gamepad2 },
    { id: "tvs", name: "Телевизори", icon: Tv },
    { id: "audio", name: "Аудио", icon: Headphones },
    { id: "tablets", name: "Таблети", icon: ShoppingBag },
    { id: "home", name: "Домаќинство", icon: ShoppingBag },
    { id: "food", name: "Храна", icon: Coffee },
    { id: "fashion", name: "Мода", icon: Tag },
  ];

  const filteredDeals = REAL_DEALS.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.store_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory || deal.subcategory === selectedCategory;
    const matchesStore = selectedStore === "all" || deal.store_name.toLowerCase().includes(selectedStore.toLowerCase());
    const matchesDiscount = (deal.discount_percentage || 0) >= minDiscount;

    return matchesSearch && matchesCategory && matchesStore && matchesDiscount;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад / Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Сите Понуди / All Deals</h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredDeals.length} понуди / deals
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пребарувај..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="flex-1 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Filter */}
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-gray-400" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="flex-1 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Сите продавници</option>
                {STORES.map((store) => (
                  <option key={store.id} value={store.name.toLowerCase()}>
                    {store.name}
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
                className="flex-1 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={0}>Било кој попуст</option>
                <option value={10}>10%+ попуст</option>
                <option value={20}>20%+ попуст</option>
                <option value={30}>30%+ попуст</option>
                <option value={40}>40%+ попуст</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
                <Tag className="h-16 w-16 text-red-300" />
                {deal.is_trending && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🔥 Трендинг
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {deal.discount_percentage}% OFF
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Store Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">{deal.store_name}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {deal.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {deal.description}
                </p>

                {/* Address */}
                <div className="flex items-start space-x-2 text-xs text-gray-500 mb-4">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{deal.store_address}</span>
                </div>

                {/* Price */}
                <div className="flex items-end space-x-3 mb-4">
                  <span className="text-2xl font-bold text-red-600">
                    {formatMKD(deal.discount_price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatMKD(deal.original_price)}
                  </span>
                </div>

                {/* Valid Until */}
                <p className="text-xs text-gray-500 mb-4">
                  Важи до: {deal.valid_until}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-bold">
                    Види Понуда
                  </button>
                  <button className="px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                    💾
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-16">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Нема понуди</h3>
            <p className="text-gray-600">Пробај други филтри</p>
          </div>
        )}
      </main>
    </div>
  );
}

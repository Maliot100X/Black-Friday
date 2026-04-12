"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, MapPin, Phone, ArrowLeft, Search, QrCode, ExternalLink, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface StoreData {
  id: number;
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  website: string;
  dealCount: number;
  qrCode: string;
  discount: string;
  description: string;
  workingHours: string;
}

const REAL_STORES: StoreData[] = [
  {
    id: 1,
    name: "Anhoch",
    category: "electronics",
    address: "Бул. Ѓорче Петров 120",
    city: "Скопје",
    phone: "+389 2 310 3100",
    latitude: 42.0050,
    longitude: 21.3925,
    website: "https://www.anhoch.com",
    dealCount: 5,
    qrCode: "MKBF-STORE-ANHOCH-001",
    discount: "5% дополнително",
    description: "Apple Premium Reseller. Голем избор на лаптопи, телефони и додатоци.",
    workingHours: "Пон-Пет: 09:00-20:00, Саб: 09:00-16:00",
  },
  {
    id: 2,
    name: "Neptun",
    category: "electronics",
    address: "City Mall",
    city: "Скопје",
    phone: "+389 2 321 9000",
    latitude: 42.0042,
    longitude: 21.3914,
    website: "https://www.neptun.mk",
    dealCount: 6,
    qrCode: "MKBF-STORE-NEPTUN-002",
    discount: "3% дополнително",
    description: "Најголема понуда на ТВ-ови, фрижидери и кујнски апарати.",
    workingHours: "Пон-Нед: 10:00-22:00",
  },
  {
    id: 3,
    name: "TechnoMarket",
    category: "electronics",
    address: "Бул. Александар Македонски 50",
    city: "Скопје",
    phone: "+389 2 329 0320",
    latitude: 41.9965,
    longitude: 21.4314,
    website: "https://www.technomarket.mk",
    dealCount: 3,
    qrCode: "MKBF-STORE-TECHNO-003",
    discount: "7% дополнително",
    description: "Компјутери, компоненти, гејминг опрема. Техничка поддршка.",
    workingHours: "Пон-Пет: 09:00-19:00, Саб: 09:00-15:00",
  },
  {
    id: 4,
    name: "Setec",
    category: "electronics",
    address: "Никола Вапцаров 26",
    city: "Скопје",
    phone: "+389 2 322 5123",
    latitude: 41.9925,
    longitude: 21.4230,
    website: "https://www.setec.mk",
    dealCount: 3,
    qrCode: "MKBF-STORE-SETEC-004",
    discount: "4% дополнително",
    description: "Телефони, таблети, конзоли. PlayStation и Xbox.",
    workingHours: "Пон-Пет: 09:00-20:00, Саб: 09:00-16:00",
  },
  {
    id: 5,
    name: "Digital City",
    category: "electronics",
    address: "Бул. Партизански Одреди 14",
    city: "Скопје",
    phone: "+389 2 321 7050",
    latitude: 41.9960,
    longitude: 21.4430,
    website: "https://www.digitalcity.mk",
    dealCount: 2,
    qrCode: "MKBF-STORE-DIGITAL-005",
    discount: "6% дополнително",
    description: "Гејминг опрема, компјутери, монитори. Гејмер зона.",
    workingHours: "Пон-Пет: 10:00-20:00, Саб: 10:00-16:00",
  },
  {
    id: 6,
    name: "Vero",
    category: "supermarket",
    address: "Бул. Илинденска",
    city: "Скопје",
    phone: "+389 2 329 0900",
    latitude: 41.9850,
    longitude: 21.4550,
    website: "https://www.vero.com.mk",
    dealCount: 2,
    qrCode: "MKBF-STORE-VERO-006",
    discount: "10% на сè",
    description: "Супермаркет со голем избор на храна и пијалоци.",
    workingHours: "Пон-Нед: 08:00-22:00",
  },
  {
    id: 7,
    name: "Tinex",
    category: "supermarket",
    address: "Јане Сандански 100",
    city: "Скопје",
    phone: "+389 2 322 8800",
    latitude: 41.9810,
    longitude: 21.4650,
    website: "https://www.tinex.com.mk",
    dealCount: 2,
    qrCode: "MKBF-STORE-TINEX-007",
    discount: "8% на сè",
    description: "Квалитетни производи, свежа храна, кафе.",
    workingHours: "Пон-Нед: 07:00-22:00",
  },
  {
    id: 8,
    name: "Zito Market",
    category: "supermarket",
    address: "Орце Николов 150",
    city: "Скопје",
    phone: "+389 2 310 9800",
    latitude: 41.9980,
    longitude: 21.4180,
    website: "https://www.zito.com.mk",
    dealCount: 2,
    qrCode: "MKBF-STORE-ZITO-008",
    discount: "5% на сè",
    description: "Македонски производи, традиционални вкусови.",
    workingHours: "Пон-Саб: 07:00-21:00, Нед: 08:00-20:00",
  },
  {
    id: 9,
    name: "KAM Market",
    category: "supermarket",
    address: "Кочо Рацин",
    city: "Тетово",
    phone: "+389 44 335 500",
    latitude: 42.0092,
    longitude: 20.9700,
    website: "https://www.kam.com.mk",
    dealCount: 1,
    qrCode: "MKBF-STORE-KAM-009",
    discount: "10% на сè",
    description: "Супермаркет во Тетово. Добри цени, квалитет.",
    workingHours: "Пон-Нед: 08:00-22:00",
  },
  {
    id: 10,
    name: "Ramos",
    category: "fashion",
    address: "Кеј 13 Ноември",
    city: "Скопје",
    phone: "+389 2 321 6000",
    latitude: 41.9940,
    longitude: 21.4300,
    website: "https://www.ramos.mk",
    dealCount: 1,
    qrCode: "MKBF-STORE-RAMOS-010",
    discount: "15% на цела колекција",
    description: "Модна облека за сите возрасти. Трендовски парчиња.",
    workingHours: "Пон-Саб: 10:00-20:00, Нед: 10:00-16:00",
  },
];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const filteredStores = REAL_STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openQRModal = (store: StoreData) => {
    setSelectedStore(store);
    setShowQRModal(true);
  };

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
              <h1 className="text-xl font-bold text-gray-900">Партнер Продавници</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-3">
            <QrCode className="h-8 w-8" />
            <div>
              <h2 className="text-lg font-bold">Скенирај QR код за попуст!</h2>
              <p className="text-red-100">Скенирај го QR кодот на продавницата и добиј дополнителен попуст преку апликацијата.</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Барај продавници..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Store className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                  <span className="text-sm text-gray-500 capitalize">{store.category}</span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm text-gray-600 mb-4">
                <p className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>{store.address}, {store.city}</span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  <span>{store.phone}</span>
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{store.description}</p>

              {/* Working Hours */}
              <p className="text-xs text-gray-500 mb-4">{store.workingHours}</p>

              {/* Discount Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-green-600" />
                  {store.discount} со QR код
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openQRModal(store)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-bold flex items-center justify-center"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Код
                </button>
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* QR Modal */}
      {showQRModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedStore.name}</h2>
              <p className="text-gray-600 mb-6">Скенирај го овој QR код во продавницата за попуст</p>

              <div className="bg-white p-4 border-4 border-red-600 rounded-xl inline-block mb-6">
                <QRCodeSVG value={selectedStore.qrCode} size={200} />
              </div>

              <p className="text-sm text-gray-500 mb-2">Код: {selectedStore.qrCode}</p>
              <p className="text-lg font-bold text-red-600 mb-6">{selectedStore.discount}</p>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

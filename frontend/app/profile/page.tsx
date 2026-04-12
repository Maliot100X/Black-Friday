"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, QrCode, ShoppingBag, MapPin, Bell } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2024-01-15",
    qrCode: "MKBF-USER-12345-67890",
    savedDeals: 12,
    purchases: 5,
    notifications: true,
  };

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
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {user.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{user.savedDeals}</div>
            <div className="text-sm text-gray-600">Saved Deals</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{user.purchases}</div>
            <div className="text-sm text-gray-600">Purchases</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">Gold</div>
            <div className="text-sm text-gray-600">Member Status</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            {["overview", "qr-code", "saved-deals", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                      <span>Purchased Laptop Deal at Anhoch</span>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>Visited TechnoMarket Store</span>
                    </div>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "qr-code" && (
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-4">Your Member QR Code</h3>
                <p className="text-gray-600 mb-6">
                  Show this QR code at partner stores to get exclusive member discounts
                </p>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCodeSVG value={user.qrCode} size={200} />
                </div>
                <p className="text-sm text-gray-500 mt-4">{user.qrCode}</p>
              </div>
            )}

            {activeTab === "saved-deals" && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Saved Deals</h3>
                <p className="text-gray-600">You have {user.savedDeals} saved deals</p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Settings</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span>Push Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={user.notifications} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

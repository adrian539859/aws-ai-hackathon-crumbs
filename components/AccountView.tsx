"use client";

import {
  IconUser,
  IconStar,
  IconCoin,
  IconSettings,
  IconHistory,
} from "@tabler/icons-react";

export default function AccountView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <IconUser className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome Back!
              </h2>
              <p className="text-gray-600">Travel enthusiast</p>
            </div>
          </div>
        </div>

        {/* Credits & Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <IconCoin className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Credits</p>
                <p className="text-xl font-semibold text-gray-900">1,250</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <IconStar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <IconHistory className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Review History</p>
                <p className="text-sm text-gray-600">View all your reviews</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <IconSettings className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Manage your preferences</p>
              </div>
            </button>
          </div>
        </div>

        {/* Credit System Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Earn More Credits!
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Write reviews for Hong Kong attractions to earn credits. Use credits
            for exclusive rewards and discounts.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Write a review</span>
              <span className="font-medium text-yellow-600">+50 credits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Add photos</span>
              <span className="font-medium text-yellow-600">+25 credits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Detailed review (100+ words)
              </span>
              <span className="font-medium text-yellow-600">+25 credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

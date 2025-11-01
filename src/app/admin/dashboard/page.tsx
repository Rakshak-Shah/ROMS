'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboard();
    }
  }, [user, loading, router]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/menu')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-blue-600 text-2xl mb-2">🍽️</div>
            <h3 className="font-semibold text-gray-900">Menu Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage menu items</p>
          </button>

          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-green-600 text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-900">Orders</h3>
            <p className="text-sm text-gray-600 mt-1">View & manage orders</p>
          </button>

          <button
            onClick={() => router.push('/admin/reservations')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-purple-600 text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900">Reservations</h3>
            <p className="text-sm text-gray-600 mt-1">Manage table bookings</p>
          </button>

          <button
            onClick={() => router.push('/admin/inventory')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-orange-600 text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900">Inventory</h3>
            <p className="text-sm text-gray-600 mt-1">Track stock levels</p>
          </button>

          <button
            onClick={() => router.push('/admin/staff')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-red-600 text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">Staff</h3>
            <p className="text-sm text-gray-600 mt-1">Manage employees</p>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {dashboardData?.ordersCount || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {dashboardData?.usersCount || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {dashboardData?.reviewsCount || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/menu')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Add New Menu Item</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new dish for your menu</p>
            </button>

            <button
              onClick={() => router.push('/admin/orders')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">View Pending Orders</h3>
              <p className="text-sm text-gray-600 mt-1">Check orders that need attention</p>
            </button>

            <button
              onClick={() => router.push('/admin/reservations')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Confirm Reservations</h3>
              <p className="text-sm text-gray-600 mt-1">Manage pending table bookings</p>
            </button>

            <button
              onClick={() => router.push('/admin/inventory')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Check Low Stock Items</h3>
              <p className="text-sm text-gray-600 mt-1">View items that need restocking</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


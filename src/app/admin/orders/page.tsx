'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (user) loadOrders();
  }, [user, loading, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await adminService.deleteOrder(orderId);
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">View and manage customer orders</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded capitalize whitespace-nowrap ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                  <p className="text-gray-600 text-sm">{order.customerInfo?.name || 'Guest'}</p>
                  <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                      className="bg-green-50 text-green-600 px-4 py-2 rounded hover:bg-green-100"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'preparing')}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'ready')}
                    className="bg-purple-50 text-purple-600 px-4 py-2 rounded hover:bg-purple-100"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && order.orderType === 'delivery' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'out-for-delivery')}
                    className="bg-orange-50 text-orange-600 px-4 py-2 rounded hover:bg-orange-100"
                  >
                    Out for Delivery
                  </button>
                )}
                {(order.status === 'ready' || order.status === 'out-for-delivery') && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded hover:bg-green-100"
                  >
                    Mark Delivered
                  </button>
                )}
                <button
                  onClick={() => handleDelete(order._id)}
                  className="ml-auto bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


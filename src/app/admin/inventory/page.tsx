'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminInventoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    itemName: '',
    category: 'ingredient',
    quantity: 0,
    unit: '',
    minimumStock: 10,
    reorderQuantity: 50,
    costPerUnit: 0,
    supplier: '',
  });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      router.push('/login');
      return;
    }
    if (user) {
      loadInventory();
      loadStats();
    }
  }, [user, loading, router]);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllInventory();
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminService.getInventoryStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading inventory stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminService.updateInventoryItem(editingItem._id, formData);
      } else {
        await adminService.createInventoryItem(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadInventory();
      loadStats();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Failed to save inventory item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminService.deleteInventoryItem(id);
      loadInventory();
      loadStats();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Failed to delete item');
    }
  };

  const handleRestock = async (id: string) => {
    const quantity = prompt('Enter quantity to restock:');
    if (!quantity) return;
    try {
      await adminService.restockInventoryItem(id, parseInt(quantity));
      loadInventory();
      loadStats();
    } catch (error) {
      console.error('Error restocking item:', error);
      alert('Failed to restock item');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: 'ingredient',
      quantity: 0,
      unit: '',
      minimumStock: 10,
      reorderQuantity: 50,
      costPerUnit: 0,
      supplier: '',
    });
  };

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Track stock levels and manage inventory</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add New Item
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalValue?.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.itemName}</div>
                    {item.supplier && <div className="text-sm text-gray-500">{item.supplier}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                      item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">${item.costPerUnit?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-medium">${(item.quantity * item.costPerUnit)?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestock(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => openModal(item)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Inventory Item</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="ingredient">Ingredient</option>
                      <option value="beverage">Beverage</option>
                      <option value="packaging">Packaging</option>
                      <option value="supplies">Supplies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="kg, liters, pieces"
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock</label>
                    <input
                      type="number"
                      value={formData.minimumStock}
                      onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reorder Qty</label>
                    <input
                      type="number"
                      value={formData.reorderQuantity}
                      onChange={(e) => setFormData({ ...formData, reorderQuantity: parseInt(e.target.value) })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost per Unit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


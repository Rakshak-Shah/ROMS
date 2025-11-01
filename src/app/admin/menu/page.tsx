'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService, ApiMenuItem } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminMenuPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<ApiMenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'mains',
    preparationTime: 15,
    servingSize: '',
    ingredients: [],
    isAvailable: true,
  });

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      router.push('/login');
      return;
    }
    if (user) loadMenuItems();
  }, [user, loading, router]);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const items = await adminService.getAllMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminService.updateMenuItem(editingItem._id, formData);
      } else {
        await adminService.createMenuItem(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await adminService.deleteMenuItem(id);
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item');
    }
  };

  const openModal = (item?: ApiMenuItem) => {
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
      name: '',
      description: '',
      price: 0,
      category: 'mains',
      preparationTime: 15,
      servingSize: '',
      ingredients: [],
      isAvailable: true,
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
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-2">Create, update, and delete menu items</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-primary text-inverse px-6 py-3 rounded-lg shadow hover:opacity-90 active:opacity-100 transition-colors"
          >
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-card border border-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg mb-2 text-primary">{item.name}</h3>
              <p className="text-secondary text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold" style={{color: 'var(--success)'}}>${item.price}</span>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  item.isAvailable 
                    ? 'bg-[var(--success-bg)] text-[var(--success)]' 
                    : 'bg-[var(--error-bg)] text-[var(--error)]'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="text-sm text-muted mb-4">
                <span className="capitalize">{item.category}</span> • {item.preparationTime} min
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="flex-1 bg-[var(--info-bg)] text-[var(--info)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-[var(--error-bg)] text-[var(--error)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-primary">{editingItem ? 'Edit' : 'Add'} Menu Item</h2>
              <form onSubmit={handleSubmit} className="space-y-4 text-primary">
                <div>
                  <label className="block text-sm font-medium mb-1 text-secondary">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                    placeholder="e.g., Spaghetti Carbonara"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-secondary">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                    rows={3}
                    placeholder="Describe the dish to your customers..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-secondary">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-secondary">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                    >
                      <option value="appetizers">Appetizers</option>
                      <option value="mains">Mains</option>
                      <option value="pasta">Pasta</option>
                      <option value="desserts">Desserts</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-secondary">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                      className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-secondary">Serving Size</label>
                    <input
                      type="text"
                      value={formData.servingSize}
                      onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                      className="w-full border border-default rounded-lg px-3 py-2 bg-page text-primary focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-secondary">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="mr-2 accent-[var(--primary)]"
                    />
                    <span className="text-sm font-medium">Available</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-primary text-inverse px-4 py-2 rounded-lg shadow hover:opacity-90">
                    Save
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-primary px-4 py-2 rounded-lg border border-default hover:bg-gray-200 dark:hover:bg-gray-600">
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


export const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return baseUrl.replace(/\/$/, '');
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Create headers with auth token
const createHeaders = (customHeaders: HeadersInit = {}): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
};

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: createHeaders(init?.headers),
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, data?: any, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: createHeaders(init?.headers),
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, data?: any, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: createHeaders(init?.headers),
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PUT ${url} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: createHeaders(init?.headers),
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DELETE ${url} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, data?: any, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: createHeaders(init?.headers),
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PATCH ${url} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

// Types
export type ApiMenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isAvailable?: boolean;
  preparationTime?: number;
  servingSize?: string;
  isSpecial?: boolean;
  specialPrice?: number;
  specialValidUntil?: Date;
  rating?: number;
  reviews?: number;
};

export type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  message?: string;
};

// Menu API Service
export const menuService = {
  // Get all menu items
  async getAll(): Promise<ApiMenuItem[]> {
    try {
      const response = await apiGet<ApiResponse<ApiMenuItem[]>>('/api/menu');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },

  // Get menu items by category
  async getByCategory(category: string): Promise<ApiMenuItem[]> {
    try {
      const response = await apiGet<ApiResponse<ApiMenuItem[]>>(`/api/menu?category=${category}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      return [];
    }
  },

  // Get single menu item
  async getById(id: string): Promise<ApiMenuItem | null> {
    try {
      const response = await apiGet<ApiResponse<ApiMenuItem>>(`/api/menu/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
  },
};

// Order API Service
export type CreateOrderData = {
  items: Array<{
    menuItem: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    specialInstructions?: string;
  }>;
  orderType: 'dine-in' | 'delivery' | 'pickup';
  tableNumber?: number;
  deliveryAddress?: {
    street: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: 'card' | 'cash' | 'online';
  specialInstructions?: string;
};

export type OrderResponse = {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentStatus: string;
};

export const orderService = {
  // Create a new order
  async create(orderData: CreateOrderData): Promise<OrderResponse | null> {
    try {
      const response = await apiPost<ApiResponse<OrderResponse>>('/api/orders', orderData);
      return response.data || null;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's order history
  async getMyOrders(): Promise<any[]> {
    try {
      const response = await apiGet<ApiResponse<any[]>>('/api/orders/my-orders');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get single order by ID
  async getById(id: string): Promise<any | null> {
    try {
      const response = await apiGet<ApiResponse<any>>(`/api/orders/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },
};

// Admin API Service
export const adminService = {
  // Dashboard
  async getDashboard(): Promise<any> {
    try {
      const response = await apiGet<ApiResponse<any>>('/api/admin/dashboard');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  // Orders Management
  async getAllOrders(): Promise<any[]> {
    try {
      const response = await apiGet<ApiResponse<{ orders: any[] }>>('/api/admin/orders');
      return response.data?.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<any>>(`/api/admin/orders/${orderId}/status`, { status, note });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    try {
      await apiDelete(`/api/admin/orders/${orderId}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Reservations Management
  async getAllReservations(): Promise<any[]> {
    try {
      const response = await apiGet<ApiResponse<{ reservations: any[] }>>('/api/admin/reservations');
      return response.data?.reservations || [];
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  },

  async confirmReservation(reservationId: string, tableNumber?: number): Promise<any> {
    try {
      const response = await apiPost<ApiResponse<any>>(`/api/admin/reservations/${reservationId}/confirm`, { tableNumber });
      return response.data;
    } catch (error) {
      console.error('Error confirming reservation:', error);
      throw error;
    }
  },

  async updateReservationStatus(reservationId: string, status: string): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<any>>(`/api/admin/reservations/${reservationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  },

  // Menu Management
  async getAllMenuItems(): Promise<ApiMenuItem[]> {
    try {
      const response = await apiGet<ApiResponse<{ menuItems: ApiMenuItem[] }>>('/api/admin/menu');
      return response.data?.menuItems || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },

  async createMenuItem(data: Partial<ApiMenuItem>): Promise<ApiMenuItem> {
    try {
      const response = await apiPost<ApiResponse<{ menuItem: ApiMenuItem }>>('/api/admin/menu', data);
      return response.data!.menuItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(id: string, data: Partial<ApiMenuItem>): Promise<ApiMenuItem> {
    try {
      const response = await apiPatch<ApiResponse<{ menuItem: ApiMenuItem }>>(`/api/admin/menu/${id}`, data);
      return response.data!.menuItem;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await apiDelete(`/api/admin/menu/${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Inventory Management
  async getAllInventory(): Promise<any[]> {
    try {
      const response = await apiGet<ApiResponse<{ items: any[] }>>('/api/inventory');
      return response.data?.items || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  },

  async getInventoryStats(): Promise<any> {
    try {
      const response = await apiGet<ApiResponse<any>>('/api/inventory/stats');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      return {};
    }
  },

  async createInventoryItem(data: any): Promise<any> {
    try {
      const response = await apiPost<ApiResponse<{ item: any }>>('/api/inventory', data);
      return response.data!.item;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  },

  async updateInventoryItem(id: string, data: any): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<{ item: any }>>(`/api/inventory/${id}`, data);
      return response.data!.item;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  async deleteInventoryItem(id: string): Promise<void> {
    try {
      await apiDelete(`/api/inventory/${id}`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  async restockInventoryItem(id: string, quantity: number): Promise<any> {
    try {
      const response = await apiPost<ApiResponse<{ item: any }>>(`/api/inventory/${id}/restock`, { quantity });
      return response.data!.item;
    } catch (error) {
      console.error('Error restocking inventory item:', error);
      throw error;
    }
  },

  // Staff Management
  async getAllUsers(): Promise<any[]> {
    try {
      const response = await apiGet<ApiResponse<{ users: any[] }>>('/api/admin/users');
      return response.data?.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getUserById(id: string): Promise<any | null> {
    try {
      const response = await apiGet<ApiResponse<{ user: any }>>(`/api/admin/users/${id}`);
      return response.data?.user || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(id: string, data: any): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<{ user: any }>>(`/api/admin/users/${id}`, data);
      return response.data!.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiDelete(`/api/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async activateUser(id: string): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<{ user: any }>>(`/api/admin/users/${id}/activate`, {});
      return response.data!.user;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  async deactivateUser(id: string): Promise<any> {
    try {
      const response = await apiPatch<ApiResponse<{ user: any }>>(`/api/admin/users/${id}/deactivate`, {});
      return response.data!.user;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },
};

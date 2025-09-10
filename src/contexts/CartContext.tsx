'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  tableNumber?: string;
  serviceType?: string;
  // DELIVERY CONFIGURATION - You can modify these values
  deliveryAddress?: string;
  deliveryFee: number; // Base delivery fee - change this amount as needed
  freeDeliveryThreshold: number; // Minimum order for free delivery - adjust as needed
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TABLE'; payload: string }
  | { type: 'SET_SERVICE_TYPE'; payload: string }
  | { type: 'SET_DELIVERY_ADDRESS'; payload: string } // New action for delivery address
  | { type: 'UPDATE_DELIVERY_CONFIG'; payload: { deliveryFee?: number; freeDeliveryThreshold?: number } }; // For admin updates

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setTable: (tableNumber: string) => void;
  setServiceType: (serviceType: string) => void;
  setDeliveryAddress: (address: string) => void; // New method for delivery address
  updateDeliveryConfig: (config: { deliveryFee?: number; freeDeliveryThreshold?: number }) => void; // For admin updates
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getDeliveryFee: () => number; // Calculate delivery fee based on order total
  getFinalTotal: () => number; // Total including delivery fee and tax
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'SET_TABLE':
      return {
        ...state,
        tableNumber: action.payload,
      };

    case 'SET_SERVICE_TYPE':
      return {
        ...state,
        serviceType: action.payload,
        // Clear delivery address when switching away from delivery
        deliveryAddress: action.payload === 'delivery' ? state.deliveryAddress : undefined,
      };

    case 'SET_DELIVERY_ADDRESS':
      return {
        ...state,
        deliveryAddress: action.payload,
      };

    case 'UPDATE_DELIVERY_CONFIG':
      return {
        ...state,
        deliveryFee: action.payload.deliveryFee ?? state.deliveryFee,
        freeDeliveryThreshold: action.payload.freeDeliveryThreshold ?? state.freeDeliveryThreshold,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // DELIVERY SETTINGS - Modify these values to change delivery costs
  const initialState: CartState = {
    items: [],
    deliveryFee: 5.99, // Change this value to modify delivery fee
    freeDeliveryThreshold: 50.00 // Change this value to modify free delivery minimum
  };
  
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setTable = (tableNumber: string) => {
    dispatch({ type: 'SET_TABLE', payload: tableNumber });
  };

  const setServiceType = (serviceType: string) => {
    dispatch({ type: 'SET_SERVICE_TYPE', payload: serviceType });
  };

  const setDeliveryAddress = (address: string) => {
    dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: address });
  };

  const updateDeliveryConfig = (config: { deliveryFee?: number; freeDeliveryThreshold?: number }) => {
    dispatch({ type: 'UPDATE_DELIVERY_CONFIG', payload: config });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // DELIVERY FEE CALCULATION - Modify this logic to change how delivery fees are calculated
  const getDeliveryFee = () => {
    // Only apply delivery fee for delivery orders
    if (state.serviceType !== 'delivery') return 0;
    
    const subtotal = getTotalPrice();
    // Free delivery if order exceeds threshold
    if (subtotal >= state.freeDeliveryThreshold) return 0;
    
    return state.deliveryFee;
  };

  // TOTAL CALCULATION - Includes subtotal + delivery fee + tax
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = getDeliveryFee();
    const tax = (subtotal + deliveryFee) * 0.085; // 8.5% tax on subtotal + delivery
    return subtotal + deliveryFee + tax;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setTable,
        setServiceType,
        setDeliveryAddress,
        updateDeliveryConfig,
        getTotalPrice,
        getTotalItems,
        getDeliveryFee,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export type { MenuItem, CartItem };

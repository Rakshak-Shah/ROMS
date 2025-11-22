'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, ReactNode } from 'react';

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
  
  // Load state from localStorage on mount
  const loadState = (): CartState => {
    if (typeof window === 'undefined') return initialState;
    try {
      const savedState = localStorage.getItem('cart_state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Validate the loaded state
        return {
          items: Array.isArray(parsed.items) ? parsed.items : [],
          tableNumber: parsed.tableNumber,
          serviceType: parsed.serviceType,
          deliveryAddress: parsed.deliveryAddress,
          deliveryFee: typeof parsed.deliveryFee === 'number' ? parsed.deliveryFee : initialState.deliveryFee,
          freeDeliveryThreshold: typeof parsed.freeDeliveryThreshold === 'number' ? parsed.freeDeliveryThreshold : initialState.freeDeliveryThreshold
        };
      }
    } catch (error) {
      console.error('Error loading cart state from localStorage:', error);
      // Clear corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_state');
      }
    }
    return initialState;
  };
  
  const [state, dispatch] = useReducer(cartReducer, initialState, loadState);
  
  // Use ref to track if this is initial mount
  const isInitialMount = useRef(true);

  // Save state to localStorage whenever it changes (skip initial mount to avoid loops)
  useEffect(() => {
    // Skip saving on initial mount (data just loaded from localStorage)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (typeof window !== 'undefined') {
      try {
        // Create a clean copy of state to avoid circular references
        const stateToSave = {
          items: state.items,
          tableNumber: state.tableNumber,
          serviceType: state.serviceType,
          deliveryAddress: state.deliveryAddress,
          deliveryFee: state.deliveryFee,
          freeDeliveryThreshold: state.freeDeliveryThreshold
        };
        localStorage.setItem('cart_state', JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving cart state to localStorage:', error);
      }
    }
  }, [state]);

  const addToCart = useCallback((item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setTable = useCallback((tableNumber: string) => {
    dispatch({ type: 'SET_TABLE', payload: tableNumber });
  }, []);

  const setServiceType = useCallback((serviceType: string) => {
    dispatch({ type: 'SET_SERVICE_TYPE', payload: serviceType });
  }, []);

  const setDeliveryAddress = useCallback((address: string) => {
    dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: address });
  }, []);

  const updateDeliveryConfig = useCallback((config: { deliveryFee?: number; freeDeliveryThreshold?: number }) => {
    dispatch({ type: 'UPDATE_DELIVERY_CONFIG', payload: config });
  }, []);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.items]);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  // DELIVERY FEE CALCULATION - Modify this logic to change how delivery fees are calculated
  const getDeliveryFee = useCallback(() => {
    // Only apply delivery fee for delivery orders
    if (state.serviceType !== 'delivery') return 0;
    
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    // Free delivery if order exceeds threshold
    if (subtotal >= state.freeDeliveryThreshold) return 0;
    
    return state.deliveryFee;
  }, [state.serviceType, state.items, state.freeDeliveryThreshold, state.deliveryFee]);

  // TOTAL CALCULATION - Includes subtotal + delivery fee + tax
  const getFinalTotal = useCallback(() => {
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = state.serviceType === 'delivery' ? 
      (subtotal >= state.freeDeliveryThreshold ? 0 : state.deliveryFee) : 0;
    const tax = (subtotal + deliveryFee) * 0.085; // 8.5% tax on subtotal + delivery
    return subtotal + deliveryFee + tax;
  }, [state.items, state.serviceType, state.freeDeliveryThreshold, state.deliveryFee]);

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

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '../types';

interface OrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setCurrentOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearOrders: () => void;
  
  // Getters
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getActiveOrders: () => Order[];
  getOrderHistory: () => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      // Actions
      addOrder: (order: Order) => {
        set(state => ({
          orders: [order, ...state.orders],
          currentOrder: order,
        }));
      },

      updateOrder: (orderId: string, updates: Partial<Order>) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
          currentOrder: state.currentOrder?.id === orderId 
            ? { ...state.currentOrder, ...updates }
            : state.currentOrder,
        }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          ),
          currentOrder: state.currentOrder?.id === orderId 
            ? { ...state.currentOrder, status }
            : state.currentOrder,
        }));
      },

      setCurrentOrder: (order: Order | null) => {
        set({ currentOrder: order });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearOrders: () => {
        set({
          orders: [],
          currentOrder: null,
        });
      },

      // Getters
      getOrderById: (orderId: string) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId);
      },

      getOrdersByStatus: (status: OrderStatus) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },

      getActiveOrders: () => {
        const { orders } = get();
        const activeStatuses: OrderStatus[] = [
          'pending',
          'confirmed',
          'preparing',
          'ready_for_pickup',
          'out_for_delivery',
        ];
        return orders.filter(order => activeStatuses.includes(order.status));
      },

      getOrderHistory: () => {
        const { orders } = get();
        const historyStatuses: OrderStatus[] = [
          'delivered',
          'cancelled',
          'refunded',
        ];
        return orders.filter(order => historyStatuses.includes(order.status));
      },
    }),
    {
      name: 'oneqlick-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder,
      }),
    }
  )
);

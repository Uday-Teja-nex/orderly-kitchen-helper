
import { create } from 'zustand';

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: "pending" | "progress" | "completed" | "cancelled";
  timestamp: string;
  total: number;
};

type OrderStore = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (order) => {
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: (state.orders.length + 1).toString(),
          status: "pending",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  },
  updateOrder: (orderId, updates) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    }));
  },
}));

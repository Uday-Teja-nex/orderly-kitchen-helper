
import { create } from 'zustand';

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  status?: "progress" | "completed"; // Add status to each item
};

export type Order = {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: "progress" | "completed" | "cancelled";
  timestamp: string;
  total: number;
};

type OrderStore = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateOrderItem: (orderId: string, itemIndex: number, status: "progress" | "completed") => void;
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
          status: "progress", // Changed from "pending" to "progress"
          timestamp: new Date().toISOString(),
          items: order.items.map(item => ({
            ...item,
            status: "progress" // Initialize all items as "in progress"
          }))
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
  updateOrderItem: (orderId, itemIndex, status) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = [...order.items];
          if (updatedItems[itemIndex]) {
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              status
            };
          }
          
          // Check if all items are completed to update order status
          const allCompleted = updatedItems.every(item => item.status === "completed");
          return {
            ...order,
            items: updatedItems,
            status: allCompleted ? "completed" : "progress"
          };
        }
        return order;
      }),
    }));
  },
}));

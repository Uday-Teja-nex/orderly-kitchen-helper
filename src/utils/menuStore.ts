
import { create } from 'zustand';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
};

type MenuStore = {
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  removeItem: (id: string) => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  items: [
    { id: "1", name: "Burger", price: 10 },
    { id: "2", name: "Fries", price: 5 },
    { id: "3", name: "Pizza", price: 15 },
    { id: "4", name: "Salad", price: 8 },
    { id: "5", name: "Drink", price: 3 },
  ],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

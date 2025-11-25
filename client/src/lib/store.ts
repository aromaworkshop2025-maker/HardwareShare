import { create } from 'zustand';
import { Item, MOCK_ITEMS } from './mock-data';

interface StoreState {
  items: Item[];
  addItem: (item: Item) => void;
  requestItem: (itemId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: MOCK_ITEMS,
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  requestItem: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, status: 'Requested' } : item
      ),
    })),
}));

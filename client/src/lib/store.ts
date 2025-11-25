import { create } from 'zustand';
import type { ItemWithOwner } from '@shared/schema';

interface StoreState {
  items: ItemWithOwner[];
  setItems: (items: ItemWithOwner[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));

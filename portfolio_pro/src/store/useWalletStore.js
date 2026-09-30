import { create } from 'zustand';

export const useWalletStore = create((set) => ({
  // The initial state (data)
  buyingPower: 100000.00,
  
  // The actions (functions to modify the data)
  deductFunds: (amount) => set((state) => ({ 
    buyingPower: state.buyingPower - amount 
  })),
  
  addFunds: (amount) => set((state) => ({ 
    buyingPower: state.buyingPower + amount 
  })),
}));
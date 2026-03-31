import { Alert } from "react-native";
import { create } from "zustand";
import { getBalance, getTokens, getTxns } from "@/services/solana";
import type { Token, Transaction } from "@/types/solana";

interface WalletState {
  publicKey: string;
  balance: number | null;
  tokens: Token[];
  txns: Transaction[];
  loading: boolean;
  setPublicKey: (key: string) => void;
  search: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: "",
  balance: null,
  tokens: [],
  txns: [],
  loading: false,

  setPublicKey: (key) => set({ publicKey: key }),

  search: async () => {
    const addr = get().publicKey.trim();
    if (!addr) {
      Alert.alert("Enter a wallet address");
      return;
    }

    set({ loading: true });
    try {
      const [balance, tokens, txns] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTxns(addr),
      ]);
      set({ balance, tokens, txns });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Error", message);
    } finally {
      set({ loading: false });
    }
  },
}));

import { Alert } from "react-native";
import { create } from "zustand";
import { getBalance, getTokens, getTxns } from "@/services/solana";
import { WSOL_MINT } from "@/constants/solana";
import { useSettingsStore } from "@/stores/settings-store";
import type { Token, Transaction } from "@/types/solana";

interface WalletState {
  publicKey: string;
  balance: number | null;
  tokens: Token[];
  txns: Transaction[];
  loading: boolean;
  connectedPubkey: string | null;
  connecting: boolean;
  setPublicKey: (key: string) => void;
  setConnectedPubkey: (key: string | null) => void;
  setConnecting: (val: boolean) => void;
  search: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: "",
  balance: null,
  tokens: [],
  txns: [],
  loading: false,
  connectedPubkey: null,
  connecting: false,

  setPublicKey: (key) => set({ publicKey: key }),
  setConnectedPubkey: (key) => set({ connectedPubkey: key }),
  setConnecting: (val) => set({ connecting: val }),

  search: async () => {
    const addr = get().publicKey.trim();
    if (!addr) {
      Alert.alert("Enter a wallet address");
      return;
    }

    const { isDevnet } = useSettingsStore.getState();
    set({ loading: true });
    try {
      const [balance, tokens, txns] = await Promise.all([
        getBalance(addr, isDevnet),
        getTokens(addr, isDevnet),
        getTxns(addr, isDevnet),
      ]);
      const solToken: Token = { mint: WSOL_MINT, amount: balance };
      const allTokens = [solToken, ...tokens].filter((t) => t.amount > 0.0001);
      set({ balance, tokens: allTokens, txns });
      useSettingsStore.getState().addToHistory(addr);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Error", message);
    } finally {
      set({ loading: false });
    }
  },
}));

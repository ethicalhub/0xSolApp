import { SWAP_TOKENS } from "@/constants/tokens";
import { SwapToken } from "@/types/swap";
import { deriveFromAmount, deriveToAmount, isCanSwap } from "@/utils/swap";
import { create } from "zustand";

interface SwapState {
  fromToken: SwapToken;
  toToken: SwapToken;
  fromAmount: string;
  toAmount: string;
  canSwap: boolean;

  setFromToken: (token: SwapToken) => void;
  setToToken: (token: SwapToken) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  flipTokens: () => void;
}

export const useSwapStore = create<SwapState>((set, get) => ({
  fromToken: SWAP_TOKENS[0],
  toToken: SWAP_TOKENS[1],
  fromAmount: "",
  toAmount: "",
  canSwap: false,

  setFromToken: (token) => {
    const { toToken, fromAmount } = get();
    const toAmount = deriveToAmount(fromAmount, token, toToken);
    set({ fromToken: token, toAmount, canSwap: isCanSwap(token, toToken, fromAmount) });
  },

  setToToken: (token) => {
    const { fromToken, fromAmount } = get();
    const toAmount = deriveToAmount(fromAmount, fromToken, token);
    set({ toToken: token, toAmount, canSwap: isCanSwap(fromToken, token, fromAmount) });
  },

  setFromAmount: (amount) => {
    const { fromToken, toToken } = get();
    const toAmount = deriveToAmount(amount, fromToken, toToken);
    set({ fromAmount: amount, toAmount, canSwap: isCanSwap(fromToken, toToken, amount) });
  },

  setToAmount: (amount) => {
    const { fromToken, toToken } = get();
    const fromAmount = deriveFromAmount(amount, fromToken, toToken);
    set({ toAmount: amount, fromAmount, canSwap: isCanSwap(fromToken, toToken, fromAmount) });
  },

  flipTokens: () => {
    const { fromToken, toToken, fromAmount, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount,
      canSwap: isCanSwap(toToken, fromToken, toAmount),
    });
  },
}));

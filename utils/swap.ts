import { SwapToken } from "@/types/swap";

export function deriveToAmount(fromAmount: string, from: SwapToken, to: SwapToken): string {
  const n = parseFloat(fromAmount);
  if (!fromAmount || isNaN(n) || n <= 0) return "";
  return ((n * from.usdPrice) / to.usdPrice).toFixed(6);
}

export function deriveFromAmount(toAmount: string, from: SwapToken, to: SwapToken): string {
  const n = parseFloat(toAmount);
  if (!toAmount || isNaN(n) || n <= 0) return "";
  return ((n * to.usdPrice) / from.usdPrice).toFixed(6);
}

export function isCanSwap(fromToken: SwapToken, toToken: SwapToken, fromAmount: string): boolean {
  const n = parseFloat(fromAmount);
  return fromToken.symbol !== toToken.symbol && !isNaN(n) && n > 0;
}

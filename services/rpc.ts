import Constants from "expo-constants";
import type { RpcResponse } from "@/types/solana";

const MAINNET_URL =
  (Constants.expoConfig?.extra?.solRpcUrl as string) ??
  "https://api.mainnet-beta.solana.com";

const DEVNET_URL =
  (Constants.expoConfig?.extra?.solDevnetRpcUrl as string) ??
  "https://api.devnet.solana.com";

export const rpcCall = async <T>(
  method: string,
  params: unknown[],
  isDevnet = false,
): Promise<T> => {
  const url = isDevnet ? DEVNET_URL : MAINNET_URL;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  const data: RpcResponse<T> = await response.json();

  if (data.error) {
    throw new Error(data.error.message ?? "RPC error");
  }

  return data.result as T;
};

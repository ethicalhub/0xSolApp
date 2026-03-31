import Constants from "expo-constants";
import type { RpcResponse } from "@/types/solana";

const SOL_RPC_URL =
  (Constants.expoConfig?.extra?.solRpcUrl as string) ??
  "https://api.mainnet-beta.solana.com";

export const rpcCall = async <T>(
  method: string,
  params: unknown[],
): Promise<T> => {
  const response = await fetch(SOL_RPC_URL, {
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

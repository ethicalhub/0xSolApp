export interface Token {
  mint: string;
  amount: number;
}

export interface Transaction {
  sig: string;
  time: number | null;
  ok: boolean;
}

export interface RpcResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

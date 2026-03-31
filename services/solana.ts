import { rpcCall } from "./rpc";
import { LAMPORTS_PER_SOL, TOKEN_PROGRAM_ID } from "@/constants/solana";
import type { Token, Transaction } from "@/types/solana";

interface BalanceResult {
  context: { slot: number };
  value: number;
}

interface TokenAccountResult {
  context: { slot: number };
  value: {
    account: {
      data: {
        parsed: {
          info: {
            mint: string;
            tokenAmount: { uiAmount: number };
          };
        };
      };
    };
  }[];
}

interface SignatureInfo {
  signature: string;
  blockTime: number | null;
  err: unknown;
}

export const getBalance = async (publicKey: string): Promise<number> => {
  const result = await rpcCall<BalanceResult>("getBalance", [publicKey]);
  return result.value / LAMPORTS_PER_SOL;
};

export const getTokens = async (publicKey: string): Promise<Token[]> => {
  const result = await rpcCall<TokenAccountResult>(
    "getTokenAccountsByOwner",
    [publicKey, { programId: TOKEN_PROGRAM_ID }, { encoding: "jsonParsed" }],
  );

  return result.value
    .map((account) => ({
      mint: account.account.data.parsed.info.mint,
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((token) => token.amount > 0);
};

export const getTxns = async (publicKey: string): Promise<Transaction[]> => {
  const sigs = await rpcCall<SignatureInfo[]>("getSignaturesForAddress", [
    publicKey,
    { limit: 10 },
  ]);

  return sigs.map((s) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

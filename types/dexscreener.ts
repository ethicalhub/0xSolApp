export interface DexScreenerToken {
  address: string;
  name: string;
  symbol: string;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: DexScreenerToken;
  quoteToken: DexScreenerToken;
  priceUsd: string;
  priceChange: {
    h1: number;
    h6: number;
    h24: number;
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  marketCap: number;
  fdv: number;
  info?: {
    imageUrl?: string;
  };
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[] | null;
}

export interface TokenDetails {
  name: string;
  symbol: string;
  imageUrl: string | null;
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  fdv: number;
  volume24h: number;
  liquidityUsd: number;
  dexId: string;
  pairUrl: string;
  mintAddress: string;
}

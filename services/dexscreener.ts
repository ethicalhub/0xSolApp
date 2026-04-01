import type { DexScreenerPair, TokenDetails } from "@/types/dexscreener";

// tokens/v1 returns a plain array, not { pairs: [] }
const BASE_URL = "https://api.dexscreener.com/tokens/v1/solana";

export async function getTokenDetails(mintAddress: string): Promise<TokenDetails | null> {
  try {
    const res = await fetch(`${BASE_URL}/${mintAddress}`);

    if (!res.ok) {
      throw new Error(`DexScreener request failed: ${res.status}`);
    }

    const pairs: DexScreenerPair[] = await res.json();

    if (!Array.isArray(pairs) || pairs.length === 0) {
      return null;
    }

    // Pick the pair with the highest liquidity as the primary source
    const pair = pairs.reduce((best, current) =>
      (current.liquidity?.usd ?? 0) > (best.liquidity?.usd ?? 0) ? current : best
    );

    return {
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      imageUrl: pair.info?.imageUrl ?? null,
      priceUsd: parseFloat(pair.priceUsd ?? "0"),
      priceChange24h: pair.priceChange?.h24 ?? 0,
      marketCap: pair.marketCap ?? 0,
      fdv: pair.fdv ?? 0,
      volume24h: pair.volume?.h24 ?? 0,
      liquidityUsd: pair.liquidity?.usd ?? 0,
      dexId: pair.dexId,
      pairUrl: pair.url,
      mintAddress,
    };
  } catch (e) {
    console.error("[dexscreener] getTokenDetails error:", e);
    return null;
  }
}

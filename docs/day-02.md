# Day 02 — Navigation, Swap UI, Layered Architecture & Token Details

**Date:** 2026-04-01
**Project:** [0xSol App](../README.md)
**Status:** Done

---

## Preview

<img src="../assets/docs/day2.jpg" width="280" /> <img src="../assets/docs/day2_1.jpg" width="280" />

---

## Goal for the Day

Day 1 left us with a working single-screen app — one `index.tsx` doing everything. The plan was to clean that up before adding new features.

We did that, and then some. By end of day we had:

- Bottom tab navigation with two real screens
- A fully interactive Swap UI
- A reorganized component structure
- A shared style system
- A standalone AI-powered code review agent
- A live Token Details page powered by the DexScreener API

---

## What We Built

### 1. Bottom Tab Navigation

Added `expo-router`'s file-based tab layout under `app/(tabs)/`. Two tabs:

| Tab | Screen | Icon |
|-----|--------|------|
| Explore | Wallet address search + balance/token/tx view | `search` |
| Swap | Token swap interface | `swap-horizontal` |

The tab bar uses custom styling — dark background, no visible border, accent color on the active tab icon. Navigation is instant, state for each tab is preserved between switches.

---

### 2. Component Folder Reorganization

Moved from a flat `components/` directory to feature-based subdirectories:

```
components/
  explore/          ← previously flat in components/
    balance-card.tsx
    search-bar.tsx
    token-list.tsx
    transaction-list.tsx
  swap/             ← new
    swap-card.tsx
    token-selector.tsx
    token-picker-modal.tsx
  ui/               ← new, shared primitives
    button.tsx
```

The old flat layout worked for one screen. With two screens and more coming, grouping by feature makes it easier to find and change things without touching unrelated code.

---

### 3. Shared Style Constants (`constants/styles.ts`)

Screens were duplicating the same `safe`, `scroll`, and `title` styles. Pulled them into a `shared` object:

```ts
export const shared = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screenContainer: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  screenTitle: { color: colors.white, fontSize: 32, fontWeight: "700", ... },
});
```

Both `index.tsx` and `swap.tsx` now import `shared` instead of redeclaring identical styles. Each screen's local `StyleSheet` only has what's unique to it.

---

### 4. Swap Screen

Replaced the "Coming soon..." placeholder with a real UI.

**Components:**

- `SwapCard` — a card containing a token selector + amount input. Used twice (pay / receive).
- `TokenSelector` — a pressable row showing the selected token's logo, symbol, and a chevron. Tapping opens the picker.
- `TokenPickerModal` — a bottom sheet modal listing all available tokens. Selecting one closes the modal and updates the store.
- `Button` (shared) — a reusable primary button with disabled state styling.

**Swap Screen layout:**

```
[Swap Tokens title]
[SwapCard — You pay]
  [token selector]  [amount input]
[↕ flip button]
[SwapCard — You receive]
  [token selector]  [amount input]
[warning: same token selected]
[Swap button — disabled if invalid]
```

**Keyboard handling:** The screen wraps in `KeyboardAvoidingView` + `TouchableWithoutFeedback` so tapping outside the input dismisses the keyboard, and the layout adjusts on iOS/Android correctly.

---

### 5. Swap State — `stores/swap-store.ts`

All swap logic lives in a Zustand store. The store manages:

- `fromToken` / `toToken` — which tokens are selected
- `fromAmount` / `toAmount` — the input values
- `canSwap` — derived boolean, true only when tokens differ and `fromAmount` is a valid positive number
- `flipTokens()` — swaps both tokens and amounts in one atomic update

Amount derivation uses mock exchange rates from `utils/swap.ts`. No live price feeds yet — that's a future concern.

**Types (`types/swap.ts`):**
```ts
interface SwapToken {
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
  mockPrice: number; // USD, for rate derivation
}
```

**Token list (`constants/tokens.ts`):** SOL, USDC, USDT, RAY, BONK — the five most common tokens on Solana mainnet.

---

### 6. AI Code Review Agent (`scripts/review/index.ts`)

Built a standalone Node script that runs Claude against the codebase and produces a structured code review report.

Uses the `@anthropic-ai/claude-agent-sdk` with the `query()` API — streams the review back as the model reads and reasons about the files.

**How it works:**

```
ts-node scripts/review/index.ts
  → Claude reads app/, components/, stores/, utils/, constants/, types/
  → Reports issues grouped by file with severity and fix suggestions
  → Scores each category: Type Safety, Security, Performance, etc.
```

Can also target a single file:
```
ts-node scripts/review/index.ts --file components/swap/swap-card.tsx
```

**The system prompt tells the model to check for:**
1. Type safety — `any`, unsafe casts, missing types
2. Security — hardcoded secrets, unsafe inputs
3. Performance — unnecessary re-renders, missing `keyExtractor`, bad `FlatList` usage
4. `useEffect` misuse — effects that should be derived state
5. Reusability — duplicated logic, magic strings, oversized components
6. Standards — naming, folder structure, dead code

The agent is given `Read`, `Glob`, and `Grep` tools only — it can explore the codebase but can't write to it. The review is purely advisory.

The `scripts/` folder is excluded from git via `.gitignore` — it's internal tooling, not part of the app.

---

### 7. Token Details Page

Tapping any token row in the Explore tab navigates to a dynamic details screen at `app/token/[mint].tsx`. It fetches live market data from DexScreener and renders it in a set of focused cards.

**Route:** `app/token/[mint].tsx` — `mint` is the token's mint address, `amount` is passed as a query param (the user's balance of that token).

**DexScreener API:**
```
GET https://api.dexscreener.com/tokens/v1/solana/{mintAddress}
```
Returns a plain array of trading pairs. No auth needed. We pick the pair with the highest liquidity as the source of truth.

**Components (`components/token-detail/`):**

| Component | Shows |
|-----------|-------|
| `PriceCard` | Token logo, name, symbol, current price, 24h change badge |
| `HoldingsCard` | User's token amount + USD value (amount × price) |
| `MarketDataCard` | Market Cap, FDV, 24h Volume, Liquidity |
| `TokenInfoCard` | Contract address (shortened), Network, DEX name |
| `ActionButtons` | DexScreener link + Solscan link |

**SOL in the token list:**

Native SOL isn't an SPL token — `getTokenAccountsByOwner` never returns it. It lives in a separate "bucket" on the account. To make it appear in the list, after fetching we manually build a synthetic entry:

```ts
const solToken: Token = { mint: WSOL_MINT, amount: balance };
const allTokens = [solToken, ...tokens].filter((t) => t.amount > 0.0001);
```

`WSOL_MINT` (`So111...112`) is the canonical Wrapped SOL address the whole ecosystem (Phantom, DexScreener, Raydium) uses to give SOL an SPL identity. DexScreener recognises it and returns SOL price data.

The `> 0.0001` filter also handles the edge case of a wallet with 0 SOL — the synthetic entry gets filtered out and nothing breaks.

---

## Architecture After Day 2

```
app/
  (tabs)/
    _layout.tsx       ← tab bar config
    index.tsx         ← Explore screen
    swap.tsx          ← Swap screen
  token/
    [mint].tsx        ← dynamic Token Details screen

components/
  explore/            ← all explore-screen components
  swap/               ← all swap-screen components
  token-detail/       ← PriceCard, HoldingsCard, MarketDataCard, TokenInfoCard, ActionButtons
  ui/                 ← shared primitives (Button, ...)

constants/
  theme.ts            ← colors, spacing, radius
  styles.ts           ← shared StyleSheet (safe, screenContainer, screenTitle)
  tokens.ts           ← SWAP_TOKENS list
  solana.ts           ← RPC URLs, WSOL_MINT, constants

stores/
  wallet-store.ts     ← explore screen state
  swap-store.ts       ← swap screen state + derivation logic

types/
  solana.ts
  swap.ts
  dexscreener.ts      ← DexScreenerPair, TokenDetails

utils/
  format.ts           ← short(), timeAgo()
  swap.ts             ← deriveToAmount(), deriveFromAmount(), isCanSwap()

services/
  solana.ts           ← RPC calls
  dexscreener.ts      ← getTokenDetails()

scripts/              ← excluded from git
  review/
    index.ts          ← AI code reviewer agent
```

---

## Learnings

- **Feature-based folders scale better than type-based folders.** `components/explore/` is easier to navigate than a flat `components/` as the app grows. When you need to change a feature, everything you need is in one place.
- **Shared styles pay off immediately.** Two screens duplicating the same `safe` container style was already annoying on Day 2. `constants/styles.ts` solved it and the fix propagates everywhere at once.
- **Zustand's `get()` inside actions is the right pattern for derived state.** Each setter in `swap-store` reads current state via `get()`, computes derived values, and sets everything in one `set()` call. No cascading effects, no stale closures.
- **`KeyboardAvoidingView` behavior differs by platform.** `"padding"` on iOS, `"height"` on Android — and wrapping the `ScrollView` (not the whole screen) is what actually works.
- **The Agent SDK's `query()` streaming API is minimal.** You iterate over messages, check for `"result"` in the message, and print it. The agent handles all the tool-calling internally — you just give it a prompt, tools, and a model.
- **Read the API response shape before writing the service.** The DexScreener `tokens/v1` endpoint returns a plain array `[]`, not `{ pairs: [] }`. Assuming a wrapper object meant `data.pairs` was always `undefined` — everything returned "no market data" until we curled the endpoint and saw the real shape.
- **Native SOL is invisible to the SPL token system.** `getTokenAccountsByOwner` only sees token accounts. SOL itself lives outside that system and must be injected manually using the wSOL mint address as the canonical identifier.
- **`headerBackTitle: ""` removes the iOS back button label.** By default expo-router shows the previous screen's segment name (e.g. `(tabs)`) next to the back arrow. An empty string leaves just the arrow.

---

## Next Steps (Day 3 Preview)

- Wire up real token prices (Jupiter or CoinGecko API)
- Add slippage tolerance setting
- Build a transaction confirmation sheet before swap executes
- Possibly add a portfolio view to the Explore tab

---

## Summary

| What | How |
|------|-----|
| Bottom tab navigation | `expo-router` file-based `(tabs)/` layout |
| Swap UI | `SwapCard` + `TokenPickerModal` + `useSwapStore` with derived amounts |
| Component structure | Feature-based folders: `explore/`, `swap/`, `token-detail/`, `ui/` |
| Shared styles | `constants/styles.ts` — one source for `safe`, `screenContainer`, `screenTitle` |
| Token Details page | Dynamic `app/token/[mint].tsx` → DexScreener API → 5 focused cards |
| SOL in token list | Synthetic entry using `WSOL_MINT` + `getBalance()` result, filtered by `> 0.0001` |
| AI code reviewer | `scripts/review/index.ts` using Claude Agent SDK `query()` — reads codebase, reports issues |

---

[← Day 01](day-01.md) | [Back to README](../README.md)

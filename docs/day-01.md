# Day 01 — Setup & Basic UI

**Date:** 2026-04-01
**Project:** [0xSol App](../README.md)
**Status:** Done

---

## Goal for the Day

Get a working Expo project off the ground, strip out the boilerplate, and build the first piece of real UI — a wallet address input that will drive everything else in the app.

No placeholders. No fake data. Just a foundation I can actually build on.

---

## What I Built

- Initialized the project using `create-expo-app`
- Deleted all default Expo boilerplate (tabs layout, themed components, example screens)
- Configured `app.config.ts` with app metadata and a Solana RPC URL via environment variable
- Built a single-screen UI with:
  - A title and subtitle
  - A text input for entering a Solana wallet address
  - A search trigger to kick off the RPC call (implemented the call inline for now)

By end of day, the app could accept a wallet address, call the Solana mainnet RPC, and return balance, token accounts, and recent transactions — all rendered in a single `index.tsx`.

---

## UI Breakdown

| Component | Purpose |
|-----------|---------|
| `SafeAreaView` | Keeps content within safe screen bounds on iOS/Android |
| `ScrollView` | Allows the results list to scroll as data grows |
| `View` | Layout containers and grouping |
| `TextInput` | The core input — user enters a Solana public key here |
| `Text` | Title, subtitle, labels, and displayed data |
| `TouchableOpacity` | Search button with press feedback |
| `ActivityIndicator` | Loading state while the RPC call is in flight |
| `FlatList` | Rendering token and transaction lists efficiently |

The `TextInput` is the entry point for the entire app. Everything downstream — balance, tokens, transactions — flows from whatever address the user types in.

---

## Current Flow

```
User enters wallet address
  → Tap Search
    → RPC call to api.mainnet-beta.solana.com
      → Parse balance (lamports → SOL)
      → Parse token accounts (SPL tokens)
      → Parse recent transactions
        → Render results to screen
```

All of this lived in one file on Day 1. That's fine — it's easier to understand the full flow before splitting it apart.

---

## Learnings

- `create-expo-app` scaffolds a lot. Most of it is not needed — stripping it down early is worth the effort rather than working around it.
- Solana's JSON-RPC API is straightforward. A plain `fetch` POST with the right method and params is all it takes to get on-chain data — no SDK needed at this stage.
- Lamports to SOL conversion: divide by `1_000_000_000`. Worth remembering; it's easy to display raw lamport values and have no idea why the balance looks wrong.
- `expo-router` defaults to a file-based tab layout. Replacing that with a simple `Stack` and a single `index.tsx` was the right call for this stage.
- `app.config.ts` (TypeScript config) is more flexible than `app.json` and worth using from the start.

---

## Challenges

- **Boilerplate cleanup was tedious.** The default Expo template has a lot of files across `components/`, `hooks/`, `constants/`, and `app/(tabs)/`. Figuring out what to delete without breaking the router took a moment.
- **RPC responses need careful parsing.** Token account data is nested a few levels deep inside `account.data.parsed.info`. Easy to get wrong on first read.
- **No error boundaries yet.** Invalid addresses or network failures just throw. That's acceptable for Day 1 but it's the first thing to address.

---

## Next Steps (Day 2 Preview)

The monolithic `index.tsx` works, but 400+ lines in a single file is a sign it needs to be broken up.

- Extract RPC logic into a `services/` layer
- Move state into a Zustand store (`stores/wallet-store.ts`)
- Split UI into focused components: `SearchBar`, `BalanceCard`, `TokenList`, `TransactionList`
- Move the RPC URL into `app.config.ts` properly (already done, just wire it through)

The goal is a clean layered architecture before adding any new features.

---

[Back to README](../README.md)

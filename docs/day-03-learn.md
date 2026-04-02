# Day 03 — Theory: State Management (Zustand + MMKV)

**Date:** 2026-04-02
**Project:** [0xSol App](../README.md)
**Type:** Learning Notes

---

## What We're Building Today

We're adding three things to 0xSol:

1. **Global State with Zustand** — Share data between any screen without prop drilling
2. **Persistent Storage** — Save data to the phone so it survives app restarts
3. **Practical Features** — Favorites, search history, devnet toggle

By the end, your 0xSol app will feel like a real app people would actually use.

---

## Why Do We Need This?

Right now in our app:

**Problem 1: Data doesn't survive restarts.** Search for a wallet, close the app, open it — gone. Users hate this.

**Problem 2: Screens can't share data.** If you favorite a wallet on the Explorer tab, the Settings tab has no idea. You'd have to pass props through every layout, which gets ugly fast.

**Problem 3: No offline capability.** If the user loses internet, the app shows nothing. A real app should show the last known data.

**Solution:** Zustand for global state + MMKV for persistence. These two together give you an offline-first app where data flows everywhere and survives restarts.

---

## Part 1: Zustand — Global State Made Simple

### What is Zustand?

Zustand (German for "state") is a tiny state management library. Think of it as React Context but without the boilerplate and re-render problems.

**Why not Context?**
Context re-renders every component that uses it when ANY value changes. Zustand only re-renders components that use the specific value that changed. In a list of 100 items, this is the difference between smooth and janky.

**Why not Redux?**
Redux is powerful but requires actions, reducers, dispatchers, middleware, and a lot of boilerplate. Zustand does the same thing in 10 lines.

### How Zustand Works

You define a store — a plain object with state and the functions that change it:

```ts
import { create } from "zustand";

interface WalletState {
  publicKey: string;
  balance: number | null;
  setPublicKey: (key: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: "",
  balance: null,
  setPublicKey: (key) => set({ publicKey: key }),
}));
```

Then use it anywhere in your app — no Provider, no context wrapping:

```ts
const { publicKey, setPublicKey } = useWalletStore();
```

That's it. Any component that calls `useWalletStore()` gets the same data. Change it in one place, it updates everywhere.

### Selectors — The Performance Key

Instead of pulling the whole store, you can subscribe to just the value you need:

```ts
// Re-renders when ANY store value changes
const store = useWalletStore();

// Re-renders ONLY when publicKey changes
const publicKey = useWalletStore((s) => s.publicKey);

// Re-renders ONLY when this specific address's favorite status changes
const favorited = useSettingsStore((s) => s.favorites.includes(address));
```

Selectors are how Zustand stays fast at scale. The more precise your selector, the fewer unnecessary re-renders.

### `getState()` — Calling Stores Outside of React

Hooks can only be called inside React components. But sometimes you need to call a store from a non-React context — like inside another store's action.

```ts
// Inside wallet-store's search() action — can't use hooks here
useSettingsStore.getState().addToHistory(addr);
```

`getState()` gives you direct access to the current store values and actions without subscribing. Use it for imperative calls from outside the component tree.

---

## Part 2: MMKV — Persistent Storage

### The Problem

Right now, Zustand state lives in memory. Close the app → state is gone. We need to persist it to the phone's storage.

### Why MMKV and Not AsyncStorage?

| | AsyncStorage | MMKV |
|---|---|---|
| Speed | ~50ms per read | ~0.01ms per read |
| Async? | Yes (needs `await`) | No (synchronous!) |
| Size limit | Recommended <6MB | Handles 100MB+ easily |
| Used by | Facebook (legacy) | WeChat (2B+ users) |

MMKV is **5000x faster** than AsyncStorage. It's what WeChat uses for 2 billion users. For a crypto app where you might store price data, transaction history, and multiple wallet data, speed matters.

### Install

```bash
npx expo install react-native-mmkv
```

> **Important:** MMKV requires a development build — it won't work in Expo Go because it contains native code. You need to run `npx expo run:android` or `npx expo run:ios` to create a dev build first.

### Connecting MMKV to Zustand

Zustand's `persist` middleware handles all the serialization. You just provide a storage adapter:

```ts
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const storage = new MMKV();

const mmkvAdapter = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // ... your state and actions
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => mmkvAdapter),
    },
  ),
);
```

Notice the curried `create<State>()()` syntax — the double call is required when using middleware with TypeScript.

### What Gets Persisted?

Zustand's `persist` middleware automatically serializes plain data values and ignores functions. You don't need to configure this — it just works:

```ts
// ✅ Persisted to storage
favorites: string[]
searchHistory: string[]
isDevnet: boolean

// ❌ Not persisted (functions are ignored automatically)
addFavorite: (address) => ...
toggleNetwork: () => ...
```

### AsyncStorage vs MMKV — Which to Use?

In this project we used **AsyncStorage** because it works with Expo Go (no dev build needed) and the performance difference doesn't matter for a few preference values. But if you're building a production app or storing larger data (price history, transaction cache), switch to MMKV.

---

## Part 3: Practical Patterns

### Pattern 1 — Separate Stores for Separate Concerns

Don't put everything in one store. Group by lifecycle:

```
wallet-store.ts     → blockchain data, ephemeral (resets on each search)
settings-store.ts   → user preferences, persistent (survives restarts)
swap-store.ts       → swap UI state, ephemeral
```

The rule: if two pieces of state change for different reasons and at different rates, they probably belong in different stores.

### Pattern 2 — Hydration Guard

AsyncStorage and MMKV reads are async. On app start there's a brief moment where the store has default values before persisted data loads in. Without a guard, your UI can flash wrong state.

```ts
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  const unsub = useSettingsStore.persist.onFinishHydration(() =>
    setHydrated(true),
  );
  // Handles the case where hydration already finished before this effect ran
  if (useSettingsStore.persist.hasHydrated()) setHydrated(true);
  return unsub;
}, []);

if (!hydrated) return <ActivityIndicator />;
```

### Pattern 3 — Cap Unbounded Lists

Any list that grows over time needs a cap. Search history without a limit becomes a memory problem:

```ts
addToHistory: (address) =>
  set((state) => ({
    searchHistory: [
      address,
      ...state.searchHistory.filter((a) => a !== address),
    ].slice(0, 20), // ← cap at 20 entries
  })),
```

The pattern: prepend the new item → dedupe → slice. Three operations, one `set()` call, always bounded.

---

## What We Built vs. What's Next

In this project we used **AsyncStorage** as the persistence layer — it works without a dev build and is fine for small preference data.

**The upgrade path:** When you're ready to store larger data (watchlist with price history, cached transactions, portfolio data), swap `asyncStorageAdapter` for an MMKV adapter. The store interface and all the actions stay exactly the same — only the adapter changes. That's the value of the abstraction in `lib/storage.ts`.

---

## Summary

| Concept | What It Does | When to Use |
|---------|-------------|-------------|
| Zustand store | Global state, shared across all screens | Any state that needs to be accessed from multiple places |
| Selectors | Subscribe to one value, not the whole store | Always — keeps re-renders minimal |
| `getState()` | Imperative store access outside React | Calling a store action from inside another store |
| `persist` middleware | Saves store to disk, loads on startup | Any state that should survive app restarts |
| AsyncStorage | Simple async key-value storage | Small preference data, Expo Go compatible |
| MMKV | Fast sync key-value storage, 5000x faster | Large data, production apps, dev build required |
| Hydration guard | Wait for persisted data to load | Any screen that reads from a persisted store |

---

[← Day 03](day-03.md) | [Back to README](../README.md)

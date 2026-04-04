# Day 05 — Wallet Connect via Mobile Wallet Adapter

**Date:** 2026-04-04
**Project:** [0xSol App](../README.md)
**Status:** Done

---

## Goal for the Day

Day 04 gave us a native Android build on a physical device. Today we go from **read-only** to **interactive** — connect to a real Solana wallet (Phantom) on the user's phone using the Mobile Wallet Adapter (MWA) protocol, read the connected wallet's data, and display connection state across the app.

---

## What We Built

1. **`useWallet` hook** — manages the full wallet connect/disconnect lifecycle via MWA
2. **`ConnectButton` component** — 3-state pill button (disconnected → connecting → connected)
3. **Wallet connect on home screen** — tap to connect, auto-loads balance/tokens/txns
4. **Connected wallet section in Settings** — shows connected address + disconnect option
5. **Android manifest fix** — added `solana-wallet://` URI scheme to `<queries>` so the app can discover Phantom
6. **Safe area fix for tab bar** — bottom tabs no longer hidden by Android system navigation buttons

---

## What We Did

### Step 1 — Created `hooks/useWallet.ts`

The core hook that wraps MWA's `transact()` function:

```tsx
const authResult = await transact(async (wallet: Web3MobileWallet) => {
  const result = await wallet.authorize({
    chain: `solana:${cluster}`,
    identity: APP_IDENTITY,
  });
  return result;
});
```

**How it works:**
1. `transact()` opens a secure local WebSocket connection to Phantom
2. `wallet.authorize()` tells Phantom our app identity and network
3. Phantom shows "0xSol wants to connect" → user approves
4. Returns the user's public key (base64-encoded)
5. We decode it to base58 and sync it to `useWalletStore`
6. `useWalletStore.search()` fires automatically → balance, tokens, txns load

**Key design decisions:**
- Hook stores `connectedPubkey` in local `useState` AND syncs to the Zustand `useWalletStore` — this lets existing `BalanceCard`, `TokenList`, `TransactionList` work with zero changes
- `disconnect()` clears both local state and Zustand store
- `cluster` is derived from `useSettingsStore.isDevnet` — toggling devnet in Settings changes the chain for the next connect
- Our app never sees the private key — Phantom handles all key management

**File:** `hooks/useWallet.ts`

---

### Step 2 — Created `components/explore/connect-button.tsx`

A presentational component with three visual states:

| State | Appearance |
|-------|------------|
| Disconnected | Purple (`#9945FF`) pill, wallet-outline icon, "Connect Wallet" |
| Connecting | Gray pill, `ActivityIndicator` spinner, "Connecting..." |
| Connected | Green-bordered pill, wallet icon, truncated address (`7xKX...sAsU`), close icon |

Props-driven — no business logic inside. The parent screen passes `onConnect`/`onDisconnect` callbacks.

**File:** `components/explore/connect-button.tsx`

---

### Step 3 — Integrated into the Explore Screen

Added `ConnectButton` between the "0xSol" title and the subtitle text in `app/(tabs)/index.tsx`:

```tsx
<Text style={shared.screenTitle}>0xSol</Text>
<ConnectButton
  connected={!!connectedPubkey}
  connecting={connecting}
  publicKey={connectedPubkey}
  onConnect={connect}
  onDisconnect={disconnect}
/>
<Text style={s.subtitle}>Enter a solana address...</Text>
```

When the user connects, the hook auto-calls `setPublicKey()` + `search()` on the wallet store, so `BalanceCard`, `TokenList`, and `TransactionList` populate automatically — no changes needed to those components.

The manual search bar still works independently.

**File:** `app/(tabs)/index.tsx` (modified)

---

### Step 4 — Added "Connected Wallet" Section to Settings

Added a new section at the top of the Settings screen with two states:

**Not connected:** Shows "No wallet connected" / "Tap to connect Phantom" with a chevron — tapping it triggers `connect()`.

**Connected:** Shows "Phantom" label with the truncated green monospace address and a red "Disconnect" button.

Uses the same `useWallet` hook — wallet state is shared across screens.

**File:** `app/(tabs)/settings.tsx` (modified)

---

### Step 5 — Fixed AndroidManifest for MWA Discovery

Android 11+ (API 30+) requires apps to declare which URI schemes they query via `<queries>` in the manifest. Without declaring `solana-wallet://`, the app can't discover Phantom and `transact()` silently fails.

Added to `AndroidManifest.xml`:

```xml
<queries>
  <!-- existing https query -->
  <intent>
    <action android:name="android.intent.action.VIEW"/>
    <data android:scheme="solana-wallet"/>
  </intent>
</queries>
```

This required a full native rebuild (`npx expo run:android`).

**File:** `android/app/src/main/AndroidManifest.xml` (modified)

---

### Step 6 — Fixed Tab Bar Hidden by System Navigation

The bottom tab bar used a fixed `height: 60` and `paddingBottom: 8`, which didn't account for Android soft navigation buttons. On devices with gesture nav or 3-button nav, tabs were partially hidden.

Fixed by using `useSafeAreaInsets()`:

```tsx
const insets = useSafeAreaInsets();
// ...
height: 60 + insets.bottom,
paddingBottom: insets.bottom || 8,
```

**File:** `app/(tabs)/_layout.tsx` (modified)

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/useWallet.ts` | Created | MWA connect/disconnect hook |
| `components/explore/connect-button.tsx` | Created | 3-state wallet button UI |
| `app/(tabs)/index.tsx` | Modified | Added ConnectButton to home screen |
| `app/(tabs)/settings.tsx` | Modified | Added Connected Wallet section |
| `android/app/src/main/AndroidManifest.xml` | Modified | Added `solana-wallet://` URI query |
| `app/(tabs)/_layout.tsx` | Modified | Safe area insets for tab bar |

---

## Architecture After Day 5

```
User taps "Connect Wallet"
  → useWallet.connect()
    → transact() opens Phantom via Android intent
      → wallet.authorize() → Phantom shows approval screen
        → User approves → base64 public key returned
          → Decode to base58
          → useWalletStore.setPublicKey(base58)
          → useWalletStore.search()
            → getBalance() + getTokens() + getTxns()
              → UI updates automatically (BalanceCard, TokenList, etc.)
```

Our app never touches the private key. Phantom holds it securely and only signs what the user explicitly approves.

---

## What's Next — Day 06: Signing & Sending Transactions

With wallet connection in place, the next step is enabling write operations on the blockchain.

### Plan

| Feature | What We'll Build |
|---------|-----------------|
| **Send SOL screen** | New screen with recipient address input, amount input, and "Send" button |
| **Build transactions** | Use `SystemProgram.transfer()` to create SOL transfer instructions |
| **Sign via Phantom** | Use `wallet.signAndSendTransactions()` inside `transact()` — Phantom shows tx details, user approves, Phantom signs + submits |
| **Transaction confirmation** | Poll for confirmation using `connection.confirmTransaction()`, show success/failure |
| **Transaction history** | After sending, the tx appears in the existing transaction list on the home screen |

### Key Concepts for Day 06

- **Transaction** = an envelope containing one or more instructions
- **Instruction** = a single operation (e.g., "transfer 0.1 SOL from A to B")
- **Blockhash** = a recent block hash required as a "timestamp" — transactions expire after ~60 seconds to prevent replay attacks
- **Fee payer** = who pays the transaction fee (~5000 lamports ≈ $0.0001)
- **`signAndSendTransactions()`** = Phantom signs with the private key and submits to the network — our app never sees the key

### Code Preview

```tsx
// Build the transaction
const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: new PublicKey(recipientAddress),
    lamports: Math.round(amountSOL * LAMPORTS_PER_SOL),
  })
);

// Set metadata
const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = publicKey;

// Sign and send via Phantom
const signature = await transact(async (wallet) => {
  await wallet.authorize({ chain, identity: APP_IDENTITY });
  const sigs = await wallet.signAndSendTransactions({
    transactions: [transaction],
  });
  return sigs[0];
});
```

### Testing Plan for Day 06
1. Toggle **devnet** in Settings
2. In Phantom: Settings → Developer Settings → Devnet
3. Get free devnet SOL from [faucet.solana.com](https://faucet.solana.com)
4. Send a small amount (0.01 SOL) to another devnet address
5. Verify the tx appears on [explorer.solana.com?cluster=devnet](https://explorer.solana.com?cluster=devnet)

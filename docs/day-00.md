# Day 00 — Why React Native, and How It Works

**Date:** 2026-04-01
**Project:** [0xSol App](../README.md)
**Status:** Research & Decision

---

## The Decision

Before writing a single line of app code, I wanted to be intentional about the stack. React Native isn't the only option — but after looking at the landscape, it's the right one for this project.

Here's my reasoning.

---

## Why React Native in 2026

Mobile development has two dominant platforms: **iOS (Swift/UIKit)** and **Android (Kotlin/Jetpack Compose)**. Building natively for both means two codebases, two languages, two teams. React Native solves that with one JavaScript codebase that compiles to real native UI on both platforms.

The pitch from 2015 still holds: **"Learn once, write anywhere."**

What's changed is the credibility. React Native isn't an experiment anymore. It's what ships production apps at:

- **Shopify** — 300 screens, 86% shared code, migrated their entire flagship app
- **Coinbase** — 100M+ users, billions in crypto transactions
- **Tesla** — the app that unlocks your car
- **Instagram** — up to 99% shared code across iOS and Android
- **Microsoft** — Teams, Office, Xbox

If it's good enough for those, it's good enough for a Solana wallet explorer.

I'm also already in the React mental model. React Native is the most direct path from web to mobile without relearning everything.

---

## How It Works — Architecture

### The Old Way (and Why It Was Slow)

The original React Native used a **Bridge** — a serialization layer between JavaScript and native platform code. Every interaction had to be converted to JSON, sent across the bridge, then converted back.

That caused real problems:
- UI flickering — layout updates arrived a frame late
- Sluggish animations under load
- Hard limits on data throughput (camera frames, real-time data)

### The New Architecture (0.76+, on by default)

Three concrete improvements:

**1. JSI (JavaScript Interface)**
JS and Native now share the same memory. No serialization, no bridge. They talk directly — like two threads in the same process pointing at the same objects. This is what makes real-time camera processing, gesture libraries, and low-latency updates possible now.

**2. Synchronous Layout**
Measure and apply layout in one step. Tooltips, modals, and overlays render in the right position immediately instead of visually jumping on first frame.

**3. React 18 Concurrent Features**
- **Automatic batching** — 100 rapid state updates get grouped into one render pass
- **Transitions** — low-priority updates (like rendering a long list) won't block high-priority ones (like keeping a text input responsive)

### What This Means Practically

No configuration needed for new projects — New Architecture is the default. But you have to use the right APIs to actually benefit from it (`useLayoutEffect` for sync layout, `useTransition` for deferred updates). The old code paths still work, they just don't get faster automatically.

---

## What I'm Building On

| Choice | Reason |
|--------|--------|
| React Native + Expo | Fastest path to cross-platform mobile with the RN ecosystem |
| New Architecture (default) | No legacy bridge overhead |
| TypeScript | Catch Solana address/type errors at compile time |
| Zustand | Minimal state management, no boilerplate |
| Solana JSON-RPC | Direct RPC calls, no SDK dependency to start |

---

## Next

Day 1 — scaffold the project, strip the boilerplate, build the wallet input UI.

[Day 01 →](day-01.md) | [Back to README](../README.md)

---

**References**
- [React Native Architecture Overview](https://reactnative.dev/architecture/overview)
- [RN New Architecture Deep Dive](https://medium.com/@ak8826844638/rn-new-architecture-ca43de8a33b7)

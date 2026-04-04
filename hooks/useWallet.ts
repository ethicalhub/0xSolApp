import { useState, useCallback } from "react";
import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useSettingsStore } from "@/stores/settings-store";
import { useWalletStore } from "@/stores/wallet-store";

const APP_IDENTITY = {
  name: "0xSol",
  uri: "https://0xsol.app",
  icon: "favicon.ico",
};

export function useWallet() {
  const [connectedPubkey, setConnectedPubkey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const isDevnet = useSettingsStore((s) => s.isDevnet);
  const cluster = isDevnet ? "devnet" : "mainnet-beta";

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const authResult = await transact(
        async (wallet: Web3MobileWallet) => {
          const result = await wallet.authorize({
            chain: `solana:${cluster}`,
            identity: APP_IDENTITY,
          });
          return result;
        }
      );

      const pubkey = new PublicKey(
        Buffer.from(authResult.accounts[0].address, "base64")
      );
      const base58 = pubkey.toBase58();

      setConnectedPubkey(base58);
      useWalletStore.getState().setPublicKey(base58);
      useWalletStore.getState().search();

      return base58;
    } catch (error) {
      console.error("Wallet connect failed:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [cluster]);

  const disconnect = useCallback(() => {
    setConnectedPubkey(null);
    useWalletStore.setState({
      publicKey: "",
      balance: null,
      tokens: [],
      txns: [],
    });
  }, []);

  return {
    connectedPubkey,
    connected: !!connectedPubkey,
    connecting,
    connect,
    disconnect,
  };
}

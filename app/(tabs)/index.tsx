import { BalanceCard } from "@/components/balance-card";
import { SearchBar } from "@/components/search-bar";
import { TokenList } from "@/components/token-list";
import { TransactionList } from "@/components/transaction-list";
import { colors, spacing } from "@/constants/theme";
import { useWalletStore } from "@/stores/wallet-store";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { publicKey, setPublicKey, balance, tokens, txns, loading, search } =
    useWalletStore();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll}>
        <Text style={s.title}>0xSol</Text>
        <Text style={s.subtitle}>
          Enter a solana address to view more details...
        </Text>

        <SearchBar
          value={publicKey}
          onChangeText={setPublicKey}
          onSearch={search}
          loading={loading}
        />

        {balance !== null && (
          <BalanceCard balance={balance} address={publicKey.trim()} />
        )}

        <TokenList tokens={tokens} />
        <TransactionList txns={txns} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.gray,
    fontSize: 15,
    marginBottom: spacing.xxl,
    fontWeight: "400",
  },
});

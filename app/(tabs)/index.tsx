import { BalanceCard } from "@/components/explore/balance-card";
import { SearchBar } from "@/components/explore/search-bar";
import { TokenList } from "@/components/explore/token-list";
import { TransactionList } from "@/components/explore/transaction-list";
import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import { useWalletStore } from "@/stores/wallet-store";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { publicKey, setPublicKey, balance, tokens, txns, loading, search } =
    useWalletStore();

  return (
    <SafeAreaView style={shared.safe}>
      <ScrollView style={shared.screenContainer}>
        <Text style={shared.screenTitle}>0xSol</Text>
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
  subtitle: {
    color: colors.gray,
    fontSize: 15,
    marginBottom: spacing.xxl,
    fontWeight: "400",
  },
});

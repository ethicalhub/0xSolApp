import { ActionButtons } from "@/components/token-detail/action-buttons";
import { HoldingsCard } from "@/components/token-detail/holdings-card";
import { MarketDataCard } from "@/components/token-detail/market-data-card";
import { PriceCard } from "@/components/token-detail/price-card";
import { TokenInfoCard } from "@/components/token-detail/token-info-card";
import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import { getTokenDetails } from "@/services/dexscreener";
import type { TokenDetails } from "@/types/dexscreener";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TokenDetailScreen() {
  const { mint, amount } = useLocalSearchParams<{ mint: string; amount: string }>();
  const [details, setDetails] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTokenDetails(mint);
        if (!data) {
          setError("No market data found for this token.");
        } else {
          setDetails(data);
        }
      } catch {
        setError("Failed to load token details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mint]);

  return (
    <SafeAreaView style={shared.safe} edges={["bottom"]}>
      {loading && (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      )}

      {!loading && error && (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {!loading && details && (
        <ScrollView
          style={shared.screenContainer}
          showsVerticalScrollIndicator={false}
        >
          <PriceCard details={details} />
          <HoldingsCard details={details} amount={parseFloat(amount ?? "0")} />
          <MarketDataCard details={details} />
          <TokenInfoCard details={details} />
          <View style={s.spacer} />
          <ActionButtons details={details} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.gray,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  spacer: {
    height: spacing.lg,
  },
});

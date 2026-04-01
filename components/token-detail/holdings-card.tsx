import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import type { TokenDetails } from "@/types/dexscreener";
import { StyleSheet, Text, View } from "react-native";

interface HoldingsCardProps {
  details: TokenDetails;
  amount: number;
}

export function HoldingsCard({ details, amount }: HoldingsCardProps) {
  const usdValue = amount * details.priceUsd;

  return (
    <View style={[shared.card, s.container]}>
      <Text style={shared.label}>YOUR HOLDINGS</Text>
      <Text style={s.amount}>
        {amount} {details.symbol}
      </Text>
      <Text style={s.usd}>${usdValue.toFixed(2)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  amount: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  usd: {
    color: colors.gray,
    fontSize: 14,
    marginTop: spacing.xs,
  },
});

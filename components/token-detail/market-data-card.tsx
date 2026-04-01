import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import type { TokenDetails } from "@/types/dexscreener";
import { StyleSheet, Text, View } from "react-native";

interface MarketDataCardProps {
  details: TokenDetails;
}

export function MarketDataCard({ details }: MarketDataCardProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Market Cap", value: formatUsd(details.marketCap) },
    { label: "FDV", value: formatUsd(details.fdv) },
    { label: "24h Volume", value: formatUsd(details.volume24h) },
    { label: "Liquidity", value: formatUsd(details.liquidityUsd) },
  ];

  return (
    <View style={[shared.card, s.container]}>
      <Text style={[shared.label, s.heading]}>MARKET DATA</Text>
      {rows.map((row, i) => (
        <View key={row.label} style={[shared.spaceBetween, i < rows.length - 1 && s.rowBorder]}>
          <Text style={s.rowLabel}>{row.label}</Text>
          <Text style={s.rowValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

const s = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  heading: {
    marginBottom: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  rowLabel: {
    color: colors.gray,
    fontSize: 14,
  },
  rowValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import { short } from "@/utils/format";
import type { TokenDetails } from "@/types/dexscreener";
import { StyleSheet, Text, View } from "react-native";

interface TokenInfoCardProps {
  details: TokenDetails;
}

export function TokenInfoCard({ details }: TokenInfoCardProps) {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Contract", value: short(details.mintAddress, 6), mono: true },
    { label: "Network", value: "Solana" },
    { label: "DEX", value: details.dexId },
  ];

  return (
    <View style={[shared.card, s.container]}>
      <Text style={[shared.label, s.heading]}>TOKEN INFO</Text>
      {rows.map((row, i) => (
        <View key={row.label} style={[shared.spaceBetween, i < rows.length - 1 && s.rowBorder]}>
          <Text style={s.rowLabel}>{row.label}</Text>
          <Text style={[s.rowValue, row.mono && s.mono]}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
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
    fontWeight: "500",
  },
  mono: {
    fontFamily: "monospace",
    color: colors.purple,
  },
});

import { StyleSheet, Text, View } from "react-native";
import { short } from "@/utils/format";
import { colors, radius, spacing } from "@/constants/theme";

interface BalanceCardProps {
  balance: number;
  address: string;
}

export function BalanceCard({ balance, address }: BalanceCardProps) {
  return (
    <View style={s.card}>
      <Text style={s.label}>SOL Balance</Text>
      <Text style={s.balance}>{balance.toFixed(4)}</Text>
      <Text style={s.sol}>SOL</Text>
      <Text style={s.addr}>{short(address, 6)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  balance: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
  },
  sol: {
    color: colors.green,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  addr: {
    color: colors.purple,
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: spacing.lg,
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
});

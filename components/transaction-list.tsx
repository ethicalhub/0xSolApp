import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { short, timeAgo } from "@/utils/format";
import { colors, radius, spacing } from "@/constants/theme";
import { SOLSCAN_BASE_URL } from "@/constants/solana";
import type { Transaction } from "@/types/solana";

interface TransactionListProps {
  txns: Transaction[];
}

export function TransactionList({ txns }: TransactionListProps) {
  if (txns.length === 0) return null;

  return (
    <>
      <Text style={s.section}>Recent Transactions</Text>
      <FlatList
        data={txns}
        keyExtractor={(t) => t.sig}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            onPress={() =>
              Linking.openURL(`${SOLSCAN_BASE_URL}/tx/${item.sig}`)
            }
            activeOpacity={0.8}
          >
            <View>
              <Text style={s.sig}>{short(item.sig, 8)}</Text>
              <Text style={s.time}>
                {item.time ? timeAgo(item.time) : "pending"}
              </Text>
            </View>
            <Text
              style={[
                s.statusIcon,
                { color: item.ok ? colors.green : colors.red },
              ]}
            >
              {item.ok ? "✓" : "✗"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

const s = StyleSheet.create({
  section: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "600",
    marginTop: spacing.xxxl,
    marginBottom: spacing.lg,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sig: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  time: {
    color: colors.gray,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: "400",
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: "600",
  },
});

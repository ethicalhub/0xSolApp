import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { short } from "@/utils/format";
import { colors, radius, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import type { Token } from "@/types/solana";

interface TokenListProps {
  tokens: Token[];
}

export function TokenList({ tokens }: TokenListProps) {
  const router = useRouter();

  if (tokens.length === 0) return null;

  return (
    <>
      <Text style={s.section}>Tokens</Text>
      <FlatList
        data={tokens}
        keyExtractor={(t) => t.mint}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.7}
            onPress={() => router.push(`/token/${item.mint}?amount=${item.amount}`)}
          >
            <Text style={s.mint}>{short(item.mint, 6)}</Text>
            <Text style={s.amount}>{item.amount}</Text>
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
  mint: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  amount: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "600",
  },
});

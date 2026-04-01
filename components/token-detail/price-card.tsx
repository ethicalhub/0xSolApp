import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import type { TokenDetails } from "@/types/dexscreener";
import { Image, StyleSheet, Text, View } from "react-native";

interface PriceCardProps {
  details: TokenDetails;
}

export function PriceCard({ details }: PriceCardProps) {
  const isPositive = details.priceChange24h >= 0;
  const changeColor = isPositive ? colors.green : colors.red;
  const changePrefix = isPositive ? "▲" : "▼";

  return (
    <View style={[shared.card, s.container]}>
      {details.imageUrl ? (
        <Image source={{ uri: details.imageUrl }} style={s.logo} />
      ) : (
        <View style={s.logoPlaceholder}>
          <Text style={s.logoText}>{details.symbol.charAt(0)}</Text>
        </View>
      )}
      <Text style={s.name}>{details.name}</Text>
      <Text style={s.symbol}>{details.symbol}</Text>

      <Text style={shared.label}>CURRENT PRICE</Text>
      <View style={[shared.row, s.priceRow]}>
        <Text style={s.price}>${formatPrice(details.priceUsd)}</Text>
        <View style={[s.badge, { backgroundColor: changeColor + "22" }]}>
          <Text style={[s.change, { color: changeColor }]}>
            {changePrefix} {Math.abs(details.priceChange24h).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatPrice(price: number): string {
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.0001) return price.toFixed(6);
  return price.toExponential(2);
}

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    marginBottom: spacing.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: spacing.md,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
  },
  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  symbol: {
    color: colors.gray,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  priceRow: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  price: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  change: {
    fontSize: 13,
    fontWeight: "600",
  },
});

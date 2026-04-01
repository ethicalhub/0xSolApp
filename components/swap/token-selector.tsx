import { colors, radius, spacing } from "@/constants/theme";
import { SwapToken } from "@/types/swap";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TokenSelectorProps {
  token: SwapToken;
  onPress: () => void;
}

export function TokenSelector({ token, onPress }: TokenSelectorProps) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: token.iconUri }} style={s.icon} />
      <Text style={s.symbol}>{token.symbol}</Text>
      <Ionicons name="chevron-down" size={16} color={colors.gray} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
  symbol: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

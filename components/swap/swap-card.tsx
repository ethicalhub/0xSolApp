import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import { SwapToken } from "@/types/swap";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TokenPickerModal } from "./token-picker-modal";
import { TokenSelector } from "./token-selector";

interface SwapCardProps {
  label: string;
  token: SwapToken;
  amount: string;
  onAmountChange: (v: string) => void;
  onTokenChange: (t: SwapToken) => void;
}

export function SwapCard({
  label,
  token,
  amount,
  onAmountChange,
  onTokenChange,
}: SwapCardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const usdValue =
    amount && !isNaN(parseFloat(amount))
      ? (parseFloat(amount) * token.usdPrice).toFixed(2)
      : "0.00";

  return (
    <>
      <View style={[shared.card, s.card]}>
        <Text style={shared.label}>{label}</Text>
        <View style={shared.spaceBetween}>
          <TokenSelector token={token} onPress={() => setPickerOpen(true)} />
          <TextInput
            style={s.input}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="0"
            placeholderTextColor={colors.gray}
            keyboardType="decimal-pad"
            textAlign="right"
          />
        </View>
        <View style={[shared.spaceBetween, s.footer]}>
          <Text style={shared.meta}>
            Balance: {token.balance.toLocaleString()} {token.symbol}
          </Text>
          <Text style={shared.meta}>${usdValue}</Text>
        </View>
      </View>

      <TokenPickerModal
        visible={pickerOpen}
        selected={token}
        onSelect={onTokenChange}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}

const s = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginLeft: spacing.md,
  },
  footer: {
    marginTop: spacing.xs,
  },
});

import { Button } from "@/components/ui/button";
import { SwapCard } from "@/components/swap/swap-card";
import { shared } from "@/constants/styles";
import { colors, spacing } from "@/constants/theme";
import { useSwapStore } from "@/stores/swap-store";
import { Ionicons } from "@expo/vector-icons";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SwapScreen() {
  const {
    fromToken, toToken,
    fromAmount, toAmount,
    setFromToken, setToToken,
    setFromAmount, setToAmount,
    flipTokens, canSwap,
  } = useSwapStore();

  return (
    <SafeAreaView style={shared.safe}>
      <KeyboardAvoidingView
        style={shared.safe}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={shared.screenContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={[shared.screenTitle, s.title]}>Swap Tokens</Text>

            <SwapCard
              label="You pay"
              token={fromToken}
              amount={fromAmount}
              onAmountChange={setFromAmount}
              onTokenChange={setFromToken}
            />

            <TouchableOpacity
              style={s.flipBtn}
              onPress={() => { Keyboard.dismiss(); flipTokens(); }}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical" size={20} color={colors.white} />
            </TouchableOpacity>

            <SwapCard
              label="You receive"
              token={toToken}
              amount={toAmount}
              onAmountChange={setToAmount}
              onTokenChange={setToToken}
            />

            {!canSwap && fromToken.symbol === toToken.symbol && (
              <Text style={s.warning}>Select different tokens to swap</Text>
            )}

            <Button
              title="Swap"
              disabled={!canSwap}
              onPress={() => {}}
              style={s.swapBtn}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  title: {
    marginBottom: spacing.xxl,
  },
  flipBtn: {
    alignSelf: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },
  warning: {
    color: colors.gray,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.md,
  },
  swapBtn: {
    marginTop: spacing.xl,
  },
});

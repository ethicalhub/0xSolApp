import { colors, spacing } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SwapScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.title}>Swap</Text>
        <Text style={s.subtitle}>Coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.gray,
    fontSize: 15,
  },
});

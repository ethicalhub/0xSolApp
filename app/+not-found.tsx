import { colors, spacing } from "@/constants/theme";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={s.container}>
        <Text style={s.heading}>404</Text>
        <Text style={s.sub}>Page not found</Text>
        <Link href="/" style={s.link}>
          Go back home
        </Link>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  heading: {
    color: colors.white,
    fontSize: 64,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  sub: {
    color: colors.gray,
    fontSize: 16,
    marginBottom: spacing.xxl,
  },
  link: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

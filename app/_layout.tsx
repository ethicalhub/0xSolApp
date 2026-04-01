import { colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="token/[mint]"
        options={{
          headerShown: true,
          title: "Token Details",
          headerBackTitle: "",
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

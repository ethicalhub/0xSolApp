import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shared } from "@/constants/styles";
import { colors, radius, spacing } from "@/constants/theme";
import { useSettingsStore } from "@/stores/settings-store";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDevnet, toggleNetwork, favorites, searchHistory, clearHistory } =
    useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useSettingsStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <SafeAreaView style={shared.safe}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={colors.green}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={shared.safe}>
      <ScrollView style={shared.screenContainer}>
        <Text style={shared.screenTitle}>Settings</Text>
        <Text style={s.subtitle}>Configure your wallet explorer</Text>

        {/* NETWORK */}
        <Text style={s.sectionLabel}>NETWORK</Text>
        <View style={shared.card}>
          <View style={shared.spaceBetween}>
            <View style={shared.row}>
              <Text style={s.rowIcon}>🧪</Text>
              <View>
                <Text style={s.rowTitle}>Devnet</Text>
                <Text style={s.rowSub}>Testing network (free SOL)</Text>
              </View>
            </View>
            <Switch
              value={isDevnet}
              onValueChange={toggleNetwork}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* DATA */}
        <Text style={s.sectionLabel}>DATA</Text>
        <View style={shared.card}>
          <TouchableOpacity
            style={shared.spaceBetween}
            onPress={() => router.push("/settings/saved-wallets")}
          >
            <View style={shared.row}>
              <Ionicons
                name="heart"
                size={18}
                color={colors.green}
                style={s.icon}
              />
              <Text style={s.rowTitle}>Saved Wallets</Text>
            </View>
            <View style={shared.row}>
              <Text style={s.count}>{favorites.length}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.gray}
              />
            </View>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity
            style={shared.spaceBetween}
            onPress={() => router.push("/settings/history")}
          >
            <View style={shared.row}>
              <Ionicons
                name="time"
                size={18}
                color={colors.green}
                style={s.icon}
              />
              <Text style={s.rowTitle}>Search History</Text>
            </View>
            <View style={shared.row}>
              <Text style={s.count}>{searchHistory.length}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.gray}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* DANGER ZONE */}
        <Text style={s.sectionLabel}>DANGER ZONE</Text>
        <TouchableOpacity style={s.dangerBtn} onPress={clearHistory}>
          <Ionicons name="trash" size={16} color={colors.red} />
          <Text style={s.dangerText}>Clear Search History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  subtitle: {
    color: colors.gray,
    fontSize: 15,
    fontWeight: "400",
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  rowTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  rowSub: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 2,
  },
  rowIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  icon: {
    marginRight: spacing.md,
  },
  count: {
    color: colors.gray,
    fontSize: 15,
    marginRight: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.red,
    padding: spacing.lg,
  },
  dangerText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: "600",
  },
});

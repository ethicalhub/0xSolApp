import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shared } from "@/constants/styles";
import { colors, radius, spacing } from "@/constants/theme";
import { useSettingsStore } from "@/stores/settings-store";
import { useWalletStore } from "@/stores/wallet-store";
import { short } from "@/utils/format";

export default function SavedWalletsScreen() {
  const router = useRouter();
  const { favorites, removeFavorite } = useSettingsStore();
  const { setPublicKey, search } = useWalletStore();

  const handleSelect = (address: string) => {
    setPublicKey(address);
    search();
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={shared.safe}>
      <View style={shared.screenContainer}>
        {/* Header */}
        <View style={[shared.row, s.header]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={s.title}>Saved Wallets</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="heart-outline" size={48} color={colors.gray} />
            <Text style={s.emptyText}>No saved wallets yet</Text>
            <Text style={s.emptySub}>
              Search a wallet and tap the heart icon to save it
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.row}
                onPress={() => handleSelect(item)}
              >
                <View style={shared.row}>
                  <Ionicons
                    name="heart"
                    size={16}
                    color={colors.green}
                    style={s.icon}
                  />
                  <Text style={s.address}>{short(item, 8)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFavorite(item)}>
                  <Ionicons name="close" size={18} color={colors.gray} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={s.divider} />}
            contentContainerStyle={s.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  list: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  icon: {
    marginRight: spacing.md,
  },
  address: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "monospace",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: 80,
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySub: {
    color: colors.gray,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
});

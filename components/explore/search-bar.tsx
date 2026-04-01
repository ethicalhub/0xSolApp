import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <>
      <View style={s.inputContainer}>
        <TextInput
          style={s.input}
          placeholder="Enter Solana address"
          placeholderTextColor={colors.gray}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={s.btnRow}>
        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={onSearch}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.dark} />
          ) : (
            <Text style={s.btnText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  input: {
    color: colors.white,
    fontSize: 15,
    paddingVertical: 14,
    fontWeight: "400",
  },
  btnRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  btn: {
    flex: 1,
    backgroundColor: colors.green,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.dark,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

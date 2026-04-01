import { shared } from "@/constants/styles";
import { colors, radius, spacing } from "@/constants/theme";
import { SWAP_TOKENS } from "@/constants/tokens";
import { SwapToken } from "@/types/swap";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

interface TokenPickerModalProps {
  visible: boolean;
  selected: SwapToken;
  onSelect: (token: SwapToken) => void;
  onClose: () => void;
}

export function TokenPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: TokenPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={s.sheet}>
        <View style={[shared.spaceBetween, s.header]}>
          <Text style={s.title}>Select Token</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.gray} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={SWAP_TOKENS}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => {
            const isSelected = item.symbol === selected.symbol;
            return (
              <TouchableOpacity
                style={[s.row, isSelected && s.rowSelected]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Image source={{ uri: item.iconUri }} style={s.icon} />
                <View style={s.info}>
                  <Text style={s.symbol}>{item.symbol}</Text>
                  <Text style={s.name}>{item.name}</Text>
                </View>
                <Text style={s.balance}>{item.balance.toLocaleString()}</Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.green} style={s.check} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: "60%",
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  rowSelected: {
    backgroundColor: colors.inputBg,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  symbol: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    color: colors.gray,
    fontSize: 13,
    marginTop: 2,
  },
  balance: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: "500",
  },
  check: {
    marginLeft: spacing.sm,
  },
});

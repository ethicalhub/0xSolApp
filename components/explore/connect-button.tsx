import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/constants/theme";

interface Props {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectButton({
  connected,
  connecting,
  publicKey,
  onConnect,
  onDisconnect,
}: Props) {
  if (connecting) {
    return (
      <View style={[s.button, s.connecting]}>
        <ActivityIndicator size="small" color={colors.white} />
        <Text style={s.buttonText}>Connecting...</Text>
      </View>
    );
  }

  if (connected && publicKey) {
    return (
      <TouchableOpacity
        style={[s.button, s.connected]}
        onPress={onDisconnect}
      >
        <Ionicons name="wallet" size={18} color={colors.green} />
        <Text style={s.connectedText}>
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </Text>
        <Ionicons name="close-circle-outline" size={16} color={colors.gray} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[s.button, s.disconnected]} onPress={onConnect}>
      <Ionicons name="wallet-outline" size={18} color={colors.white} />
      <Text style={s.buttonText}>Connect Wallet</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: spacing.md,
  },
  disconnected: {
    backgroundColor: colors.purple,
  },
  connected: {
    backgroundColor: "#14F19520",
    borderWidth: 1,
    borderColor: colors.green,
  },
  connecting: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  connectedText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "monospace",
  },
});

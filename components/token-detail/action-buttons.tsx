import { Button } from "@/components/ui/button";
import { SOLSCAN_BASE_URL } from "@/constants/solana";
import { colors, spacing } from "@/constants/theme";
import type { TokenDetails } from "@/types/dexscreener";
import { Linking, StyleSheet, View } from "react-native";

interface ActionButtonsProps {
  details: TokenDetails;
}

export function ActionButtons({ details }: ActionButtonsProps) {
  return (
    <View style={s.row}>
      <Button
        title="DexScreener"
        style={s.dex}
        onPress={() => Linking.openURL(details.pairUrl)}
      />
      <Button
        title="Solscan"
        style={s.solscan}
        textStyle={s.solscanText}
        onPress={() =>
          Linking.openURL(`${SOLSCAN_BASE_URL}/token/${details.mintAddress}`)
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  dex: {
    flex: 1,
  },
  solscan: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.green,
  },
  solscanText: {
    color: colors.green,
  },
});

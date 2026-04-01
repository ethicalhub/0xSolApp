import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "./theme";

export const shared = StyleSheet.create({
  // layout
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // surfaces
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  // typography
  screenTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "500",
  },
  meta: {
    color: colors.gray,
    fontSize: 13,
  },
});

import { colors, radius, spacing } from "@/constants/theme";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle?: object;
}

export function Button({ title, disabled, style, textStyle, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[s.btn, disabled && s.disabled, style]}
      disabled={disabled}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={[s.label, disabled && s.labelDisabled, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: colors.green,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.dark,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  labelDisabled: {
    color: colors.gray,
  },
});

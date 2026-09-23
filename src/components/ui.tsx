import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useI18n } from "../state/language";
import React from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { colors as c } from "../theme";
export const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, minWidth: 0 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: c.text,
    letterSpacing: -0.6,
  },
  heading: { fontSize: 16, fontWeight: "600", color: c.text },
  body: { fontSize: 14, color: c.text, lineHeight: 21 },
  muted: { fontSize: 13, color: c.muted, lineHeight: 19 },
  card: {
    backgroundColor: c.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    padding: 17,
  },
  section: { gap: 12 },
  label: { fontSize: 13, color: c.text, marginBottom: 8 },
  input: {
    backgroundColor: c.white,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: c.text,
  },
  hint: { backgroundColor: c.lime, borderRadius: 14, padding: 15, gap: 8 },
  error: { color: "#AF3838", fontSize: 13, lineHeight: 20 },
  center: { alignItems: "center", justifyContent: "center" },
});
export function Screen({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: width < 360 ? 14 : width >= 768 ? 32 : 20,
          gap: 21,
          paddingBottom: 30 + insets.bottom,
          paddingLeft: Math.max(
            width < 360 ? 14 : width >= 768 ? 32 : 20,
            insets.left,
          ),
          paddingRight: Math.max(
            width < 360 ? 14 : width >= 768 ? 32 : 20,
            insets.right,
          ),
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
        }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Button({
  title,
  onPress,
  outline = false,
  disabled = false,
  icon: Icon,
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: outline ? "transparent" : c.green,
        borderWidth: 1,
        borderColor: disabled ? c.line : c.green,
        borderRadius: 12,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 9,
        padding: 12,
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      })}
    >
      {Icon ? <Icon size={19} color={outline ? c.green : "white"} /> : null}
      <Text
        style={{
          color: outline ? c.green : "white",
          fontSize: 14,
          fontWeight: "600",
          textAlign: "center",
          flexShrink: 1,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  rawTitle = false,
  rawSubtitle = false,
}: {
  rawTitle?: boolean;
  rawSubtitle?: boolean;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}) {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(label)}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        padding: 9,
        minHeight: 44,
        minWidth: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        backgroundColor: pressed ? c.line : "transparent",
      })}
    >
      <Icon size={21} color={c.green} />
    </Pressable>
  );
}
export function Row({
  icon: Icon,
  title,
  subtitle,
  value,
  onPress,
  rawTitle = false,
  rawSubtitle = false,
}: {
  rawTitle?: boolean;
  rawSubtitle?: boolean;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  value?: React.ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Icon size={23} color={c.green} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text raw={rawTitle} style={s.body}>
          {title}
        </Text>
        {subtitle ? (
          <Text raw={rawSubtitle} style={s.muted}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value}
      {onPress ? <ChevronRight size={17} color={c.muted} /> : null}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[s.row, { minHeight: 53, paddingVertical: 7 }]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={[s.row, { minHeight: 53, paddingVertical: 7 }]}>
      {content}
    </View>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { t } = useI18n();
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={t(label)}
        placeholderTextColor={c.muted}
        {...props}
        placeholder={props.placeholder ? t(props.placeholder) : undefined}
        style={[s.input, props.style]}
      />
    </View>
  );
}
export function Segment({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#EBEFEA",
        padding: 4,
        borderRadius: 11,
        gap: 4,
      }}
    >
      {items.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 5,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: value === item ? c.green : "transparent",
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              fontWeight: value === item ? "600" : "400",
              color: value === item ? "white" : c.muted,
            }}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

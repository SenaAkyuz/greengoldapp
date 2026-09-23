import React, { createContext, use, useEffect, useState } from "react";
import { Text as NativeText, TextProps, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, translate } from "../lib/translations";
import { colors as c } from "../theme";
const Context = createContext<{
  language: Language;
  setLanguage: (value: Language) => Promise<void>;
}>({ language: "tr", setLanguage: async () => {} });
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setValue] = useState<Language>("tr");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("greengold.language")
      .then((value) => {
        if (active && (value === "tr" || value === "en")) setValue(value);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  async function setLanguage(value: Language) {
    await AsyncStorage.setItem("greengold.language", value);
    setValue(value);
  }
  return (
    <Context value={{ language, setLanguage }}>
      {ready ? children : null}
    </Context>
  );
}
export function useI18n() {
  const context = use(Context);
  const locale = context.language === "tr" ? "tr-TR" : "en-GB";
  return {
    ...context,
    locale,
    t: (key: string, values?: Record<string, string | number>) =>
      translate(context.language, key, values),
    number: (value: number) =>
      value.toLocaleString(locale, { maximumFractionDigits: 1 }),
  };
}
// Only known UI phrases are translated. Pass raw for names and user-authored content.
export function Text({
  children,
  raw = false,
  ...props
}: TextProps & { raw?: boolean }) {
  const { t } = useI18n();
  const content = raw
    ? children
    : React.Children.map(children, (child) =>
        typeof child === "string" ? t(child) : child,
      );
  return (
    <NativeText {...props} style={[{ flexShrink: 1 }, props.style]}>
      {content}
    </NativeText>
  );
}
export function LanguagePicker() {
  const { language, setLanguage, t } = useI18n();
  const [error, setError] = useState("");
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: c.muted, fontSize: 13 }}>Dil</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(
          [
            ["tr", "Türkçe"],
            ["en", "English"],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: language === value }}
            onPress={() => {
              setError("");
              void setLanguage(value).catch(() =>
                setError(t("Dil kaydedilemedi. Tekrar dene.")),
              );
            }}
            style={{
              flex: 1,
              minHeight: 44,
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: language === value ? c.green : c.line,
              backgroundColor: language === value ? c.lime : c.white,
              alignItems: "center",
            }}
          >
            <NativeText
              style={{
                color: c.green,
                fontWeight: language === value ? "600" : "400",
              }}
            >
              {label}
            </NativeText>
          </Pressable>
        ))}
      </View>
      {error ? (
        <NativeText
          accessibilityLiveRegion="polite"
          style={{ color: "#AF3838" }}
        >
          {error}
        </NativeText>
      ) : null}
    </View>
  );
}

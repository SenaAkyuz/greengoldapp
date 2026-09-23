import { Text, useI18n, LanguageProvider } from "../state/language";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { AppProvider, useApp } from "../state/app-state";
import { colors } from "../theme";
import { Button } from "../components/ui";
function Navigation() {
  const { t } = useI18n();
  const { ready, dataReady, error, retry, signOut } = useApp();
  if (!ready || (!dataReady && !error))
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 30, gap: 20 }}>
        <Text>{error}</Text>
        <Button title="Yeniden dene" onPress={retry} />
        <Button
          title="Çıkış yap"
          outline
          onPress={() => void signOut().catch(() => {})}
        />
      </View>
    );
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.green,
        headerStyle: { backgroundColor: colors.bg },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "GreenGoldApp" }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "GreenGoldApp", presentation: "modal" }}
      />
      <Stack.Screen
        name="detail"
        options={{ title: t("Detay"), presentation: "modal" }}
      />
    </Stack>
  );
}
export default function Root() {
  return (
    <View style={{ flex: 1, backgroundColor: "#EEF1EB", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          backgroundColor: colors.bg,
        }}
      >
        <LanguageProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <Navigation />
          </AppProvider>
        </LanguageProvider>
      </View>
    </View>
  );
}

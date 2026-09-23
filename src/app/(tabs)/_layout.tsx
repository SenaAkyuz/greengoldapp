import { useI18n } from "../../state/language";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import {
  House,
  CirclePlus,
  ChartNoAxesColumnIncreasing,
  BookUser,
} from "lucide-react-native";
import { useApp } from "../../state/app-state";
import { colors as c } from "../../theme";
export default function Layout() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { demo, userId } = useApp();
  if (!demo && !userId) return <Redirect href="/login" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: c.bg },
        tabBarActiveTintColor: c.green,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.bg,
          borderTopColor: c.line,
          height: 64 + Math.max(insets.bottom, 12),
          paddingTop: 9,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        tabBarLabelStyle: { fontSize: 10, marginTop: 3 },
      }}
    >
      {[
        { name: "index", title: "Bugün", icon: House },
        { name: "calculate", title: "Hesapla", icon: CirclePlus },
        { name: "report", title: "Rapor", icon: ChartNoAxesColumnIncreasing },
        { name: "passport", title: "Pasaport", icon: BookUser },
      ].map(({ name, title, icon: Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(title),
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <Icon color={color} size={22} />,
          }}
        />
      ))}
    </Tabs>
  );
}

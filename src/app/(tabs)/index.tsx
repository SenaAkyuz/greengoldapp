import { Text, useI18n } from "../../state/language";
import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { router } from "expo-router";
import {
  Bell,
  UserRound,
  Car,
  Utensils,
  House,
  Plus,
  RotateCcw,
  Lightbulb,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, IconButton, Row, Screen, s } from "../../components/ui";
import { colors as c } from "../../theme";
import { useApp } from "../../state/app-state";
import { localDate, today } from "../../lib/emissions";
export default function Home() {
  const { t, locale, number } = useI18n();
  const app = useApp();
  const inset = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const items = app.activities.filter((a) => a.date === today());
  const total = items.reduce((n, a) => n + a.kg, 0);
  async function repeat() {
    setMessage("");
    setCopying(true);
    try {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = app.activities.filter((a) => a.date === localDate(d));
      if (!yesterday.length) {
        setMessage("Dün kaydedilmiş aktivite yok. Aktivite ekleyerek başla.");
        return;
      }
      await app.add(
        yesterday.map((a) => ({
          ...a,
          date: today(),
          label: a.label + " · tekrar",
        })),
      );
      setMessage(
        t("{count} aktivite bugüne eklendi.", { count: yesterday.length }),
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setCopying(false);
    }
  }
  return (
    <Screen>
      <View style={[s.between, { paddingTop: inset.top + 4 }]}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: c.green,
            letterSpacing: -0.7,
          }}
        >
          GreenGold
        </Text>
        <View style={[s.row, { gap: 3 }]}>
          <IconButton
            icon={Bell}
            label="Bildirimler"
            onPress={() => router.push("/detail?kind=notifications")}
          />
          <IconButton
            icon={UserRound}
            label="Profil"
            onPress={() => router.push("/detail?kind=profile")}
          />
        </View>
      </View>
      <View style={{ gap: 5 }}>
        <Text style={s.title}>
          {t("Merhaba, {name}", {
            name:
              app.demo && app.name === "Misafir"
                ? t("Misafir")
                : app.name.split(" ")[0] || t("doğa dostu"),
          })}
        </Text>
        <Text style={s.muted}>Daha temiz bir yarın mümkün. 🌍</Text>
      </View>
      <View style={s.section}>
        <View style={s.between}>
          <Text style={s.heading}>Bugünkü izin</Text>
          <Text style={{ fontSize: 12, color: c.green }}>
            {new Date().toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              weekday: "long",
            })}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/detail?kind=activities")}
          style={{
            backgroundColor: c.green,
            borderRadius: 17,
            padding: 20,
            gap: 12,
            boxShadow: "0 5px 14px #15513E18",
          }}
        >
          <Text style={{ color: "#EDF4E8", fontSize: 14, fontWeight: "500" }}>
            Tahmini emisyon
          </Text>
          <View style={s.between}>
            <View style={[s.row, { alignItems: "baseline", gap: 7 }]}>
              <Text
                selectable
                style={{
                  fontSize: 53,
                  fontWeight: "600",
                  letterSpacing: -2,
                  color: "white",
                }}
              >
                {number(total)}
              </Text>
              <Text style={{ color: "#E8EFE6" }}>kg CO₂e</Text>
            </View>
            <View
              style={{
                width: 54,
                height: 54,
                borderWidth: 1,
                borderColor: "#FFFFFF28",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChartNoAxesColumnIncreasing color="#E6EDD6" size={28} />
            </View>
          </View>
          <View
            style={[
              s.between,
              {
                borderTopWidth: 1,
                borderTopColor: "#FFFFFF20",
                paddingTop: 13,
              },
            ]}
          >
            <Text style={{ color: "#E5EDE3", fontSize: 13 }}>
              {t("{count} aktivite kaydedildi", { count: items.length })}
            </Text>
            <ChevronRight size={18} color="#E5EDE3" />
          </View>
        </Pressable>
      </View>
      <View style={s.section}>
        <Text style={s.heading}>Kategorilere göre dağılım</Text>
        <View style={[s.card, { paddingVertical: 4 }]}>
          {[
            { label: "Ulaşım", icon: Car },
            { label: "Beslenme", icon: Utensils },
            { label: "Ev", icon: House },
          ].map(({ label, icon }, i) => (
            <View
              key={label}
              style={
                i ? { borderTopWidth: 1, borderTopColor: c.line } : undefined
              }
            >
              <Row
                icon={icon}
                title={label}
                onPress={() =>
                  router.push(
                    `/detail?kind=activities&category=${encodeURIComponent(label)}`,
                  )
                }
                value={
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", color: c.text }}
                  >
                    {number(
                      items
                        .filter((a) => a.category === label)
                        .reduce((n, a) => n + a.kg, 0),
                    )}
                    <Text
                      style={{
                        fontSize: 11,
                        color: c.muted,
                        fontWeight: "400",
                      }}
                    >
                      {" "}
                      kg CO₂e
                    </Text>
                  </Text>
                }
              />
            </View>
          ))}
        </View>
        <Button
          title="Aktivite ekle"
          icon={Plus}
          onPress={() => router.push("/calculate")}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={copying || app.busy}
        onPress={repeat}
        style={[s.card, s.row]}
      >
        <RotateCcw size={27} color={c.green} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={s.body}>
            {copying ? "Ekleniyor…" : "Dünkü rutinini kullan"}
          </Text>
          <Text style={s.muted}>Dünün aktivitelerini tekrar ekle.</Text>
        </View>
        <ChevronRight size={18} color={c.muted} />
      </Pressable>
      {message ? (
        <Text accessibilityLiveRegion="polite" style={s.muted}>
          {message}
        </Text>
      ) : null}
      <View style={[s.hint, s.row, { alignItems: "flex-start" }]}>
        <View
          style={{ backgroundColor: "#DFEBBD", borderRadius: 20, padding: 7 }}
        >
          <Lightbulb size={21} color={c.green} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 12, color: c.green }}>Bugünün önerisi</Text>
          <Text style={[s.body, { fontWeight: "600" }]}>
            Kısa mesafede yürümeyi dene.
          </Text>
          <Text style={{ fontSize: 12, color: c.green, lineHeight: 18 }}>
            Hem sağlığın hem de şehir için iyi bir adım.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

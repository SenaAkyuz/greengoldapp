import { Text, useI18n } from "../../state/language";
import React, { useState } from "react";
import { View, Share, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import {
  Settings,
  Globe2,
  CalendarDays,
  Layers2,
  BedDouble,
  Plane,
  Leaf,
  Share2,
  QrCode,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen, s, IconButton, Button, Row } from "../../components/ui";
import { useApp } from "../../state/app-state";
import { colors as c } from "../../theme";
export default function Passport() {
  const { t, locale } = useI18n();
  const app = useApp();
  const inset = useSafeAreaInsets();
  const [error, setError] = useState("");
  const days = new Set(app.activities.map((a) => a.date)).size;
  const categories = new Set(app.activities.map((a) => a.category)).size;
  const id = app.demo
    ? "GG · MİSAFİR"
    : `GG · ${app.userId?.slice(0, 8).toUpperCase()}`;
  return (
    <Screen>
      <View style={[s.between, { paddingTop: inset.top + 7 }]}>
        <View style={{ gap: 3, flex: 1 }}>
          <Text style={s.title}>Climate Passport</Text>
          <Text style={s.muted}>İklim yolculuğun, tek yerde.</Text>
        </View>
        <IconButton
          icon={Settings}
          label="Ayarlar"
          onPress={() => router.push("/detail?kind=profile")}
        />
      </View>
      <View
        style={{
          backgroundColor: c.deep,
          borderRadius: 19,
          padding: 22,
          gap: 21,
          overflow: "hidden",
          boxShadow: "0 6px 16px #103D3025",
        }}
      >
        {[0, 1, 2, 3, 4].map((n) => (
          <View
            key={n}
            style={{
              position: "absolute",
              width: 230 + n * 40,
              height: 230 + n * 40,
              borderWidth: 1,
              borderColor: "#DBC77A0C",
              borderRadius: 250,
              top: -90 - n * 20,
              right: -160 - n * 20,
            }}
          />
        ))}
        <View style={s.between}>
          <Text
            style={{
              color: c.gold,
              fontSize: 21,
              fontWeight: "600",
              letterSpacing: -0.6,
            }}
          >
            GreenGold
          </Text>
          <Text
            style={{
              color: c.gold,
              fontSize: 8,
              textAlign: "right",
              letterSpacing: 0.8,
            }}
          >
            A CLEANER TOMORROW
          </Text>
        </View>
        <View style={{ alignItems: "center", gap: 17, paddingTop: 2 }}>
          <Globe2 size={83} color={c.gold} strokeWidth={1.2} />
          <Text
            style={{
              color: c.gold,
              fontSize: 18,
              fontWeight: "600",
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            {(app.demo && app.name === "Misafir"
              ? t("Misafir")
              : app.name || t("doğa dostu")
            ).toLocaleUpperCase(locale)}
          </Text>
          <Text style={{ color: "#F3F1DD", fontSize: 14, letterSpacing: 1 }}>
            {id}
          </Text>
          <Text style={{ color: "#C6CCA6", fontSize: 11 }}>
            {app.demo ? "Örnek iklim pasaportu" : "Kişisel iklim pasaportun"}
          </Text>
        </View>
      </View>
      <View style={[s.row, { gap: 12 }]}>
        {[
          { icon: CalendarDays, value: days, label: "Kayıtlı gün" },
          { icon: Layers2, value: categories, label: "Aktivite türü" },
        ].map(({ icon: Icon, value, label }) => (
          <View key={label} style={[s.card, s.row, { flex: 1, padding: 13 }]}>
            <Icon size={25} color={c.green} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 23, fontWeight: "600", color: c.text }}>
                {value}
              </Text>
              <Text style={{ fontSize: 11, color: c.muted }}>{label}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.section}>
        <Text style={s.heading}>Seyahat kayıtları</Text>
        <View style={[s.row, { flexWrap: "wrap" }]}>
          <View style={[s.card, { flex: 1, minWidth: 125, padding: 11 }]}>
            <Row
              icon={BedDouble}
              title="Konaklama ekle"
              onPress={() => router.push("/detail?kind=stay")}
            />
          </View>
          <View style={[s.card, { flex: 1, padding: 11 }]}>
            <Row
              icon={Plane}
              title="Uçuş ekle"
              onPress={() => router.push("/detail?kind=flight")}
            />
          </View>
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.heading}>İklim katkılarım</Text>
        <View style={[s.card, { paddingVertical: 8 }]}>
          <Row
            icon={Leaf}
            title={
              app.contributions.length
                ? t("{count} katkı kaydedildi", {
                    count: app.contributions.length,
                  })
                : "İlk katkını ekle"
            }
            subtitle="Fidan dikimi, gönüllülük ve geri dönüşüm kayıtların."
            onPress={() => router.push("/detail?kind=contributions")}
          />
        </View>
      </View>
      <View style={{ gap: 9 }}>
        <Button
          title="Pasaportumu paylaş"
          icon={Share2}
          onPress={async () => {
            try {
              await Share.share({
                title: "GreenGoldApp",
                message: t(
                  "{brand} Climate Passport{demo} · {name} · {days} kayıtlı gün · {categories} aktivite türü. Daha temiz bir yarın mümkün.",
                  {
                    brand: "GreenGoldApp",
                    demo: app.demo ? " (Demo)" : "",
                    name: app.name,
                    days,
                    categories,
                  },
                ),
              });
            } catch (error) {
              if ((error as Error).name === "AbortError") return;
              if (Platform.OS === "web") {
                try {
                  await Clipboard.setStringAsync(
                    t(
                      "{brand} Climate Passport{demo} · {name} · {days} kayıtlı gün · {categories} aktivite türü. Daha temiz bir yarın mümkün.",
                      {
                        brand: "GreenGoldApp",
                        demo: app.demo ? " (Demo)" : "",
                        name: app.name,
                        days,
                        categories,
                      },
                    ),
                  );
                  setError(
                    "Pasaport özeti panoya kopyalandı. İstediğin yerde paylaşabilirsin.",
                  );
                } catch {
                  setError("Paylaşım açılamadı. QR kodunu kullanabilirsin.");
                }
              } else setError("Paylaşım açılamadı. Tekrar dene.");
            }
          }}
        />
        <Button
          outline
          title="QR kodumu göster"
          icon={QrCode}
          onPress={() => router.push("/detail?kind=qr")}
        />
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
    </Screen>
  );
}

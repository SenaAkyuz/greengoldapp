import { Text, useI18n } from "../../state/language";
import React, { useState } from "react";
import { View, Pressable, TextInput, Linking } from "react-native";
import { router } from "expo-router";
import {
  Car,
  BusFront,
  Bike,
  Footprints,
  Check,
  Leaf,
  Info,
  Minus,
  Plus,
  ExternalLink,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Screen,
  s,
  Button,
  Segment,
  IconButton,
  Field,
} from "../../components/ui";
import { colors as c } from "../../theme";
import { useApp } from "../../state/app-state";
import {
  Category,
  today,
  transportKg,
  foodKg,
  homeKg,
  FACTOR_VERSION,
} from "../../lib/emissions";
import { validateDate } from "../../lib/models";
import { metricsUrl } from "../../lib/firebase";
export default function Calculate() {
  const { t, number } = useI18n();
  const inset = useSafeAreaInsets();
  const app = useApp();
  const [source, setSource] = useState("Tahmini hesapla");
  const [category, setCategory] = useState<Category>("Ulaşım");
  const [mode, setMode] = useState("Araba");
  const [fuel, setFuel] = useState("Benzin");
  const [km, setKm] = useState("12");
  const [people, setPeople] = useState(1);
  const [amount, setAmount] = useState("1");
  const [food, setFood] = useState("Karışık");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(today());
  const distance = Number(km.replace(",", "."));
  const quantity = Number(amount.replace(",", "."));
  let kg = 0;
  let valid = true;
  try {
    kg =
      category === "Ulaşım"
        ? transportKg(mode, fuel, distance, people)
        : category === "Beslenme"
          ? foodKg(food, quantity)
          : homeKg(quantity);
    validateDate(date);
  } catch {
    valid = false;
  }
  async function save() {
    if (!valid) {
      setError("Lütfen geçerli, sıfırdan büyük bir miktar gir.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await app.add([
        {
          date,
          factorVersion: FACTOR_VERSION,
          category,
          kg,
          label:
            category === "Ulaşım"
              ? `${mode} · ${distance.toLocaleString("tr-TR", { useGrouping: false, maximumFractionDigits: 3 })} km`
              : category === "Beslenme"
                ? `${food} · ${quantity} öğün`
                : `Elektrik · ${quantity} kWh`,
        },
      ]);
      router.navigate("/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <Screen>
      <View
        style={{ paddingTop: inset.top + 14, gap: 5, alignItems: "center" }}
      >
        <Text style={s.heading}>
          {source === "3P Metrics giriş" ? "3P Metrics" : category + " ekle"}
        </Text>
        <Text style={s.muted}>Yaklaşık 20 saniye</Text>
      </View>
      <Segment
        items={["Tahmini hesapla", "3P Metrics giriş"]}
        value={source}
        onChange={setSource}
      />
      {source === "3P Metrics giriş" ? (
        <View style={{ gap: 23, paddingTop: 20 }}>
          <View style={[s.hint, s.center, { padding: 30 }]}>
            <Leaf size={40} color={c.green} />
            <Text style={s.title}>3P Metrics</Text>
            <Text style={[s.body, { textAlign: "center" }]}>
              Ölçüm için 3P Metrics web sitesine devam et.
            </Text>
          </View>
          <Text style={s.muted}>
            3P Metrics hesabına kendi web sitesinden giriş yapabilirsin. Bu
            aşamada ölçüm verilerin GreenGold’a aktarılmaz.
          </Text>
          <Button
            title="3P Metrics’e git"
            icon={ExternalLink}
            onPress={() =>
              Linking.openURL(metricsUrl || "https://www.3pmetrics.com/").catch(
                () => setError("Web sitesi açılamadı. Lütfen tekrar dene."),
              )
            }
          />
          {error ? <Text style={s.error}>{error}</Text> : null}
        </View>
      ) : (
        <>
          <Segment
            items={["Ulaşım", "Beslenme", "Ev"]}
            value={category}
            onChange={(v) => {
              setCategory(v as Category);
              setError("");
            }}
          />
          {category === "Ulaşım" ? (
            <>
              <Text style={s.title}>Nasıl seyahat ettin?</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {[
                  { name: "Araba", icon: Car },
                  { name: "Toplu taşıma", icon: BusFront },
                  { name: "Bisiklet", icon: Bike },
                  { name: "Yürüyüş", icon: Footprints },
                ].map(({ name, icon: Icon }) => (
                  <Pressable
                    key={name}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mode === name }}
                    onPress={() => setMode(name)}
                    style={{
                      flexBasis: "45%",
                      flexGrow: 1,
                      minHeight: 112,
                      padding: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: mode === name ? c.green : c.line,
                      backgroundColor: mode === name ? c.lime : c.white,
                    }}
                  >
                    {mode === name ? (
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: c.green,
                          borderRadius: 12,
                          padding: 3,
                        }}
                      >
                        <Check size={12} color="white" />
                      </View>
                    ) : null}
                    <Icon size={34} color={c.green} />
                    <Text
                      style={[
                        s.body,
                        { fontWeight: mode === name ? "600" : "400" },
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {mode === "Araba" ? (
                <View>
                  <Text style={s.label}>Yakıt türü</Text>
                  <Segment
                    items={["Benzin", "Dizel", "Elektrik"]}
                    value={fuel}
                    onChange={setFuel}
                  />
                </View>
              ) : null}
              <View>
                <Text style={s.label}>Mesafe</Text>
                <View style={s.row}>
                  <IconButton
                    icon={Minus}
                    label="Mesafeyi azalt"
                    onPress={() =>
                      setKm(String(Math.max(1, (distance || 1) - 1)))
                    }
                  />
                  <View
                    style={[s.input, s.row, { flex: 1, paddingVertical: 9 }]}
                  >
                    <TextInput
                      accessibilityLabel={t("Mesafe kilometre")}
                      keyboardType="decimal-pad"
                      value={km}
                      onChangeText={setKm}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: 22,
                        color: c.text,
                      }}
                    />
                    <Text style={s.muted}>km</Text>
                  </View>
                  <IconButton
                    icon={Plus}
                    label="Mesafeyi artır"
                    onPress={() =>
                      setKm(String(Math.min(10000, (distance || 0) + 1)))
                    }
                  />
                </View>
              </View>
              {mode === "Araba" ? (
                <View>
                  <Text style={s.label}>Araçtaki kişi sayısı</Text>
                  <View style={s.row}>
                    <IconButton
                      icon={Minus}
                      label="Kişi sayısını azalt"
                      onPress={() => setPeople(Math.max(1, people - 1))}
                    />
                    <Text
                      style={[
                        s.input,
                        {
                          flex: 1,
                          textAlign: "center",
                          fontSize: 22,
                          paddingVertical: 9,
                        },
                      ]}
                    >
                      {people}
                    </Text>
                    <IconButton
                      icon={Plus}
                      label="Kişi sayısını artır"
                      onPress={() => setPeople(Math.min(8, people + 1))}
                    />
                  </View>
                </View>
              ) : null}
            </>
          ) : category === "Beslenme" ? (
            <>
              <Text style={s.title}>Bugün nasıl beslendin?</Text>
              <Segment
                items={["Bitkisel", "Karışık", "Et ağırlıklı"]}
                value={food}
                onChange={setFood}
              />
              <Field
                label="Öğün sayısı"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </>
          ) : (
            <>
              <Text style={s.title}>Evdeki enerji kullanımın</Text>
              <Field
                label="Elektrik tüketimi (kWh)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <Text style={s.muted}>
                Faturandaki tüketim miktarını kullanabilirsin.
              </Text>
            </>
          )}
          <Field
            label="Tarih (YYYY-AA-GG)"
            value={date}
            onChangeText={setDate}
            maxLength={10}
          />
          <View style={[s.hint, s.row]}>
            <Leaf size={21} color={c.green} />
            <Text style={{ fontSize: 13, color: c.green }}>
              Tahmini emisyon ·{" "}
              <Text style={{ fontWeight: "700" }}>
                {valid ? number(kg) : "—"} kg CO₂e
              </Text>
            </Text>
          </View>
          {error ? (
            <Text accessibilityLiveRegion="polite" style={s.error}>
              {error}
            </Text>
          ) : null}
          <View style={{ gap: 13 }}>
            <Button
              title={saving ? "Kaydediliyor…" : "Kaydet"}
              disabled={saving || app.busy}
              onPress={save}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/detail?kind=method")}
              style={[s.row, { justifyContent: "center", gap: 5 }]}
            >
              <Info size={14} color={c.muted} />
              <Text style={{ fontSize: 11, color: c.muted }}>
                Hesaplama yöntemi
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

import { activityCopy } from "../lib/activity-copy";
import { Text, useI18n, LanguagePicker } from "../state/language";
import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Stack, router, useLocalSearchParams, Redirect } from "expo-router";
import {
  Leaf,
  Bell,
  Car,
  LogOut,
  Check,
  Trash2,
  Plane,
  BedDouble,
} from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { Screen, Button, Field, Segment, Row, s } from "../components/ui";
import { useApp } from "../state/app-state";
import { colors as c } from "../theme";
import {
  today,
  flightKg,
  stayKg,
  FACTOR_VERSION,
  positive,
} from "../lib/emissions";
import { validateDate, notifications } from "../lib/models";
import { auth, emulatorMode } from "../lib/firebase";
const titles: Record<string, string> = {
  profile: "Profil ve ayarlar",
  goal: "Aylık hedef",
  method: "Hesaplama yöntemi",
  qr: "Pasaport QR kodu",
  activities: "Aktivite kayıtları",
  notifications: "Bildirimler",
  stay: "Konaklama ekle",
  flight: "Uçuş ekle",
  contributions: "İklim katkılarım",
};
export default function Detail() {
  const { t, locale, number, language } = useI18n();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    kind: string;
    category?: string;
    period?: string;
    date?: string;
  }>();
  const kind = params.kind || "activities";
  const app = useApp();
  const [value, setValue] = useState(
    kind === "profile" ? app.name : app.goal?.toString() || "150",
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [remove, setRemove] = useState("");
  const [date, setDate] = useState(today());
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("1");
  const [rooms, setRooms] = useState("1");
  const [people, setPeople] = useState("1");
  const [distance, setDistance] = useState("500");
  const [cabin, setCabin] = useState("Ekonomi");
  const [trip, setTrip] = useState("Tek yön");
  const [contributionKind, setContributionKind] = useState("Fidan dikimi");
  const [note, setNote] = useState("");
  if (!app.demo && !app.userId) return <Redirect href="/login" />;
  const locked = pending || app.busy;
  async function perform(task: () => Promise<void>) {
    if (locked) return;
    setPending(true);
    setError("");
    try {
      await task();
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }
  function numeric(v: string) {
    return Number(v.replace(",", "."));
  }
  let estimate: number | null = null;
  try {
    estimate =
      kind === "flight"
        ? flightKg(
            numeric(distance),
            cabin,
            trip === "Gidiş dönüş",
            numeric(people),
          )
        : kind === "stay"
          ? stayKg(numeric(amount), numeric(rooms), numeric(people))
          : null;
  } catch {}
  async function saveTravel() {
    validateDate(date);
    if (!title.trim())
      throw new Error(
        kind === "flight" ? "Uçuş güzergâhını gir." : "Konaklama adını gir.",
      );
    if (estimate === null) throw new Error("Geçerli miktarları gir.");
    await app.add([
      {
        date,
        category: kind === "flight" ? "Ulaşım" : "Ev",
        kind,
        label:
          kind === "flight"
            ? title.trim() +
              " · " +
              distance +
              " km · " +
              trip +
              " · " +
              cabin +
              " · " +
              people +
              " kişi"
            : title.trim() +
              " · " +
              amount +
              " gece · " +
              rooms +
              " oda / " +
              people +
              " kişi",
        kg: estimate,
        factorVersion: FACTOR_VERSION,
      },
    ]);
    router.back();
  }
  const selectedDate = params.date || today();
  const period = params.period || "Gün";
  const items = app.activities
    .filter(
      (a) =>
        (period === "Tümü" ||
          (period === "Ay"
            ? a.date.slice(0, 7) === selectedDate.slice(0, 7)
            : period === "Yıl"
              ? a.date.slice(0, 4) === selectedDate.slice(0, 4)
              : a.date === selectedDate)) &&
        (!params.category || a.category === params.category),
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0),
    );
  const messages = notifications(app);
  return (
    <Screen>
      <Stack.Screen options={{ title: t(titles[kind] || "Detay") }} />
      {kind === "profile" || kind === "goal" ? (
        <>
          <View style={s.hint}>
            <Text style={s.body}>
              {kind === "goal"
                ? "Aylık emisyon hedefini belirle."
                : app.demo
                  ? "Misafir demo hesabı · Kayıtlar bu cihazda"
                  : emulatorMode
                    ? "Yerel Firebase test hesabı"
                    : "Firebase hesabın · Sana özel bulut kayıtları"}
            </Text>
            {kind === "profile" && auth?.currentUser?.email ? (
              <Text style={s.muted}>{auth.currentUser.email}</Text>
            ) : null}
          </View>
          <Field
            label={kind === "goal" ? "Aylık hedef (kg CO₂e)" : "Ad soyad"}
            value={value}
            maxLength={kind === "profile" ? 80 : 10}
            onChangeText={(v) => {
              setValue(v);
              setSaved(false);
            }}
            keyboardType={kind === "goal" ? "decimal-pad" : "default"}
          />
          <Button
            title={locked ? "Kaydediliyor…" : saved ? "Kaydedildi" : "Kaydet"}
            icon={saved ? Check : undefined}
            disabled={locked}
            onPress={() =>
              perform(() =>
                kind === "goal"
                  ? app.setGoal(numeric(value))
                  : app.rename(value),
              )
            }
          />
          {kind === "profile" ? <LanguagePicker /> : null}
          {kind === "profile" ? (
            <Button
              outline
              title="Çıkış yap"
              icon={LogOut}
              disabled={locked}
              onPress={() =>
                perform(async () => {
                  await app.signOut();
                  router.replace("/login");
                })
              }
            />
          ) : null}
        </>
      ) : kind === "flight" || kind === "stay" ? (
        <>
          <View style={s.row}>
            {kind === "flight" ? (
              <Plane color={c.green} />
            ) : (
              <BedDouble color={c.green} />
            )}
            <Text style={s.title}>
              {kind === "flight" ? "Uçuşunu kaydet" : "Konaklamanı kaydet"}
            </Text>
          </View>
          <Field
            label={
              kind === "flight"
                ? "Güzergâh (örn. İstanbul – Ankara)"
                : "Otel / konaklama adı"
            }
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Field
            label="Tarih (YYYY-AA-GG)"
            value={date}
            onChangeText={setDate}
            maxLength={10}
          />
          {kind === "flight" ? (
            <>
              <Field
                label="Tek yön mesafesi (km)"
                value={distance}
                onChangeText={setDistance}
                keyboardType="decimal-pad"
              />
              <Segment
                items={["Tek yön", "Gidiş dönüş"]}
                value={trip}
                onChange={setTrip}
              />
              <Segment
                items={["Ekonomi", "Business"]}
                value={cabin}
                onChange={setCabin}
              />
              <Field
                label="Kaydedilecek yolcu sayısı"
                value={people}
                onChangeText={setPeople}
                keyboardType="number-pad"
              />
            </>
          ) : (
            <>
              <Field
                label="Gece sayısı"
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
              />
              <Field
                label="Oda sayısı"
                value={rooms}
                onChangeText={setRooms}
                keyboardType="number-pad"
              />
              <Field
                label="Emisyonu paylaşan kişi sayısı"
                value={people}
                onChangeText={setPeople}
                keyboardType="number-pad"
              />
            </>
          )}
          <View style={s.hint}>
            <Text style={s.heading}>
              {`${t("Tahmini emisyon")} · ${estimate === null ? "—" : number(estimate)} kg CO₂e`}
            </Text>
            <Text style={s.muted}>
              {kind === "flight"
                ? "Seçilen yolcuların toplamı; gidiş dönüşte mesafe iki kat alınır."
                : "Oda-gece toplamı seçilen kişi sayısına bölünür."}
            </Text>
          </View>
          <Button
            title={locked ? "Kaydediliyor…" : "Kaydet"}
            disabled={locked}
            onPress={() => perform(saveTravel)}
          />
          <Button
            outline
            title="Hesaplama yöntemi"
            onPress={() => router.push("/detail?kind=method")}
          />
        </>
      ) : kind === "contributions" ? (
        <>
          <Text style={s.title}>İklim katkılarım</Text>
          <Text style={s.muted}>
            Gerçekleştirdiğin katkıyı kaydet. Bu kayıtlar emisyon toplamından
            düşülmez ve sertifika yerine geçmez.
          </Text>
          <Segment
            items={["Fidan dikimi", "Gönüllülük", "Geri dönüşüm"]}
            value={contributionKind}
            onChange={setContributionKind}
          />
          <Field
            label="Katkı / proje adı"
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />
          <Field
            label="Tarih (YYYY-AA-GG)"
            value={date}
            onChangeText={setDate}
            maxLength={10}
          />
          <Field
            label={
              contributionKind === "Fidan dikimi"
                ? "Fidan sayısı"
                : contributionKind === "Gönüllülük"
                  ? "Süre (saat)"
                  : "Miktar (kg)"
            }
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <Field
            label="Not (isteğe bağlı)"
            value={note}
            onChangeText={setNote}
            maxLength={500}
            multiline
          />
          <Button
            title={locked ? "Kaydediliyor…" : "Katkıyı kaydet"}
            disabled={locked}
            onPress={() =>
              perform(async () => {
                validateDate(date);
                if (!title.trim()) throw new Error("Katkı adını gir.");
                const quantity = positive(
                  numeric(amount),
                  100000,
                  contributionKind === "Fidan dikimi",
                );
                await app.addContribution({
                  date,
                  title: title.trim(),
                  kind: contributionKind,
                  quantity,
                  note: note.trim(),
                });
                setTitle("");
                setNote("");
              })
            }
          />
          {saved ? (
            <Text accessibilityLiveRegion="polite" style={s.body}>
              Katkı kaydedildi.
            </Text>
          ) : null}
          <Text style={s.heading}>
            {t("Kayıtlı katkılar ({count})", {
              count: app.contributions.length,
            })}
          </Text>
          {app.contributions.length ? (
            app.contributions
              .slice()
              .reverse()
              .map((entry) => (
                <View key={entry.id} style={s.card}>
                  <Row
                    icon={Leaf}
                    rawTitle
                    title={entry.title}
                    subtitle={
                      entry.date +
                      " · " +
                      t(entry.kind) +
                      " · " +
                      number(entry.quantity) +
                      " " +
                      (language === "en" && entry.quantity === 1
                        ? entry.kind === "Fidan dikimi"
                          ? "tree"
                          : entry.kind === "Gönüllülük"
                            ? "hour"
                            : "kg"
                        : t(
                            entry.kind === "Fidan dikimi"
                              ? "adet"
                              : entry.kind === "Gönüllülük"
                                ? "saat"
                                : "kg",
                          ))
                    }
                  />
                  {entry.note ? (
                    <Text raw style={s.muted}>
                      {entry.note}
                    </Text>
                  ) : null}
                  <Button
                    outline
                    title={remove === entry.id ? "Silmeyi onayla" : "Kaydı sil"}
                    disabled={locked}
                    icon={Trash2}
                    onPress={() => {
                      if (remove === entry.id)
                        void perform(async () => {
                          await app.removeContribution(entry.id);
                          setRemove("");
                        });
                      else setRemove(entry.id);
                    }}
                  />
                  {remove === entry.id ? (
                    <Button
                      outline
                      title="Vazgeç"
                      onPress={() => setRemove("")}
                    />
                  ) : null}
                </View>
              ))
          ) : (
            <Text style={s.muted}>Henüz katkı yok.</Text>
          )}
        </>
      ) : kind === "notifications" ? (
        <>
          <Text style={s.title}>Bildirimlerin</Text>
          <Text style={s.muted}>
            Hesabındaki aktivite ve katkı güncellemeleri.
          </Text>
          <Button
            title="Tümünü okundu işaretle"
            disabled={locked || messages.every((m) => m.time <= app.readAt)}
            onPress={() => perform(app.markRead)}
          />
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                s.card,
                { backgroundColor: m.time > app.readAt ? c.lime : c.white },
              ]}
            >
              <Row
                icon={Bell}
                title={m.title}
                rawSubtitle
                subtitle={
                  app.activities.some((a) => a.id === m.id)
                    ? activityCopy(
                        app.activities.find((a) => a.id === m.id)!,
                        language,
                      )
                    : m.id === "welcome"
                      ? t(m.body)
                      : m.body
                }
              />
              <Text style={s.muted}>
                {new Date(m.time).toLocaleString(locale)} ·{" "}
                {m.time > app.readAt ? "Yeni" : "Okundu"}
              </Text>
            </View>
          ))}
        </>
      ) : kind === "activities" ? (
        <>
          <Text style={s.title}>{params.category || "Aktivite kayıtları"}</Text>
          <Text style={s.muted}>
            {period === "Tümü" ? "Tüm tarihler" : selectedDate} ·{" "}
            {t("{count} kayıt", { count: items.length })}
          </Text>
          {items.length ? (
            items.map((item) => (
              <View key={item.id} style={s.card}>
                <Row
                  icon={
                    item.kind === "flight"
                      ? Plane
                      : item.kind === "stay"
                        ? BedDouble
                        : Car
                  }
                  rawTitle
                  title={activityCopy(item, language)}
                  subtitle={item.date + " · " + t(item.category)}
                  value={<Text style={s.body}>{number(item.kg)} kg</Text>}
                />
                <Button
                  outline
                  icon={Trash2}
                  title={remove === item.id ? "Silmeyi onayla" : "Kaydı sil"}
                  disabled={locked}
                  onPress={() => {
                    if (remove === item.id)
                      void perform(async () => {
                        await app.removeActivity(item.id);
                        setRemove("");
                      });
                    else setRemove(item.id);
                  }}
                />
                {remove === item.id ? (
                  <Button
                    outline
                    title="Vazgeç"
                    onPress={() => setRemove("")}
                  />
                ) : null}
              </View>
            ))
          ) : (
            <Text style={s.muted}>Bu dönemde kayıt yok.</Text>
          )}
          <Button
            title="Aktivite ekle"
            onPress={() => router.replace("/calculate")}
          />
        </>
      ) : kind === "qr" ? (
        <View style={{ alignItems: "center", gap: 26, paddingVertical: 35 }}>
          <QRCode
            value={JSON.stringify({
              app: "GreenGoldApp",
              type: "climate-passport",
              id: app.userId || "local-guest",
              name: app.name,
              demo: app.demo,
            })}
            size={Math.min(220, Math.max(100, width - 80))}
            color={c.green}
          />
          <Text raw style={[s.heading, { textAlign: "center" }]}>
            {app.name}
          </Text>
          <Text style={[s.muted, { textAlign: "center" }]}>
            QR kodu pasaport adını ve kimliğini içerir. Doğrulanmış karbon
            sertifikası değildir.
          </Text>
        </View>
      ) : (
        <>
          <Leaf color={c.green} size={36} />
          <Text style={s.title}>Tahmini hesaplama</Text>
          <Text style={s.body}>
            Sonuçlar girilen miktarlar ve örnek katsayılarla hesaplanır;
            doğrulanmış ölçüm veya 3P Metrics raporu değildir.
          </Text>
          <View style={s.card}>
            <Text style={s.body}>
              Araba: km × katsayı ÷ kişi. Benzin 0,175; dizel 0,170; elektrik
              0,060 kg CO₂e/km. Toplu taşıma: 0,065 kg CO₂e/yolcu-km.
            </Text>
          </View>
          <Text style={s.body}>
            Bisiklet ve yürüyüş: doğrudan emisyon 0. Beslenme: bitkisel 1,
            karışık 2,8, et ağırlıklı 5 kg CO₂e/öğün. Ev elektriği: 0,42 kg
            CO₂e/kWh.
          </Text>
          <Text style={s.body}>
            Uçuş: tek yön km × 0,158 × kabin çarpanı × yön sayısı × yolcu.
            Ekonomi 1, Business 2,5. Konaklama: gece × oda × 15 kg CO₂e ÷
            paylaşan kişi.
          </Text>
          <Text style={s.muted}>
            {t(
              "Katsayı sürümü: {version}. Üretim öncesi onaylı veri setiyle değiştirilmelidir. Katkılar emisyonlardan otomatik düşülmez.",
              { version: FACTOR_VERSION },
            )}
          </Text>
        </>
      )}
      {error ? (
        <Text accessibilityLiveRegion="polite" style={s.error}>
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

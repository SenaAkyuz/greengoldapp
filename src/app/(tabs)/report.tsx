import { Text, useI18n } from "../../state/language";
import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Car,
  Utensils,
  House,
  ChartNoAxesColumnIncreasing,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Screen,
  s,
  Segment,
  IconButton,
  Button,
  Row,
} from "../../components/ui";
import { useApp } from "../../state/app-state";
import { colors as c } from "../../theme";
import { localDate } from "../../lib/emissions";
export default function Report() {
  const { t, locale, number } = useI18n();
  const { activities, goal } = useApp();
  const inset = useSafeAreaInsets();
  const [period, setPeriod] = useState("Ay");
  const [date, setDate] = useState(new Date());
  const key = localDate(date);
  const filtered = activities.filter((a) =>
    period === "Gün"
      ? a.date === key
      : period === "Ay"
        ? a.date.slice(0, 7) === key.slice(0, 7)
        : a.date.slice(0, 4) === key.slice(0, 4),
  );
  const total = filtered.reduce((n, a) => n + a.kg, 0);
  const days = new Set(filtered.map((a) => a.date)).size;
  const categories = [
    { title: "Ulaşım", icon: Car },
    { title: "Beslenme", icon: Utensils },
    { title: "Ev", icon: House },
  ].map((a) => ({
    ...a,
    kg: filtered
      .filter((x) => x.category === a.title)
      .reduce((n, x) => n + x.kg, 0),
  }));
  const largest = [...categories].sort((a, b) => b.kg - a.kg)[0];
  const count =
    period === "Yıl"
      ? 12
      : period === "Gün"
        ? 3
        : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const bars = Array.from({ length: count }, (_, i) =>
    period === "Gün"
      ? categories[i].kg
      : filtered
          .filter(
            (a) =>
              Number(a.date.split("-")[period === "Yıl" ? 1 : 2]) === i + 1,
          )
          .reduce((n, a) => n + a.kg, 0),
  );
  const max = Math.max(1, ...bars);
  const caption =
    period === "Yıl"
      ? date.getFullYear().toString()
      : date.toLocaleDateString(
          locale,
          period === "Gün"
            ? { day: "numeric", month: "long", year: "numeric" }
            : { month: "long", year: "numeric" },
        );
  function move(delta: number) {
    setDate((d) =>
      period === "Yıl"
        ? new Date(d.getFullYear() + delta, d.getMonth(), 1)
        : period === "Ay"
          ? new Date(d.getFullYear(), d.getMonth() + delta, 1)
          : new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta),
    );
  }
  return (
    <Screen>
      <Text style={[s.title, { paddingTop: inset.top + 16 }]}>
        {t(
          period === "Ay"
            ? "Aylık özet"
            : period === "Gün"
              ? "Günlük özet"
              : "Yıllık özet",
        )}
      </Text>
      <Segment
        items={["Gün", "Ay", "Yıl"]}
        value={period}
        onChange={setPeriod}
      />
      <View style={s.between}>
        <IconButton
          icon={ChevronLeft}
          label="Önceki dönem"
          onPress={() => move(-1)}
        />
        <Text style={s.heading}>{caption}</Text>
        <IconButton
          icon={ChevronRight}
          label="Sonraki dönem"
          onPress={() => move(1)}
        />
      </View>
      <View style={[s.card, { gap: 23 }]}>
        <View style={s.between}>
          <View>
            <Text style={s.body}>
              {t(`Bu ${period.toLocaleLowerCase("tr-TR")} kaydedilen`)}
            </Text>
            <Text
              selectable
              style={{
                fontSize: 45,
                fontWeight: "700",
                color: c.green,
                letterSpacing: -1,
              }}
            >
              {number(total)}
              <Text style={{ fontSize: 12, fontWeight: "400", color: c.text }}>
                {" "}
                kg CO₂e
              </Text>
            </Text>
          </View>
          <View style={[s.hint, s.row, { padding: 10, gap: 7 }]}>
            <CalendarDays size={21} color={c.green} />
            <Text style={{ fontSize: 11, color: c.green, lineHeight: 16 }}>
              {t("{count} kayıtlı gün", { count: days })}
            </Text>
          </View>
        </View>
        <View style={{ height: 155, flexDirection: "row", gap: 8 }}>
          <View style={{ justifyContent: "space-between", paddingBottom: 2 }}>
            {[max, max / 2, 0].map((v, i) => (
              <Text key={i} style={{ fontSize: 9, color: c.muted }}>
                {number(v)}
              </Text>
            ))}
          </View>
          <View
            accessibilityLabel={t(
              "{caption} emisyon grafiği, toplam {total} kilogram",
              { caption, total: number(total) },
            )}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-end",
              gap: period === "Gün" ? 24 : 3,
              borderBottomWidth: 1,
              borderBottomColor: c.line,
            }}
          >
            {bars.map((v, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(2, (v / max) * 95)}%`,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  backgroundColor: v ? c.green : c.line,
                }}
              />
            ))}
          </View>
        </View>
        <View style={[s.between, { marginTop: -15, paddingLeft: 24 }]}>
          {(period === "Gün"
            ? ["Ulaşım", "Beslenme", "Ev"]
            : period === "Yıl"
              ? ["Oca", "Haz", "Ara"]
              : ["1", "7", "14", "22", String(count)]
          ).map((t) => (
            <Text key={t} style={{ fontSize: 10, color: c.muted }}>
              {t}
            </Text>
          ))}
        </View>
        {!filtered.length ? (
          <Text style={s.muted}>
            Bu dönemde kayıt yok. İlk aktiviteni ekleyebilirsin.
          </Text>
        ) : null}
      </View>
      <View style={s.section}>
        <Text style={s.heading}>En büyük kaynak</Text>
        <View style={[s.card, { paddingVertical: 4 }]}>
          {categories.map(({ title, icon, kg }) => (
            <Row
              key={title}
              title={title}
              icon={icon}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    kind: "activities",
                    category: title,
                    period,
                    date: key,
                  },
                })
              }
              value={
                <View style={s.row}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {number(kg)}
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: 10,
                        color: c.muted,
                      }}
                    >
                      {" "}
                      kg CO₂e
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 11, color: c.muted }}>
                    {locale === "tr-TR" ? "%" : ""}
                    {total ? Math.round((kg / total) * 100) : 0}
                    {locale === "en-GB" ? "%" : ""}
                  </Text>
                </View>
              }
            />
          ))}
        </View>
      </View>
      <View style={[s.hint, s.row]}>
        <ChartNoAxesColumnIncreasing size={29} color={c.green} />
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: c.green }}>
            {total
              ? t("{category}, kayıtlı emisyonlarının %{percent}’i.", {
                  category: t(largest.title),
                  percent: Math.round((largest.kg / total) * 100),
                })
              : "Her küçük adım bir başlangıç."}
          </Text>
          <Text style={{ fontSize: 11, color: c.green, lineHeight: 17 }}>
            Fark yaratmak senin elinde.
          </Text>
        </View>
      </View>
      {goal ? (
        <Text style={s.muted}>
          {t("Aylık hedefin: {goal} kg CO₂e", { goal: number(goal) })}
        </Text>
      ) : null}
      <Button
        title={goal ? "Hedefimi düzenle" : "Hedef belirle"}
        onPress={() => router.push("/detail?kind=goal")}
      />
    </Screen>
  );
}

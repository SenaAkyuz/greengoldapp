import type { Activity } from "./emissions";
import { type Language, translate } from "./translations.ts";
export function activityCopy(
  activity: Pick<Activity, "label" | "kind">,
  language: Language,
): string {
  const label = activity.label;
  if (language === "tr") return label;
  const t = (text: string) => translate(language, text);
  if (label.endsWith(" · tekrar"))
    return (
      activityCopy({ ...activity, label: label.slice(0, -9) }, language) +
      " · repeated"
    );
  const trip = label.match(
    /^(Araba|Toplu taşıma|Bisiklet|Yürüyüş) · ([\d.,]+) km$/,
  );
  if (trip) return `${t(trip[1])} · ${trip[2].replace(",", ".")} km`;
  const meal = label.match(
    /^(Bitkisel|Karışık|Et ağırlıklı) · ([\d.,]+) öğün$/,
  );
  if (meal)
    return `${t(meal[1])} · ${meal[2]} ${Number(meal[2]) === 1 ? "meal" : "meals"}`;
  const energy = label.match(/^Elektrik · ([\d.,]+) kWh$/);
  if (energy) return `Electricity · ${energy[1]} kWh`;
  const flight =
    activity.kind === "flight" &&
    label.match(
      /^(.*) · ([\d.,]+) km · (Tek yön|Gidiş dönüş) · (Ekonomi|Business) · (\d+) kişi$/,
    );
  if (flight)
    return `${flight[1]} · ${flight[2]} km · ${t(flight[3])} · ${t(flight[4])} · ${flight[5]} ${Number(flight[5]) === 1 ? "passenger" : "passengers"}`;
  const stay =
    activity.kind === "stay" &&
    label.match(/^(.*) · (\d+) gece · (\d+) oda \/ (\d+) kişi$/);
  if (stay)
    return `${stay[1]} · ${stay[2]} ${Number(stay[2]) === 1 ? "night" : "nights"} · ${stay[3]} ${Number(stay[3]) === 1 ? "room" : "rooms"} / ${stay[4]} ${Number(stay[4]) === 1 ? "person" : "people"}`;
  return activity.kind === "flight" || activity.kind === "stay" ? label : t(label);
}

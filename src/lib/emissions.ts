export type Category = "Ulaşım" | "Beslenme" | "Ev";
export type Activity = {
  id: string;
  date: string;
  category: Category;
  label: string;
  kg: number;
  createdAt?: number;
  kind?: string;
  factorVersion?: string;
};
export const today = () => localDate(new Date());
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
// Prototype coefficients only. Replace with approved, versioned factors before production.
export function transportKg(
  mode: string,
  fuel: string,
  distance: number,
  people: number,
) {
  if (
    !Number.isFinite(distance) ||
    distance <= 0 ||
    distance > 10000 ||
    !Number.isInteger(people) ||
    people < 1 ||
    people > 8
  )
    throw new Error("Mesafe 0–10.000 km, kişi sayısı 1–8 arasında olmalı.");
  const factor =
    mode === "Araba"
      ? ({ Benzin: 0.175, Dizel: 0.17, Elektrik: 0.06 }[fuel] ?? 0.175)
      : mode === "Toplu taşıma"
        ? 0.065
        : 0;
  return (
    Math.round(((distance * factor) / (mode === "Araba" ? people : 1)) * 1000) /
    1000
  );
}
export function seedActivities(): Activity[] {
  const now = new Date();
  const result: Activity[] = [];
  for (let day = 1; day < now.getDate(); day++) {
    if (day % 6 === 0) continue;
    const date = localDate(new Date(now.getFullYear(), now.getMonth(), day));
    (["Ulaşım", "Beslenme", "Ev"] as Category[]).forEach((category, i) =>
      result.push({
        id: `seed-${day}-${i}`,
        date,
        category,
        label: ["Günlük ulaşım", "Günlük beslenme", "Ev enerjisi"][i],
        kg: Math.round([4.2, 2.8, 1.4][i] * (0.7 + (day % 5) * 0.15) * 10) / 10,
      }),
    );
  }
  (["Ulaşım", "Beslenme", "Ev"] as Category[]).forEach((category, i) =>
    result.push({
      id: `today-${i}`,
      date: today(),
      category,
      label: ["Araba · 24 km", "Günlük beslenme", "Ev enerjisi"][i],
      kg: [4.2, 2.8, 1.4][i],
    }),
  );
  return result;
}

export const FACTOR_VERSION = "prototype-v2";
export function positive(value: number, max = 100000, integer = false) {
  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    throw new Error(
      integer
        ? "Geçerli, pozitif bir tam sayı gir."
        : "Geçerli, sıfırdan büyük bir miktar gir.",
    );
  return value;
}
export function foodKg(food: string, meals: number) {
  const factors: Record<string, number> = {
    Bitkisel: 1,
    Karışık: 2.8,
    "Et ağırlıklı": 5,
  };
  if (!(food in factors)) throw new Error("Beslenme türünü seç.");
  return Math.round(positive(meals, 30, true) * factors[food] * 1000) / 1000;
}
export function homeKg(kwh: number) {
  return Math.round(positive(kwh) * 0.42 * 1000) / 1000;
}
export function flightKg(
  km: number,
  cabin: string,
  roundTrip: boolean,
  passengers: number,
) {
  const multiplier: Record<string, number> = { Ekonomi: 1, Business: 2.5 };
  if (!(cabin in multiplier)) throw new Error("Kabin sınıfını seç.");
  return (
    Math.round(
      positive(km, 20000) *
        0.158 *
        multiplier[cabin] *
        (roundTrip ? 2 : 1) *
        positive(passengers, 20, true) *
        1000,
    ) / 1000
  );
}
export function stayKg(nights: number, rooms: number, people: number) {
  return (
    Math.round(
      ((positive(nights, 365, true) * positive(rooms, 20, true) * 15) /
        positive(people, 100, true)) *
        1000,
    ) / 1000
  );
}

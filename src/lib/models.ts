import type { Activity } from "./emissions";
export type Contribution = {
  id: string;
  date: string;
  title: string;
  kind: string;
  quantity: number;
  note: string;
  createdAt: number;
};
export type Profile = {
  name: string;
  goal: number | null;
  readAt: number;
  joinedAt: number;
};
export type AppData = Profile & {
  activities: Activity[];
  contributions: Contribution[];
};
export const blankData = (name = ""): AppData => ({
  name,
  goal: null,
  readAt: 0,
  joinedAt: Date.now(),
  activities: [],
  contributions: [],
});
export function validateName(name: string) {
  const clean = name.trim().replace(/\s+/g, " ");
  if (clean.length < 2 || clean.length > 80)
    throw new Error("Ad soyad 2–80 karakter olmalı.");
  return clean;
}
export function validateDate(value: string) {
  const date = new Date(value + "T12:00:00");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(+date) ||
    date.getFullYear() < 2000 ||
    date.getFullYear() > 2100 ||
    date.getDate() !== Number(value.slice(-2))
  )
    throw new Error("Geçerli tarih gir (YYYY-AA-GG).");
  return value;
}
export function notifications(data: AppData) {
  const items = [
    {
      id: "welcome",
      time: data.joinedAt,
      title: "GreenGold’a hoş geldin",
      body: "İlk adımını kaydet; günlük emisyonlarını takip et.",
    },
  ];
  for (const a of data.activities.filter((a) => a.createdAt).slice(-30))
    items.push({
      id: a.id,
      time: a.createdAt!,
      title: "Aktivite kaydedildi",
      body: a.label,
    });
  for (const a of data.contributions.slice(-20))
    items.push({
      id: a.id,
      time: a.createdAt,
      title: "İklim katkısı kaydedildi",
      body: a.title,
    });
  return items.sort((a, b) => b.time - a.time);
}

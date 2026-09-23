import { test } from "node:test";
import assert from "node:assert/strict";
import { transportKg, seedActivities, today } from "./emissions.ts";
test("12 km benzinli yolculuk 2,1 kg, iki kişi 1,05 kg", () => {
  assert.equal(transportKg("Araba", "Benzin", 12, 1), 2.1);
  assert.equal(transportKg("Araba", "Benzin", 12, 2), 1.05);
});
test("toplu taşıma kişi başı, aktif ulaşım doğrudan sıfır", () => {
  assert.equal(transportKg("Toplu taşıma", "Benzin", 12, 4), 0.78);
  assert.equal(transportKg("Bisiklet", "Benzin", 12, 1), 0);
  assert.equal(transportKg("Yürüyüş", "Benzin", 12, 1), 0);
});
test("geçersiz girdiler hesaplanmaz", () => {
  for (const km of [0, -1, NaN, Infinity, 10001])
    assert.throws(() => transportKg("Araba", "Benzin", km, 1));
  for (const people of [0, -1, 1.5, 9])
    assert.throws(() => transportKg("Araba", "Benzin", 12, people));
});
test("demo günlük toplamı referanstaki 8,4 kg ile tutarlı", () => {
  const items = seedActivities().filter((a) => a.date === today());
  assert.equal(items.length, 3);
  assert.equal(Math.round(items.reduce((n, a) => n + a.kg, 0) * 10) / 10, 8.4);
});

import { foodKg, homeKg, flightKg, stayKg } from "./emissions.ts";
test("beslenme ve ev tüketimi", () => {
  assert.equal(foodKg("Karışık", 2), 5.6);
  assert.equal(homeKg(10), 4.2);
  assert.throws(() => foodKg("Karışık", 1.5));
  assert.throws(() => homeKg(Infinity));
});
test("uçuş yön, sınıf ve yolcu sayısını uygular", () => {
  assert.equal(flightKg(500, "Ekonomi", false, 1), 79);
  assert.equal(flightKg(500, "Ekonomi", true, 2), 316);
  assert.equal(flightKg(500, "Business", false, 1), 197.5);
  assert.throws(() => flightKg(-5, "Ekonomi", false, 1));
});
test("konaklama oda-gece emisyonunu kişiler arasında paylaştırır", () => {
  assert.equal(stayKg(2, 1, 2), 15);
  assert.equal(stayKg(3, 2, 1), 90);
  assert.throws(() => stayKg(1, 1, 0));
  assert.throws(() => stayKg(1.5, 1, 1));
});

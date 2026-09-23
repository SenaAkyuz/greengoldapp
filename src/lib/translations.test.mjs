import {test} from 'node:test';
import assert from 'node:assert/strict';
import {english,translate} from './translations.ts';
import {activityCopy} from './activity-copy.ts';
test('every English sentence preserves the source interpolation fields',()=>{
 const fields=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
 for(const [source,translation] of Object.entries(english))assert.deepEqual(fields(translation),fields(source),source);
});
test('names and inserted values remain literal, while counts use singular copy',()=>{
 assert.equal(translate('en','Merhaba, {name}',{name:'Ev'}),'Hello, Ev');
 assert.equal(translate('en','{count} aktivite kaydedildi',{count:1}),'1 activity logged');
 assert.equal(translate('en','{count} aktivite kaydedildi',{count:2}),'2 activities logged');
 assert.equal(translate('tr','Merhaba, {name}',{name:'Sena'}),'Merhaba, Sena');
 assert.equal(translate('en','Tahmini emisyon · '),'Estimated emissions · ');
});
test('stored activities localize without changing the saved data or user-written route',()=>{
 const flight={kind:'flight',label:'Ev – Ankara · 500 km · Gidiş dönüş · Ekonomi · 1 kişi'};
 assert.equal(activityCopy(flight,'en'),'Ev – Ankara · 500 km · Return · Economy · 1 passenger');
 assert.equal(activityCopy(flight,'tr'),flight.label);
 assert.equal(activityCopy({kind:'stay',label:'Ev · 2 gece · 1 oda / 1 kişi'},'en'),'Ev · 2 nights · 1 room / 1 person');
 assert.equal(activityCopy({label:'Araba · 12,5 km · tekrar'},'en'),'Car · 12.5 km · repeated');
 assert.equal(activityCopy({label:'Bitkisel · 1 öğün'},'en'),'Plant-based · 1 meal');
});

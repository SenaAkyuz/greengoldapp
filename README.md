# GreenGoldApp

React Native, Expo ve TypeScript ile geliştirilen karbon takip uygulaması. Web, Android ve iOS aynı kod tabanını kullanır. Arayüz Türkçe ve İngilizce çalışır; dil giriş ekranından veya profil ayarlarından değiştirilebilir.

## Hazır olan özellikler

- Google ile giriş; isteğe bağlı e-posta/şifre ve ayrı demo hesabı
- Giriş yapan kullanıcıya ait ad, aktiviteler, hedefler ve iklim katkıları
- Ulaşım, beslenme, ev elektriği, uçuş ve konaklama hesapları
- Günlük, aylık ve yıllık raporlar
- Climate Passport, QR kodu ve paylaşım özeti
- 3P Metrics sitesine geçiş
- Kullanıcıya göre ayrılmış Firestore verileri ve güvenlik kuralları
- Küçük telefon, büyük telefon ve tablet ekranlarına uyumlu yerleşim

Hesaplama katsayıları prototip amaçlıdır. Doğrulanmış karbon ölçümü veya 3P Metrics raporu değildir. Katkılar emisyon toplamından otomatik düşülmez. Banka bağlantısı ve ekstre yükleme sonraki aşamadadır.

## Yerel çalıştırma

```powershell
npm install
npx expo start --web --port 8081
```

Tarayıcı önizlemesi: http://localhost:8081

Canlı Firebase web ayarları `.env.local` dosyasındadır ve emülatör kapalıdır. Bu dosya Git'e eklenmez. Firebase API anahtarı web istemci tanımlayıcısıdır; servis hesabı özel anahtarı uygulamaya konmamalıdır.

## Firebase ve Google durumu

- Firebase Authentication Google sağlayıcısı etkin.
- `localhost`, Firebase yetkili alanlarında kayıtlı.
- Firestore Production modunda ve `firestore.rules` kullanıcı verilerini UID ile sınırlar.
- Google OAuth görünen uygulama adı: **GreenGoldApp**.
- Web Google girişinin son kullanıcı seçimi, kullanıcı tarafından Chrome'da tamamlanarak doğrulanmalıdır.

Google Auth Platform içindeki ana sayfa alanı için `https://www.foundationgreengold.org/` kullanılabilir. Gizlilik politikası ve kullanım koşulları alanlarına yalnızca vakfın yayımladığı gerçek sayfalar girilmelidir. Teknik `firebaseapp.com` adresini giriş ekranından kaldırmak için ileride vakfın onayıyla `auth.foundationgreengold.org` gibi özel bir Firebase Authentication alan adı kurulmalıdır.

Uygulamanın mağaza ve cihaz kimlikleri:

- Görünen ad: `GreenGoldApp`
- Expo slug ve URL şeması: `greengoldapp`
- Android package: `org.foundationgreengold.greengoldapp`
- iOS bundle identifier: `org.foundationgreengold.greengoldapp`

Android ve iOS uygulamaları Firebase Console'a bu kimliklerle ayrıca kaydedilmelidir. Native Google girişi Expo Go yerine development build gerektirir; Android SHA sertifikaları, iOS OAuth istemcisi ve ters istemci URL şeması bu aşamada eklenecektir.

## Kontroller

```powershell
npm run typecheck
npm test
npm run test:firebase
npx expo export --platform all
```

Hesaplama ve dil testleri, kullanıcı metinlerinin korunması, kullanıcılar arası Firestore erişiminin engellenmesi ve web/iOS/Android paket üretimi kontrol edildi. Tarayıcıda kayıt ekleme-silme, rapor, hedef, uçuş, konaklama, katkı ve dil kalıcılığı denendi. Yerleşimler 320, 390, 430, 768 ve 1024 piksel genişliklerde yatay taşma olmadan doğrulandı.

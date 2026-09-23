export type Language = "tr" | "en";
// Editorial translations, keyed by the existing Turkish copy. Domain values in
// Firestore remain unchanged; only presentation is localized.
export const english: Record<string, string> = {
  "Önce Firebase bağlantı ayarları eklenmeli.":
    "Firebase connection settings need to be added first.",
  "Google ile giriş telefonda geliştirme derlemesi gerektirir. Expo Go’da demo kullanabilir, Google girişini tarayıcıda deneyebilirsin.":
    "Google sign-in on a phone requires a development build. You can explore the demo in Expo Go or try Google sign-in in your browser.",
  "Yerel Google giriş testini tarayıcıdan yap. Telefonda gerçek Firebase yapılandırmasını kullan.":
    "Use your browser for local Google sign-in tests. Use the live Firebase configuration on your phone.",
  "Mobil Google Web Client ID yapılandırılmalı.":
    "The Google web client ID needs to be configured for mobile sign-in.",
  "Google girişi iptal edildi.": "Google sign-in was cancelled.",
  "Google giriş belirteci alınamadı.":
    "Couldn’t complete Google sign-in. Please try again.",
  "Kayıtların yüklenmesi uzun sürüyor. Bağlantını kontrol edip yeniden dene.":
    "Your records are taking longer to load. Check your connection and try again.",
  Bugün: "Today",
  Hesapla: "Calculate",
  Rapor: "Report",
  Pasaport: "Passport",
  Bildirimler: "Notifications",
  Profil: "Profile",
  Ayarlar: "Settings",
  Detay: "Details",
  "Profil ve ayarlar": "Profile & settings",
  Dil: "Language",
  "Dil kaydedilemedi. Tekrar dene.":
    "Couldn’t save your language preference. Please try again.",
  "Merhaba, {name}": "Hello, {name}",
  Misafir: "Guest",
  "doğa dostu": "climate friend",
  "Daha temiz bir yarın mümkün. 🌍": "A cleaner tomorrow starts with us. 🌍",
  "Bugünkü izin": "Today’s footprint",
  "Tahmini emisyon": "Estimated emissions",
  "Tahmini emisyon ·": "Estimated emissions ·",
  "{count} aktivite kaydedildi": "{count} activities logged",
  "Kategorilere göre dağılım": "By category",
  Ulaşım: "Transport",
  Beslenme: "Food",
  Ev: "Home",
  "Aktivite ekle": "Add activity",
  "Ekleniyor…": "Adding…",
  "Dünkü rutinini kullan": "Repeat yesterday’s routine",
  "Dünün aktivitelerini tekrar ekle.": "Add yesterday’s activities to today.",
  "Dün kaydedilmiş aktivite yok. Aktivite ekleyerek başla.":
    "No activities logged yesterday. Add an activity to get started.",
  "{count} aktivite bugüne eklendi.": "Added {count} activities to today.",
  "Bugünün önerisi": "Today’s tip",
  "Kısa mesafede yürümeyi dene.": "Try walking for short trips.",
  "Hem sağlığın hem de şehir için iyi bir adım.":
    "A small step for you. A positive change for your city.",
  "Demo · Örnek veriler": "Demo · Sample data",
  "Tahmini hesaplama": "Emissions estimate",
  "Ulaşım ekle": "Log a trip",
  "Beslenme ekle": "Log a meal",
  "Ev ekle": "Log home energy",
  "Yaklaşık 20 saniye": "Takes about 20 seconds",
  "Tahmini hesapla": "Quick estimate",
  "3P Metrics giriş": "3P Metrics sign-in",
  "Ölçüm için 3P Metrics web sitesine devam et.":
    "Continue to 3P Metrics for carbon measurement.",
  "3P Metrics hesabına kendi web sitesinden giriş yapabilirsin. Bu aşamada ölçüm verilerin GreenGold’a aktarılmaz.":
    "Sign in to your 3P Metrics account on their website. Measurement data is not currently imported into GreenGoldApp.",
  "3P Metrics’e git": "Go to 3P Metrics",
  "Web sitesi açılamadı. Lütfen tekrar dene.":
    "Couldn’t open the website. Please try again.",
  "Web sitesi açılamadı.": "Couldn’t open the website.",
  "Nasıl seyahat ettin?": "How did you travel?",
  Araba: "Car",
  "Toplu taşıma": "Public transport",
  Bisiklet: "Cycling",
  Yürüyüş: "Walking",
  "Yakıt türü": "Fuel type",
  Benzin: "Petrol",
  Dizel: "Diesel",
  Elektrik: "Electric",
  Mesafe: "Distance",
  "Mesafe kilometre": "Distance in kilometres",
  "Mesafeyi azalt": "Decrease distance",
  "Mesafeyi artır": "Increase distance",
  "Araçtaki kişi sayısı": "People in the car",
  "Kişi sayısını azalt": "Decrease passenger count",
  "Kişi sayısını artır": "Increase passenger count",
  "Bugün nasıl beslendin?": "What did you eat?",
  Bitkisel: "Plant-based",
  Karışık: "Mixed diet",
  "Et ağırlıklı": "Meat-heavy",
  "Öğün sayısı": "Number of meals",
  "Evdeki enerji kullanımın": "Your home energy use",
  "Elektrik tüketimi (kWh)": "Electricity use (kWh)",
  "Faturandaki tüketim miktarını kullanabilirsin.":
    "You can find your usage on your electricity bill.",
  "Tarih (YYYY-AA-GG)": "Date (YYYY-MM-DD)",
  Kaydet: "Save",
  "Kaydediliyor…": "Saving…",
  Kaydedildi: "Saved",
  "Hesaplama yöntemi": "How we calculate",
  "Lütfen geçerli, sıfırdan büyük bir miktar gir.":
    "Enter a valid amount greater than zero.",
  "Aylık özet": "Monthly overview",
  "Günlük özet": "Daily overview",
  "Yıllık özet": "Yearly overview",
  Gün: "Day",
  Ay: "Month",
  Yıl: "Year",
  "Önceki dönem": "Previous period",
  "Sonraki dönem": "Next period",
  "Bu gün kaydedilen": "Logged today",
  "Bu ay kaydedilen": "Logged this month",
  "Bu yıl kaydedilen": "Logged this year",
  "{count} kayıtlı gün": "{count} days logged",
  "{caption} emisyon grafiği, toplam {total} kilogram":
    "Emissions chart for {caption}: {total} kilograms in total",
  Oca: "Jan",
  Haz: "Jun",
  Ara: "Dec",
  "Bu dönemde kayıt yok. İlk aktiviteni ekleyebilirsin.":
    "No records for this period. Add your first activity to get started.",
  "En büyük kaynak": "Emissions by source",
  "{category}, kayıtlı emisyonlarının %{percent}’i.":
    "{category} accounts for {percent}% of your logged emissions.",
  "Her küçük adım bir başlangıç.": "Every small step counts.",
  "Fark yaratmak senin elinde.": "Your everyday choices can make a difference.",
  "Aylık hedefin: {goal} kg CO₂e": "Your monthly target: {goal} kg CO₂e",
  "Hedefimi düzenle": "Edit target",
  "Hedef belirle": "Set a target",
  "İklim yolculuğun, tek yerde.": "Your climate journey, all in one place.",
  "GG · MİSAFİR": "GG · GUEST",
  "Örnek iklim pasaportu": "Sample climate passport",
  "Kişisel iklim pasaportun": "Your personal climate passport",
  "Kayıtlı gün": "Days logged",
  "Aktivite türü": "Activity categories",
  "Seyahat kayıtları": "Travel records",
  "Konaklama ekle": "Add a stay",
  "Uçuş ekle": "Add a flight",
  "İklim katkılarım": "Climate actions",
  "{count} katkı kaydedildi": "{count} climate actions logged",
  "İlk katkını ekle": "Log your first climate action",
  "Fidan dikimi, gönüllülük ve geri dönüşüm kayıtların.":
    "Keep track of tree planting, volunteering and recycling.",
  "Pasaportumu paylaş": "Share my passport",
  "QR kodumu göster": "Show my QR code",
  "Pasaport özeti panoya kopyalandı. İstediğin yerde paylaşabilirsin.":
    "Passport summary copied. Paste it wherever you’d like to share it.",
  "Paylaşım açılamadı. QR kodunu kullanabilirsin.":
    "Couldn’t share your passport. You can use the QR code instead.",
  "Paylaşım açılamadı. Tekrar dene.":
    "Couldn’t open sharing. Please try again.",
  "{brand} Climate Passport{demo} · {name} · {days} kayıtlı gün · {categories} aktivite türü. Daha temiz bir yarın mümkün.":
    "{brand} Climate Passport{demo} · {name} · {days} days logged · {categories} activity categories. A cleaner tomorrow starts with us.",
  "Karbon takibi · Climate Passport": "Carbon tracking · Climate Passport",
  "Daha temiz bir yarına.": "Towards a cleaner tomorrow.",
  "Kendi hesabın, kendi iklim yolculuğun.":
    "Your account. Your climate journey.",
  "Yerel test ortamı · Firebase emülatörü":
    "Local test environment · Firebase emulator",
  "Lütfen bekle…": "Please wait…",
  "Google ile devam et": "Continue with Google",
  "E-posta girişini kapat": "Hide email sign-in",
  "E-posta ile devam et": "Continue with email",
  "Giriş yap": "Sign in",
  "Kayıt ol": "Create account",
  "Ad soyad": "Full name",
  "E-posta": "Email address",
  Şifre: "Password",
  "En az 8 karakter": "At least 8 characters",
  "ornek@sirket.com": "you@company.com",
  "Şifremi unuttum": "Forgot password?",
  "Demo olarak keşfet": "Explore the demo",
  "Kurumsal karbon ölçümü için": "For business carbon measurement",
  "Firebase kurulumu bekleniyor. Bağlantı ayarları eklendiğinde hesap girişi açılacak; demo kullanılabilir.":
    "Account sign-in will be available once Firebase is connected. You can explore the demo now.",
  "Geçerli e-posta ve en az 8 karakterli şifre gir.":
    "Enter a valid email address and a password with at least 8 characters.",
  "Önce Firebase bağlantısı tamamlanmalı.":
    "Firebase needs to be connected first.",
  "Önce e-posta adresini gir.": "Enter your email address first.",
  "Bu adrese ait hesap varsa şifre sıfırlama bağlantısı gönderildi.":
    "If an account exists for this address, you’ll receive a password reset link.",
  "Aylık hedef": "Monthly target",
  "Pasaport QR kodu": "Passport QR code",
  "Aktivite kayıtları": "Activity history",
  "Aylık emisyon hedefini belirle.": "Set a target for your monthly emissions.",
  "Misafir demo hesabı · Kayıtlar bu cihazda":
    "Guest demo · Records saved on this device",
  "Yerel Firebase test hesabı": "Local Firebase test account",
  "Firebase hesabın · Sana özel bulut kayıtları":
    "Your account · Personal records saved in the cloud",
  "Aylık hedef (kg CO₂e)": "Monthly target (kg CO₂e)",
  "Çıkış yap": "Sign out",
  "Uçuşunu kaydet": "Log your flight",
  "Konaklamanı kaydet": "Log your stay",
  "Güzergâh (örn. İstanbul – Ankara)": "Route (e.g. Istanbul – Ankara)",
  "Otel / konaklama adı": "Hotel or accommodation name",
  "Tek yön mesafesi (km)": "One-way distance (km)",
  "Tek yön": "One-way",
  "Gidiş dönüş": "Return",
  Ekonomi: "Economy",
  Business: "Business",
  "Kaydedilecek yolcu sayısı": "Passengers to include",
  "Gece sayısı": "Number of nights",
  "Oda sayısı": "Number of rooms",
  "Emisyonu paylaşan kişi sayısı": "People sharing the emissions",
  "Seçilen yolcuların toplamı; gidiş dönüşte mesafe iki kat alınır.":
    "Total for the passengers included. Return flights count twice the one-way distance.",
  "Oda-gece toplamı seçilen kişi sayısına bölünür.":
    "Room-night emissions are divided equally among the people sharing the stay.",
  "Uçuş güzergâhını gir.": "Enter your flight route.",
  "Konaklama adını gir.": "Enter the accommodation name.",
  "Geçerli miktarları gir.": "Enter valid amounts.",
  "Gerçekleştirdiğin katkıyı kaydet. Bu kayıtlar emisyon toplamından düşülmez ve sertifika yerine geçmez.":
    "Log a climate action you’ve taken. These records do not offset your emissions or serve as certificates.",
  "Fidan dikimi": "Tree planting",
  Gönüllülük: "Volunteering",
  "Geri dönüşüm": "Recycling",
  "Katkı / proje adı": "Action or project name",
  "Fidan sayısı": "Number of trees",
  "Süre (saat)": "Time (hours)",
  "Miktar (kg)": "Amount (kg)",
  "Not (isteğe bağlı)": "Note (optional)",
  "Katkıyı kaydet": "Save climate action",
  "Katkı adını gir.": "Enter a name for your climate action.",
  "Katkı kaydedildi.": "Climate action saved.",
  "Kayıtlı katkılar ({count})": "Logged actions ({count})",
  "Silmeyi onayla": "Confirm deletion",
  "Kaydı sil": "Delete record",
  Vazgeç: "Cancel",
  "Henüz katkı yok.": "No climate actions logged yet.",
  adet: "trees",
  saat: "hours",
  Bildirimlerin: "Your notifications",
  "Hesabındaki aktivite ve katkı güncellemeleri.":
    "Updates on your activities and climate actions.",
  "Tümünü okundu işaretle": "Mark all as read",
  Yeni: "New",
  Okundu: "Read",
  "Tüm tarihler": "All dates",
  "{count} kayıt": "{count} records",
  "Bu dönemde kayıt yok.": "No records for this period.",
  "QR kodu pasaport adını ve kimliğini içerir. Doğrulanmış karbon sertifikası değildir.":
    "This QR code contains your passport name and ID. It is not a verified carbon certificate.",
  "Sonuçlar girilen miktarlar ve örnek katsayılarla hesaplanır; doğrulanmış ölçüm veya 3P Metrics raporu değildir.":
    "Estimates use the amounts you enter and illustrative emission factors. They are not verified measurements or 3P Metrics reports.",
  "Araba: km × katsayı ÷ kişi. Benzin 0,175; dizel 0,170; elektrik 0,060 kg CO₂e/km. Toplu taşıma: 0,065 kg CO₂e/yolcu-km.":
    "Car: distance × emission factor ÷ people. Petrol: 0.175; diesel: 0.170; electric: 0.060 kg CO₂e/km. Public transport: 0.065 kg CO₂e per passenger-km.",
  "Bisiklet ve yürüyüş: doğrudan emisyon 0. Beslenme: bitkisel 1, karışık 2,8, et ağırlıklı 5 kg CO₂e/öğün. Ev elektriği: 0,42 kg CO₂e/kWh.":
    "Cycling and walking: zero direct emissions. Food: plant-based 1, mixed diet 2.8, meat-heavy 5 kg CO₂e per meal. Home electricity: 0.42 kg CO₂e/kWh.",
  "Uçuş: tek yön km × 0,158 × kabin çarpanı × yön sayısı × yolcu. Ekonomi 1, Business 2,5. Konaklama: gece × oda × 15 kg CO₂e ÷ paylaşan kişi.":
    "Flight: one-way distance × 0.158 × cabin factor × number of legs × passengers. Economy: 1; business: 2.5. Stay: nights × rooms × 15 kg CO₂e ÷ people sharing.",
  "Katsayı sürümü: {version}. Üretim öncesi onaylı veri setiyle değiştirilmelidir. Katkılar emisyonlardan otomatik düşülmez.":
    "Factor version: {version}. An approved dataset is required before production use. Climate actions are not automatically deducted from emissions.",
  "GreenGold’a hoş geldin": "Welcome to GreenGoldApp",
  "İlk adımını kaydet; günlük emisyonlarını takip et.":
    "Log your first activity and start tracking your daily emissions.",
  "Aktivite kaydedildi": "Activity saved",
  "İklim katkısı kaydedildi": "Climate action saved",
  "Günlük ulaşım": "Daily travel",
  "Günlük beslenme": "Daily meals",
  "Ev enerjisi": "Home energy",
  "Yeniden dene": "Try again",
  "Kayıtlar okunamadı.": "Couldn’t load your records.",
  "Kayıt işlemi sürüyor.": "A save is already in progress.",
  "Kayıtlar yüklenmeden işlem yapılamaz.":
    "Please wait for your records to load.",
  "Geçerli hedef gir.":
    "Enter a target greater than zero and no more than 100,000.",
  "Önce kayıt işleminin tamamlanmasını bekle.":
    "Please wait until your changes have been saved.",
  "Ad soyad 2–80 karakter olmalı.":
    "Your name must be between 2 and 80 characters.",
  "Geçerli tarih gir (YYYY-AA-GG).": "Enter a valid date (YYYY-MM-DD).",
  "Mesafe 0–10.000 km, kişi sayısı 1–8 arasında olmalı.":
    "Distance must be greater than 0 and no more than 10,000 km. Include 1–8 people.",
  "Geçerli, pozitif bir tam sayı gir.":
    "Enter a valid whole number greater than zero.",
  "Geçerli, sıfırdan büyük bir miktar gir.":
    "Enter a valid amount greater than zero.",
  "Beslenme türünü seç.": "Choose a meal type.",
  "Kabin sınıfını seç.": "Choose a cabin class.",
  "Firebase bağlantı ayarları henüz eklenmedi.":
    "Firebase connection settings haven’t been added yet.",
  "Google giriş penceresi kapatıldı. Yeniden deneyebilirsin.":
    "The Google sign-in window was closed. You can try again.",
  "Google giriş sonucu bu tarayıcıya aktarılamadı. Normal Chrome/Safari’de açabilir veya aşağıdaki tam sayfa girişini kullanabilirsin.":
    "This browser couldn’t receive the Google sign-in result. Open GreenGoldApp in Chrome or Safari, or use the full-page sign-in below.",
  "Tam sayfada Google ile giriş yap": "Sign in with Google on this page",
  "Tarayıcı giriş penceresini engelledi. Bu site için açılır pencerelere izin verip tekrar dene.":
    "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
  "Firebase Authentication → Settings → Authorized domains bölümüne localhost eklenmeli.":
    "Add localhost under Firebase Authentication → Settings → Authorized domains.",
  "Bu e-posta başka bir giriş yöntemiyle kayıtlı. Mevcut yönteminle giriş yap.":
    "This email is registered with another sign-in method. Use that method to continue.",
  "E-posta veya şifre hatalı.": "Incorrect email or password.",
  "Bu e-posta zaten kayıtlı. Giriş yapabilir veya şifreni sıfırlayabilirsin.":
    "This email is already registered. Sign in or reset your password.",
  "Daha güçlü bir şifre seç; en az 8 karakter kullan.":
    "Choose a stronger password with at least 8 characters.",
  "Geçerli bir e-posta adresi gir.": "Enter a valid email address.",
  "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.":
    "Too many attempts. Please try again later.",
  "Kayıt erişimi reddedildi. Firebase Firestore kuralları yayımlanmalı.":
    "Access to records was denied. The Firebase Firestore rules need to be published.",
  "Firebase Console → Authentication bölümünde kullandığın giriş yöntemini (Google veya E-posta/Şifre) etkinleştir.":
    "Enable your sign-in method (Google or Email/Password) in Firebase Console → Authentication.",
  "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.":
    "Couldn’t connect. Check your internet connection and try again.",
  "Firebase bağlantı ayarlarını kontrol et.":
    "Check the Firebase connection settings.",
  "İşlem tamamlanamadı. Tekrar dene.":
    "Something went wrong. Please try again.",
};
export function translate(
  language: Language,
  key: string,
  values: Record<string, string | number> = {},
) {
  const normalized = key.trim().replace(/\s+/g, " ");
  let copy = language === "en" ? (english[normalized] ?? key) : key;
  if (language === "en" && english[normalized] !== undefined) {
    copy =
      (key.match(/^\s*/)?.[0] || "") + copy + (key.match(/\s*$/)?.[0] || "");
  }
  // Singular forms are deliberate copy, not a word-by-word transformation.
  if (language === "en" && Number(values.count) === 1) {
    const singular: Record<string, string> = {
      "{count} aktivite kaydedildi": "1 activity logged",
      "{count} aktivite bugüne eklendi.": "Added 1 activity to today.",
      "{count} kayıtlı gün": "1 day logged",
      "{count} katkı kaydedildi": "1 climate action logged",
      "{count} kayıt": "1 record",
    };
    copy = singular[key] ?? copy;
  }
  if (
    language === "en" &&
    key ===
      "{brand} Climate Passport{demo} · {name} · {days} kayıtlı gün · {categories} aktivite türü. Daha temiz bir yarın mümkün."
  ) {
    if (Number(values.days) === 1)
      copy = copy.replace("days logged", "day logged");
    if (Number(values.categories) === 1)
      copy = copy.replace("activity categories", "activity category");
  }
  return copy.replace(/\{(\w+)\}/g, (token, name) =>
    values[name] === undefined ? token : String(values[name]),
  );
}

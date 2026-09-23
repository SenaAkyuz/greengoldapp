import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { createAuth } from "./firebase-auth";
export const emulatorMode =
  process.env.EXPO_PUBLIC_FIREBASE_EMULATORS === "true";
const config = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    (emulatorMode ? "demo-key" : ""),
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "demo-greengold.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    (emulatorMode ? "demo-greengold" : ""),
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID || (emulatorMode ? "demo-app" : ""),
};
export const firebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.appId,
);
const app = firebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(config)
  : null;
export const auth = app ? createAuth(app) : null;
export const db = app ? getFirestore(app) : null;
if (emulatorMode && auth && db) {
  const host = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
  if (!auth.emulatorConfig)
    connectAuthEmulator(auth, "http://" + host + ":9099", {
      disableWarnings: true,
    });
  // Module is loaded once per JS runtime; Fast Refresh preserves the existing client.
  try {
    connectFirestoreEmulator(db, host, 8085);
  } catch (e) {
    if (!(e instanceof Error && e.message.includes("already"))) throw e;
  }
}
export const metricsUrl =
  process.env.EXPO_PUBLIC_METRICS_LOGIN_URL || "https://www.3pmetrics.com/";
export function firebaseError(error: unknown) {
  const code = (error as { code?: string })?.code || "";
  if (
    code.includes("popup-closed-by-user") ||
    code.includes("cancelled-popup-request")
  )
    return "Google giriş sonucu bu tarayıcıya aktarılamadı. Normal Chrome/Safari’de açabilir veya aşağıdaki tam sayfa girişini kullanabilirsin.";
  if (code.includes("popup-blocked"))
    return "Tarayıcı giriş penceresini engelledi. Bu site için açılır pencerelere izin verip tekrar dene.";
  if (code.includes("unauthorized-domain"))
    return "Firebase Authentication → Settings → Authorized domains bölümüne localhost eklenmeli.";
  if (code.includes("account-exists-with-different-credential"))
    return "Bu e-posta başka bir giriş yöntemiyle kayıtlı. Mevcut yönteminle giriş yap.";
  if (
    code.includes("invalid-credential") ||
    code.includes("wrong-password") ||
    code.includes("user-not-found")
  )
    return "E-posta veya şifre hatalı.";
  if (code.includes("email-already-in-use"))
    return "Bu e-posta zaten kayıtlı. Giriş yapabilir veya şifreni sıfırlayabilirsin.";
  if (code.includes("weak-password"))
    return "Daha güçlü bir şifre seç; en az 8 karakter kullan.";
  if (code.includes("invalid-email")) return "Geçerli bir e-posta adresi gir.";
  if (code.includes("too-many-requests"))
    return "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.";
  if (code.includes("permission-denied"))
    return "Kayıt erişimi reddedildi. Firebase Firestore kuralları yayımlanmalı.";
  if (code.includes("operation-not-allowed"))
    return "Firebase Console → Authentication bölümünde kullandığın giriş yöntemini (Google veya E-posta/Şifre) etkinleştir.";
  if (code.includes("network") || code.includes("unavailable"))
    return "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.";
  if (code.includes("invalid-api-key"))
    return "Firebase bağlantı ayarlarını kontrol et.";
  return error instanceof Error
    ? error.message
    : "İşlem tamamlanamadı. Tekrar dene.";
}

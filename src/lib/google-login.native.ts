import Constants from "expo-constants";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, emulatorMode } from "./firebase";
import { ensureProfile } from "./user-profile";
export async function signInGoogle(language = "tr") {
  if (!auth) throw new Error("Önce Firebase bağlantı ayarları eklenmeli.");
  auth.languageCode = language;
  if (Constants.executionEnvironment === "storeClient")
    throw new Error(
      "Google ile giriş telefonda geliştirme derlemesi gerektirir. Expo Go’da demo kullanabilir, Google girişini tarayıcıda deneyebilirsin.",
    );
  if (emulatorMode)
    throw new Error(
      "Yerel Google giriş testini tarayıcıdan yap. Telefonda gerçek Firebase yapılandırmasını kullan.",
    );
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId)
    throw new Error("Mobil Google Web Client ID yapılandırılmalı.");
  const { GoogleSignin, isSuccessResponse } =
    await import("@react-native-google-signin/google-signin");
  GoogleSignin.configure({
    webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response))
    throw new Error("Google girişi iptal edildi.");
  if (!response.data.idToken)
    throw new Error("Google giriş belirteci alınamadı.");
  const result = await signInWithCredential(
    auth,
    GoogleAuthProvider.credential(response.data.idToken),
  );
  await ensureProfile(result.user);
}
export async function signInGoogleRedirect(language = "tr") {
  return signInGoogle(language);
}
export async function completeGoogleRedirect() {
  return false;
}
export async function clearGoogleSession() {
  if (Constants.executionEnvironment === "storeClient") return;
  try {
    const { GoogleSignin } =
      await import("@react-native-google-signin/google-signin");
    await GoogleSignin.signOut();
  } catch {}
}

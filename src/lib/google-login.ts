import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "./firebase";
import { ensureProfile } from "./user-profile";
export async function signInGoogle(language = "tr") {
  if (!auth) throw new Error("Firebase bağlantı ayarları henüz eklenmedi.");
  const provider = new GoogleAuthProvider();
  auth.languageCode = language;
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  await ensureProfile(result.user);
}
export async function signInGoogleRedirect(language = "tr") {
  if (!auth) throw new Error("Firebase bağlantı ayarları henüz eklenmedi.");
  auth.languageCode = language;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}
export async function completeGoogleRedirect() {
  if (!auth) return false;
  const result = await getRedirectResult(auth);
  if (!result) return false;
  await ensureProfile(result.user);
  return true;
}
export async function clearGoogleSession() {}

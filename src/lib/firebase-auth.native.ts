import { FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, Persistence } from "firebase/auth";
import * as FirebaseAuth from "firebase/auth";
import * as SecureStore from "expo-secure-store";
const keyFor = (key: string) =>
  "gg." +
  Array.from(key)
    .map((c) => c.charCodeAt(0).toString(16))
    .join("-");
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(keyFor(key)),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(keyFor(key), value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(keyFor(key)),
};
export function createAuth(app: FirebaseApp) {
  // Metro resolves native exports; TypeScript uses browser declarations.
  const { getReactNativePersistence } = FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence(storage: typeof secureStorage): Persistence;
  };
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(secureStorage),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "auth/already-initialized")
      return getAuth(app);
    throw error;
  }
}

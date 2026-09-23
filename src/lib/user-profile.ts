import type { User } from "firebase/auth";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";
export async function ensureProfile(user: User) {
  if (!db) throw new Error("Firebase bağlantısı eksik.");
  const ref = doc(db, "users", user.uid);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      const name = (
        user.displayName ||
        user.email?.split("@")[0] ||
        "Doğa Dostu"
      )
        .trim()
        .slice(0, 80);
      transaction.set(ref, {
        name: name.length >= 2 ? name : "Doğa Dostu",
        goal: null,
        readAt: 0,
        joinedAt: Date.now(),
      });
    }
  });
}

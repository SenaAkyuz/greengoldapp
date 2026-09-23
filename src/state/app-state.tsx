import React, { createContext, use, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { Activity, seedActivities } from "../lib/emissions";
import { auth, db, firebaseError } from "../lib/firebase";
import { clearGoogleSession } from "../lib/google-login";
import {
  AppData,
  Contribution,
  Profile,
  blankData,
  validateName,
} from "../lib/models";
type State = AppData & {
  ready: boolean;
  dataReady: boolean;
  error: string;
  demo: boolean;
  userId: string | null;
  busy: boolean;
  startDemo: (name?: string) => Promise<void>;
  add: (items: Omit<Activity, "id">[]) => Promise<void>;
  setGoal: (goal: number) => Promise<void>;
  rename: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
  addContribution: (
    value: Omit<Contribution, "id" | "createdAt">,
  ) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  removeContribution: (id: string) => Promise<void>;
  markRead: () => Promise<void>;
};
const Context = createContext<State | null>(null);
// Bump the demo namespace when the sample schema or bundled example changes.
// Older demo data stays recoverable in device storage but is not shown.
const demoKey = "greengold.v3.demo";
const newId = () =>
  Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => blankData());
  const current = useRef(data);
  const [ready, setReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const lock = useRef(false);
  const identity = useRef<string | null>(null);
  function apply(next: AppData) {
    current.current = next;
    setData(next);
  }
  useEffect(() => {
    let active = true;
    let generation = 0;
    let unsubs: (() => void)[] = [];
    const switchUser = async (uid: string | null, name: string) => {
      const ticket = ++generation;
      unsubs.forEach((f) => f());
      unsubs = [];
      identity.current = uid;
      setError("");
      setDataReady(false);
      setUserId(uid);
      setDemo(false);
      apply(blankData(name));
      if (uid && db) {
        const loaded = new Set<string>();
        const timer = setTimeout(() => {
          if (active && ticket === generation && loaded.size < 3) {
            setError(
              "Kayıtların yüklenmesi uzun sürüyor. Bağlantını kontrol edip yeniden dene.",
            );
            setReady(true);
          }
        }, 15000);
        unsubs.push(() => clearTimeout(timer));
        const fail = (e: unknown) => {
          if (active && ticket === generation) {
            setError(firebaseError(e));
            setReady(true);
          }
        };
        const mark = (key: string) => {
          loaded.add(key);
          if (loaded.size === 3) {
            clearTimeout(timer);
            setDataReady(true);
            setError("");
          }
        };
        const userDoc = doc(db, "users", uid);
        unsubs.push(
          onSnapshot(
            userDoc,
            (snap) => {
              if (!active || ticket !== generation) return;
              const profile = snap.exists()
                ? (snap.data() as Profile)
                : {
                    name: name || "Doğa Dostu",
                    goal: null,
                    readAt: 0,
                    joinedAt: Date.now(),
                  };
              apply({ ...current.current, ...profile });
              mark("profile");
            },
            fail,
          ),
        );
        unsubs.push(
          onSnapshot(
            collection(userDoc, "activities"),
            (snapshot) => {
              if (!active || ticket !== generation) return;
              apply({
                ...current.current,
                activities: snapshot.docs
                  .map((d) => ({ ...d.data(), id: d.id }) as Activity)
                  .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)),
              });
              mark("activities");
            },
            fail,
          ),
        );
        unsubs.push(
          onSnapshot(
            collection(userDoc, "contributions"),
            (snapshot) => {
              if (!active || ticket !== generation) return;
              apply({
                ...current.current,
                contributions: snapshot.docs
                  .map((d) => ({ ...d.data(), id: d.id }) as Contribution)
                  .sort((a, b) => a.createdAt - b.createdAt),
              });
              mark("contributions");
            },
            fail,
          ),
        );
        setReady(true);
      } else {
        try {
          const isDemo =
            (await AsyncStorage.getItem("greengold.demo")) === "true";
          const raw = isDemo ? await AsyncStorage.getItem(demoKey) : null;
          const parsed = raw
            ? JSON.parse(raw)
            : isDemo
              ? { ...blankData("Misafir"), activities: seedActivities() }
              : blankData("Misafir");
          if (isDemo && !raw)
            await AsyncStorage.setItem(demoKey, JSON.stringify(parsed));
          if (
            !Array.isArray(parsed.activities) ||
            !Array.isArray(parsed.contributions)
          )
            throw new Error("Kayıtlar okunamadı.");
          if (!active || ticket !== generation) return;
          identity.current = isDemo ? "demo" : null;
          setDemo(isDemo);
          apply(parsed);
          setDataReady(true);
          setReady(true);
        } catch (e) {
          if (active) {
            setError(firebaseError(e));
            setReady(true);
          }
        }
      }
    };
    const unsubscribe = auth
      ? onAuthStateChanged(
          auth,
          (user) =>
            void switchUser(
              user?.uid || null,
              user?.displayName || user?.email?.split("@")[0] || "",
            ),
        )
      : null;
    if (!auth) void switchUser(null, "");
    return () => {
      active = false;
      generation++;
      unsubscribe?.();
      unsubs.forEach((f) => f());
    };
  }, [revision]);
  async function mutation(
    local: (data: AppData) => AppData,
    remote: (uid: string) => Promise<void>,
  ) {
    if (lock.current) throw new Error("Kayıt işlemi sürüyor.");
    if (!identity.current || !dataReady)
      throw new Error("Kayıtlar yüklenmeden işlem yapılamaz.");
    const owner = identity.current;
    lock.current = true;
    setBusy(true);
    try {
      if (owner === "demo") {
        const next = local(current.current);
        await AsyncStorage.setItem(demoKey, JSON.stringify(next));
        if (identity.current === owner) apply(next);
      } else await remote(owner);
    } catch (e) {
      throw new Error(firebaseError(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function profileUpdate(patch: Partial<Profile>) {
    return mutation(
      (d) => ({ ...d, ...patch }),
      async (uid) => {
        const ref = doc(db!, "users", uid);
        await runTransaction(db!, async (tx) => {
          const snapshot = await tx.get(ref);
          if (snapshot.exists()) tx.update(ref, patch);
          else
            tx.set(ref, {
              name: current.current.name,
              goal: current.current.goal,
              readAt: current.current.readAt,
              joinedAt: current.current.joinedAt,
              ...patch,
            });
        });
      },
    );
  }
  return (
    <Context
      value={{
        ...data,
        ready,
        dataReady,
        error,
        demo,
        userId,
        busy,
        retry: () => setRevision((n) => n + 1),
        startDemo: async (name = "Misafir") => {
          const clean = validateName(name);
          const existing = await AsyncStorage.getItem(demoKey);
          const next = existing
            ? { ...JSON.parse(existing), name: clean }
            : { ...blankData(clean), activities: seedActivities() };
          await AsyncStorage.setItem(demoKey, JSON.stringify(next));
          await AsyncStorage.setItem("greengold.demo", "true");
          setRevision((n) => n + 1);
        },
        add: async (items) => {
          const entries = items.map((a, i) => ({
            ...a,
            id: newId(),
            createdAt: Date.now() + i,
          }));
          await mutation(
            (d) => ({ ...d, activities: [...d.activities, ...entries] }),
            async (uid) => {
              const batch = writeBatch(db!);
              entries.forEach((a) =>
                batch.set(doc(db!, "users", uid, "activities", a.id), a),
              );
              await batch.commit();
            },
          );
        },
        setGoal: async (goal) => {
          if (!Number.isFinite(goal) || goal <= 0 || goal > 100000)
            throw new Error("Geçerli hedef gir.");
          await profileUpdate({ goal });
        },
        rename: async (name) => {
          const clean = validateName(name);
          await profileUpdate({ name: clean });
          if (auth?.currentUser)
            await updateProfile(auth.currentUser, { displayName: clean });
        },
        markRead: async () => profileUpdate({ readAt: Date.now() }),
        addContribution: async (value) => {
          const entry = { ...value, id: newId(), createdAt: Date.now() };
          await mutation(
            (d) => ({ ...d, contributions: [...d.contributions, entry] }),
            async (uid) =>
              setDoc(doc(db!, "users", uid, "contributions", entry.id), entry),
          );
        },
        removeActivity: async (id) =>
          mutation(
            (d) => ({
              ...d,
              activities: d.activities.filter((a) => a.id !== id),
            }),
            async (uid) => {
              const batch = writeBatch(db!);
              batch.delete(doc(db!, "users", uid, "activities", id));
              await batch.commit();
            },
          ),
        removeContribution: async (id) =>
          mutation(
            (d) => ({
              ...d,
              contributions: d.contributions.filter((a) => a.id !== id),
            }),
            async (uid) => {
              const batch = writeBatch(db!);
              batch.delete(doc(db!, "users", uid, "contributions", id));
              await batch.commit();
            },
          ),
        signOut: async () => {
          if (lock.current)
            throw new Error("Önce kayıt işleminin tamamlanmasını bekle.");
          await AsyncStorage.removeItem("greengold.demo");
          if (auth?.currentUser) {
            await firebaseSignOut(auth);
            await clearGoogleSession();
          } else setRevision((n) => n + 1);
        },
      }}
    >
      {children}
    </Context>
  );
}
export function useApp() {
  const state = use(Context);
  if (!state) throw new Error("AppProvider missing");
  return state;
}

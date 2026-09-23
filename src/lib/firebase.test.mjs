import { test } from "node:test";
import assert from "node:assert/strict";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch,
  setLogLevel,
} from "firebase/firestore";
setLogLevel("silent");
test("Firebase: ad, kalıcılık, hesap izolasyonu, güvenlik kuralları ve CRUD", async () => {
  const app = initializeApp(
    { apiKey: "demo-key", projectId: "demo-greengold", appId: "demo-app" },
    "integration-" + Date.now(),
  );
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  const db = getFirestore(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8085);
  const stamp = Date.now();
  let userA, userB;
  try {
    userA = (
      await createUserWithEmailAndPassword(
        auth,
        "test-a-" + stamp + "@example.com",
        "Test-Only-2026!",
      )
    ).user;
    await updateProfile(userA, { displayName: "Sena Test" });
    await setDoc(doc(db, "users", userA.uid), {
      name: "Sena Test",
      goal: 140,
      readAt: 0,
      joinedAt: stamp,
    });
    const activity = {
      id: "trip",
      date: "2026-09-23",
      category: "Ulaşım",
      label: "12 km",
      kg: 2.1,
      createdAt: stamp,
    };
    await setDoc(doc(db, "users", userA.uid, "activities", "trip"), activity);
    assert.equal(
      (await getDoc(doc(db, "users", userA.uid))).data().name,
      "Sena Test",
    );
    await assert.rejects(
      setDoc(doc(db, "users", userA.uid, "activities", "negative"), {
        ...activity,
        id: "negative",
        kg: -1,
      }),
    );
    await assert.rejects(
      setDoc(doc(db, "users", userA.uid), {
        name: "Bad",
        goal: 0,
        readAt: 0,
        joinedAt: stamp,
      }),
    );
    await signOut(auth);
    await assert.rejects(getDoc(doc(db, "users", userA.uid)));
    userB = (
      await createUserWithEmailAndPassword(
        auth,
        "test-b-" + stamp + "@example.com",
        "Test-Only-2026!",
      )
    ).user;
    await updateProfile(userB, { displayName: "Deniz Test" });
    assert.equal(
      (await getDocs(collection(db, "users", userB.uid, "activities"))).size,
      0,
    );
    await assert.rejects(getDoc(doc(db, "users", userA.uid)));
    await assert.rejects(
      getDocs(collection(db, "users", userA.uid, "activities")),
    );
    await assert.rejects(
      setDoc(doc(db, "users", userA.uid, "activities", "intrusion"), {
        ...activity,
        id: "intrusion",
      }),
    );
    await assert.rejects(
      deleteDoc(doc(db, "users", userA.uid, "activities", "trip")),
    );
    await signOut(auth);
    await signInWithEmailAndPassword(auth, userA.email, "Test-Only-2026!");
    assert.equal(auth.currentUser.displayName, "Sena Test");
    assert.equal(
      (await getDoc(doc(db, "users", userA.uid, "activities", "trip"))).data()
        .kg,
      2.1,
    );
    const batch = writeBatch(db);
    batch.set(doc(db, "users", userA.uid, "activities", "flight"), {
      ...activity,
      id: "flight",
      kind: "flight",
      kg: 158,
    });
    batch.set(doc(db, "users", userA.uid, "activities", "stay"), {
      ...activity,
      id: "stay",
      category: "Ev",
      kind: "stay",
      kg: 15,
    });
    await batch.commit();
    await setDoc(doc(db, "users", userA.uid, "contributions", "tree"), {
      id: "tree",
      date: "2026-09-23",
      title: "Test fidanı",
      kind: "Fidan dikimi",
      quantity: 2,
      note: "",
      createdAt: stamp,
    });
    assert.equal(
      (await getDocs(collection(db, "users", userA.uid, "activities"))).size,
      3,
    );
    assert.equal(
      (await getDocs(collection(db, "users", userA.uid, "contributions"))).size,
      1,
    );
    await setDoc(
      doc(db, "users", userA.uid),
      { name: "Sena Güncel", readAt: stamp + 100 },
      { merge: true },
    );
    assert.equal(
      (await getDoc(doc(db, "users", userA.uid))).data().name,
      "Sena Güncel",
    );
    await deleteDoc(doc(db, "users", userA.uid, "contributions", "tree"));
    await deleteDoc(doc(db, "users", userA.uid, "activities", "trip"));
    assert.equal(
      (await getDocs(collection(db, "users", userA.uid, "contributions"))).size,
      0,
    );
    assert.equal(
      (await getDocs(collection(db, "users", userA.uid, "activities"))).size,
      2,
    );
  } finally {
    await deleteApp(app);
  }
});

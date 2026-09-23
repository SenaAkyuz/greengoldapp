import { Text, useI18n, LanguagePicker } from "../state/language";
import React, { useEffect, useState } from "react";
import { View, Linking, Pressable } from "react-native";
import { Redirect, Stack } from "expo-router";
import { Leaf, ArrowRight, ExternalLink } from "lucide-react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Screen, Button, Field, Segment, s } from "../components/ui";
import { colors as c } from "../theme";
import { useApp } from "../state/app-state";
import {
  auth,
  db,
  metricsUrl,
  firebaseError,
  emulatorMode,
} from "../lib/firebase";
import { validateName } from "../lib/models";
import {
  completeGoogleRedirect,
  signInGoogle,
  signInGoogleRedirect,
} from "../lib/google-login";
export default function Login() {
  const { locale } = useI18n();
  const app = useApp();
  const [mode, setMode] = useState("Giriş yap");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [emailForm, setEmailForm] = useState(false);
  const [redirectFallback, setRedirectFallback] = useState(false);
  useEffect(() => {
    let active = true;
    setPending(true);
    completeGoogleRedirect()
      .catch((error) => {
        if (active) setMessage(firebaseError(error));
      })
      .finally(() => {
        if (active) setPending(false);
      });
    return () => {
      active = false;
    };
  }, []);
  if ((app.demo || app.userId) && !pending) return <Redirect href="/" />;
  async function submit() {
    setMessage("");
    if (!auth || !db) {
      setMessage(
        "Firebase kurulumu bekleniyor. Bağlantı ayarları eklendiğinde hesap girişi açılacak; demo kullanılabilir.",
      );
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      password.length < 8
    ) {
      setMessage("Geçerli e-posta ve en az 8 karakterli şifre gir.");
      return;
    }
    setPending(true);
    try {
      if (mode === "Kayıt ol") {
        const clean = validateName(name);
        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(result.user, { displayName: clean });
        await setDoc(doc(db, "users", result.user.uid), {
          name: clean,
          goal: null,
          readAt: 0,
          joinedAt: Date.now(),
        });
      } else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setMessage(firebaseError(e));
    } finally {
      setPending(false);
    }
  }
  async function reset() {
    if (!auth) {
      setMessage("Önce Firebase bağlantısı tamamlanmalı.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Önce e-posta adresini gir.");
      return;
    }
    setPending(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(
        "Bu adrese ait hesap varsa şifre sıfırlama bağlantısı gönderildi.",
      );
    } catch (e) {
      setMessage(firebaseError(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          paddingTop: 48,
          gap: 14,
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <View
          style={{ padding: 19, backgroundColor: c.lime, borderRadius: 29 }}
        >
          <Leaf size={39} color={c.green} />
        </View>
        <Text
          style={{
            fontSize: 34,
            fontWeight: "700",
            color: c.green,
            letterSpacing: -1.4,
          }}
        >
          GreenGoldApp
        </Text>
        <Text style={s.muted}>Karbon takibi · Climate Passport</Text>
      </View>
      <LanguagePicker />
      <View style={{ gap: 8 }}>
        <Text style={s.title}>Daha temiz bir yarına.</Text>
        <Text style={s.muted}>Kendi hesabın, kendi iklim yolculuğun.</Text>
      </View>
      {emulatorMode ? (
        <Text style={s.hint}>Yerel test ortamı · Firebase emülatörü</Text>
      ) : null}
      <Button
        title={pending ? "Lütfen bekle…" : "Google ile devam et"}
        disabled={pending}
        onPress={async () => {
          setPending(true);
          setMessage("");
          try {
            await signInGoogle(locale);
          } catch (e) {
            const code = (e as { code?: string })?.code || "";
            if (
              code.includes("popup-closed-by-user") ||
              code.includes("cancelled-popup-request") ||
              code.includes("popup-blocked")
            )
              setRedirectFallback(true);
            setMessage(firebaseError(e));
          } finally {
            setPending(false);
          }
        }}
      />
      {redirectFallback ? (
        <Button
          outline
          title="Tam sayfada Google ile giriş yap"
          disabled={pending}
          onPress={async () => {
            setPending(true);
            setMessage("");
            try {
              await signInGoogleRedirect(locale);
            } catch (error) {
              setMessage(firebaseError(error));
              setPending(false);
            }
          }}
        />
      ) : null}
      <Button
        outline
        title={emailForm ? "E-posta girişini kapat" : "E-posta ile devam et"}
        disabled={pending}
        onPress={() => setEmailForm((v) => !v)}
      />
      {emailForm ? (
        <>
          <Segment
            items={["Giriş yap", "Kayıt ol"]}
            value={mode}
            onChange={(v) => {
              if (!pending) {
                setMode(v);
                setMessage("");
              }
            }}
          />
          {mode === "Kayıt ol" ? (
            <Field
              label="Ad soyad"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              maxLength={80}
            />
          ) : null}
          <Field
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@sirket.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Field
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            placeholder="En az 8 karakter"
            secureTextEntry
            autoComplete={
              mode === "Kayıt ol" ? "new-password" : "current-password"
            }
          />
          <Button
            title={pending ? "Lütfen bekle…" : mode}
            disabled={pending}
            onPress={submit}
            icon={ArrowRight}
          />
          <Pressable
            accessibilityRole="button"
            disabled={pending}
            onPress={reset}
            style={{ alignItems: "center", padding: 10 }}
          >
            <Text style={{ color: c.green }}>Şifremi unuttum</Text>
          </Pressable>
        </>
      ) : null}
      {message ? (
        <Text accessibilityLiveRegion="polite" style={s.error}>
          {message}
        </Text>
      ) : null}
      <Button
        outline
        title="Demo olarak keşfet"
        disabled={pending}
        onPress={async () => {
          setPending(true);
          try {
            await app.startDemo(name.trim() || "Misafir");
          } catch (e) {
            setMessage(firebaseError(e));
          } finally {
            setPending(false);
          }
        }}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: c.line,
          paddingTop: 20,
          gap: 10,
        }}
      >
        <Text style={[s.muted, { textAlign: "center" }]}>
          Kurumsal karbon ölçümü için
        </Text>
        <Button
          outline
          title="3P Metrics’e git"
          icon={ExternalLink}
          onPress={() =>
            Linking.openURL(metricsUrl).catch(() =>
              setMessage("Web sitesi açılamadı."),
            )
          }
        />
      </View>
    </Screen>
  );
}

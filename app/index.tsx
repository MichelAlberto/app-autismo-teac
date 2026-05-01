import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../styles/index.styles";

// IMPORTES DO FIREBASE
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

import Toast from "../components/Toast";

export default function Index() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados do Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenIntro");
        if (seen === "true") {
          setShowLogin(true);
        } else {
          router.replace("/slides");
        }
      } catch (e) {
        setShowLogin(true); // Fallback caso ocorra erro na leitura
      }
    };
    init();
  }, []);

  if (!showLogin) return null;

  const handleLogin = async () => {
    setErrorMsg("");

    if (!email || !senha) {
      setErrorMsg("Preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);

    try {
      // 1. Autenticar com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha);
      const user = userCredential.user;

      // 2. Buscar dados adicionais no Firestore (Nome e isAdmin)
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // 3. Salvar na sessão local para manter compatibilidade com o resto do app
        const currentUser = {
          uid: user.uid,
          nome: userData.nome,
          email: user.email,
          isAdmin: userData.isAdmin || false
        };

        await AsyncStorage.setItem("teac_current_user", JSON.stringify(currentUser));

        // 4. Ir para Home
        router.push("/(tabs)/home");
      } else {
        setErrorMsg("Usuário autenticado, mas dados não encontrados no banco.");
      }

    } catch (error: any) {
      console.error("ERRO AO LOGAR:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg("E-mail ou senha incorretos.");
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg("Formato de e-mail inválido.");
      } else {
        setErrorMsg("Erro ao entrar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    showToast("Login com Google requer configurações adicionais.", "info");
  };

  return (
    <LinearGradient colors={["#c2f0f7", "#f7c2e0"]} style={{ flex: 1 }}>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Seja Bem-vindo</Text>
          <Text style={styles.subtitle}>Aprenda e Conecte-se</Text>

          <Image source={require("../assets/logo1.png")} style={styles.image} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entre na sua Conta</Text>

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Senha"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={senha}
                onChangeText={setSenha}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/recuperacao-senha")}
              style={styles.forgotBtn}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {errorMsg !== "" && <Text style={styles.errorText}>{errorMsg}</Text>}

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginText}>Entrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push("/cadastro")}
              disabled={loading}
            >
              <Text style={styles.registerText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <Text>Entrar com Google</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            © 2026 TEAC. Capacitando e Ensinando Pessoas Sobre o Transtorno do Espectro Autista.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../../context/ThemeContext";

import { QUIZ_DATA } from "../../constants/quizData";
import { db } from "../firebaseConfig";

export default function QuizResultScreen() {
  const { answersJson, score: passedScore, shuffledQuizJson } = useLocalSearchParams();
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [isSaving, setIsSaving] = useState(true);
  const [parsedAnswers, setParsedAnswers] = useState<Record<number, string>>({});
  const [displayQuiz, setDisplayQuiz] = useState(QUIZ_DATA);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (answersJson) {
      const answers = JSON.parse(answersJson as string);
      setParsedAnswers(answers);

      // Usa o score passado ou recalcula se necessário
      const finalScore = passedScore ? parseInt(passedScore as string) : 0;
      const shuffledQuiz = shuffledQuizJson ? JSON.parse(shuffledQuizJson as string) : QUIZ_DATA;
      
      setDisplayQuiz(shuffledQuiz);
      setScore(finalScore);
      setPassed(finalScore >= 7);
      saveResultToFirebase(finalScore, finalScore >= 7);

      // Animação de entrada após salvar
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);
    }
  }, [answersJson, passedScore, shuffledQuizJson]);

  const saveResultToFirebase = async (finalScore: number, isPassed: boolean) => {
    try {
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.uid) {
          await setDoc(
            doc(db, "users", user.uid),
            {
              quizProgress: {
                lastScore: finalScore,
                totalQuestions: 10,
                passed: isPassed,
                completedAt: new Date().toISOString(),
              },
            },
            { merge: true }
          );
          // Salva localmente para a Home saber que o quiz foi feito (chave por usuário)
          await AsyncStorage.setItem(`quiz_completed_${user.uid}`, "true");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar resultado do quiz:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const correctCount = score;
  const wrongCount = QUIZ_DATA.length - score;
  const passingGradient: [string, string] = ["#5B21B6", "#7C3AED"];
  const failingGradient: [string, string] = ["#9F1239", "#DC2626"];

  const { colors, isDark } = useTheme();

  if (isSaving) {
    return (
      <LinearGradient colors={passed ? passingGradient : failingGradient} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ marginTop: 12, color: "rgba(255,255,255,0.8)", fontSize: 15 }}>
          Salvando resultado...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      {/* ── HERO GRADIENTE ── */}
      <LinearGradient
        colors={passed ? passingGradient : failingGradient}
        style={s.hero}
      >
        <SafeAreaView edges={["top"]} style={s.heroSafe}>
          <TouchableOpacity onPress={() => router.push("/home")} style={s.heroBack}>
            <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          {/* Badge de Pontuação Animado */}
          <Animated.View style={[s.scoreBadgeWrap, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <View style={[s.scoreBadge, { borderColor: passed ? "#A78BFA" : "#F87171" }]}>
              <Text style={s.scoreFraction}>{score}</Text>
              <Text style={s.scoreDivider}>/ 10</Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
            <Text style={s.heroTitle}>
              {passed ? "Parabéns! 🎉" : "Quase lá! 💪"}
            </Text>
            <Text style={s.heroSubtitle}>
              {passed
                ? "Você demonstrou um ótimo domínio sobre o autismo!"
                : "Revise o conteúdo do curso e tente novamente."}
            </Text>
          </Animated.View>

          {/* Estatísticas rápidas */}
          <Animated.View style={[s.statsRow, { opacity: fadeAnim }]}>
            <View style={s.statCard}>
              <Ionicons name="checkmark-circle" size={22} color="#4ADE80" />
              <Text style={s.statNumber}>{correctCount}</Text>
              <Text style={s.statLabel}>Acertos</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statCard}>
              <Ionicons name="close-circle" size={22} color="#F87171" />
              <Text style={s.statNumber}>{wrongCount}</Text>
              <Text style={s.statLabel}>Erros</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statCard}>
              <Ionicons name="trophy" size={22} color="#FCD34D" />
              <Text style={s.statNumber}>{Math.round((correctCount / 10) * 100)}%</Text>
              <Text style={s.statLabel}>Aproveit.</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── LISTA DE REVISÃO ── */}
      <ScrollView
        style={s.reviewScroll}
        contentContainerStyle={s.reviewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.sectionTitle, { color: colors.text }]}>Revisão das Respostas</Text>

        {displayQuiz.map((question, idx) => {
          const userAnswer = parsedAnswers[question.id];
          const isCorrect = userAnswer === question.correctOptionId;
          const userText = question.options.find((o) => o.id === userAnswer)?.text ?? "Não respondida";
          const correctText = question.options.find((o) => o.id === question.correctOptionId)?.text ?? "";

          return (
            <View key={question.id} style={[
              s.reviewCard, 
              { backgroundColor: colors.card, shadowColor: isDark ? '#000' : colors.shadow },
              isCorrect ? s.reviewCardCorrect : s.reviewCardWrong
            ]}>
              {/* Número e ícone */}
              <View style={s.reviewCardHeader}>
                <View style={[s.reviewNum, { backgroundColor: isCorrect ? (isDark ? "#064e3b" : "#D1FAE5") : (isDark ? "#7f1d1d" : "#FEE2E2") }]}>
                  <Text style={[s.reviewNumText, { color: isCorrect ? (isDark ? "#ecfdf5" : "#065F46") : (isDark ? "#fef2f2" : "#991B1B") }]}>
                    {String(idx + 1).padStart(2, "0")}
                  </Text>
                </View>
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={isCorrect ? "#10b981" : "#ef4444"}
                />
              </View>

              <Text style={[s.reviewQuestion, { color: colors.text }]}>{question.question}</Text>

              {/* Resposta do usuário */}
              <View style={[s.answerRow, { backgroundColor: isCorrect ? (isDark ? "rgba(16,185,129,0.1)" : "#ECFDF5") : (isDark ? "rgba(239,68,68,0.1)" : "#FEF2F2") }]}>
                <Text style={[s.answerLabel, { color: colors.subtext }]}>Sua resposta:</Text>
                <Text style={[s.answerText, { color: isCorrect ? (isDark ? "#34d399" : "#065F46") : (isDark ? "#f87171" : "#991B1B") }]}>{userText}</Text>
              </View>

              {/* Resposta correta (só aparece se errou) */}
              {!isCorrect && (
                <View style={[s.answerRow, { backgroundColor: isDark ? "rgba(16,185,129,0.1)" : "#ECFDF5", marginTop: 6 }]}>
                  <Text style={[s.answerLabel, { color: colors.subtext }]}>Resposta correta:</Text>
                  <Text style={[s.answerText, { color: isDark ? "#34d399" : "#065F46" }]}>{correctText}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Botões finais */}
        <TouchableOpacity
          style={[s.btn, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnText}>Voltar para o Início</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.btnOutline, { backgroundColor: isDark ? 'transparent' : '#fff', borderColor: colors.accent }]} 
          onPress={() => router.replace("/quiz")}
        >
          <Ionicons name="refresh-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={[s.btnOutlineText, { color: colors.accent }]}>Refazer Quiz</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7FF" },

  // ── HERO ──
  hero: { paddingBottom: 28 },
  heroSafe: { alignItems: "center", paddingHorizontal: 20 },
  heroBack: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 8,
  },
  scoreBadgeWrap: { marginBottom: 16 },
  scoreBadge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreFraction: { fontSize: 52, fontWeight: "800", color: "#FFFFFF", lineHeight: 58 },
  scoreDivider: { fontSize: 18, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 6 },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  statCard: { flex: 1, alignItems: "center", gap: 2 },
  statNumber: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  statDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.25)" },

  // ── REVIEW ──
  reviewScroll: { flex: 1 },
  reviewContent: { paddingHorizontal: 20, paddingTop: 22 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  reviewCardCorrect: { borderLeftColor: "#059669" },
  reviewCardWrong: { borderLeftColor: "#DC2626" },
  reviewCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewNum: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  reviewNumText: { fontSize: 12, fontWeight: "700" },
  reviewQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
    lineHeight: 20,
  },
  answerRow: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  answerLabel: { fontSize: 11, color: "#6B7280", fontWeight: "600", marginBottom: 2 },
  answerText: { fontSize: 13, fontWeight: "500", lineHeight: 18 },

  // ── BOTÕES ──
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#6B46C1",
    backgroundColor: "#FFFFFF",
  },
  btnOutlineText: { color: "#6B46C1", fontSize: 16, fontWeight: "700" },
});

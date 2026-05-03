import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QUIZ_DATA, QuizOption, QuizQuestion } from "../../constants/quizData";
import MenuLateral from "../../components/MenuLateral";
import { useTheme } from "../../context/ThemeContext";


// Embaralha as opções de uma pergunta e recalcula a letra da resposta correta
function shuffleQuizOptions(question: QuizQuestion): QuizQuestion {
  const correctText = question.options.find(o => o.id === question.correctOptionId)!.text;
  const shuffled = [...question.options].sort(() => Math.random() - 0.5);
  const letters: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const newOptions: QuizOption[] = shuffled.map((opt, idx) => ({ ...opt, id: letters[idx] }));
  const newCorrectId = newOptions.find(o => o.text === correctText)!.id;
  return { ...question, options: newOptions, correctOptionId: newCorrectId };
}

function OptionCard({
  option,
  selected,
  locked,
  correctId,
  onPress,
}: {
  option: QuizOption;
  selected: boolean;
  locked: boolean;
  correctId: "A" | "B" | "C" | "D";
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (locked) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const { colors, isDark } = useTheme();
  const isCorrectAnswer = option.id === correctId;
  let borderColor = isDark ? colors.border : "#D8D4ED";
  let bg = isDark ? colors.card : "#FFFFFF";
  let letterBg = isDark ? colors.background : "#EDE9FF";
  let letterColor = colors.accent;
  let textColor = colors.text;

  if (locked) {
    if (isCorrectAnswer) {
      bg = isDark ? "#064e3b" : "#ECFDF5";
      borderColor = "#10b981";
      letterBg = "#10b981";
      letterColor = "#FFFFFF";
      textColor = isDark ? "#ecfdf5" : "#065F46";
    } else if (selected && !isCorrectAnswer) {
      bg = isDark ? "#7f1d1d" : "#FEF2F2";
      borderColor = "#ef4444";
      letterBg = "#ef4444";
      letterColor = "#FFFFFF";
      textColor = isDark ? "#fef2f2" : "#991B1B";
    }
  } else if (selected) {
    bg = isDark ? "#2e1065" : "#F5F0FF";
    borderColor = colors.accent;
    letterBg = colors.accent;
    letterColor = "#FFFFFF";
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={locked}
        style={[s.optionCard, { backgroundColor: bg, borderColor }]}
      >
        <View style={[s.optionLetter, { backgroundColor: letterBg }]}>
          <Text style={[s.optionLetterText, { color: letterColor }]}>{option.id}</Text>
        </View>
        <Text style={[s.optionText, { color: textColor }]}>{option.text}</Text>
        {locked && isCorrectAnswer && (
          <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
        )}
        {locked && selected && !isCorrectAnswer && (
          <Ionicons name="close-circle" size={20} color="#F87171" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function QuizScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  
  // UseRef para garantir acesso síncrono aos dados no momento da transição
  const answersRef = useRef<Record<number, "A" | "B" | "C" | "D">>({});

  // Embaralha as opções uma única vez ao montar a tela (não reembaralha no re-render)
  const [shuffledQuiz] = useState<QuizQuestion[]>(() => QUIZ_DATA.map(shuffleQuizOptions));

  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const question = shuffledQuiz[currentIndex];
  const totalQuestions = shuffledQuiz.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  const isCorrect = selectedOption === question.correctOptionId;

  const handleOptionSelect = (optionId: "A" | "B" | "C" | "D") => {
    if (selectedOption) return;
    
    // Atualiza síncronamente o Ref e assíncronamente o State (para UI)
    answersRef.current[question.id] = optionId;
    
    setSelectedOption(optionId);
    setAnswers({ ...answersRef.current });

    // Anima o card de feedback
    feedbackAnim.setValue(0);
    Animated.spring(feedbackAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      feedbackAnim.setValue(0);
    } else {
      // Cálculo final síncrono usando o Ref (que é garantido estar atualizado)
      let finalScore = 0;
      const finalAnswers = answersRef.current;
      
      shuffledQuiz.forEach(q => {
        if (finalAnswers[q.id] === q.correctOptionId) {
          finalScore++;
        }
      });

      router.push({
        pathname: "/quiz/result",
        params: { 
          answersJson: JSON.stringify(finalAnswers),
          score: finalScore.toString(),
          shuffledQuizJson: JSON.stringify(shuffledQuiz)
        },
      });
    }
  };

  const { colors, isDark } = useTheme();

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#e6f5f9", "#e0eaf5", "#dce0f2"]} 
      style={s.root}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={[s.iconBtn, isDark && { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={20} color={colors.accent} />
          </TouchableOpacity>

          <View style={s.headerCenter}>
            <Text style={[s.headerTitle, { color: colors.text }]}>Teste de Conhecimentos</Text>
            <Text style={[s.headerSub, { color: colors.subtext }]}>Autismo</Text>
          </View>

          <MenuLateral />
        </View>

        <View style={s.progressRow}>
          <View style={[s.progressBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(107,70,193,0.15)' }]}>
            <View style={[s.progressFill, { width: `${progressPercentage}%`, backgroundColor: colors.accent }]} />
          </View>
          <Text style={[s.progressLabel, { color: colors.accent }]}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {/* ── CARD DA PERGUNTA ── */}
          <View style={[s.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[s.questionIconWrap, { backgroundColor: isDark ? colors.background : "#F0EBFF" }]}>
              <Ionicons name={question.icon} size={42} color={colors.accent} />
            </View>
            <Text style={[s.questionText, { color: colors.text }]}>{question.question}</Text>
          </View>

          {/* ── OPÇÕES ── */}
          <View style={s.optionsWrap}>
            {question.options.map((opt: QuizOption) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={selectedOption === opt.id}
                locked={selectedOption !== null}
                correctId={question.correctOptionId}
                onPress={() => handleOptionSelect(opt.id)}
              />
            ))}
          </View>

          {/* ── FEEDBACK ANIMADO ── */}
          {selectedOption && (
            <Animated.View
              style={[
                s.feedbackCard,
                {
                  backgroundColor: isCorrect
                    ? (isDark ? "rgba(16,185,129,0.15)" : "rgba(74,222,128,0.18)")
                    : (isDark ? "rgba(239,68,68,0.15)" : "rgba(248,113,113,0.18)"),
                  borderColor: isCorrect ? "#10b981" : "#ef4444",
                  opacity: feedbackAnim,
                  transform: [
                    {
                      translateY: feedbackAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={s.feedbackRow}>
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={22}
                  color={isCorrect ? "#10b981" : "#ef4444"}
                />
                <Text style={[s.feedbackTitle, { color: isCorrect ? "#10b981" : "#ef4444" }]}>
                  {isCorrect ? "Correto!" : "Incorreto"}
                </Text>
              </View>
              <Text style={[s.feedbackText, { color: colors.text }]}>{question.explanation}</Text>
            </Animated.View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── BOTÃO PRÓXIMO ── */}
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.nextBtn, { backgroundColor: colors.accent }, !selectedOption && s.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!selectedOption}
          >
            <Text style={[s.nextBtnText, { color: "#FFF" }]}>
              {currentIndex === totalQuestions - 1 ? "Finalizar" : "Próximo"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 15, fontWeight: "700", color: "#1a3b5c" },
  headerSub: { fontSize: 12, color: "#64748b", marginTop: 1 },

  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  progressBg: {
    flex: 1,
    height: 7,
    backgroundColor: "rgba(107,70,193,0.15)",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 7,
    backgroundColor: "#6B46C1",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: "#6B46C1",
    fontWeight: "700",
    minWidth: 36,
    textAlign: "right",
  },

  // Scroll
  scroll: { paddingHorizontal: 16 },

  // Question card
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E2FF",
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#6B46C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  questionIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F0EBFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a3b5c",
    textAlign: "center",
    lineHeight: 26,
  },

  // Options
  optionsWrap: { gap: 10, marginBottom: 4 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionLetter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionLetterText: { fontSize: 14, fontWeight: "700" },
  optionText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: "500" },

  // Feedback
  feedbackCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginTop: 12,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  feedbackTitle: { fontSize: 15, fontWeight: "700" },
  feedbackText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },

  // Footer / next button
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  nextBtn: {
    backgroundColor: "#6B46C1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 6,
    shadowColor: "#6B46C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextBtnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
});

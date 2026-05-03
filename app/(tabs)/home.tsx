import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/home.styles";
import { TOPIC_CONTENT } from "../../constants/topicContent";
import { useTheme } from "../../context/ThemeContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";

// Lista de dicas focadas em Autismo
const TIPS = [
  "Dê instruções claras e curtas para facilitar a compreensão.",
  "Use apoios visuais para tornar a rotina mais previsível e segura.",
  "O tempo de processamento pode ser maior; espere 10 segundos antes de repetir.",
  "Celebre as pequenas conquistas de hoje; elas são grandes vitórias!",
  "Mantenha a rotina previsível para reduzir a ansiedade e o estresse.",
  "Respeite os limites sensoriais; cada pessoa percebe o mundo de um jeito único.",
  "Comunicação não é apenas fala; observe gestos, olhares e expressões.",
  "Prepare a criança com antecedência para mudanças na programação.",
  "Crie um 'espaço seguro' em casa para momentos de sobrecarga sensorial.",
  "Foque nos interesses da criança para criar momentos de conexão.",
  "Sua saúde mental também importa; tire um momento para respirar hoje.",
  "A paciência é a maior ferramenta de ensino que você possui."
];

import MenuLateral from "../../components/MenuLateral";

export default function Home() {
  const { colors, isDark } = useTheme();
  const [userName, setUserName] = useState("");
  const [isCourseComplete, setIsCourseComplete] = useState(false);
  const [isCourseStarted, setIsCourseStarted] = useState(false);
  const [dailyTip, setDailyTip] = useState("");
  const [isQuizDone, setIsQuizDone] = useState(false);

  useEffect(() => {
    const loadDailyTip = async () => {
      try {
        const q = query(collection(db, "tips"));
        const querySnapshot = await getDocs(q);
        const firestoreTips: string[] = [];
        querySnapshot.forEach((doc) => {
          firestoreTips.push(doc.data().text);
        });

        const finalTips = firestoreTips.length > 0 ? firestoreTips : TIPS;
        const randomIndex = Math.floor(Math.random() * finalTips.length);
        setDailyTip(finalTips[randomIndex]);
      } catch (error) {
        console.error("Erro ao carregar dicas do Firestore:", error);
        const randomIndex = Math.floor(Math.random() * TIPS.length);
        setDailyTip(TIPS[randomIndex]);
      }
    };

    loadDailyTip();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserAndProgress = async () => {
      try {
        // Busca Usuário e seu Progresso
        const userJson = await AsyncStorage.getItem("teac_current_user");
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserName(user.isAdmin ? "ADMINISTRADOR" : user.nome);

          // 1. Busca Progresso na Nuvem (Firebase)
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let cloudProgress = {};
          if (userDoc.exists()) {
            cloudProgress = userDoc.data().courseProgress || {};
          }

          // 2. Busca Progresso Local (Cache)
          const localData = await AsyncStorage.getItem(`course_progress_detailed_${user.uid}`);
          const localProgress = localData ? JSON.parse(localData) : {};

          // 3. Mescla e calcula
          const progressData = { ...localProgress, ...cloudProgress };
          await AsyncStorage.setItem(`course_progress_detailed_${user.uid}`, JSON.stringify(progressData));

          let fullyCompletedTopicsCount = 0;
          let startedTopicsCount = 0;

          Object.keys(progressData).forEach((topicId) => {
            const revealedSlides = progressData[topicId].length;
            const totalSlides = TOPIC_CONTENT[topicId] ? TOPIC_CONTENT[topicId].length : 5;
            if (revealedSlides > 0) startedTopicsCount++;
            if (revealedSlides >= totalSlides) fullyCompletedTopicsCount++;
          });

          if (startedTopicsCount > 0) setIsCourseStarted(true);
          if (fullyCompletedTopicsCount >= 15) setIsCourseComplete(true);

          // 4. Busca status do Quiz
          const quizDone = await AsyncStorage.getItem(`quiz_completed_${user.uid}`);
          if (quizDone === "true") setIsQuizDone(true);
        }

      } catch (e) {
        console.error(e);
      }
    };
    fetchUserAndProgress();
  }, [])
);

  return (
    <LinearGradient
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#e6f5f9", "#e0eaf5", "#dce0f2"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* CABEÇALHO PADRONIZADO (IGUAL AO FÓRUM) */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 20, 
            paddingTop: 10,
            paddingBottom: 10
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
                Bem-vindo{userName ? `, ${userName}` : ""}!
              </Text>
              <Text style={{ fontSize: 14, color: colors.subtext }}>
                Continue a jornada de aprendizado.
              </Text>
            </View>
            <MenuLateral />
          </View>

          {/* CARD 1: COMECE SUA JORNADA */}
          <View style={[
            styles.journeyCard, 
            { backgroundColor: colors.card },
            isCourseComplete && { backgroundColor: isDark ? colors.card : '#ffffff', borderColor: '#ff9800', borderWidth: 1 }
          ]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {isCourseComplete ? "Jornada Concluída! 🎉" : "Comece sua jornada"}
            </Text>

            <View style={styles.journeyContent}>
              <View style={styles.journeyTextSection}>
                {isCourseComplete ? (
                  <Text style={[styles.bulletText, { color: '#ff9800', fontWeight: 'bold' }]}>
                    Parabéns! Você concluiu todos os módulos e está pronto para aplicar seus conhecimentos.
                  </Text>
                ) : (
                  <>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        Aprenda as praticas de rotina e comunicação do TEA.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        Conclua e receba seu certificado!
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'column', gap: 10 }}>
              <TouchableOpacity
                style={styles.iniciarCursoBtn}
                onPress={() => router.push("/course")}
              >
                <Text style={styles.iniciarCursoBtnText}>
                  {isCourseComplete 
                    ? "Refazer Curso" 
                    : isCourseStarted 
                      ? "Continuar Curso" 
                      : "Iniciar Curso"}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Imagem Flutuante na Direita */}
            <View style={styles.absoluteRingContainer}>
              <View style={styles.floatingImageRing}>
                <Image
                  source={require("../../assets/logo3.png")}
                  style={styles.floatingImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* CARD 2: TESTE O SEU CONHECIMENTO */}
          <View style={[styles.recommendationCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Teste o seu conhecimento</Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.bulletText, { color: colors.subtext }]}>
                  Coloque em pratica o que você aprendeu no curso.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.bulletText, { color: colors.subtext }]}>Aprenda e desafie amigos ou familiares</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.verConteudoBtn, isDark && { backgroundColor: '#334155' }]} onPress={() => router.push("/quiz")}>
              <Text style={[styles.verConteudoText, isDark && { color: '#fff' }]}>
                {isQuizDone ? "Refazer Quiz" : "Iniciar Quiz"}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={isDark ? "#fff" : "#3b4352"} />
            </TouchableOpacity>

            {/* Imagem Flutuante na Direita */}
            <View style={styles.absoluteRingContainer}>
              <View style={[styles.floatingImageRing, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
                <Image
                  source={require("../../assets/logo2.png")}
                  style={styles.floatingImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* CARD 3: FÓRUM */}
          <View style={[styles.forumCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Acessar o fórum</Text>
            <Text style={[styles.forumDescription, { color: colors.subtext }]}>
              Envie sua dúvida para um dos nossos especialistas.
            </Text>
            <TouchableOpacity
              style={[styles.forumBtn, isDark && { backgroundColor: colors.accent }]}
              onPress={() => router.push("/forum")}
            >
              <Text style={[styles.forumBtnText, isDark && { color: '#fff' }]}>Ir para o Fórum</Text>
            </TouchableOpacity>
          </View>

          {/* CARD 4: DICA DO DIA */}
          <View style={[styles.tipCard, { backgroundColor: isDark ? colors.card : '#e3f3ff' }]}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={24} color="#ff9800" />
              <Text style={[styles.tipTitle, { color: colors.text }]}>Dica do dia</Text>
            </View>
            <Text style={[styles.tipText, { color: colors.subtext }]}>
              "{dailyTip}"
            </Text>
          </View>

          {/* RECOMENDADOS */}
          <View style={styles.notificationsHeader}>
            <Text style={[styles.notificationsTitle, { color: colors.text }]}>Recomendado</Text>
            <TouchableOpacity style={styles.verTudoRow}>
            </TouchableOpacity>
          </View>

          <View style={styles.gridMenu}>
            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: isDark ? '#1e293b' : '#b2dfdb' }]}
              onPress={() => router.push("/relatorios")}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={28}
                color={isDark ? '#4db6ac' : "#4db6ac"}
                style={styles.gridIconContainer}
              />
              <Text style={[styles.gridText, { color: colors.text }]}>Relatório de{"\n"}comportamentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: isDark ? '#1e293b' : '#ffcc80' }]}
              onPress={() => router.push("/registrar-comportamento")}
            >
              <MaterialCommunityIcons
                name="clipboard-plus-outline"
                size={28}
                color={isDark ? '#ff9800' : "#ff9800"}
                style={styles.gridIconContainer}
              />
              <Text style={[styles.gridText, { color: colors.text }]}>Registrar{"\n"}comportamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: isDark ? '#1e293b' : '#bbdefb' }]}
              onPress={() => router.push("/criar-rotina")}
            >
              <MaterialCommunityIcons
                name="view-list"
                size={28}
                color={isDark ? '#42a5f5' : "#42a5f5"}
                style={styles.gridIconContainer}
              />
              <Text style={[styles.gridText, { color: colors.text }]}>Criar{"\n"}rotina</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: isDark ? '#1e293b' : '#fff59d' }]}
            >
              <Ionicons
                name="notifications"
                size={28}
                color={isDark ? '#fbc02d' : "#fbc02d"}
                style={styles.gridIconContainer}
              />
              <Text style={[styles.gridText, { color: colors.text }]}>Adicionar{"\n"}lembrete</Text>
            </TouchableOpacity>
          </View>

          {/* CITAÇÃO FINAL */}
          <View style={[styles.footerQuoteBox, isDark && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            <Text style={[styles.footerQuoteText, { color: colors.text }]}>
              {'"Cada pequeno avanço é uma grande conquista."'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

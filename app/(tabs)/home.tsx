import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/home.styles";
import { TOPIC_CONTENT } from "../../constants/topicContent";

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
  const [userName, setUserName] = useState("");
  const [isCourseComplete, setIsCourseComplete] = useState(false);
  const [isCourseStarted, setIsCourseStarted] = useState(false);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    // Sorteia uma dica ao carregar
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    setDailyTip(TIPS[randomIndex]);

    const fetchUserAndProgress = async () => {
      try {
        // Busca Usuário
        const userJson = await AsyncStorage.getItem("teac_current_user");
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserName(user.isAdmin ? "ADMINISTRADOR" : user.nome);
        }

        // Busca Progresso do Curso (Lista de IDs concluídos)
        const progressJson = await AsyncStorage.getItem("course_progress_detailed");
        if (progressJson) {
          const progressData = JSON.parse(progressJson);
          
          let fullyCompletedTopicsCount = 0;
          let startedTopicsCount = 0;

          Object.keys(progressData).forEach((topicId) => {
            const revealedSlides = progressData[topicId].length;
            const totalSlides = TOPIC_CONTENT[topicId] ? TOPIC_CONTENT[topicId].length : 5;
            
            if (revealedSlides > 0) {
              startedTopicsCount++;
            }
            if (revealedSlides >= totalSlides) {
              fullyCompletedTopicsCount++;
            }
          });

          if (startedTopicsCount > 0) {
            setIsCourseStarted(true);
          }

          // O curso tem 15 tópicos no total (5 módulos x 3 tópicos)
          if (fullyCompletedTopicsCount >= 15) {
            setIsCourseComplete(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserAndProgress();
  }, []);

  return (
    <LinearGradient
      // Manteremos um gradiente claro suave de azul para lilás para combinar com o layout
      colors={["#e6f5f9", "#e0eaf5", "#dce0f2"]}
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
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a3b5c' }}>
                Bem-vindo{userName ? `, ${userName}` : ""}!
              </Text>
              <Text style={{ fontSize: 14, color: '#64748b' }}>
                Continue a jornada de aprendizado.
              </Text>
            </View>
            <MenuLateral />
          </View>

          {/* CARD 1: COMECE SUA JORNADA */}
          <View style={[styles.journeyCard, isCourseComplete && { backgroundColor: '#ffffff', borderColor: '#ff9800', borderWidth: 1 }]}>
            <Text style={styles.cardTitle}>
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
                style={[styles.iniciarCursoBtn, isCourseComplete && { backgroundColor: '#ff9800' }]}
                onPress={() => router.push("/course")}
              >
                <Text style={styles.iniciarCursoBtnText}>
                  {isCourseComplete 
                    ? "Rever Curso" 
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

          {/* CARD 2: FÓRUM */}
          <View style={styles.forumCard}>
            <Text style={styles.cardTitle}>Acessar o fórum</Text>
            <Text style={styles.forumDescription}>
              Envie sua dúvida para um dos nossos especialistas.
            </Text>
            <TouchableOpacity
              style={styles.forumBtn}
              onPress={() => router.push("/forum")}
            >
              <Text style={styles.forumBtnText}>Ir para o Fórum</Text>
            </TouchableOpacity>
          </View>

          {/* CARD 3: RECOMENDADO HOJE */}
          <View style={styles.recommendationCard}>
            <Text style={styles.cardTitle}>Recomendado hoje</Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Como lidar com sobrecarga sensorial
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Sinais iniciais do TEA</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>
                  Estratégias para rotina diária
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.verConteudoBtn}>
              <Text style={styles.verConteudoText}>Ver conteúdo</Text>
              <Ionicons name="chevron-forward" size={18} color="#3b4352" />
            </TouchableOpacity>

            {/* Imagem Flutuante na Direita */}
            <View style={styles.absoluteRingContainer}>
              <View style={styles.floatingImageRing}>
                {/* Substituir logo2 pela arte redonda depois */}
                <Image
                  source={require("../../assets/logo2.png")}
                  style={styles.floatingImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* CARD 3: DICA DO DIA */}
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={24} color="#ff9800" />
              <Text style={styles.tipTitle}>Dica do dia</Text>
            </View>
            <Text style={styles.tipText}>
              "{dailyTip}"
            </Text>
          </View>

          {/* SEÇÃO NOTIFICAÇÕES */}
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notificações</Text>
            <TouchableOpacity style={styles.verTudoRow}>
              <Text style={styles.verTudoText}>Ver tudo</Text>
              <Ionicons name="chevron-forward" size={16} color="#3b4352" />
            </TouchableOpacity>
          </View>

          <View style={styles.gridMenu}>
            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#b2dfdb" }]}
              onPress={() => router.push("/relatorios")}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={28}
                color="#4db6ac"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Relatório de{"\n"}comportamentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#ffcc80" }]}
              onPress={() => router.push("/registrar-comportamento")}
            >
              <MaterialCommunityIcons
                name="clipboard-plus-outline"
                size={28}
                color="#ff9800"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Registrar{"\n"}comportamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#bbdefb" }]}
              onPress={() => router.push("/criar-rotina")}
            >
              <MaterialCommunityIcons
                name="view-list"
                size={28}
                color="#42a5f5"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Criar{"\n"}rotina</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#fff59d" }]}
            >
              <Ionicons
                name="notifications"
                size={28}
                color="#fbc02d"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Adicionar{"\n"}lembrete</Text>
            </TouchableOpacity>
          </View>

          {/* CITAÇÃO FINAL */}
          <View style={styles.footerQuoteBox}>
            <Text style={styles.footerQuoteText}>
              {'"Cada pequeno avanço é uma grande conquista."'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

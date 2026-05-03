import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState, useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/course.styles";
import { COURSE_DATA } from "../constants/courseData";
import { TOPIC_CONTENT } from "../constants/topicContent";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

import MenuLateral from "../components/MenuLateral";

export default function Course() {
  const [detailedProgress, setDetailedProgress] = useState<{ [key: string]: number[] }>({});

  const scrollViewRef = React.useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Recarregar progresso toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await loadProgress();
        // Restaurar scroll após carregar os dados
        const savedScroll = await AsyncStorage.getItem("course_scroll_y");
        if (savedScroll && scrollViewRef.current) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: parseInt(savedScroll), animated: false });
          }, 100);
        }
      };
      init();
    }, [])
  );

  const loadProgress = async () => {
    try {
      let cloudProgress = {};
      
      // 1. Tentar pegar do Firebase para sincronizar
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          cloudProgress = userDoc.data().courseProgress || {};
        }
      }

      // 2. Pegar local
      const data = await AsyncStorage.getItem("course_progress_detailed");
      const localProgress = data ? JSON.parse(data) : {};

      // 3. Juntar tudo
      const combinedProgress = { ...localProgress, ...cloudProgress };
      setDetailedProgress(combinedProgress);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const handleTopicPress = async (topicId: string, topicTitle: string) => {
    // Salvar posição atual antes de navegar
    await AsyncStorage.setItem("course_scroll_y", scrollPosition.toString());
    
    router.push({
      pathname: "/topic-detail",
      params: { topicId, topicTitle },
    });
  };

  const progress = useMemo(() => {
    let totalSlidesGlobal = 0;
    let totalRevealedGlobal = 0;

    COURSE_DATA.forEach(module => {
      module.topics.forEach(topic => {
        // Pega a quantidade real de slides do conteúdo do tópico
        const slides = TOPIC_CONTENT[topic.id] || [];
        const count = slides.length;
        
        totalSlidesGlobal += count;
        const revealed = detailedProgress[topic.id] ? detailedProgress[topic.id].length : 0;
        totalRevealedGlobal += revealed;
      });
    });

    return totalSlidesGlobal > 0 ? Math.round((totalRevealedGlobal / totalSlidesGlobal) * 100) : 0;
  }, [detailedProgress]);

  const isTopicCompleted = (topicId: string) => {
    const revealedCount = detailedProgress[topicId] ? detailedProgress[topicId].length : 0;
    const slides = TOPIC_CONTENT[topicId] || [];
    const totalCount = slides.length;
    
    // Se o usuário viu pelo menos a mesma quantidade de slides que o tópico possui, está completo
    return totalCount > 0 && revealedCount >= totalCount;
  };

  const { colors, isDark } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#e6f5f9", "#e0eaf5", "#dce0f2"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            setScrollPosition(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
        >
          {/* CABEÇALHO PADRONIZADO (IGUAL AO FÓRUM) */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 2, 
            paddingTop: 5,
            paddingBottom: 5
          }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 80 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, flex: 1 }}>
              Curso TEAC
            </Text>
            <MenuLateral />
          </View>

          {/* BANNER */}
          <View style={[styles.bannerContainer, isDark && { backgroundColor: colors.card }]}>
            <Image
              source={require("../assets/logo3.png")}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* TÍTULO E SUBTÍTULO */}
          <View style={styles.headerSection}>
            <Text style={[styles.mainTitle, { color: colors.text }]}>
              Estratégias Diárias para Crianças com TEA
            </Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              Rotina, Comunicação e Comportamento
            </Text>
          </View>

          <View style={[styles.courseCard, { backgroundColor: colors.card }]}>
            {/* BARRA DE PROGRESSO GLOBAL */}
            <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
              <View style={styles.progressRow}>
                <Text style={[styles.progressPercentage, { color: colors.accent }]}>{progress}%</Text>
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: progress === 100 ? '#10b981' : colors.accent }]}
                  />
                </View>
              </View>
              <Text style={[styles.moduleInfo, { color: colors.subtext }]}>
                {progress === 100 ? "Parabéns! Você concluiu o curso." : "Acompanhe seu progresso cartão a cartão!"}
              </Text>

              {/* BOTÃO DE CERTIFICADO */}
              <TouchableOpacity
                style={[
                  styles.certificateBtn,
                  { backgroundColor: colors.accent },
                  progress < 100 && [styles.certificateBtnDisabled, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]
                ]}
                onPress={() => progress === 100 && router.push("/certificate")}
                activeOpacity={progress === 100 ? 0.7 : 1}
              >
                <Ionicons 
                  name="ribbon-outline" 
                  size={20} 
                  color={progress === 100 ? "#ffffff" : (isDark ? "#64748b" : "#A0AEC0")} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[
                  styles.certificateBtnText,
                  progress < 100 && [styles.certificateBtnTextDisabled, { color: isDark ? "#64748b" : "#A0AEC0" }]
                ]}>
                  Baixar Certificado Digital
                </Text>
                {progress < 100 && (
                  <Ionicons name="lock-closed" size={14} color={isDark ? "#64748b" : "#A0AEC0"} style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>

            <View style={[styles.topicsCard, { backgroundColor: colors.card }]}>
              {COURSE_DATA.map((module) => (
                <View key={module.id} style={styles.moduleSection}>
                  <Text style={[styles.moduleTitle, { color: colors.accent }]}>{module.title}</Text>
                  {module.topics.map((topic, index) => {
                    const completed = isTopicCompleted(topic.id);
                    return (
                      <React.Fragment key={topic.id}>
                        <TouchableOpacity
                          style={styles.topicItem}
                          onPress={() => handleTopicPress(topic.id, topic.title)}
                        >
                          <View
                            style={[
                              styles.topicDot,
                              { borderColor: colors.border },
                              completed && [styles.topicDotCompleted, { backgroundColor: '#10b981', borderColor: '#10b981' }],
                            ]}
                          >
                            {completed && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                          </View>
                          <Text style={[styles.topicText, { color: colors.text }, completed && { color: '#10b981', fontWeight: '600' }]}>
                            {topic.title}
                          </Text>
                        </TouchableOpacity>
                        {index < module.topics.length - 1 && (
                          <View style={[styles.topicSeparator, { backgroundColor: colors.border }]} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* CARD AJUDA */}
          <View style={[styles.helpCard, { backgroundColor: colors.card }]}>
            <View style={styles.helpHeader}>
              <Ionicons name="help-circle" size={24} color={colors.accent} />
              <Text style={[styles.helpTitle, { color: colors.text }]}>Precisa de ajuda?</Text>
            </View>
            <Text style={[styles.helpText, { color: colors.subtext }]}>
              Envie sua dúvida no Fórum da Comunidade.
            </Text>
            <TouchableOpacity
              style={[styles.forumBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push("/forum")}
            >
              <Text style={styles.forumBtnText}>Acessar Fórum</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

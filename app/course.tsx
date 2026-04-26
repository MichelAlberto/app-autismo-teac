import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState, useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/course.styles";
import { COURSE_DATA, SLIDES_COUNT } from "../constants/courseData";

export default function Course() {
  const [detailedProgress, setDetailedProgress] = useState<{ [key: string]: number[] }>({});

  // Recarregar progresso toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem("course_progress_detailed");
      if (data) {
        setDetailedProgress(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const handleTopicPress = (topicId: string, topicTitle: string) => {
    router.push({
      pathname: "/topic-detail",
      params: { topicId, topicTitle },
    });
  };

  const progress = useMemo(() => {
    let totalSlides = 0;
    let totalRevealed = 0;

    COURSE_DATA.forEach(module => {
      module.topics.forEach(topic => {
        const count = SLIDES_COUNT[topic.id] || 5;
        totalSlides += count;
        const revealed = detailedProgress[topic.id] ? detailedProgress[topic.id].length : 0;
        totalRevealed += revealed;
      });
    });

    return totalSlides > 0 ? Math.round((totalRevealed / totalSlides) * 100) : 0;
  }, [detailedProgress]);

  const isTopicCompleted = (topicId: string) => {
    const revealedCount = detailedProgress[topicId] ? detailedProgress[topicId].length : 0;
    const totalCount = SLIDES_COUNT[topicId] || 5;
    return revealedCount >= totalCount;
  };

  return (
    <LinearGradient
      colors={["#e6f5f9", "#e0eaf5", "#dce0f2"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* BANNER */}
          <View style={styles.bannerContainer}>
            <TouchableOpacity
              style={styles.backBtnOnBanner}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Image
              source={require("../assets/logo3.png")}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* TÍTULO E SUBTÍTULO */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>
              Estratégias Diárias para Crianças com TEA
            </Text>
            <Text style={styles.subtitle}>
              Rotina, Comunicação e Comportamento
            </Text>
          </View>

          <View style={styles.courseCard}>
            {/* BARRA DE PROGRESSO GLOBAL */}
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressPercentage}>{progress}%</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: progress === 100 ? '#4CAF50' : '#3B82F6' }]}
                  />
                </View>
              </View>
              <Text style={styles.moduleInfo}>
                {progress === 100 ? "Parabéns! Você concluiu o curso." : "Acompanhe seu progresso cartão a cartão!"}
              </Text>

              {/* BOTÃO DE CERTIFICADO */}
              <TouchableOpacity
                style={[
                  styles.certificateBtn,
                  progress < 100 && styles.certificateBtnDisabled
                ]}
                onPress={() => progress === 100 && router.push("/certificate")}
                activeOpacity={progress === 100 ? 0.7 : 1}
              >
                <Ionicons 
                  name="ribbon-outline" 
                  size={20} 
                  color={progress === 100 ? "#ffffff" : "#A0AEC0"} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[
                  styles.certificateBtnText,
                  progress < 100 && styles.certificateBtnTextDisabled
                ]}>
                  Baixar Certificado Digital
                </Text>
                {progress < 100 && (
                  <Ionicons name="lock-closed" size={14} color="#A0AEC0" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.topicsCard}>
              {COURSE_DATA.map((module) => (
                <View key={module.id} style={styles.moduleSection}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
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
                              completed && styles.topicDotCompleted,
                            ]}
                          >
                            {completed && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                          </View>
                          <Text style={[styles.topicText, completed && { color: '#4CAF50', fontWeight: '600' }]}>
                            {topic.title}
                          </Text>
                        </TouchableOpacity>
                        {index < module.topics.length - 1 && (
                          <View style={styles.topicSeparator} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* CARD AJUDA */}
          <View style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <Ionicons name="help-circle" size={24} color="#64b5f6" />
              <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            </View>
            <Text style={styles.helpText}>
              Envie sua dúvida no Fórum da Comunidade.
            </Text>
            <TouchableOpacity
              style={styles.forumBtn}
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

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/course.styles";

interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  topics: Topic[];
}

const COURSE_DATA: CourseModule[] = [
  {
    id: "1",
    title: "Módulo 1 - Introdução ao Autismo",
    topics: [
      {
        id: "1-1",
        title: "O que é o Transtorno do Espectro Autista (TEA)",
        completed: false,
      },
      {
        id: "1-2",
        title: "Mitos e Verdades",
        completed: false,
      },
      {
        id: "1-3",
        title: "Diversidade dentro do Espectro",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "Módulo 2 - Identificação e Sinais",
    topics: [
      {
        id: "2-1",
        title: "Sinais Precoces em Crianças",
        completed: false,
      },
      {
        id: "2-2",
        title: "Diferenças entre Idades",
        completed: false,
      },
      {
        id: "2-3",
        title: "Quando Procurar Ajuda",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Módulo 3 - Comunicação e Comportamento",
    topics: [
      {
        id: "3-1",
        title: "Comunicação Verbal e Não-verbal",
        completed: false,
      },
      {
        id: "3-2",
        title: "Crises (Meltdowns) vs Birras",
        completed: false,
      },
      {
        id: "3-3",
        title: "Estratégias Práticas do Dia a Dia",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    title: "Módulo 4 - Intervenções e Terapias",
    topics: [
      {
        id: "4-1",
        title: "ABA, Fonoaudiologia, Terapia Ocupacional",
        completed: false,
      },
      {
        id: "4-2",
        title: "Como Escolher Abordagens",
        completed: false,
      },
      {
        id: "4-3",
        title: "Papel da Família",
        completed: false,
      },
    ],
  },
  {
    id: "5",
    title: "Módulo 5 - Inclusão a Escola",
    topics: [
      {
        id: "5-1",
        title: "Adaptação Escolar",
        completed: false,
      },
      {
        id: "5-2",
        title: "Direitos Legais (Importantes no Brasil)",
        completed: false,
      },
      {
        id: "5-3",
        title: "Relação com Professores",
        completed: false,
      },
    ],
  },
];

export default function Course() {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem("course_progress");
      if (progress) {
        const completed = JSON.parse(progress);
        setCompletedTopics(completed);
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

  const markTopicAsCompleted = async (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const updated = [...completedTopics, topicId];
      setCompletedTopics(updated);
      await AsyncStorage.setItem("course_progress", JSON.stringify(updated));
    }
  };

  const calculateProgress = () => {
    const totalTopics = COURSE_DATA.reduce(
      (acc, module) => acc + module.topics.length,
      0,
    );
    return totalTopics > 0
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;
  };

  const handleGoBack = () => {
    router.back();
  };

  const progress = calculateProgress();

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
          {/* BANNER COM IMAGEM EM LARGURA TOTAL */}
          <View style={styles.bannerContainer}>
            <TouchableOpacity
              style={styles.backBtnOnBanner}
              onPress={handleGoBack}
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
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <Text style={styles.progressPercentage}>{progress}%</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>
              <Text style={styles.moduleInfo}>
                15 Tópicos em 5 Módulos - Conclua e receba um certificado!
              </Text>
            </View>

            <View style={styles.topicsCard}>
              {COURSE_DATA.map((module) => (
                <View key={module.id} style={styles.moduleSection}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  {module.topics.map((topic, index) => (
                    <React.Fragment key={topic.id}>
                      <TouchableOpacity
                        style={styles.topicItem}
                        onPress={() => {
                          markTopicAsCompleted(topic.id);
                          handleTopicPress(topic.id, topic.title);
                        }}
                      >
                        <View
                          style={[
                            styles.topicDot,
                            completedTopics.includes(topic.id) &&
                              styles.topicDotCompleted,
                          ]}
                        />
                        <Text style={styles.topicText}>{topic.title}</Text>
                      </TouchableOpacity>
                      {index < module.topics.length - 1 && (
                        <View style={styles.topicSeparator} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* CARD "PRECISA DE AJUDA?" */}
          <View style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <Ionicons name="help-circle" size={24} color="#64b5f6" />
              <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            </View>
            <Text style={styles.helpText}>
              Envie sua dúvida no Fórum Cen...
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

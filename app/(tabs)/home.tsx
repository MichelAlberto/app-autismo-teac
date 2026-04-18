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

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("teac_current_user");
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserName(user.isAdmin ? "ADMINISTRADOR" : user.nome);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja deslogar e voltar ao início?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("teac_current_user");
          router.replace("/");
        },
      },
    ]);
  };

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
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#e53935" />
          </TouchableOpacity>

          {/* SAUDAÇÃO INICIAL */}
          <View style={styles.greetingHeader}>
            <Text style={styles.greetingTitle}>
              Bem-vindo de volta{userName ? `, ${userName}` : ""}!
            </Text>
            <Text style={styles.greetingSubtitle}>
              Continue a jornada de aprendizado.
            </Text>
          </View>

          {/* CARD 1: COMECE SUA JORNADA */}
          <View style={styles.journeyCard}>
            <Text style={styles.cardTitle}>Comece sua jornada</Text>

            <View style={styles.journeyContent}>
              <View style={styles.journeyTextSection}>
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
              </View>
            </View>

            <TouchableOpacity style={styles.iniciarCursoBtn}>
              <Text style={styles.iniciarCursoBtnText}> Ir para  o curso </Text>
              <Ionicons name="chevron-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

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
              <Ionicons name="bulb" size={24} color="#aed581" />
              <Text style={styles.tipTitle}>Dica do dia</Text>
            </View>
            <Text style={styles.tipText}>
              Crianças com TEA costumam responder melhor a rotinas previsíveis.
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
            >
              <MaterialCommunityIcons
                name="calendar-check"
                size={28}
                color="#4db6ac"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Agendar{"\n"}consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#ffcc80" }]}
            >
              <MaterialCommunityIcons
                name="clipboard-text"
                size={28}
                color="#ff9800"
                style={styles.gridIconContainer}
              />
              <Text style={styles.gridText}>Registrar{"\n"}comportamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridSquare, { backgroundColor: "#bbdefb" }]}
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

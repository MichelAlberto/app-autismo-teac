import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { TOPIC_CONTENT } from '../constants/topicContent';

export default function AdminPanel() {
  const { colors, isDark } = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    topics: Object.keys(TOPIC_CONTENT).length,
    certificates: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Busca Usuários
        const usersSnap = await getDocs(collection(db, "users"));
        const userCount = usersSnap.size;

        // Para certificados, vamos contar usuários que completaram o progresso
        // (Aqui é uma estimativa baseada no campo courseProgress se existir)
        let certCount = 0;
        usersSnap.forEach(doc => {
          const data = doc.data();
          if (data.courseProgress && Object.keys(data.courseProgress).length >= 15) {
            certCount++;
          }
        });

        setStats({
          users: userCount,
          topics: Object.keys(TOPIC_CONTENT).length,
          certificates: certCount
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const ADMIN_ACTIONS = [
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      subtitle: 'Ver, editar ou remover usuários',
      icon: 'people-outline',
      color: '#4f46e5',
      route: '/admin/users'
    },
    {
      id: 'course',
      title: 'Conteúdo do Curso',
      subtitle: 'Adicionar ou editar módulos e tópicos',
      icon: 'book-outline',
      color: '#0891b2',
      route: '/admin/course'
    },
    {
      id: 'forum',
      title: 'Moderação do Fórum',
      subtitle: 'Gerenciar perguntas e respostas',
      icon: 'chatbubbles-outline',
      color: '#059669',
      route: '/admin/forum'
    },
    {
      id: 'tips',
      title: 'Dicas do Dia',
      subtitle: 'Atualizar lista de dicas dinâmicas',
      icon: 'bulb-outline',
      color: '#d97706',
      route: '/admin/tips'
    }
  ];

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, isDark && { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Painel Administrativo</Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>Gerenciamento Geral do TEAC</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              {loadingStats ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Text style={[styles.statValue, { color: colors.accent }]}>{stats.users}</Text>
              )}
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Usuários</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: '#059669' }]}>{stats.topics}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Tópicos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              {loadingStats ? (
                <ActivityIndicator size="small" color="#d97706" />
              ) : (
                <Text style={[styles.statValue, { color: '#d97706' }]}>{stats.certificates}</Text>
              )}
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Certificados</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações Disponíveis</Text>
          
          {ADMIN_ACTIONS.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => {
                if (action.route) {
                  router.push(action.route as any);
                }
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                <Text style={[styles.actionSubtitle, { color: colors.subtext }]}>{action.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.border} />
            </TouchableOpacity>
          ))}

          <View style={[styles.infoCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <Ionicons name="information-circle-outline" size={24} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              As funções de CRUD estão sendo integradas ao Firebase Firestore. Algumas seções podem estar em desenvolvimento.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 15,
    paddingBottom: 15,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitleContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  statCard: {
    width: '30%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    lineHeight: 18,
  }
});

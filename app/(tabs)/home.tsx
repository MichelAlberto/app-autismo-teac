import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/home.styles';

export default function Home() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('teac_current_user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserName(user.isAdmin ? 'ADMINISTRADOR' : user.nome);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja deslogar e voltar ao início?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('teac_current_user');
          router.replace('/');
        }
      }
    ]);
  };

  return (
    <LinearGradient
      // Manteremos um gradiente claro suave de azul para lilás para combinar com o layout
      colors={['#e6f5f9', '#e0eaf5', '#dce0f2']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#e53935" />
          </TouchableOpacity>

          {/* SAUDAÇÃO INICIAL */}
          <View style={styles.greetingHeader}>
            <Text style={styles.greetingTitle}>Bem-vindo de volta{userName ? `, ${userName}` : ''}!</Text>
            <Text style={styles.greetingSubtitle}>Continue a jornada de aprendizado.</Text>
          </View>

          {/* CARD 1: SEU PROGRESSO */}
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>Seu progresso</Text>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>40% concluído</Text>

            <View style={styles.progressRow}>
              <View style={styles.progressStatsList}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="graduation-cap" size={16} color="#e57373" />
                  <Text style={styles.statText}>Cursos concluídos: 3 de 8</Text>
                </View>
                <TouchableOpacity style={styles.statItem} onPress={() => router.push('/forum')}>
                  <Ionicons name="chatbubble" size={16} color="#64b5f6" />
                  <Text style={[styles.statText, { textDecorationLine: 'underline', fontWeight: 'bold' }]}>Acessar o Fórum Central</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.lastActivityBox}>
                <Ionicons name="star" size={24} color="#ffd54f" />
                <Text style={styles.lastActivityTitle}>Última atividade:</Text>
                <Text style={styles.lastActivityDesc}>Rotina e comunicação</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.continueBtn}>
              <Ionicons name="checkmark-circle" size={20} color="#ffb74d" />
              <Text style={styles.continueBtnText}>Continuar aprendizado</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ea7b8" />
            </TouchableOpacity>
          </View>

          {/* CARD 2: RECOMENDADO HOJE */}
          <View style={styles.recommendationCard}>
            <Text style={styles.cardTitle}>Recomendado hoje</Text>
            
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Como lidar com sobrecarga sensorial</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Sinais iniciais do TEA</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Estratégias para rotina diária</Text>
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
                  source={require('../../assets/logo2.png')} 
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
            <TouchableOpacity style={[styles.gridSquare, { backgroundColor: '#b2dfdb' }]}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#4db6ac" style={styles.gridIconContainer} />
              <Text style={styles.gridText}>Agendar{"\n"}consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridSquare, { backgroundColor: '#ffcc80' }]}>
              <MaterialCommunityIcons name="clipboard-text" size={28} color="#ff9800" style={styles.gridIconContainer} />
              <Text style={styles.gridText}>Registrar{"\n"}comportamento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridSquare, { backgroundColor: '#bbdefb' }]}>
              <MaterialCommunityIcons name="view-list" size={28} color="#42a5f5" style={styles.gridIconContainer} />
              <Text style={styles.gridText}>Criar{"\n"}rotina</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridSquare, { backgroundColor: '#fff59d' }]}>
              <Ionicons name="notifications" size={28} color="#fbc02d" style={styles.gridIconContainer} />
              <Text style={styles.gridText}>Adicionar{"\n"}lembrete</Text>
            </TouchableOpacity>
          </View>

          {/* CITAÇÃO FINAL */}
          <View style={styles.footerQuoteBox}>
            <Text style={styles.footerQuoteText}>
              "Cada pequeno avanço é uma grande conquista. "
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
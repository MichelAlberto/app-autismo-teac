import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// IMPORTES FIREBASE
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

import MenuLateral from '../components/MenuLateral';
import { useTheme } from '../context/ThemeContext';
import CustomAlert from '../components/CustomAlert';
import { Image } from 'react-native';

export default function Forum() {
  const { colors, isDark } = useTheme();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Custom Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'warning' | 'danger' | 'success' | 'info';
    onConfirm: () => void;
  }>({
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: any = 'info', onConfirm: any = null) => {
    setAlertConfig({
      title,
      message,
      type,
      onConfirm: () => {
        setAlertVisible(false);
        if (onConfirm) onConfirm();
      }
    });
    setAlertVisible(true);
  };

  useEffect(() => {
    getUser();
    loadData();
  }, []);

  const getUser = async () => {
    const userJson = await AsyncStorage.getItem('teac_current_user');
    if (userJson) setCurrentUser(JSON.parse(userJson));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Busca perguntas ordenadas pela data (mais recentes primeiro)
      const q = query(collection(db, "forum_topics"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(docs);
    } catch (e) {
      console.error("Erro ao carregar fórum:", e);
      showAlert("Erro", "Não foi possível carregar as mensagens.", "danger");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAsk = async () => {
    if (!novaPergunta.trim()) return;
    
    setLoading(true);
    try {
      const author = currentUser ? currentUser.nome : 'Visitante';
      const authorPhoto = currentUser?.profilePhoto || null;
      
      const newTopic = {
        author,
        authorId: currentUser?.uid || 'anonimo',
        authorPhoto,
        pergunta: novaPergunta,
        resposta: '',
        responsavel: '',
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "forum_topics"), newTopic);
      
      setNovaPergunta('');
      showAlert('Sucesso', 'Sua pergunta foi enviada aos especialistas!', 'success');
      loadData(); // Recarrega a lista
    } catch (e) {
      console.error("Erro ao postar pergunta:", e);
      showAlert("Erro", "Falha ao enviar pergunta.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (docId: string) => {
    const text = respostas[docId];
    if (!text || !text.trim()) return;
    
    setLoading(true);
    try {
      const topicRef = doc(db, "forum_topics", docId);
      
      await updateDoc(topicRef, {
        resposta: text,
        responsavel: currentUser?.nome || 'Admin',
        repliedAt: new Date().toISOString()
      });

      showAlert('Sucesso', 'Sua resposta foi publicada!', 'success');
      loadData(); // Recarrega a lista
    } catch (e) {
      console.error("Erro ao responder:", e);
      showAlert("Erro", "Falha ao enviar resposta.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ['#e6f5f9', '#e0eaf5', '#dce0f2']} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomAlert 
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setAlertVisible(false)}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Fórum de Dúvidas</Text>
          <View style={{ flex: 1 }} />
          <MenuLateral />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
        >
          {(!currentUser || !currentUser.isAdmin) && (
            <View style={[styles.askContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.askTitle, { color: colors.text }]}>Faça uma pergunta aos especialistas:</Text>
              <TextInput
                style={[styles.askInput, { backgroundColor: isDark ? colors.background : '#f5f5f5', color: colors.text }]}
                placeholder="Ex: Como lidar com a seletividade alimentar?"
                placeholderTextColor={colors.subtext}
                value={novaPergunta}
                onChangeText={setNovaPergunta}
                multiline
                editable={!loading}
              />
              <TouchableOpacity 
                style={[styles.askBtn, { backgroundColor: colors.accent }, loading && { opacity: 0.7 }]} 
                onPress={handleAsk}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.askBtnText}>Enviar Pergunta</Text>}
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tópicos Recentes</Text>

          {loading && !refreshing && <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />}

          {!loading && messages.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.subtext }]}>Nenhuma pergunta feita ainda. Puxe para baixo para atualizar.</Text>
          ) : (
            messages.map((msg: any) => (
              <View key={msg.id} style={[styles.messageCard, { backgroundColor: colors.card }]}>
                <View style={styles.authorRow}>
                  <View style={styles.avatarMiniContainer}>
                    {msg.authorPhoto ? (
                      <Image source={{ uri: msg.authorPhoto }} style={styles.avatarMini} />
                    ) : (
                      <Ionicons name="person-circle" size={24} color={colors.subtext} />
                    )}
                  </View>
                  <Text style={[styles.authorText, { color: colors.text }]}>{msg.author} perguntou:</Text>
                </View>
                <Text style={[styles.questionText, { color: colors.text }]}>{msg.pergunta}</Text>

                {msg.resposta ? (
                  <View style={[styles.answerBox, { backgroundColor: isDark ? '#1e3a8a' : '#e8f5e9', borderLeftColor: isDark ? '#3b82f6' : '#4caf50' }]}>
                    <Text style={[styles.adminName, { color: isDark ? '#93c5fd' : '#2e7d32' }]}>@{msg.responsavel || 'Especialista'} respondeu:</Text>
                    <Text style={[styles.answerText, { color: isDark ? '#dbeafe' : '#1b5e20' }]}>{msg.resposta}</Text>
                  </View>
                ) : (
                  currentUser && currentUser.isAdmin ? (
                    <View style={[styles.replyContainer, { borderTopColor: colors.border }]}>
                      <TextInput
                        style={[styles.replyInput, { backgroundColor: colors.background, color: colors.text }]}
                        placeholder="Escreva sua resposta aqui..."
                        placeholderTextColor={colors.subtext}
                        value={respostas[msg.id] || ''}
                        onChangeText={(t) => setRespostas({ ...respostas, [msg.id]: t })}
                        multiline
                        editable={!loading}
                      />
                      <TouchableOpacity 
                        style={[styles.replyBtn, { backgroundColor: colors.accent }, loading && { opacity: 0.7 }]} 
                        onPress={() => handleReply(msg.id)}
                        disabled={loading}
                      >
                         {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.replyBtnText}>Responder</Text>}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={[styles.waitingText, { color: colors.subtext }]}>[Aguardando resposta de um especialista...]</Text>
                  )
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3b5c',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  askContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  askTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  askInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  askBtn: {
    backgroundColor: '#4db6ac',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minHeight: 45,
    justifyContent: 'center',
  },
  askBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3b5c',
    marginBottom: 15,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarMiniContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMini: {
    width: '100%',
    height: '100%',
  },
  authorText: {
    fontWeight: '600',
    color: '#555',
  },
  questionText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
  },
  answerBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  adminName: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  answerText: {
    color: '#1b5e20',
  },
  waitingText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  replyContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  replyInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  replyBtn: {
    backgroundColor: '#6A7FDB',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  replyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

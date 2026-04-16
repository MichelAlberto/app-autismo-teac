import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Forum() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});

  // Assim que a tela carrega, nós tentamos identificar se o usuário é administrador ou normal
  // E também puxamos todos os dados do banco de dados local "teac_forum_messages"
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userJson = await AsyncStorage.getItem('teac_current_user');
    if (userJson) setCurrentUser(JSON.parse(userJson));

    const forumJson = await AsyncStorage.getItem('teac_forum_messages');
    if (forumJson) {
      setMessages(JSON.parse(forumJson));
    }
  };

  const handleAsk = async () => {
    if (!novaPergunta) return;
    const isMock = !currentUser; // Caso a pessoa tenha pulado o login de alguma forma
    const author = isMock ? 'Visitante' : currentUser.nome;
    const newMsg = {
      id: Date.now(),
      author,
      pergunta: novaPergunta,
      resposta: ''
    };
    
    // Injetamos a nova pergunta no topo da lista
    const updated = [newMsg, ...messages];
    setMessages(updated);
    setNovaPergunta('');
    
    // Salvamos a matriz inteira atualizada no dispositivo do usuário
    await AsyncStorage.setItem('teac_forum_messages', JSON.stringify(updated));
    Alert.alert('Sucesso', 'Sua pergunta foi enviada aos especialistas!');
  };

  const handleReply = async (id: number) => {
    const text = respostas[id];
    if (!text) return;
    
    const updated = messages.map(m => {
      // Quando achamos o id da pergunta original, injetamos a resposta
      if (m.id === id) {
        return { ...m, resposta: text, responsavel: currentUser?.nome || 'Admin' };
      }
      return m;
    });

    setMessages(updated);
    await AsyncStorage.setItem('teac_forum_messages', JSON.stringify(updated));
    Alert.alert('Sucesso', 'Sua resposta profissional foi publicada!');
  };

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
    <LinearGradient colors={['#e6f5f9', '#e0eaf5', '#dce0f2']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1a3b5c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fórum de Dúvidas</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#e53935" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* SE NÃO FOR ADMIN, MOSTRA CAIXA VERDE DE PERGUNTAR */}
          {(!currentUser || !currentUser.isAdmin) && (
            <View style={styles.askContainer}>
              <Text style={styles.askTitle}>Faça uma pergunta aos especialistas:</Text>
              <TextInput
                style={styles.askInput}
                placeholder="Ex: Como lidar com a seletividade alimentar nestes casos?"
                value={novaPergunta}
                onChangeText={setNovaPergunta}
                multiline
              />
              <TouchableOpacity style={styles.askBtn} onPress={handleAsk}>
                <Text style={styles.askBtnText}>Enviar Pergunta</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionTitle}>Tópicos Recentes da Comunidade</Text>

          {messages.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma pergunta foi feita ainda. Seja o primeiro da nossa comunidade!</Text>
          ) : (
            messages.map((msg) => (
              <View key={msg.id} style={styles.messageCard}>
                <View style={styles.authorRow}>
                  <Ionicons name="person-circle" size={20} color="#666" />
                  <Text style={styles.authorText}>{msg.author} perguntou:</Text>
                </View>
                <Text style={styles.questionText}>{msg.pergunta}</Text>

                {/* SE TIVER SIDO RESPONDIDA, MOSTRA CAIXA DE SUCESSO VERDE */}
                {msg.resposta ? (
                  <View style={styles.answerBox}>
                    <Text style={styles.adminName}>@{msg.responsavel || 'Especialista'} respondeu:</Text>
                    <Text style={styles.answerText}>{msg.resposta}</Text>
                  </View>
                ) : (
                  /* SE NÃO TIVER RESPOSTA AINDA, E QUEM ESTIVER VENDO A TELA FOR ADMIN, MOSTRA CAIXA AZUL PARA RESPONDER */
                  currentUser && currentUser.isAdmin ? (
                    <View style={styles.replyContainer}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder="Escreva sua resposta profissional aqui..."
                        value={respostas[msg.id] || ''}
                        onChangeText={(t) => setRespostas({ ...respostas, [msg.id]: t })}
                        multiline
                      />
                      <TouchableOpacity style={styles.replyBtn} onPress={() => handleReply(msg.id)}>
                        <Text style={styles.replyBtnText}>Responder a Dúvida</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.waitingText}>[Aguardando resposta de um especialista na plataforma...]</Text>
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
    marginBottom: 5,
  },
  authorText: {
    marginLeft: 5,
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
  },
  replyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

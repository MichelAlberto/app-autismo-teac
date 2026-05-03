import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import Toast from '../../components/Toast';
import CustomAlert from '../../components/CustomAlert';

interface ForumPost {
  id: string;
  userName: string;
  pergunta: string;
  respostasCount?: number;
  timestamp: any;
}

export default function AdminForum() {
  const { colors, isDark } = useTheme();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Toast states
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

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

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "forum_topics"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData: ForumPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({ 
          id: doc.id, 
          userName: data.author || 'Anônimo',
          pergunta: data.pergunta,
          respostasCount: data.resposta ? 1 : 0,
          timestamp: data.createdAt
        } as ForumPost);
      });
      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      showToast("Erro ao carregar fórum", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = (id: string) => {
    setAlertConfig({
      title: 'Excluir Postagem',
      message: 'Deseja remover esta pergunta permanentemente do fórum?',
      type: 'danger',
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          await deleteDoc(doc(db, "forum_topics", id));
          showToast("Postagem removida!", "success");
          fetchPosts();
        } catch (error) {
          showToast("Erro ao remover postagem", "error");
        }
      }
    });
    setAlertVisible(true);
  };

  const renderPost = ({ item }: { item: ForumPost }) => (
    <View style={[styles.postCard, { backgroundColor: colors.card }]}>
      <View style={styles.postHeader}>
        <View style={[styles.userBadge, { backgroundColor: colors.accent + '15' }]}>
          <Text style={[styles.userBadgeText, { color: colors.accent }]}>{item.userName?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{item.userName || 'Anônimo'}</Text>
      </View>
      <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.pergunta}</Text>
      <View style={styles.postFooter}>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.subtext} />
          <Text style={[styles.statText, { color: colors.subtext }]}>{item.respostasCount} respostas</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteBtnText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Toast visible={toastVisible} message={toastMessage} type={toastType} onHide={() => setToastVisible(false)} />
        
        <CustomAlert 
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setAlertVisible(false)}
        />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, isDark && { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Moderação do Fórum</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="chatbubbles-outline" size={60} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>Nenhuma postagem no fórum.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  postCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    marginLeft: 6,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  }
});

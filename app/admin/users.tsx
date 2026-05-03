import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import Toast from '../../components/Toast';
import CustomAlert from '../../components/CustomAlert';

interface User {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  profilePhoto?: string;
}

export default function ManageUsers() {
  const { colors, isDark } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("nome"));
      const querySnapshot = await getDocs(q);
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdmin = async (user: User) => {
    const newStatus = !user.isAdmin;
    setAlertConfig({
      title: 'Alterar Permissão',
      message: `Deseja tornar ${user.nome} um ${newStatus ? 'Administrador' : 'Usuário Comum'}?`,
      type: 'warning',
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, { isAdmin: newStatus });
          showToast("Status atualizado com sucesso!", "success");
          fetchUsers();
        } catch (error) {
          showToast("Erro ao atualizar permissão", "error");
        }
      }
    });
    setAlertVisible(true);
  };

  const handleDeleteUser = async (user: User) => {
    setAlertConfig({
      title: 'Excluir Usuário',
      message: `Tem certeza que deseja excluir ${user.nome}? Todos os dados de rotinas e comportamentos também serão removidos. Esta ação não pode ser desfeita.`,
      type: 'danger',
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          // Deleta o documento do usuário
          await deleteDoc(doc(db, "users", user.id));
          showToast("Usuário removido com sucesso!", "success");
          fetchUsers();
        } catch (error) {
          console.error("Erro ao deletar usuário:", error);
          showToast("Erro ao excluir usuário", "error");
        }
      }
    });
    setAlertVisible(true);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={[styles.userCard, { backgroundColor: colors.card }]}>
      <View style={[styles.avatarBox, { borderColor: colors.border }]}>
        {item.profilePhoto ? (
          <Image source={{ uri: item.profilePhoto }} style={styles.avatar} />
        ) : (
          <Ionicons name="person" size={24} color={colors.accent} />
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>{item.nome}</Text>
        <Text style={[styles.userEmail, { color: colors.subtext }]}>{item.email}</Text>
        {item.isAdmin && (
          <View style={[styles.adminBadge, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.adminBadgeText, { color: colors.accent }]}>ADMIN</Text>
          </View>
        )}
      </View>
      <TouchableOpacity 
        onPress={() => toggleAdmin(item)}
        style={[styles.actionBtn, { backgroundColor: item.isAdmin ? '#ef444415' : colors.accent + '15', marginRight: 8 }]}
      >
        <Ionicons 
          name={item.isAdmin ? "shield-outline" : "shield-checkmark-outline"} 
          size={22} 
          color={item.isAdmin ? "#ef4444" : colors.accent} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => handleDeleteUser(item)}
        style={[styles.actionBtn, { backgroundColor: '#ef444415' }]}
      >
        <Ionicons name="trash-outline" size={22} color="#ef4444" />
      </TouchableOpacity>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gerenciar Usuários</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="people-outline" size={60} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>Nenhum usuário encontrado.</Text>
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
  userCard: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  adminBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 5,
  },
  adminBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  actionBtn: {
    padding: 10,
    borderRadius: 12,
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

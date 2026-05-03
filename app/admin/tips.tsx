import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Modal, 
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import Toast from '../../components/Toast';
import CustomAlert from '../../components/CustomAlert';

interface Tip {
  id: string;
  text: string;
  createdAt: any;
}

export default function ManageTips() {
  const { colors, isDark } = useTheme();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [tipText, setTipText] = useState('');
  
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

  const fetchTips = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "tips"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const tipsData: Tip[] = [];
      querySnapshot.forEach((doc) => {
        tipsData.push({ id: doc.id, ...doc.data() } as Tip);
      });
      setTips(tipsData);
    } catch (error) {
      console.error("Erro ao buscar dicas:", error);
      showToast("Erro ao carregar dicas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleSaveTip = async () => {
    if (!tipText.trim()) {
      showToast("O texto da dica não pode estar vazio", "info");
      return;
    }

    try {
      if (editingTip) {
        // Update
        const tipRef = doc(db, "tips", editingTip.id);
        await updateDoc(tipRef, { text: tipText.trim() });
        showToast("Dica atualizada!", "success");
      } else {
        // Create
        await addDoc(collection(db, "tips"), {
          text: tipText.trim(),
          createdAt: new Date().toISOString()
        });
        showToast("Dica adicionada!", "success");
      }
      setModalVisible(false);
      setTipText('');
      setEditingTip(null);
      fetchTips();
    } catch (error) {
      console.error("Erro ao salvar dica:", error);
      showToast("Erro ao salvar dica", "error");
    }
  };

  const handleDeleteTip = (id: string) => {
    setAlertConfig({
      title: 'Excluir Dica',
      message: 'Tem certeza que deseja remover esta dica?',
      type: 'danger',
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          await deleteDoc(doc(db, "tips", id));
          showToast("Dica removida", "success");
          fetchTips();
        } catch (error) {
          showToast("Erro ao remover", "error");
        }
      }
    });
    setAlertVisible(true);
  };

  const openEdit = (tip: Tip) => {
    setEditingTip(tip);
    setTipText(tip.text);
    setModalVisible(true);
  };

  const renderTip = ({ item }: { item: Tip }) => (
    <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.tipText, { color: colors.text }]}>{item.text}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTip(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gerenciar Dicas</Text>
          <TouchableOpacity 
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              setEditingTip(null);
              setTipText('');
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={tips}
            renderItem={renderTip}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="bulb-outline" size={60} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>Nenhuma dica encontrada.{"\n"}Adicione a primeira!</Text>
              </View>
            }
          />
        )}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingTip ? 'Editar Dica' : 'Nova Dica'}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? colors.background : '#f1f5f9', color: colors.text, borderColor: colors.border }]}
                placeholder="Escreva a dica aqui..."
                placeholderTextColor={colors.subtext}
                multiline
                numberOfLines={4}
                value={tipText}
                onChangeText={setTipText}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: isDark ? colors.background : '#e2e8f0' }]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalBtn, { backgroundColor: colors.accent }]} 
                  onPress={handleSaveTip}
                >
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  list: {
    padding: 20,
  },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  cardActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionBtn: {
    padding: 8,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  modalBtnText: {
    fontWeight: 'bold',
  }
});

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/rotina.styles";
import { useTheme } from "../context/ThemeContext";

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  color: string;
}

const ICON_OPTIONS = [
  { name: "sunny", type: "Ionicons", color: "#FFD54F" },
  { name: "bed", type: "Ionicons", color: "#7986CB" },
  { name: "fast-food", type: "Ionicons", color: "#FF8A65" },
  { name: "brush", type: "Ionicons", color: "#4DD0E1" },
  { name: "school", type: "Ionicons", color: "#9575CD" },
  { name: "book", type: "Ionicons", color: "#81C784" },
  { name: "basketball", type: "Ionicons", color: "#FFB74D" },
  { name: "musical-notes", type: "Ionicons", color: "#F06292" },
  { name: "moon", type: "Ionicons", color: "#5C6BC0" },
  { name: "water", type: "Ionicons", color: "#4FC3F7" },
];

// IMPORT FIREBASE
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

import Toast from "../components/Toast";

export default function CriarRotina() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState(false); 
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Estados do Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [taskTime, setTaskTime] = useState(new Date());
  const [taskDate, setTaskDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // 1. Pegar usuário logado
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (!userJson) return;
      const user = JSON.parse(userJson);
      setCurrentUser(user);

      // 2. Tentar buscar da nuvem (Firestore)
      const q = query(
        collection(db, "users", user.uid, "rotinas"), 
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      setTasks(docs);

      // 3. Cache local opcional (VINCULADO AO UID)
      await AsyncStorage.setItem(`teac_rotinas_lista_${user.uid}`, JSON.stringify(docs));
    } catch (e) {
      console.error("Erro ao carregar rotinas:", e);
      // Fallback para local se offline (VINCULADO AO UID)
      const existing = await AsyncStorage.getItem(`teac_rotinas_lista_${user.uid}`);
      if (existing) setTasks(JSON.parse(existing));
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setViewMode(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setModalVisible(true);
  };

  const openDetailModal = (task: Task) => {
    setSelectedTask(task);
    setViewMode(true);
    setModalVisible(true);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      showToast("Dê um nome para a tarefa.", "error");
      return;
    }

    if (!currentUser) return;

    setLoading(true);
    try {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDesc,
        time: taskTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        date: taskDate.toLocaleDateString("pt-BR"),
        icon: selectedIcon.name,
        iconType: selectedIcon.type,
        color: selectedIcon.color,
        createdAt: new Date().toISOString()
      };

      // Salvar na nuvem
      await addDoc(collection(db, "users", currentUser.uid, "rotinas"), newTask);
      
      setModalVisible(false);
      showToast("Rotina salva com sucesso!", "success");
      loadTasks(); // Recarregar lista
    } catch (e: any) {
      console.error("ERRO AO SALVAR NO FIREBASE:", e);
      showToast("Erro ao salvar: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeTaskFromDetail = async () => {
    if (!selectedTask || !currentUser) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "rotinas", selectedTask.id));
      setModalVisible(false);
      showToast("Rotina excluída.", "info");
      loadTasks();
    } catch (e: any) {
      console.error("Erro ao remover:", e);
      showToast("Erro ao excluir: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const { colors, isDark } = useTheme();

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#e6f5f9", "#e0eaf5", "#dce0f2"]} 
      style={{ flex: 1 }}
    >
      <Toast 
        visible={toastVisible} 
        message={toastMessage} 
        type={toastType} 
        onHide={() => setToastVisible(false)} 
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, isDark && { backgroundColor: colors.card }]}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Minhas Rotinas</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <View style={styles.timelineContainer}>
              <Text style={[styles.label, { color: colors.subtext }]}>ATIVIDADES SALVAS</Text>
              {tasks.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => openDetailModal(item)} style={[styles.taskCard, { backgroundColor: colors.card }]}>
                  <View style={[styles.iconBox, { backgroundColor: item.color + "20" }]}>
                    {item.iconType === "Ionicons" ? (
                      <Ionicons name={item.icon as any} size={28} color={item.color} />
                    ) : (
                      <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
                    )}
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.taskTime, { color: colors.subtext }]}>{item.time} • <Text style={[styles.taskDate, { color: colors.subtext }]}>{item.date}</Text></Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={isDark ? colors.border : "#cbd5e0"} />
                </TouchableOpacity>
              ))}

              {tasks.length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 50, opacity: 0.5 }}>
                  <Ionicons name="calendar-outline" size={60} color={isDark ? colors.subtext : "#ccc"} />
                  <Text style={{ color: colors.subtext, marginTop: 10 }}>Nenhuma rotina criada ainda.</Text>
                </View>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[styles.addTaskBtn, { backgroundColor: colors.accent }]} 
            onPress={openAddModal}
          >
            <Ionicons name="add-circle" size={28} color="#ffffff" />
            <Text style={styles.addTaskText}>Adicionar Nova Rotina</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{viewMode ? "Detalhes da Rotina" : "Nova Rotina"}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {viewMode ? (
                  <View>
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                      <View style={[styles.iconBox, { backgroundColor: selectedTask?.color + "20", width: 80, height: 80, borderRadius: 25 }]}>
                        <Ionicons name={selectedTask?.icon as any} size={40} color={selectedTask?.color} />
                      </View>
                      <Text style={[styles.taskTitle, { fontSize: 24, marginTop: 10, color: colors.text }]}>{selectedTask?.title}</Text>
                      <Text style={[styles.taskTime, { color: colors.subtext }]}>{selectedTask?.time} • {selectedTask?.date}</Text>
                    </View>

                    <Text style={[styles.label, { color: colors.subtext }]}>O QUE ESCREVI:</Text>
                    <View style={[styles.textArea, { backgroundColor: isDark ? colors.background : '#f0f4f8', minHeight: 120, borderColor: colors.border }]}>
                      <Text style={{ fontSize: 16, color: colors.text, lineHeight: 22 }}>
                        {selectedTask?.description || "Nenhuma descrição adicionada."}
                      </Text>
                    </View>

                    <TouchableOpacity 
                      style={[styles.saveBtn, { backgroundColor: '#ef4444', marginTop: 30 }]} 
                      onPress={removeTaskFromDetail}
                    >
                      <Text style={styles.saveBtnText}>Excluir Rotina</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.label, { color: colors.subtext }]}>Título da Atividade</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                      placeholder="Ex: Escovar os dentes"
                      placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                      value={newTaskTitle}
                      onChangeText={setNewTaskTitle}
                    />

                    <Text style={[styles.label, { marginTop: 20, color: colors.subtext }]}>Descrição / Observações</Text>
                    <TextInput
                      style={[styles.textArea, { backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                      placeholder="Escreva detalhes aqui..."
                      placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                      multiline
                      numberOfLines={4}
                      value={newTaskDesc}
                      onChangeText={setNewTaskDesc}
                    />

                    <View style={styles.dateTimeRow}>
                      <View style={styles.dateTimeField}>
                        <Text style={[styles.label, { color: colors.subtext }]}>Data</Text>
                        <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: isDark ? colors.background : '#f8fafc', borderColor: colors.border }]} onPress={() => setShowDatePicker(true)}>
                          <Text style={[styles.pickerBtnText, { color: colors.text }]}>{taskDate.toLocaleDateString('pt-BR')}</Text>
                          <Ionicons name="calendar-outline" size={20} color={colors.accent} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.dateTimeField}>
                        <Text style={[styles.label, { color: colors.subtext }]}>Horário</Text>
                        <TouchableOpacity style={[styles.pickerBtn, { backgroundColor: isDark ? colors.background : '#f8fafc', borderColor: colors.border }]} onPress={() => setShowTimePicker(true)}>
                          <Text style={[styles.pickerBtnText, { color: colors.text }]}>{taskTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                          <Ionicons name="time-outline" size={20} color={colors.accent} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {showDatePicker && (
                      <DateTimePicker
                        value={taskDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                          setShowDatePicker(false);
                          if (date) setTaskDate(date);
                        }}
                      />
                    )}

                    {showTimePicker && (
                      <DateTimePicker
                        value={taskTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, time) => {
                          setShowTimePicker(false);
                          if (time) setTaskTime(time);
                        }}
                      />
                    )}

                    <Text style={[styles.label, { marginTop: 20, color: colors.subtext }]}>Ícone</Text>
                    <View style={styles.iconGrid}>
                      {ICON_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt.name}
                          style={[
                            styles.iconOption, 
                            { backgroundColor: isDark ? colors.background : '#f8fafc', borderColor: colors.border },
                            selectedIcon.name === opt.name && [styles.iconOptionSelected, { borderColor: colors.accent, backgroundColor: colors.accent + '10' }]
                          ]}
                          onPress={() => setSelectedIcon(opt)}
                        >
                          <Ionicons name={opt.name as any} size={28} color={opt.color} />
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleAddTask}>
                      <Text style={styles.saveBtnText}>Salvar na Lista</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

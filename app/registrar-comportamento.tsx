import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/comportamento.styles";
import { useTheme } from "../context/ThemeContext";

const BEHAVIOR_TYPES = [
  { id: 'calmo', label: 'Calmo', emoji: '😊', color: '#e8f5e9' },
  { id: 'triste', label: 'Triste', emoji: '🙁', color: '#e3f2fd' },
  { id: 'irritado', label: 'Irritado', emoji: '😠', color: '#ffebee' },
  { id: 'agitado', label: 'Agitado', emoji: '⚡', color: '#fff9c4' },
  { id: 'ansioso', label: 'Ansioso', emoji: '😰', color: '#f3e5f5' },
  { id: 'apatia', label: 'Apatia', emoji: '😐', color: '#f5f5f5' },
];

const INTENSITIES = [
  { val: 1, label: 'Leve', emoji: '😊', color: '#4caf50' },
  { val: 2, label: '2', emoji: '🙂', color: '#8bc34a' },
  { val: 3, label: '3', emoji: '😐', color: '#ffeb3b' },
  { val: 4, label: '4', emoji: '😟', color: '#ff9800' },
  { val: 5, label: 'Intenso', emoji: '😫', color: '#f44336' },
];

const TRIGGERS = ['Mudança de rotina', 'Barulho', 'Interação social', 'Frustração'];
const DURATIONS = ['< 5 min', '5 - 15 min', '15 - 30 min', '+ 30 min'];
const INTERVENTIONS = ['Conversa', 'Retirada do ambiente', 'Ignorar comportamento', 'Técnica de respiração'];

// IMPORT FIREBASE
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

import Toast from "../components/Toast";

export default function RegistrarComportamento() {
  const [selectedType, setSelectedType] = useState('');
  const [customTypeDescription, setCustomTypeDescription] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [triggerText, setTriggerText] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [interventionText, setInterventionText] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados do Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  // Estados para Data e Hora
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    // Se selecionou a data, agora abre o seletor de hora
    if (event.type === 'set' && pickerMode === 'date') {
      setTimeout(() => {
        setPickerMode('time');
        setShowDatePicker(true);
      }, 500);
    }
  };

  const handleEditDateTime = () => {
    setPickerMode('date');
    setShowDatePicker(true);
  };
  
  const dateStr = date.toLocaleDateString('pt-BR');
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const toggleTrigger = (tag: string) => {
    if (selectedTriggers.includes(tag)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== tag));
    } else {
      setSelectedTriggers([...selectedTriggers, tag]);
    }
  };

  const toggleIntervention = (tag: string) => {
    if (selectedInterventions.includes(tag)) {
      setSelectedInterventions(selectedInterventions.filter(i => i !== tag));
    } else {
      setSelectedInterventions([...selectedInterventions, tag]);
    }
  };

  const handleSave = async () => {
    if (!selectedType) {
      showToast("Selecione o tipo de comportamento.", "error");
      return;
    }

    setLoading(true);
    try {
      // 1. Pegar usuário logado
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (!userJson) {
        showToast("Usuário não identificado.", "error");
        return;
      }
      const user = JSON.parse(userJson);

      const newReport = {
        type: selectedType,
        typeLabel: BEHAVIOR_TYPES.find(t => t.id === selectedType)?.label,
        customTypeDescription,
        intensity,
        triggers: selectedTriggers,
        triggerText,
        duration,
        interventions: selectedInterventions,
        interventionText,
        observations,
        date: dateStr,
        time: timeStr,
        timestamp: date.getTime(),
        createdAt: new Date().toISOString()
      };

      // 2. Salvar na nuvem (Firestore)
      await addDoc(collection(db, "users", user.uid, "comportamentos"), newReport);

      // 3. Cache local opcional (VINCULADO AO UID)
      const existing = await AsyncStorage.getItem(`teac_behavior_reports_${user.uid}`);
      const reports = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem(`teac_behavior_reports_${user.uid}`, JSON.stringify([newReport, ...reports]));
      
      showToast("Registro salvo com sucesso!", "success");
      
      setTimeout(() => {
        router.back();
      }, 2000);
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, isDark && { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Registrar comportamento</Text>
              <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>Registre o que seu filho está vivenciando para acompanhar padrões e evoluções.</Text>
            </View>
            <MaterialCommunityIcons name="clipboard-check-outline" size={40} color={colors.accent} />
          </View>

          {/* 1. TIPO DE COMPORTAMENTO */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="happy-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>1. Tipo de comportamento</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Selecione o que melhor descreve o momento.</Text>
            <View style={styles.optionsGrid}>
              {BEHAVIOR_TYPES.map((type) => (
                <TouchableOpacity 
                  key={type.id} 
                  style={[
                    styles.optionItem, 
                    { backgroundColor: isDark ? colors.background : type.color },
                    selectedType === type.id && { borderColor: colors.accent, borderWidth: 2 }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={{ fontSize: 24 }}>{type.emoji}</Text>
                  <Text style={[styles.optionText, { color: colors.text }]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={[styles.input, { marginTop: 15, backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]} 
              placeholder="Descreva um comportamento específico(Opcional)" 
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={customTypeDescription}
              onChangeText={setCustomTypeDescription}
            />
          </View>

          {/* 2. INTENSIDADE */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="chart-bar" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>2. Intensidade</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Qual o nível deste comportamento?</Text>
            <View style={styles.intensityContainer}>
              {INTENSITIES.map((item) => (
                <TouchableOpacity 
                  key={item.val} 
                  style={[
                    styles.intensityItem,
                    intensity === item.val && { backgroundColor: item.color + '20', borderColor: item.color }
                  ]}
                  onPress={() => setIntensity(item.val)}
                >
                  <Text style={{ fontSize: 24, opacity: intensity === item.val ? 1 : 0.5 }}>{item.emoji}</Text>
                  <Text style={[styles.intensityNumber, { color: item.color }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. O QUE ACONTECEU ANTES? */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>3. O que aconteceu antes? (gatilho)</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Opcional</Text>
            <View style={styles.tagContainer}>
              {TRIGGERS.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tag, { backgroundColor: isDark ? colors.background : '#f1f5f9', borderColor: colors.border }, selectedTriggers.includes(tag) && [styles.tagActive, { backgroundColor: colors.accent, borderColor: colors.accent }]]}
                  onPress={() => toggleTrigger(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text }, selectedTriggers.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]} 
              placeholder="Descreva rapidamente (opcional)" 
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={triggerText}
              onChangeText={setTriggerText}
            />
          </View>

          {/* 4. DURAÇÃO */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>4. Duração</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Quanto tempo durou?</Text>
            <View style={styles.tagContainer}>
              {DURATIONS.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tag, { backgroundColor: isDark ? colors.background : '#f1f5f9', borderColor: colors.border }, duration === tag && [styles.tagActive, { backgroundColor: colors.accent, borderColor: colors.accent }]]}
                  onPress={() => setDuration(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text }, duration === tag && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 5. COMO REAGIU / INTERVENÇÃO - ABAIXO DO 4 */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>5. Como reagiu / intervenção</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Opcional</Text>
            <View style={styles.tagContainer}>
              {INTERVENTIONS.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tag, { backgroundColor: isDark ? colors.background : '#f1f5f9', borderColor: colors.border }, selectedInterventions.includes(tag) && [styles.tagActive, { backgroundColor: colors.accent, borderColor: colors.accent }]]}
                  onPress={() => toggleIntervention(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text }, selectedInterventions.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]} 
              placeholder="Outra intervenção (opcional)" 
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={interventionText}
              onChangeText={setInterventionText}
            />
          </View>

          {/* 6. OBSERVAÇÕES */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>6. Observações</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>Algo importante a lembrar? (opcional)</Text>
            <TextInput 
              style={[styles.input, styles.textArea, { backgroundColor: isDark ? colors.background : '#f8fafc', color: colors.text, borderColor: colors.border }]} 
              placeholder="Escreva aqui..." 
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              multiline
              value={observations}
              onChangeText={setObservations}
            />
          </View>

          {/* DATA E HORÁRIO */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar-outline" size={20} color={colors.accent} style={styles.cardIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Data e horário</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>{dateStr} às {timeStr}</Text>
              </View>

              <TouchableOpacity 
                onPress={handleEditDateTime}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: colors.accent,
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Ionicons name="calendar-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>Editar</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode={pickerMode}
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>

          {/* BOTÃO SALVAR */}
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}>
            <Ionicons name="save-outline" size={24} color="#ffffff" />
            <Text style={[styles.saveBtnText, { color: '#ffffff' }]}>Salvar registro</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

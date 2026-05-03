import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/comportamento.styles";
import { useTheme } from "../context/ThemeContext";

// IMPORT FIREBASE
import { db } from "./firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Relatorios() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Pegar usuário logado
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (!userJson) return;
      const user = JSON.parse(userJson);

      // 2. Buscar da nuvem
      const q = query(
        collection(db, "users", user.uid, "comportamentos"), 
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      setReports(docs);

      // 3. Cache local opcional (VINCULADO AO UID)
      await AsyncStorage.setItem(`teac_behavior_reports_${user.uid}`, JSON.stringify(docs));
    } catch (e) {
      console.error("Erro ao carregar relatórios:", e);
      // Fallback para local
      const data = await AsyncStorage.getItem(`teac_behavior_reports_${user.uid}`);
      if (data) setReports(JSON.parse(data));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const getIntensityColor = (val: number) => {
    const colors = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'];
    return colors[val - 1] || '#ccc';
  };

  const openReport = (report: any) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const { colors, isDark } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    // Extrair dia e mês da string "DD/MM/AAAA"
    const dateParts = item.date.split('/');
    const day = dateParts[0];
    const month = dateParts[1] === '04' ? 'Abr' : dateParts[1] === '05' ? 'Mai' : 'Mês'; // Simplificado para o demo

    return (
      <TouchableOpacity 
        style={[styles.reportCard, { backgroundColor: colors.card }]} 
        onPress={() => openReport(item)}
        activeOpacity={0.7}
      >
        <View style={styles.reportDateInfo}>
          <Text style={[styles.reportDay, { color: colors.accent }]}>{day}</Text>
          <Text style={[styles.reportMonth, { color: colors.subtext }]}>{month}</Text>
        </View>
        <View style={styles.reportContent}>
          <Text style={[styles.reportType, { color: colors.text }]}>{item.typeLabel}</Text>
          <Text style={[styles.reportTime, { color: colors.subtext }]}>{item.time} • Intensidade {item.intensity}</Text>
        </View>
        <View style={[styles.reportIntensity, { backgroundColor: getIntensityColor(item.intensity) }]}>
          <Text style={styles.intensityValue}>{item.intensity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient 
      colors={isDark ? ['#0f172a', '#1e293b', '#0f172a'] : ["#e6f5f9", "#e0eaf5", "#dce0f2"]} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { flex: 1 }]}>
          
          {/* HEADER */}
          <View style={[styles.header, { marginBottom: 30 }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, isDark && { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Relatórios</Text>
              <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>Histórico de comportamentos registrados.</Text>
            </View>
          </View>

          {reports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={80} color={isDark ? colors.card : "#cbd5e0"} />
              <Text style={[styles.emptyText, { color: colors.subtext }]}>Nenhum relatório encontrado.{"\n"}Comece registrando o comportamento do seu filho.</Text>
              <TouchableOpacity 
                style={[styles.saveBtn, { width: '80%', marginTop: 30, backgroundColor: colors.accent }]} 
                onPress={() => router.push('/registrar-comportamento')}
              >
                <Text style={styles.saveBtnText}>Novo Registro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={reports}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          {/* MODAL DE DETALHES */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                {/* HEADER DO MODAL */}
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Detalhes do Registro</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {selectedReport && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* TIPO E INTENSIDADE */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailRow}>
                        <Ionicons name="happy-outline" size={20} color={colors.accent} />
                        <Text style={[styles.detailLabel, { color: colors.accent }]}>Comportamento</Text>
                        <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(selectedReport.intensity) }]}>
                          <Text style={styles.intensityBadgeText}>Nível {selectedReport.intensity}</Text>
                        </View>
                      </View>
                      <Text style={[styles.detailValue, { backgroundColor: isDark ? colors.background : '#f8f9fa', borderColor: colors.border, color: colors.text }]}>
                        {selectedReport.typeLabel}
                        {selectedReport.customTypeDescription ? `\n(${selectedReport.customTypeDescription})` : ''}
                      </Text>
                    </View>

                    {/* GATILHOS */}
                    {(selectedReport.triggers?.length > 0 || selectedReport.triggerText) && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
                          <Text style={[styles.detailLabel, { color: colors.accent }]}>O que aconteceu antes?</Text>
                        </View>
                        <View style={styles.detailTags}>
                          {selectedReport.triggers.map((t: string) => (
                            <View key={t} style={[styles.detailTag, { backgroundColor: isDark ? colors.background : '#e8f0fe', borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}><Text style={[styles.detailTagText, { color: colors.text }]}>{t}</Text></View>
                          ))}
                        </View>
                        {selectedReport.triggerText ? <Text style={[styles.detailValue, { marginTop: 8, backgroundColor: isDark ? colors.background : '#f8f9fa', borderColor: colors.border, color: colors.text }]}>{selectedReport.triggerText}</Text> : null}
                      </View>
                    )}

                    {/* DURAÇÃO */}
                    {selectedReport.duration && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="time-outline" size={20} color={colors.accent} />
                          <Text style={[styles.detailLabel, { color: colors.accent }]}>Duração</Text>
                        </View>
                        <Text style={[styles.detailValue, { backgroundColor: isDark ? colors.background : '#f8f9fa', borderColor: colors.border, color: colors.text }]}>{selectedReport.duration}</Text>
                      </View>
                    )}

                    {/* INTERVENÇÃO */}
                    {(selectedReport.interventions?.length > 0 || selectedReport.interventionText) && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="heart-outline" size={20} color={colors.accent} />
                          <Text style={[styles.detailLabel, { color: colors.accent }]}>Como reagiu / Intervenção</Text>
                        </View>
                        <View style={styles.detailTags}>
                          {selectedReport.interventions.map((i: string) => (
                            <View key={i} style={[styles.detailTag, { backgroundColor: isDark ? colors.background : '#e8f0fe', borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}><Text style={[styles.detailTagText, { color: colors.text }]}>{i}</Text></View>
                          ))}
                        </View>
                        {selectedReport.interventionText ? <Text style={[styles.detailValue, { marginTop: 8, backgroundColor: isDark ? colors.background : '#f8f9fa', borderColor: colors.border, color: colors.text }]}>{selectedReport.interventionText}</Text> : null}
                      </View>
                    )}

                    {/* OBSERVAÇÕES */}
                    {selectedReport.observations && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="document-text-outline" size={20} color={colors.accent} />
                          <Text style={[styles.detailLabel, { color: colors.accent }]}>Observações Extras</Text>
                        </View>
                        <Text style={[styles.detailValue, { backgroundColor: isDark ? colors.background : '#f8f9fa', borderColor: colors.border, color: colors.text }]}>{selectedReport.observations}</Text>
                      </View>
                    )}

                    {/* DATA E HORA */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={20} color={colors.accent} />
                        <Text style={[styles.detailLabel, { color: colors.subtext }]}>Informações de Registro</Text>
                      </View>
                      <Text style={[styles.detailValue, { fontSize: 14, color: isDark ? '#94a3b8' : '#666' }]}>
                        Registrado em {selectedReport.date} às {selectedReport.time}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

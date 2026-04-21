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

export default function Relatorios() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('teac_behavior_reports');
      if (data) {
        setReports(JSON.parse(data));
      }
    } catch (e) {
      console.error(e);
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

  const renderItem = ({ item }: { item: any }) => {
    // Extrair dia e mês da string "DD/MM/AAAA"
    const dateParts = item.date.split('/');
    const day = dateParts[0];
    const month = dateParts[1] === '04' ? 'Abr' : dateParts[1] === '05' ? 'Mai' : 'Mês'; // Simplificado para o demo

    return (
      <TouchableOpacity 
        style={styles.reportCard} 
        onPress={() => openReport(item)}
        activeOpacity={0.7}
      >
        <View style={styles.reportDateInfo}>
          <Text style={styles.reportDay}>{day}</Text>
          <Text style={styles.reportMonth}>{month}</Text>
        </View>
        <View style={styles.reportContent}>
          <Text style={styles.reportType}>{item.typeLabel}</Text>
          <Text style={styles.reportTime}>{item.time} • Intensidade {item.intensity}</Text>
        </View>
        <View style={[styles.reportIntensity, { backgroundColor: getIntensityColor(item.intensity) }]}>
          <Text style={styles.intensityValue}>{item.intensity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#e6f5f9", "#e0eaf5", "#dce0f2"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { flex: 1 }]}>
          
          {/* HEADER */}
          <View style={[styles.header, { marginBottom: 30 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1a3b5c" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Relatórios</Text>
              <Text style={styles.headerSubtitle}>Histórico de comportamentos registrados.</Text>
            </View>
          </View>

          {reports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={80} color="#cbd5e0" />
              <Text style={styles.emptyText}>Nenhum relatório encontrado.{"\n"}Comece registrando o comportamento do seu filho.</Text>
              <TouchableOpacity 
                style={[styles.saveBtn, { width: '80%', marginTop: 30 }]} 
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
              <View style={styles.modalContent}>
                {/* HEADER DO MODAL */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes do Registro</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color="#1a3b5c" />
                  </TouchableOpacity>
                </View>

                {selectedReport && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* TIPO E INTENSIDADE */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailRow}>
                        <Ionicons name="happy-outline" size={20} color="#6a7fdb" />
                        <Text style={styles.detailLabel}>Comportamento</Text>
                        <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(selectedReport.intensity) }]}>
                          <Text style={styles.intensityBadgeText}>Nível {selectedReport.intensity}</Text>
                        </View>
                      </View>
                      <Text style={styles.detailValue}>
                        {selectedReport.typeLabel}
                        {selectedReport.customTypeDescription ? `\n(${selectedReport.customTypeDescription})` : ''}
                      </Text>
                    </View>

                    {/* GATILHOS */}
                    {(selectedReport.triggers?.length > 0 || selectedReport.triggerText) && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="alert-circle-outline" size={20} color="#6a7fdb" />
                          <Text style={styles.detailLabel}>O que aconteceu antes?</Text>
                        </View>
                        <View style={styles.detailTags}>
                          {selectedReport.triggers.map((t: string) => (
                            <View key={t} style={styles.detailTag}><Text style={styles.detailTagText}>{t}</Text></View>
                          ))}
                        </View>
                        {selectedReport.triggerText ? <Text style={[styles.detailValue, { marginTop: 8 }]}>{selectedReport.triggerText}</Text> : null}
                      </View>
                    )}

                    {/* DURAÇÃO */}
                    {selectedReport.duration && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="time-outline" size={20} color="#6a7fdb" />
                          <Text style={styles.detailLabel}>Duração</Text>
                        </View>
                        <Text style={styles.detailValue}>{selectedReport.duration}</Text>
                      </View>
                    )}

                    {/* INTERVENÇÃO */}
                    {(selectedReport.interventions?.length > 0 || selectedReport.interventionText) && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="heart-outline" size={20} color="#6a7fdb" />
                          <Text style={styles.detailLabel}>Como reagiu / Intervenção</Text>
                        </View>
                        <View style={styles.detailTags}>
                          {selectedReport.interventions.map((i: string) => (
                            <View key={i} style={styles.detailTag}><Text style={styles.detailTagText}>{i}</Text></View>
                          ))}
                        </View>
                        {selectedReport.interventionText ? <Text style={[styles.detailValue, { marginTop: 8 }]}>{selectedReport.interventionText}</Text> : null}
                      </View>
                    )}

                    {/* OBSERVAÇÕES */}
                    {selectedReport.observations && (
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="document-text-outline" size={20} color="#6a7fdb" />
                          <Text style={styles.detailLabel}>Observações Extras</Text>
                        </View>
                        <Text style={styles.detailValue}>{selectedReport.observations}</Text>
                      </View>
                    )}

                    {/* DATA E HORA */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={20} color="#6a7fdb" />
                        <Text style={styles.detailLabel}>Informações de Registro</Text>
                      </View>
                      <Text style={[styles.detailValue, { fontSize: 14, color: '#666' }]}>
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

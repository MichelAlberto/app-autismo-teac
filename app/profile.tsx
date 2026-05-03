import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import CustomAlert from '../components/CustomAlert';

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<{ uid: string; nome: string; email: string; isAdmin: boolean; profilePhoto?: string } | null>(null);
  
  const [newName, setNewName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('teac_current_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserData(user);
        setNewName(user.nome);
        setProfilePhoto(user.profilePhoto || null);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3, // Qualidade baixa para manter o base64 pequeno
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfilePhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      showAlert("Erro", "O nome não pode estar vazio.", "warning");
      return;
    }

    if (!userData) return;

    setSaving(true);
    try {
      // 1. Atualizar no Firestore
      const userRef = doc(db, "users", userData.uid);
      await updateDoc(userRef, {
        nome: newName.trim(),
        profilePhoto: profilePhoto
      });

      // 2. Atualizar no AsyncStorage
      const updatedUser = { 
        ...userData, 
        nome: newName.trim(),
        profilePhoto: profilePhoto
      };
      await AsyncStorage.setItem('teac_current_user', JSON.stringify(updatedUser));
      
      setUserData(updatedUser);
      showAlert("Sucesso", "Perfil atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showAlert("Erro", "Não foi possível salvar as alterações.", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomAlert 
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
      />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* AVATAR SECTION */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={60} color={colors.accent} />
            )}
            <TouchableOpacity 
              style={[styles.editIconBtn, { backgroundColor: colors.accent }]}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.infoLabel, { color: colors.subtext, marginTop: 15 }]}>
            Foto do Perfil
          </Text>
        </View>

        {/* FORM SECTION */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>NOME COMPLETO</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Seu nome"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>E-MAIL (NÃO ALTERÁVEL)</Text>
            <View style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              opacity: 0.7
            }]}>
              <Text style={{ color: colors.subtext }}>{userData?.email}</Text>
            </View>
          </View>

          {userData?.isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#fff" />
              <Text style={styles.adminText}>CONTA ADMINISTRADOR</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: colors.accent }]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    justifyContent: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    backgroundColor: '#1a3b5c',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 8,
  },
  adminText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveBtn: {
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../app/firebaseConfig';
import { signOut } from 'firebase/auth';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75; // 75% da largura da tela

export default function MenuLateral() {
  const [visible, setVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(MENU_WIDTH)).current;

  const openMenu = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Desliza para a posição 0 (dentro da tela)
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH, // Volta para fora da tela
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleLogout = async () => {
    try {
      // 1. Deslogar do Firebase
      await signOut(auth);

      // 2. Limpar dados da sessão, mas PRESERVAR a intro
      // Definimos quais chaves queremos apagar
      const keysToRemove = [
        'teac_current_user', 
        'teac_behavior_reports', 
        'teac_rotinas_lista',
        'course_progress_detailed',
        'course_scroll_y'
      ];
      
      await AsyncStorage.multiRemove(keysToRemove);

      closeMenu();
      router.replace('/');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openMenu} style={styles.menuIconBtn}>
        <Ionicons name="menu-outline" size={32} color="#1a3b5c" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.overlayBg} />
          </TouchableWithoutFeedback>

          <Animated.View 
            style={[
              styles.menuContainer, 
              { 
                width: MENU_WIDTH,
                transform: [{ translateX: slideAnim }] 
              }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={closeMenu}>
                <Ionicons name="close" size={28} color="#1a3b5c" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/(tabs)/home'); }}>
                <Ionicons name="home-outline" size={24} color="#1a3b5c" />
                <Text style={styles.menuItemText}>Início</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/forum'); }}>
                <Ionicons name="chatbubbles-outline" size={24} color="#1a3b5c" />
                <Text style={styles.menuItemText}>Comunidade</Text>
              </TouchableOpacity>

              {/* Futuras opções podem entrar aqui */}
              <View style={styles.separator} />

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#e53935" />
                <Text style={[styles.menuItemText, { color: '#e53935' }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>Versão 1.0.0</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuIconBtn: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha o menu na direita
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a3b5c',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  versionText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginBottom: 20,
  }
});


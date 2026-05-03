import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../app/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { Switch } from 'react-native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75; // 75% da largura da tela

export default function MenuLateral() {
  const [visible, setVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(MENU_WIDTH)).current;
  const [userData, setUserData] = useState<{uid: string, nome: string, email: string, isAdmin: boolean, profilePhoto?: string} | null>(null);
  
  const { theme, colors, toggleTheme, isDark } = useTheme();

  React.useEffect(() => {
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (userJson) {
        setUserData(JSON.parse(userJson));
      }
    };
    if (visible) loadUser();
  }, [visible]);

  const openMenu = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH, 
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const keysToRemove = [
        'teac_current_user', 
        'teac_behavior_reports', 
        'teac_rotinas_lista',
        `course_progress_detailed_${userData?.uid || ''}`,
        `quiz_completed_${userData?.uid || ''}`,
        'course_progress_detailed', // Limpeza de chaves antigas
        'quiz_completed',           // Limpeza de chaves antigas
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
        <Ionicons name="menu-outline" size={32} color={colors.text} />
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
                backgroundColor: colors.card,
                transform: [{ translateX: slideAnim }] 
              }
            ]}
          >
            <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.profileSection}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  {userData?.profilePhoto ? (
                    <Image source={{ uri: userData.profilePhoto }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={30} color={colors.accent} />
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
                    {userData?.isAdmin ? "Administrador" : (userData?.nome || "Usuário")}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.subtext }]} numberOfLines={1}>
                    {userData?.email || "email@teac.com"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/profile'); }}>
                <Ionicons name="person-circle-outline" size={22} color={colors.accent} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Meu Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/(tabs)/home'); }}>
                <Ionicons name="home-outline" size={22} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Início</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/forum'); }}>
                <Ionicons name="chatbubbles-outline" size={22} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Comunidade</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(); router.push('/certificate'); }}>
                <Ionicons name="medal-outline" size={22} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Meus Certificados</Text>
              </TouchableOpacity>

              {userData?.isAdmin && (
                <>
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  <Text style={[styles.adminSectionTitle, { color: colors.accent }]}>ADMINISTRAÇÃO</Text>
                  
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => { 
                      closeMenu(); 
                      // Aqui você pode definir para onde o Admin será levado
                      // Por enquanto vou deixar um alert ou encaminhar para uma rota futura
                      router.push('/admin-panel'); 
                    }}
                  >
                    <Ionicons name="settings-outline" size={22} color={colors.accent} />
                    <Text style={[styles.menuItemText, { color: colors.accent, fontWeight: 'bold' }]}>Painel do Admin</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <View style={styles.themeToggleRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Modo Escuro</Text>
                </View>
                <Switch 
                  value={isDark} 
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#cbd5e1', true: colors.accent }}
                  thumbColor={isDark ? '#fff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem, { borderTopColor: colors.border }]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#e53935" />
                <Text style={[styles.menuItemText, { color: '#e53935' }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.versionText, { color: colors.subtext }]}>Versão 0.0.9</Text>
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
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 0, // Tiramos o padding pra o header ocupar tudo
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  profileInfo: {
    width: '100%',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3b5c',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  adminBadge: {
    backgroundColor: '#1a3b5c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  adminSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 5,
    marginTop: 5,
  },
  closeBtn: {
    padding: 5,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 5,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#334155',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 15,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  },
  versionText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 20,
    fontWeight: '500',
  }
});


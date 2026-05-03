import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const { width } = Dimensions.get('window');

export default function CustomAlert({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  onConfirm, 
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}: CustomAlertProps) {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return 'alert-circle-outline';
      case 'warning': return 'warning-outline';
      case 'success': return 'checkmark-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'success': return '#10b981';
      default: return colors.accent;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
              <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '15' }]}>
                <Ionicons name={getIcon()} size={40} color={getIconColor()} />
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.message, { color: colors.subtext }]}>{message}</Text>

              <View style={styles.buttonContainer}>
                {onCancel && (
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton, { backgroundColor: isDark ? colors.background : '#f1f5f9' }]} 
                    onPress={onCancel}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: type === 'danger' ? '#ef4444' : colors.accent }]} 
                  onPress={onConfirm}
                >
                  <Text style={[styles.buttonText, { color: '#fff' }]}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertCard: {
    width: width * 0.85,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    // Adicionais se necessário
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

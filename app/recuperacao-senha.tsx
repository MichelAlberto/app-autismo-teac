import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../styles/recuperacao-senha.styles';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) {
      setErrorMsg('Por favor, digite seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setSuccessMsg('Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes. Verifique também sua caixa de spam.');
      
      setTimeout(() => {
        router.back();
      }, 6000);

    } catch (error: any) {
      console.error("Erro ao recuperar senha:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        setErrorMsg('Este e-mail não foi encontrado no nosso sistema. Verifique se digitou corretamente.');
      } else {
        setErrorMsg('Ocorreu um erro ao tentar enviar o e-mail. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e6f5f9', '#e0eaf5', '#dce0f2']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1a3b5c" />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="key-outline" size={40} color="#6a7fdb" />
              </View>
              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.subtitle}>
                Digite seu e-mail cadastrado para receber as instruções de recuperação.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#6a7fdb" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
              {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

              <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.7 }]} 
                onPress={handleSendResetEmail}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Enviando...' : 'Enviar E-mail'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                <Text style={styles.backLinkText}>Voltar para o Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

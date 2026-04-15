import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/recuperacao-senha.styles';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleVerifyEmail = async () => {
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Preencha o e-mail.');
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem('teac_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const userExists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        setStep(2);
      } else {
        setErrorMsg('E-mail não encontrado no sistema.');
      }
    } catch (error) {
      setErrorMsg('Erro ao verificar e-mail.');
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg('');
    if (!newPassword) {
      setErrorMsg('Preencha a nova senha.');
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem('teac_users');
      let users = usersJson ? JSON.parse(usersJson) : [];

      users = users.map((u: any) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return { ...u, senha: newPassword };
        }
        return u;
      });

      await AsyncStorage.setItem('teac_users', JSON.stringify(users));

      setSuccessMsg('Senha atualizada com sucesso! Voltando...');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setErrorMsg('Erro ao atualizar a senha.');
    }
  };

  return (
    <LinearGradient
      colors={['#c2f0f7', '#f7c2e0']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>Recuperar Senha</Text>

          <View style={styles.card}>
            {step === 1 ? (
              <>
                <Text style={styles.cardTitle}>Qual é o seu e-mail?</Text>
                <TextInput
                  placeholder="Seu e-mail cadastrado"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}

                <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyEmail}>
                  <Text style={styles.btnText}>Verificar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Digite a nova senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Nova Senha"
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}
                {successMsg !== '' && <Text style={styles.successText}>{successMsg}</Text>}

                <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword}>
                  <Text style={styles.btnText}>Atualizar Senha</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


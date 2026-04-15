import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { styles } from '../styles/index.styles';

export default function Index() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setErrorMsg(''); // Limpa mensagens anteriores

    if (!email || !senha) {
      setErrorMsg('Preencha o e-mail e a senha.');
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem('teac_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const validUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);

      if (validUser) {
        // Sucesso (Avança para a home)
        router.push('/(tabs)/home');
      } else {
        setErrorMsg('E-mail ou senha incorretos.');
      }
    } catch (error) {
      setErrorMsg('Ocorreu um erro ao tentar entrar. Tente novamente.');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Sucesso', 'Login com Google efetuado com sucesso (offline)!', [
      { text: 'OK', onPress: () => router.push('/(tabs)/home') }
    ]);
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
          <Text style={styles.title}>Bem-vindo ao TEAC</Text>
      <Text style={styles.subtitle}>Aprenda e Conecte-se</Text>

      <Image
        source={require('../assets/logo1.png')}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entre na sua Conta</Text>

        {/* INPUT EMAIL */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* INPUT SENHA */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/recuperacao-senha')} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* MENSAGEM DE ERRO VISUAL */}
        {errorMsg !== '' && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        {/* BOTÃO LOGIN */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>

        {/* BOTÃO CADASTRO */}
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.registerText}>Criar conta</Text>
        </TouchableOpacity>

        {/* GOOGLE */}
        <TouchableOpacity 
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
        >
          <Text>Entrar com Google</Text>
        </TouchableOpacity>

        
      </View>

          <Text style={styles.footer}>
            Ao clicar em continuar, você concorda com os nossos Termos de Serviço e com a Política de Privacidade
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

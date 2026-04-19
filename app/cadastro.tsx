import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/cadastro.styles';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!nome || !email || !senha || !confirmarSenha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    try {
      // Puxar os usuários existentes
      const usersJson = await AsyncStorage.getItem('teac_users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Verificar se o e-mail já existe
      const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setErrorMsg('Este e-mail já está cadastrado.');
        return;
      }
      
      // Adicionar novo usuário (Contas novas sempre nascem como usuário comum)
      const newUser = { nome, email, senha, isAdmin: false };
      users.push(newUser);

      // Salvar de volta no storage (offline)
      await AsyncStorage.setItem('teac_users', JSON.stringify(users));

      setSuccessMsg('Conta salva com sucesso! Voltando...');
      
      // Espera 2 segundos para o cliente ler a mensagem e depois volta
      setTimeout(() => {
        router.back();
      }, 2000);
      
    } catch (error: any) {
      console.error("ERRO COMPLETO:", error);
      setErrorMsg('Erro interno: ' + (error?.message || 'Desconhecido'));
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
          <Text style={styles.brandTitle}>Bem-vindo ao TEAC</Text>
      <Text style={styles.subtitle}>Aprenda e Conecte-se</Text>

      <Image
        source={require('../assets/logo1.png')}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crie sua Conta</Text>

        {/* INPUT NOME */}
        <TextInput
          placeholder="Nome completo"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

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
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        {/* INPUT CONFIRMAR SENHA */}
        <TextInput
          placeholder="Confirmar Senha"
          secureTextEntry
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {/* MENSAGEM DE ERRO VISUAL */}
        {errorMsg !== '' && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        {/* MENSAGEM DE SUCESSO VISUAL */}
        {successMsg !== '' && (
          <Text style={styles.successText}>{successMsg}</Text>
        )}

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Já tenho uma conta (Voltar)</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


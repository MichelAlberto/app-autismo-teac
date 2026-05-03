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
  ActivityIndicator,
} from 'react-native';
import { styles } from '../styles/cadastro.styles';

// IMPORTES DO FIREBASE
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (senha.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 1. Criar o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      const user = userCredential.user;

      // 3. Salvar os dados complementares no Firestore
      // isAdmin é sempre false no cadastro — defina manualmente no console do Firebase.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nome: nome,
        email: email.toLowerCase().trim(),
        isAdmin: false,
        createdAt: new Date().toISOString()
      });

      setSuccessMsg('Conta criada com sucesso!');
      
      setTimeout(() => {
        router.replace('/'); 
      }, 2000);
      
    } catch (error: any) {
      console.error("ERRO AO CADASTRAR:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está em uso.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('E-mail inválido.');
      } else {
        setErrorMsg('Erro ao cadastrar: ' + error.message);
      }
    } finally {
      setLoading(false);
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

            <TextInput
              placeholder="Nome completo"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput
              placeholder="Senha (mín. 6 caracteres)"
              secureTextEntry
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
            />

            <TextInput
              placeholder="Confirmar Senha"
              secureTextEntry
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              editable={!loading}
            />

            {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}
            {successMsg !== '' && <Text style={styles.successText}>{successMsg}</Text>}

            <TouchableOpacity
              style={[styles.registerBtn, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.backText}>Já tenho uma conta (Voltar)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}



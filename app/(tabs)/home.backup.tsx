import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <LinearGradient
      colors={['#83d8d6', '#87c6e6', '#808ce3']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER LOCO & TITLE */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              {/* O logo real será colocado com '../assets/logo1.png', por enquanto usando ícone provisório para compor o layout */}
              <FontAwesome5 name="ribbon" size={60} color="#e53935" style={styles.headerIcon} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>TEAC</Text>
                <Text style={styles.headerSubtitle}>Transtorno do</Text>
                <Text style={styles.headerSubtitle}>Espectro Autista</Text>
                <Text style={styles.headerSubtitle}>Consciente</Text>
              </View>
            </View>
          </View>

          {/* CARD TEXTO INFOS (GLASSMORPHISM) */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Um aplicativo voltado para pais,
              familiares e profissionais que
              estão na jornada de aprendizado
              sobre o autismo
            </Text>
          </View>

          {/* FOTO CIRCULAR INFERIOR */}
          <View style={styles.imageContainer}>
            <View style={styles.imageRing}>
              <Image 
                source={require('../../assets/logo2.png')} 
                style={styles.childImage} 
                resizeMode="cover"
              />
              {/* Ícones de quebra cabeça como enfeite nas bordas simulando a imagem original */}
              <FontAwesome5 name="puzzle-piece" size={24} color="#fdd835" style={[styles.puzzleIcon, { top: -10, left: 50, transform: [{ rotate: '-20deg'}] }]} />
              <FontAwesome5 name="puzzle-piece" size={24} color="#e53935" style={[styles.puzzleIcon, { top: 30, left: -10, transform: [{ rotate: '-60deg'}] }]} />
              <FontAwesome5 name="puzzle-piece" size={24} color="#43a047" style={[styles.puzzleIcon, { top: '50%', right: -15, transform: [{ rotate: '45deg'}] }]} />
              <FontAwesome5 name="puzzle-piece" size={24} color="#1e88e5" style={[styles.puzzleIcon, { bottom: 10, left: 30, transform: [{ rotate: '180deg'}] }]} />
            </View>
          </View>

          {/* MENU BOTOES QUATRO QUADRADOS */}
          <View style={styles.menuContainer}>
            {/* Botão TEAC */}
            <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#75d6ce'}]}>
              <FontAwesome5 name="ribbon" size={28} color="#455a64" />
              <Text style={styles.menuBtnText}>TEAC</Text>
            </TouchableOpacity>

            {/* Botão CURSOS */}
            <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#ffb366'}]}>
              <FontAwesome5 name="graduation-cap" size={28} color="#d84315" />
              <Text style={styles.menuBtnText}>Cursos</Text>
            </TouchableOpacity>

            {/* Botão FORUM */}
            <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#87bbff'}]}>
              <Ionicons name="chatbubbles" size={32} color="#1565c0" />
              <Text style={styles.menuBtnText}>Fórum</Text>
            </TouchableOpacity>

            {/* Botão KIDS */}
            <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#ffe066'}]}>
              <Ionicons name="star" size={30} color="#f57f17" />
              <Text style={styles.menuBtnText}>Kids</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 15,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1a3b5c',
    letterSpacing: 1,
    lineHeight: 45,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1a3b5c',
    fontWeight: '600',
    lineHeight: 18,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 10,
  },
  menuBtn: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 5,
  },
  menuBtnText: {
    marginTop: 8,
    color: '#1a3b5c',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 40,
  },
  infoText: {
    fontSize: 18,
    color: '#1a3b5c',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
  },
  imageContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRing: {
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 140,
    padding: 10,
    position: 'relative',
  },
  childImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  puzzleIcon: {
    position: 'absolute',
  }
});
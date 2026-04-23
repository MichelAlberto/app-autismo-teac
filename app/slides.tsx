import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList, Image, StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from "react-native";

// Dimensões da TELA (screen) em vez de window para pegar a área total (incluindo barras)
const { width, height } = Dimensions.get("screen");

// Interface para os slides
interface Slide {
  id: string;
  title: string;
  description: string;
  icon: any;
}

// Slides atualizados com as novas imagens e frases originais
const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Bem-vindo ao TEAC!",
    description:
      "Um espaço de apoio, aprendizado e conexão para autistas, familiares e profissionais.",
    icon: require("../assets/pnghome1.png"),
  },
  {
    id: "2",
    title: "Fórum e Comunidade",
    description:
      "Tire suas dúvidas e converse com outras pessoas que compartilham da mesma vivência.",
    icon: require("../assets/pnghome2.png"),
  },
  {
    id: "3",
    title: "Pronto para Começar?",
    description:
      "Encontre profissionais qualificados para te guiar e acesse todos os recursos agora mesmo!",
    icon: require("../assets/pnghome3.png"),
  },
];

export default function SlidesApresentacao() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide>>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Vai para o próximo slide
  const nextSlide = async () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem("hasSeenIntro", "true");
      router.replace("/"); // Vai para o Login
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Overlay opcional para garantir leitura */}
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Força o conteúdo a ficar por baixo da barra de status */}
      <StatusBar translucent backgroundColor="transparent" style="light" />
      
      <Image 
        source={require("../assets/fundo.png")} 
        style={styles.backgroundImage} 
        resizeMode="cover" 
      />

      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.paginatorContainer}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i.toString()}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={nextSlide}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  slideContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", // Overlay leve para ajudar na leitura
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  iconImage: {
    width: width * 0.9,
    height: height * 0.45,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100, // Espaço para o rodapé
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  paginatorContainer: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#3B82F6",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});


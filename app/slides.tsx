import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

// Dimensões da tela para ocupar 100% da visualização
const { width } = Dimensions.get("window");

// Interface para os slides
interface Slide {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

// Você pode substituir os ícones ou imagens depois
const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Bem-vindo ao TEAC!",
    description:
      "Um espaço de apoio, aprendizado e conexão para autistas, familiares e profissionais.",
    color: "#E0F2FE", // Azul claro
    icon: "🚀", // Temporário, pode ser substituído por `<Image>`
  },
  {
    id: "2",
    title: "Fórum e Comunidade",
    description:
      "Tire suas dúvidas e converse com outras pessoas que compartilham da mesma vivência.",
    color: "#FEF08A", // Amarelo claro
    icon: "💬",
  },
  {
    id: "3",
    title: "Acesso a Profissionais",
    description:
      "Encontre profissionais qualificados para responder perguntas e te guiar na jornada.",
    color: "#BBF7D0", // Verde claro
    icon: "⚕️",
  },
  {
    id: "4",
    title: "Pronto para Começar?",
    description:
      "Faça seu login ou cadastre-se agora mesmo para acessar todos os recursos!",
    color: "#E9D5FF", // Roxo claro
    icon: "✨",
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
      <View style={[styles.slideContainer, { backgroundColor: item.color }]}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* O FLATLIST OCUPA A TELA TODA */}
      <View style={StyleSheet.absoluteFillObject}>
        <FlatList
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
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
      </View>

      {/* ÁREA DOS BOTÕES E BOLINHAS (Rodapé Sobreposto) */}
      <View style={styles.footer}>
        {/* Botão de Avançar / Iniciar (Agora em cima) */}
        <TouchableOpacity style={styles.button} onPress={nextSlide}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? "Acessar Login" : "Próximo"}
          </Text>
        </TouchableOpacity>

        {/* Bolinhas (Paginator agora embaixo do botão) */}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slideContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  icon: {
    fontSize: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    gap: 20, // Espaçamento entre botão e bolinhas
  },
  paginatorContainer: {
    flexDirection: "row",
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
    padding: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

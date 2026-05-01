import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  useWindowDimensions,
  FlatList, Image, StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from "react-native";

// Interface para os slides
interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

// Slides atualizados com as novas imagens e frases originais
const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Bem-vindo ao TEAC!",
    description:
      "Um espaço de apoio, aprendizado e conexão para autistas, familiares e profissionais.",
    image: require("../assets/int1.png"),
  },
  {
    id: "2",
    title: "Fórum e Comunidade",
    description:
      "Tire suas dúvidas e converse com outras pessoas que compartilham da mesma vivência.",
    image: require("../assets/int2.png"),
  },
  {
    id: "3",
    title: "Pronto para Começar?",
    description:
      "Encontre profissionais qualificados para te guiar e acesse todos os recursos agora mesmo!",
    image: require("../assets/int3.png"),
  },
];

export default function SlidesApresentacao() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
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
      const nextIndex = currentIndex + 1;
      slidesRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex); // Atualização otimista
    } else {
      await AsyncStorage.setItem("hasSeenIntro", "true");
      router.replace("/"); // Vai para o Login
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slideContainer, { width, height }]}>
        <Image source={item.image} style={[StyleSheet.absoluteFillObject, { width, height }]} resizeMode="stretch" />

        <View style={styles.contentContainer}>
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

      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
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
    backgroundColor: "#FFF",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  slideContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D1B3E",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
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


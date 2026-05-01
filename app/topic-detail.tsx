import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState, memo } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/topic-detail.styles";
import { TOPIC_CONTENT } from "../constants/topicContent";
import { TOTAL_COURSE_SLIDES } from "../constants/courseData";

// Removed global screenWidth to use useWindowDimensions

const FlipCard = memo(({ item, initiallyRevealed, onReveal, screenWidth, screenHeight }: any) => {
  const animatedValue = useRef(new Animated.Value(initiallyRevealed ? 180 : 0)).current;
  const [isFlipped, setIsFlipped] = useState(initiallyRevealed);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 180;
    Animated.spring(animatedValue, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start();
    setIsFlipped(!isFlipped);
    if (!isFlipped) onReveal();
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.slideWrapper, { width: screenWidth }]}>
      <View style={[styles.card, { width: screenWidth * 0.88, height: screenHeight * 0.52 }]}>
        <Animated.View
          pointerEvents={isFlipped ? "none" : "auto"}
          style={[
            styles.cardFace,
            { 
              transform: [
                { perspective: 1000 }, 
                { rotateY: frontInterpolate }
              ], 
              opacity: frontOpacity, 
              zIndex: isFlipped ? 1 : 2 
            }
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={flipCard}
            style={{ width: '100%', height: '100%', alignItems: 'center' }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={35} color="#5C6BC0" />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="lock-closed-outline" size={30} color="#E2E8F0" />
              <Text style={[styles.cardContent, { color: '#A0AEC0', marginTop: 10, fontSize: 14 }]}>
                Toque para girar o cartão
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.gestureIndicator}>
                <Ionicons name="arrow-back-outline" size={12} color="#CBD5E0" />
                <Ionicons name="hand-right-outline" size={18} color="#5C6BC0" style={{ marginHorizontal: 8 }} />
                <Ionicons name="arrow-forward-outline" size={12} color="#CBD5E0" />
              </View>
              <Text style={styles.gestureText}>Deslize para navegar</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          pointerEvents={isFlipped ? "auto" : "none"}
          style={[
            styles.cardFace,
            styles.cardBack,
            { 
              transform: [
                { perspective: 1000 }, 
                { rotateY: backInterpolate }
              ], 
              opacity: backOpacity, 
              zIndex: isFlipped ? 2 : 1 
            }
          ]}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={flipCard} style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={35} color="#5C6BC0" />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>

          <ScrollView
            style={styles.contentScrollView}
            contentContainerStyle={styles.contentScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.cardContent}>{item.content}</Text>
          </ScrollView>

          <TouchableOpacity activeOpacity={0.7} onPress={flipCard} style={styles.cardFooter}>
            <View style={styles.gestureIndicator}>
              <Ionicons name="refresh-outline" size={14} color="#5C6BC0" />
              <Text style={[styles.gestureText, { marginLeft: 5 }]}>Toque para voltar</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
});

// IMPORT FIREBASE
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TopicDetail() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { topicId, topicTitle } = useLocalSearchParams();
  const [revealedSlides, setRevealedSlides] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fullCourseProgress, setFullCourseProgress] = useState<any>({});

  const flatListRef = useRef<FlatList>(null);
  
  const topicSlides = TOPIC_CONTENT[topicId as string] || [];
  const totalSlides = topicSlides.length;

  useEffect(() => {
    loadTopicProgress();
  }, [topicId]);

  const loadTopicProgress = async () => {
    try {
      // 1. Pegar usuário logado
      const userJson = await AsyncStorage.getItem("teac_current_user");
      if (!userJson) return;
      const user = JSON.parse(userJson);
      setCurrentUser(user);

      // 2. Tentar buscar progresso do Firestore primeiro (Nuvem)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let cloudProgress = {};
      if (userDoc.exists()) {
        cloudProgress = userDoc.data().courseProgress || {};
      }

      // 3. Buscar progresso local (Fallback/Cache)
      const localData = await AsyncStorage.getItem("course_progress_detailed");
      const localProgress = localData ? JSON.parse(localData) : {};

      // Mesclar os dois (prioridade para a nuvem se existir)
      const combinedProgress = { ...localProgress, ...cloudProgress };
      setFullCourseProgress(combinedProgress);
      
      if (combinedProgress[topicId as string]) {
        setRevealedSlides(new Set<number>(combinedProgress[topicId as string]));
      }

      calculateGlobalProgress(combinedProgress);
    } catch (e) { console.error("Erro ao carregar progresso:", e); }
  };

  const calculateGlobalProgress = (progressObj: any) => {
    // Calculando a quantidade real de slides disponíveis em todo o curso dinamicamente
    let totalSlidesGlobal = 0;
    Object.keys(TOPIC_CONTENT).forEach(key => {
      totalSlidesGlobal += TOPIC_CONTENT[key].length;
    });

    let totalRevealed = 0;
    Object.keys(progressObj).forEach(id => {
      totalRevealed += progressObj[id].length;
    });

    setGlobalProgress(totalSlidesGlobal > 0 ? Math.round((totalRevealed / totalSlidesGlobal) * 100) : 0);
  };

  const saveTopicProgress = async (updatedRevealed: Set<number>) => {
    try {
      if (!currentUser) return;

      // Mantém a sincronia exata de todo o curso
      const newFullProgress = { ...fullCourseProgress };
      newFullProgress[topicId as string] = Array.from(updatedRevealed);
      setFullCourseProgress(newFullProgress);

      // 1. Salvar Localmente
      await AsyncStorage.setItem("course_progress_detailed", JSON.stringify(newFullProgress));

      // 2. Salvar no Firestore (Nuvem)
      await setDoc(doc(db, "users", currentUser.uid), {
        courseProgress: newFullProgress
      }, { merge: true });

      calculateGlobalProgress(newFullProgress);
    } catch (e) { console.error("Erro ao salvar progresso:", e); }
  };

  const onCardReveal = (index: number) => {
    if (!revealedSlides.has(index)) {
      const updated = new Set(revealedSlides);
      updated.add(index);
      setRevealedSlides(updated);
      saveTopicProgress(updated);
    }
  };

  const onScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    if (newIndex !== currentSlide && newIndex >= 0 && newIndex < totalSlides) {
      setCurrentSlide(newIndex);
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      const nextIndex = currentSlide + 1;
      setCurrentSlide(nextIndex);
      flatListRef.current?.scrollToOffset({ offset: nextIndex * screenWidth, animated: true });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1;
      setCurrentSlide(prevIndex);
      flatListRef.current?.scrollToOffset({ offset: prevIndex * screenWidth, animated: true });
    }
  };

  const renderSlideItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <FlipCard
        item={item}
        initiallyRevealed={revealedSlides.has(index)}
        onReveal={() => onCardReveal(index)}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />
    );
  };

  return (
    <LinearGradient colors={["#3949AB", "#7E57C2"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#3949AB" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>{topicTitle}</Text>

        <View style={styles.slidesContainer}>
          <FlatList
            ref={flatListRef}
            data={topicSlides}
            renderItem={renderSlideItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            removeClippedSubviews={false}
          />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlButtonWrapper}>
            <TouchableOpacity style={[styles.navButton, currentSlide === 0 && { opacity: 0.5 }]} onPress={prevSlide} disabled={currentSlide === 0}>
              <Ionicons name="chevron-back" size={24} color="#3949AB" />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Anterior</Text>
          </View>

          <View style={styles.slideCounterBadge}>
            <Text style={styles.slideCounterText}>
              {currentSlide + 1} / {totalSlides}
            </Text>
          </View>

          <View style={styles.controlButtonWrapper}>
            <TouchableOpacity style={[styles.navButton, currentSlide === totalSlides - 1 && { opacity: 0.5 }]} onPress={nextSlide} disabled={currentSlide === totalSlides - 1}>
              <Ionicons name="chevron-forward" size={24} color="#3949AB" />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Próximo</Text>
          </View>
        </View>

        <View style={styles.footerProgressContainer}>
          <View style={styles.footerLabels}>
            <Text style={styles.footerLabelText}>Progresso do curso</Text>
            <Text style={styles.footerLabelText}>{globalProgress === 100 ? "Curso concluído!" : `${globalProgress}% concluído`}</Text>
          </View>
          <View style={styles.footerProgressBarBg}>
            <View style={[styles.footerProgressBarFill, { width: `${globalProgress}%`, backgroundColor: globalProgress === 100 ? '#4CAF50' : '#ffffff' }]} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

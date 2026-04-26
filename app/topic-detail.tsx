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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/topic-detail.styles";
import { TOPIC_CONTENT } from "../constants/topicContent";
import { TOTAL_COURSE_SLIDES } from "../constants/courseData";

const { width: screenWidth } = Dimensions.get("window");

const FlipCard = memo(({ item, initiallyRevealed, onReveal }: any) => {
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
    <View style={styles.slideWrapper}>
      <View style={styles.card}>
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

export default function TopicDetail() {
  const { topicId, topicTitle } = useLocalSearchParams();
  const [revealedSlides, setRevealedSlides] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  
  const topicSlides = TOPIC_CONTENT[topicId as string] || [];
  const totalSlides = topicSlides.length;

  useEffect(() => {
    loadTopicProgress();
  }, [topicId]);

  const loadTopicProgress = async () => {
    try {
      const data = await AsyncStorage.getItem("course_progress_detailed");
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed[topicId as string]) {
          const revealed = new Set<number>(parsed[topicId as string]);
          setRevealedSlides(revealed);
          if (revealed.size === totalSlides);
        }

        let totalRevealed = 0;
        Object.keys(parsed).forEach(id => {
          totalRevealed += parsed[id].length;
        });
        setGlobalProgress(Math.round((totalRevealed / TOTAL_COURSE_SLIDES) * 100));
      }
    } catch (e) { console.error(e); }
  };

  const saveTopicProgress = async (updatedRevealed: Set<number>) => {
    try {
      const data = await AsyncStorage.getItem("course_progress_detailed");
      const parsed = data ? JSON.parse(data) : {};
      parsed[topicId as string] = Array.from(updatedRevealed);
      await AsyncStorage.setItem("course_progress_detailed", JSON.stringify(parsed));

      let totalRevealed = 0;
      Object.keys(parsed).forEach(id => {
        totalRevealed += parsed[id].length;
      });
      setGlobalProgress(Math.round((totalRevealed / TOTAL_COURSE_SLIDES) * 100));
    } catch (e) { console.error(e); }
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
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1;
      setCurrentSlide(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderSlideItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <FlipCard
        item={item}
        initiallyRevealed={revealedSlides.has(index)}
        onReveal={() => onCardReveal(index)}
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

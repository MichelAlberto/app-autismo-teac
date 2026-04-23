import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/topic-detail.styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const autismColors = ["#0078d4", "#f5b700", "#f05374", "#4db8c9", "#00b894"];

export default function TopicDetail() {
  const { topicId, topicTitle } = useLocalSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleGoBack = () => {
    router.back();
  };

  const getTopicSlides = (id: string) => {
    const slidesData: {
      [key: string]: { title: string; content: string; icon: string }[];
    } = {
      // MÓDULO 1 - INTRODUÇÃO AO AUTISMO
      "1-1": [
        {
          title: "O que é TEA?",
          content:
            "Uma condição neurobiológica que afeta comunicação, interação social e processamento de informações.",
          icon: "brain",
        },
        {
          title: "Comunicação Social",
          content:
            "Dificuldades em entender pistas sociais, expressar emoções e manter conversas.",
          icon: "chatbubbles",
        },
        {
          title: "Padrões Repetitivos",
          content:
            "Comportamentos repetitivos, rotinas fixas e interesses intensos em tópicos específicos.",
          icon: "repeat",
        },
        {
          title: "Processamento Sensorial",
          content: "Sensibilidade diferente a sons, luzes, texturas e cheiros.",
          icon: "ear",
        },
        {
          title: "Espectro",
          content:
            "Cada pessoa com TEA é única, com características em diferentes níveis de intensidade.",
          icon: "color-palette",
        },
      ],
      "1-2": [
        {
          title: "Mito: É uma doença",
          content:
            "FALSO. O autismo é uma diferença neurológica, não uma doença.",
          icon: "medical",
        },
        {
          title: "Mito: Causado por vacinas",
          content:
            "FALSO. Origem genética e neurobiológica, não relacionado a vacinas.",
          icon: "shield-checkmark",
        },
        {
          title: "Mito: Pais são culpados",
          content:
            "FALSO. Não é causado por criação ou comportamento dos pais.",
          icon: "people",
        },
        {
          title: "Verdade: Cada pessoa é única",
          content:
            "VERDADEIRO. Cada autista tem suas próprias forças e desafios.",
          icon: "person",
        },
        {
          title: "Verdade: Pode ser diagnosticado",
          content: "VERDADEIRO. Com avaliação profissional especializada.",
          icon: "checkmark-circle",
        },
      ],
      "1-3": [
        {
          title: "Diversidade no Espectro",
          content:
            "Manifestações diferentes em cada pessoa - algumas falam muito, outras pouco.",
          icon: "people-circle",
        },
        {
          title: "Autismo Aparente",
          content:
            "Pode parecer 'alto funcionamento' em algumas áreas, mas lutar intensamente em outras.",
          icon: "eye",
        },
        {
          title: "Forças Específicas",
          content:
            "Muitas pessoas com TEA têm habilidades excepcionais em matemática, arte ou memória.",
          icon: "star",
        },
        {
          title: "Aceitação",
          content:
            "Compreender a diversidade ajuda a apoiar melhor cada pessoa autista.",
          icon: "heart",
        },
        {
          title: "Inclusão",
          content:
            "Todos merecem respeito, oportunidades e apoio para viver plenamente.",
          icon: "hand-left",
        },
      ],
      // MÓDULO 2 - IDENTIFICAÇÃO E SINAIS
      "2-1": [
        {
          title: "Sinais Precoces",
          content:
            "Antes dos 2 anos: falta de contato visual e dificuldade em responder ao nome.",
          icon: "eye-off",
        },
        {
          title: "Ausência de Balbucio",
          content:
            "Crianças típicas balbuciam aos 12 meses. Algumas com TEA não desenvolvem isso.",
          icon: "mic-off",
        },
        {
          title: "Comportamentos Repetitivos",
          content:
            "Bater as mãos, rodar objetos ou alinhar brinquedos de forma específica.",
          icon: "refresh",
        },
        {
          title: "Interesses Intensos",
          content:
            "Fascinação por partes específicas de objetos ou tópicos muito específicos.",
          icon: "bulb",
        },
        {
          title: "Sensibilidade Sensorial",
          content:
            "Reações intensas a sons altos, luzes fortes ou texturas diferentes.",
          icon: "volume-high",
        },
      ],
      "2-2": [
        {
          title: "Bebês",
          content:
            "Não respondem ao nome, evitam contato visual, padrões atípicos de sono/alimentação.",
          icon: "happy",
        },
        {
          title: "Crianças Pequenas",
          content:
            "Dificuldade em brincar de faz-de-conta, preferem brincadeiras solitárias.",
          icon: "game-controller",
        },
        {
          title: "Idade Escolar",
          content:
            "Problemas com amizades, resistência a mudanças, interesses muito específicos.",
          icon: "school",
        },
        {
          title: "Adolescentes",
          content:
            "Ansiedade social, estratégias de mascaramento, necessidade de rotinas.",
          icon: "person-add",
        },
        {
          title: "Adultos",
          content:
            "Dificuldades em relacionamentos, emprego e independência diária.",
          icon: "briefcase",
        },
      ],
      "2-3": [
        {
          title: "Observe",
          content: "Registre comportamentos consistentes ao longo do tempo.",
          icon: "clipboard",
        },
        {
          title: "Consulte Profissionais",
          content:
            "Pediatra, neuropediatra ou psicólogo podem fazer avaliação inicial.",
          icon: "medkit",
        },
        {
          title: "Avaliação Completa",
          content:
            "Testes específicos ajudam a confirmar diagnóstico e identificar necessidades.",
          icon: "search",
        },
        {
          title: "Quanto Antes Melhor",
          content:
            "Intervenção precoce traz melhores resultados de desenvolvimento.",
          icon: "time",
        },
        {
          title: "Apoio Adequado",
          content:
            "Diagnóstico abre portas para terapias, direitos educacionais e suporte.",
          icon: "key",
        },
      ],
      // MÓDULO 3 - COMUNICAÇÃO E COMPORTAMENTO
      "3-1": [
        {
          title: "Comunicação Verbal",
          content:
            "Dificuldades com entonação, ritmo e compreensão de linguagem figurada.",
          icon: "chatbubble",
        },
        {
          title: "Comunicação Não-Verbal",
          content:
            "Gestos, contato visual e expressão facial podem ser diferentes.",
          icon: "hand-right",
        },
        {
          title: "Sistemas Alternativos",
          content:
            "PECS, linguagem de sinais ou dispositivos de voz podem ajudar.",
          icon: "phone-portrait",
        },
        {
          title: "Comunicação Clara",
          content:
            "Use linguagem direta, literal e combine palavras com imagens.",
          icon: "text",
        },
        {
          title: "Tempo para Processar",
          content: "Dê tempo para entender e responder - não interrompa.",
          icon: "hourglass",
        },
      ],
      "3-2": [
        {
          title: "O que é Meltdown?",
          content:
            "Sobrecarga emocional e sensorial. NÃO é birra - é resposta ao stress extremo.",
          icon: "flame",
        },
        {
          title: "Sinais de Meltdown",
          content:
            "Agitação crescente, dificuldade em se acalmar, perda temporária de controle.",
          icon: "warning",
        },
        {
          title: "Diferença da Birra",
          content:
            "Birra é manipulativa. Meltdown é genuína angústia que não pode ser interrompida.",
          icon: "contrast",
        },
        {
          title: "Como Ajudar",
          content:
            "Ambiente calmo, espaço pessoal, voz suave. Espere passar naturalmente.",
          icon: "home",
        },
        {
          title: "Prevenção",
          content:
            "Identifique gatilhos, mantenha rotinas, evite sobrecargas sensoriais.",
          icon: "shield",
        },
      ],
      "3-3": [
        {
          title: "Rotina e Previsibilidade",
          content:
            "Rotinas consistentes reduzem ansiedade e facilitam transições.",
          icon: "calendar",
        },
        {
          title: "Regulação Sensorial",
          content:
            "Espaços calmos, fones de ouvido, brinquedos sensoriais apropriados.",
          icon: "headset",
        },
        {
          title: "Elogio Positivo",
          content:
            "Reforce comportamentos desejados imediatamente e especificamente.",
          icon: "thumbs-up",
        },
        {
          title: "Escolhas",
          content: "Ofereça opções limitadas para dar sensação de controle.",
          icon: "options",
        },
        {
          title: "Paciência e Empatia",
          content:
            "Entenda que cada criança aprende e se expressa de forma diferente.",
          icon: "heart-circle",
        },
      ],
      // MÓDULO 4 - INTERVENÇÕES E TERAPIAS
      "4-1": [
        {
          title: "Análise do Comportamento (ABA)",
          content:
            "Trabalha comportamentos específicos usando reforço positivo.",
          icon: "analytics",
        },
        {
          title: "Fonoaudiologia",
          content:
            "Desenvolve comunicação, fala, linguagem e coordenação orofacial.",
          icon: "mic",
        },
        {
          title: "Terapia Ocupacional",
          content:
            "Habilidades de vida diária, coordenação motora e processamento sensorial.",
          icon: "body",
        },
        {
          title: "Terapia da Fala",
          content: "Melhora comunicação verbal e compreensão de linguagem.",
          icon: "chatbox",
        },
        {
          title: "Integração Sensorial",
          content:
            "Ajuda a processar e integrar informações sensoriais do ambiente.",
          icon: "pulse",
        },
      ],
      "4-2": [
        {
          title: "Avalie Necessidades",
          content:
            "Cada criança é diferente - identifique as maiores dificuldades.",
          icon: "search-circle",
        },
        {
          title: "Equipe Multidisciplinar",
          content: "Combine diferentes terapias para abordagem completa.",
          icon: "people",
        },
        {
          title: "Baseado em Evidências",
          content: "Escolha intervenções comprovadas cientificamente.",
          icon: "checkmark-done",
        },
        {
          title: "Personalizado",
          content: "Adapte as terapias às necessidades específicas da criança.",
          icon: "person-circle",
        },
        {
          title: "Consistência",
          content: "Pratique estratégias em casa, escola e comunidade.",
          icon: "sync",
        },
      ],
      "4-3": [
        {
          title: "Papel dos Pais",
          content:
            "Os maiores agentes de mudança - participação ativa multiplica resultados.",
          icon: "home",
        },
        {
          title: "Aprendizado Contínuo",
          content: "Estude sobre TEA para melhor apoiar seu filho.",
          icon: "book",
        },
        {
          title: "Suporte Emocional",
          content:
            "Cuidar de criança com TEA é desafiador - busque apoio emocional.",
          icon: "heart",
        },
        {
          title: "Comunicação com Profissionais",
          content: "Trabalhe em parceria com terapeutas e educadores.",
          icon: "chatbubbles",
        },
        {
          title: "Autocuidado",
          content:
            "Cuide da sua saúde mental e física para cuidar melhor do seu filho.",
          icon: "fitness",
        },
      ],
      // MÓDULO 5 - INCLUSÃO A ESCOLA
      "5-1": [
        {
          title: "Preparação",
          content:
            "Comunique com a escola sobre necessidades da criança antecipadamente.",
          icon: "school",
        },
        {
          title: "Histórias Sociais",
          content: "Prepare a criança com histórias sobre rotina escolar.",
          icon: "book",
        },
        {
          title: "Plano de Adaptação",
          content: "Comece com horários reduzidos e pessoa de referência.",
          icon: "document",
        },
        {
          title: "Ambiente Estruturado",
          content: "Rotinas visuais claras e espaço organizado ajudam.",
          icon: "grid",
        },
        {
          title: "Acompanhamento",
          content:
            "Monitore adaptação e ajuste estratégias conforme necessário.",
          icon: "eye",
        },
      ],
      "5-2": [
        {
          title: "Lei Berenice Piana",
          content:
            "Lei específica para direitos das pessoas com autismo (2012).",
          icon: "document-text",
        },
        {
          title: "Lei de Inclusão",
          content:
            "Garante educação inclusiva e atendimento educacional especializado.",
          icon: "school",
        },
        {
          title: "Direitos Educacionais",
          content:
            "AEE, acompanhante, recursos de acessibilidade quando necessário.",
          icon: "ribbon",
        },
        {
          title: "Documentação",
          content: "Laudo diagnóstico é fundamental para garantir direitos.",
          icon: "folder",
        },
        {
          title: "Defesa dos Direitos",
          content: "Conheça e reivindique os direitos garantidos por lei.",
          icon: "shield-checkmark",
        },
      ],
      "5-3": [
        {
          title: "Comunicação Aberta",
          content:
            "Mantenha diálogo constante com professores sobre progresso da criança.",
          icon: "chatbubbles",
        },
        {
          title: "Capacitação",
          content: "Ofereça informações sobre TEA para equipe escolar.",
          icon: "school",
        },
        {
          title: "Parceria",
          content:
            "Pais e professores trabalhando juntos alcançam melhores resultados.",
          icon: "handshake",
        },
        {
          title: "Validação",
          content:
            "Reconheça o esforço e dedicação dos profissionais da escola.",
          icon: "thumbs-up",
        },
        {
          title: "Apoio Contínuo",
          content:
            "A inclusão é um processo contínuo que requer dedicação de todos.",
          icon: "infinite",
        },
      ],
    };

    return (
      slidesData[id] || [
        {
          title: "Conteúdo não encontrado",
          content: "Desculpe, o conteúdo para este tópico não foi encontrado.",
          icon: "help-circle",
        },
      ]
    );
  };

  const topicSlides = getTopicSlides(topicId as string);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const parseContent = (item: { title: string; content: string }) => {
    let question = item.title;
    let answer = item.content;

    // Lógica especial para Mitos e Verdades
    const lowerTitle = item.title.toLowerCase();
    if (lowerTitle.includes("mito:") || lowerTitle.includes("verdade:")) {
      const parts = item.title.split(":");
      const type = parts[0].trim();
      question = parts[1].trim();
      
      // Se não terminar com pontuação, adiciona uma interrogação para a pergunta
      if (!question.endsWith("?") && !question.endsWith(".") && !question.endsWith("!")) {
        question = question + "?";
      }
      
      answer = type.toUpperCase() + ": " + item.content;
    }

    return { question, answer };
  };

  const Flashcard = ({
    item,
    index,
  }: {
    item: { title: string; content: string; icon: string };
    index: number;
  }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const flipCard = () => {
      if (isFlipped) {
        Animated.spring(animatedValue, {
          toValue: 0,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(animatedValue, {
          toValue: 180,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      }
      setIsFlipped(!isFlipped);
    };

    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"],
    });

    const frontAnimatedStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    const { question, answer } = parseContent(item);
    const bgColor = autismColors[index % autismColors.length];

    return (
      <View style={styles.slide}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={flipCard}
          style={styles.card}
        >
          {/* LADO DA FRENTE */}
          <Animated.View
            style={[
              styles.cardFace,
              { backgroundColor: bgColor },
              frontAnimatedStyle,
            ]}
          >
            <View style={styles.slideIconContainer}>
              <Ionicons name={item.icon as any} size={70} color="#ffffff" />
            </View>
            <Text style={styles.slideTitle}>{question}</Text>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>Ver a resposta</Text>
            </View>
          </Animated.View>

          {/* LADO DE TRÁS */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              { backgroundColor: bgColor },
              backAnimatedStyle,
            ]}
          >
            <View style={styles.backLabel}>
              <Text style={styles.backLabelText}>RESPOSTA</Text>
            </View>
            <Text style={styles.slideContent}>{answer}</Text>

            <View style={styles.instructionContainer}>
              <Ionicons name="refresh-outline" size={18} color="#ffffff" />
              <Text style={styles.instructionText}>Toque para voltar</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSlide = ({
    item,
    index,
  }: {
    item: { title: string; content: string; icon: string };
    index: number;
  }) => {
    return <Flashcard item={item} index={index} />;
  };

  const renderDot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.dot, currentSlide === index && styles.activeDot]}
      onPress={() => handleSlideChange(index)}
    />
  );

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* HEADER COM BOTÃO VOLTAR */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{topicTitle}</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* SLIDES DO TÓPICO */}
          <View style={styles.slidesContainer}>
            <FlatList
              ref={flatListRef}
              data={topicSlides}
              renderItem={renderSlide}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={336} // 320 (largura) + 16 (margem)
              decelerationRate="fast"
              contentContainerStyle={[
                styles.slidesList,
                { justifyContent: "center" },
              ]}
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.round(
                  event.nativeEvent.contentOffset.x / 336,
                );
                setCurrentSlide(slideIndex);
              }}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* INDICADORES DE SLIDE */}
            <View style={styles.dotsContainer}>
              {topicSlides.map((_, index) => renderDot(index))}
            </View>
          </View>

          {/* BOTÃO VOLTAR PARA O CURSO */}
          <TouchableOpacity style={styles.continuBtn} onPress={handleGoBack}>
            <Text style={styles.continuBtnText}>Voltar ao Curso</Text>
            <Ionicons name="chevron-back" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

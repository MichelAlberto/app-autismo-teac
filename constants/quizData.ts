export interface QuizOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  icon: any; // Ionicons name
  options: QuizOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "O que é um Meltdown no autismo?",
    icon: "flame-outline",
    options: [
      { id: "A", text: "É uma birra para chamar atenção." },
      { id: "B", text: "É uma reação intensa a sobrecarga emocional ou sensorial." },
      { id: "C", text: "É uma forma de manipular as pessoas." },
      { id: "D", text: "É um problema de comportamento." }
    ],
    correctOptionId: "B",
    explanation: "Meltdown acontece quando a pessoa está sobrecarregada e perde a capacidade de se autorregular."
  },
  {
    id: 2,
    question: "O autismo é causado por vacinas?",
    icon: "shield-checkmark-outline",
    options: [
      { id: "A", text: "Sim, várias pesquisas comprovam isso." },
      { id: "B", text: "Apenas algumas vacinas específicas." },
      { id: "C", text: "Falso, tem origem genética e neurobiológica." },
      { id: "D", text: "Verdadeiro, dependendo da idade da criança." }
    ],
    correctOptionId: "C",
    explanation: "Diversos estudos científicos já comprovaram que o autismo não é relacionado a vacinas, possuindo origem genética e neurobiológica."
  },
  {
    id: 3,
    question: "Como identificar possíveis sinais precoces do TEA em bebês?",
    icon: "eye-off-outline",
    options: [
      { id: "A", text: "Eles sempre andam mais cedo que o normal." },
      { id: "B", text: "Pouco ou nenhum balbucio e contato visual reduzido." },
      { id: "C", text: "Choram sem motivo aparente o tempo todo." },
      { id: "D", text: "Falam palavras completas antes de um ano." }
    ],
    correctOptionId: "B",
    explanation: "Sinais na comunicação e interação, como pouco balbucio, não responder ao nome e contato visual reduzido são cruciais para a identificação precoce."
  },
  {
    id: 4,
    question: "O que é a Comunicação Alternativa (ex: PECS)?",
    icon: "tablet-landscape-outline",
    options: [
      { id: "A", text: "Um sistema de pontuação para o comportamento." },
      { id: "B", text: "Uma técnica para forçar a fala." },
      { id: "C", text: "Recursos usados quando a fala é limitada, como uso de figuras." },
      { id: "D", text: "Um tipo de terapia para a coordenação motora." }
    ],
    correctOptionId: "C",
    explanation: "Sistemas como o PECS usam figuras e aplicativos para permitir que a pessoa se expresse, reduzindo frustração e aumentando a autonomia."
  },
  {
    id: 5,
    question: "Qual a diferença principal entre birra e Meltdown?",
    icon: "git-compare-outline",
    options: [
      { id: "A", text: "Birra não tem objetivo, Meltdown tem." },
      { id: "B", text: "Birra tem um objetivo; Meltdown é resposta involuntária a sobrecarga." },
      { id: "C", text: "São exatamente a mesma coisa em idades diferentes." },
      { id: "D", text: "Meltdown só acontece em adultos, birra só em crianças." }
    ],
    correctOptionId: "B",
    explanation: "Birra cessa com negociação ou mudança de atenção. Meltdown não tem intenção de manipular, é uma resposta involuntária ao estresse."
  },
  {
    id: 6,
    question: "Sobre padrões repetitivos no TEA, qual afirmação é correta?",
    icon: "refresh-outline",
    options: [
      { id: "A", text: "Eles devem ser sempre interrompidos imediatamente." },
      { id: "B", text: "Ajudam na previsibilidade, conforto e regulação da pessoa." },
      { id: "C", text: "São apenas um sinal de falta de atenção." },
      { id: "D", text: "Ocorrem apenas quando a pessoa está muito feliz." }
    ],
    correctOptionId: "B",
    explanation: "Comportamentos repetitivos, como balançar o corpo ou seguir rotinas rígidas, ajudam a pessoa a se autorregular e sentir segurança."
  },
  {
    id: 7,
    question: "O que é Ecolalia na comunicação?",
    icon: "chatbubbles-outline",
    options: [
      { id: "A", text: "Dificuldade em escutar sons muito agudos." },
      { id: "B", text: "Repetição de palavras ou frases recém-ouvidas ou memorizadas." },
      { id: "C", text: "Forma de brincar isoladamente sem sentido." },
      { id: "D", text: "Falta total de interesse em se comunicar." }
    ],
    correctOptionId: "B",
    explanation: "A ecolalia é a repetição de falas. Compreender esse perfil evita exigir padrões inadequados e permite estimular a comunicação."
  },
  {
    id: 8,
    question: "O Autismo é classificado como um 'espectro' porque:",
    icon: "color-palette-outline",
    options: [
      { id: "A", text: "Tem apenas um tipo fixo de perfil e comportamento." },
      { id: "B", text: "Varia muito em intensidade, habilidades e necessidades de suporte." },
      { id: "C", text: "Apenas crianças podem ser diagnosticadas." },
      { id: "D", text: "Desaparece completamente na vida adulta." }
    ],
    correctOptionId: "B",
    explanation: "O espectro indica que cada autista é único, apresentando diferentes desafios, forças e níveis de suporte necessários."
  },
  {
    id: 9,
    question: "A Lei Berenice Piana (12.764/2012) estabelece que:",
    icon: "document-text-outline",
    options: [
      { id: "A", text: "O autismo não é considerado deficiência no Brasil." },
      { id: "B", text: "Apenas escolas públicas devem matricular autistas." },
      { id: "C", text: "Reconhece o autismo como deficiência, garantindo todos os direitos legais." },
      { id: "D", text: "O diagnóstico deve ser feito exclusivamente pelas escolas." }
    ],
    correctOptionId: "C",
    explanation: "Esta lei garante acesso à saúde, educação e assistência, e veda qualquer tipo de discriminação, garantindo igualdade de direitos."
  },
  {
    id: 10,
    question: "Como os pais e cuidadores devem agir durante uma crise (Meltdown)?",
    icon: "heart-half-outline",
    options: [
      { id: "A", text: "Confrontar a pessoa e aplicar punições severas." },
      { id: "B", text: "Reduzir os estímulos do ambiente e oferecer um espaço seguro." },
      { id: "C", text: "Ignorar completamente e sair do local na mesma hora." },
      { id: "D", text: "Falar alto para que a pessoa obedeça." }
    ],
    correctOptionId: "B",
    explanation: "O foco é ajudar a pessoa a se regular reduzindo barulhos e luzes, mantendo a calma e evitando confrontos no momento da crise."
  }
];

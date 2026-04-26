export interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  topics: Topic[];
}

export const COURSE_DATA: CourseModule[] = [
  {
    id: "1",
    title: "Módulo 1 - Introdução ao Autismo",
    topics: [
      { id: "1-1", title: "O Transtorno do Espectro Autista (TEA)", completed: false },
      { id: "1-2", title: "Os Mitos e Verdades", completed: false },
      { id: "1-3", title: "As Diversidades Dentro do Espectro", completed: false },
    ],
  },
  {
    id: "2",
    title: "Módulo 2 - Identificação e Sinais",
    topics: [
      { id: "2-1", title: "Os Sinais Precoces em Crianças", completed: false },
      { id: "2-2", title: "As Diferenças Entre Idades", completed: false },
      { id: "2-3", title: "E Quando Procurar Ajuda?", completed: false },
    ],
  },
  {
    id: "3",
    title: "Módulo 3 - Comunicação e Comportamento",
    topics: [
      { id: "3-1", title: "Comunicação Verbal e Não-verbal", completed: false },
      { id: "3-2", title: "Crises (Meltdowns) vs Birras", completed: false },
      { id: "3-3", title: "Estratégias Práticas do Dia a Dia", completed: false },
    ],
  },
  {
    id: "4",
    title: "Módulo 4 - Intervenções e Terapias",
    topics: [
      { id: "4-1", title: "ABA, Fonoaudiologia, Terapia Ocupacional", completed: false },
      { id: "4-2", title: "Como Escolher Abordagens", completed: false },
      { id: "4-3", title: "Papel da Família", completed: false },
    ],
  },
  {
    id: "5",
    title: "Módulo 5 - Inclusão a Escola",
    topics: [
      { id: "5-1", title: "Adaptação Escolar", completed: false },
      { id: "5-2", title: "Direitos Legais (Importantes no Brasil)", completed: false },
      { id: "5-3", title: "Relação com Professores", completed: false },
    ],
  },
];

export const SLIDES_COUNT: { [key: string]: number } = {
  "1-1": 5, "1-2": 5, "1-3": 5,
  "2-1": 5, "2-2": 5, "2-3": 5,
  "3-1": 5, "3-2": 5, "3-3": 5,
  "4-1": 5, "4-2": 5, "4-3": 5,
  "5-1": 5, "5-2": 5, "5-3": 5,
};

export const TOTAL_COURSE_SLIDES = 75;

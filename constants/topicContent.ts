export interface SlideContent {
  title: string;
  content: string;
  icon: string;
}

export const TOPIC_CONTENT: { [key: string]: SlideContent[] } = {
  // MÓDULO 1 - INTRODUÇÃO AO AUTISMO
  "1-1": [
    {
      title: "1. O que é TEA?",
      content: "O Transtorno do Espectro Autista (TEA) é uma condição do neurodesenvolvimento. Afeta principalmente a forma como a pessoa se comunica, interage socialmente e percebe o mundo. Não é uma doença, mas uma condição permanente. Cada pessoa com TEA apresenta características únicas, com diferentes níveis de suporte.",
      icon: "brain"
    },
    {
      title: "2. Comunicação Social",
      content: "Pessoas com TEA podem ter dificuldades na comunicação verbal e não verbal. Isso inclui:\n\n- Dificuldade em manter conversas\n- Pouco contato visual\n- Interpretação literal da linguagem (dificuldade com ironia ou metáforas)\n\nAlgumas pessoas podem não falar, enquanto outras se comunicam bem, mas com diferenças na interação social.",
      icon: "chatbubbles"
    },
    {
      title: "3. Padrões Repetitivos",
      content: "São comportamentos ou interesses repetitivos e restritos. Exemplos:\n\n- Movimentos repetitivos (balançar o corpo, bater mãos)\n- Rotinas rígidas (dificuldade com mudanças)\n- Interesse intenso por temas específicos\n\nEsses padrões ajudam na previsibilidade e no conforto da pessoa.",
      icon: "repeat"
    },
    {
      title: "4. Processamento Sensorial",
      content: "Pessoas com TEA podem ter sensibilidade diferente a estímulos sensoriais:\n\n- Sons altos podem incomodar muito\n- Luzes fortes ou piscantes podem causar desconforto\n- Texturas podem ser desagradáveis ou muito atraentes\n\nEssa sensibilidade pode ser maior (hipersensibilidade) ou menor (hipossensibilidade).",
      icon: "volume-high"
    },
    {
      title: "5. Espectro",
      content: "O termo “espectro” indica que o autismo varia em intensidade e características. Não existe um único tipo de autismo. Cada pessoa apresenta:\n\n- Diferentes habilidades\n- Diferentes desafios\n- Diferente necessidade de apoio\n\nPor isso, o TEA é compreendido como um conjunto amplo de perfis, não um padrão único.",
      icon: "color-palette"
    },
  ],
  "1-2": [
    { title: "Autismo é uma doença?", content: "FALSO. O autismo é uma diferença neurológica, não uma doença. Não existe 'cura', mas sim suporte e compreensão.", icon: "medical" },
    { title: "O Autismo é Causado por Vacinas?", content: "FALSO. Origem genética e neurobiológica, não relacionado a vacinas. Diversos estudos científicos já comprovaram isso.", icon: "shield-checkmark" },
    { title: "Os Pais são culpados?", content: "FALSO. Não é causado por criação ou comportamento dos pais. Antigamente existia a teoria das 'mães geladeira', que foi totalmente refutada.", icon: "people" },
    { title: "Cada pessoa é única?", content: "VERDADEIRO. Cada autista tem suas próprias forças e desafios. Conhecer um autista significa conhecer apenas UM autista.", icon: "person" },
    { title: "Pode ser diagnosticado?", content: "VERDADEIRO. Com avaliação profissional especializada. O diagnóstico precoce é fundamental para o desenvolvimento.", icon: "checkmark-circle" },
  ],
  "1-3": [
    {
      title: "Diversidade no Espectro",
      content: "O TEA não é igual para todos. Existe uma grande variação de habilidades, desafios e necessidades de apoio. Algumas pessoas precisam de suporte constante; outras têm autonomia. Compreender essa diversidade evita generalizações e melhora o cuidado.",
      icon: "people-circle"
    },
    {
      title: "Autismo Aparente",
      content: "Nem sempre o autismo é visível. Algumas pessoas não apresentam sinais evidentes no primeiro contato, mas ainda enfrentam dificuldades internas, como sobrecarga sensorial ou esforço para interagir socialmente. Ausência de sinais externos não significa ausência de desafios.",
      icon: "eye"
    },
    {
      title: "Forças Específicas",
      content: "Muitas pessoas com TEA desenvolvem habilidades marcantes, como atenção a detalhes, memória, foco intenso e pensamento lógico. Identificar e estimular essas forças favorece o desenvolvimento pessoal e profissional.",
      icon: "star"
    },
    {
      title: "Aceitação",
      content: "Aceitar o autismo é reconhecer a condição sem tentar “corrigir” a pessoa. Envolve respeito às diferenças, compreensão das necessidades e valorização da individualidade. A aceitação reduz barreiras emocionais e sociais.",
      icon: "heart"
    },
    {
      title: "Inclusão",
      content: "Inclusão é adaptar ambientes e atitudes para garantir participação real. Isso inclui ajustes na escola, no trabalho e na sociedade, como comunicação clara, redução de estímulos excessivos e respeito ao ritmo da pessoa. Inclusão não é apenas permitir acesso, mas garantir pertencimento.",
      icon: "hand-left"
    },
  ],
  "2-1": [
    {
      title: "1. Sinais Precoces",
      content: "Os primeiros sinais do TEA podem aparecer nos primeiros anos de vida. É importante observar atrasos ou diferenças no desenvolvimento, principalmente na comunicação, interação social e comportamento.\n\nExemplos:\n- Pouco contato visual\n- Não responder ao nome\n- Falta de interesse em interagir\n\nA identificação precoce permite intervenções mais eficazes.",
      icon: "eye-off"
    },
    {
      title: "2. Ausência de Balbucio",
      content: "Balbucio são os primeiros sons que o bebê emite, como “ba-ba”, “da-da”, geralmente entre 6 e 12 meses.\n\nA ausência ou redução desses sons pode indicar atraso no desenvolvimento da comunicação e deve ser observada com atenção.",
      icon: "mic-off"
    },
    {
      title: "3. Comportamentos Repetitivos",
      content: "Incluem ações repetidas ou padrões fixos, como:\n\n- Balançar o corpo\n- Girar objetos\n- Repetir palavras ou frases\n\nEsses comportamentos podem ajudar na autorregulação e trazer sensação de segurança.",
      icon: "refresh"
    },
    {
      title: "4. Interesses Intensos",
      content: "A pessoa pode demonstrar forte interesse por temas específicos, dedicando muito tempo e foco a eles.\n\nExemplos:\n- Fascínio por números, objetos ou assuntos específicos\n- Interesse profundo e detalhado em um tema\n\nEsses interesses podem ser usados de forma positiva no aprendizado e desenvolvimento.",
      icon: "bulb"
    },
    {
      title: "5. Sensibilidade Sensorial",
      content: "No TEA, a percepção sensorial pode ser diferente, ocorrendo de duas formas:\n\n- Hipersensibilidade (excesso): sons, luzes, cheiros ou toques podem causar desconforto intenso.\n- Hipossensibilidade (referencia): a pessoa pode buscar estímulos mais fortes ou não reagir a dor como esperado.\n\nExemplos comuns:\n- Incômodo com barulhos altos\n- Rejeição a certas roupas ou texturas\n- Fascínio por luzes ou movimentos repetitivos",
      icon: "volume-high"
    },
  ],
  "2-2": [
    {
      title: "Bebês (0–2 anos)",
      content: "Os sinais aparecem principalmente na comunicação e interação inicial.\n\n- Pouco ou nenhum balbucio\n- Contato visual reduzido\n- Não responde ao nome\n- Pouco interesse em interagir\n\nA observação nessa fase é essencial para identificação precoce.",
      icon: "happy-outline"
    },
    {
      title: "Crianças Pequenas (2–5 anos)",
      content: "As diferenças ficam mais evidentes no comportamento e na linguagem.\n\n- Atraso na fala ou fala diferente do esperado\n- Dificuldade em brincar de forma simbólica\n- Comportamentos repetitivos mais frequentes\n- Resistência a mudanças na rotina",
      icon: "game-controller-outline"
    },
    {
      title: "Idade Escolar (6–12 anos)",
      content: "As dificuldades sociais e de adaptação ganham destaque.\n\n- Dificuldade em fazer e manter amizades\n- Interpretação literal da linguagem\n- Desafios com regras sociais e trabalho em grupo\n- Possíveis interesses restritos mais intensos",
      icon: "school-outline"
    },
    {
      title: "Adolescentes (13–17 anos)",
      content: "A fase envolve maior complexidade social e emocional.\n\n- Dificuldade em compreender relações sociais mais complexas\n- Possível aumento de ansiedade ou isolamento\n- Busca por identidade e autonomia\n- Consciência das próprias diferenças",
      icon: "person-outline"
    },
    {
      title: "Adulto (18+ anos)",
      content: "As características permanecem, mas podem ser melhor gerenciadas.\n\n- Desafios em ambientes sociais e profissionais\n- Necessidade de adaptação no trabalho\n- Maior autonomia em alguns casos\n- Desenvolvimento de estratégias próprias para lidar com dificuldades\n\nO suporte ao longo das fases da vida é fundamental para promover qualidade de vida e inclusão.",
      icon: "briefcase-outline"
    },
  ],
  "2-3": [
    {
      title: "1. Observe",
      content: "A observação contínua permite identificar padrões de comportamento e possíveis sinais de alerta. Quanto mais cedo as diferenças forem percebidas, mais rápido é possível agir de forma adequada.",
      icon: "eye-outline"
    },
    {
      title: "2. Consulte profissionais",
      content: "Profissionais especializados (como pediatras, psicólogos ou neuropediatras) têm conhecimento técnico para avaliar o desenvolvimento. A orientação correta evita interpretações erradas e direciona os próximos passos.",
      icon: "medkit-outline"
    },
    {
      title: "3. Avaliação completa",
      content: "O diagnóstico do TEA não é baseado em um único fator. Uma avaliação completa analisa comportamento, comunicação, histórico e desenvolvimento. Isso garante maior precisão e evita conclusões superficiais.",
      icon: "search-outline"
    },
    {
      title: "4. Quanto antes, melhor",
      content: "A intervenção precoce aumenta as chances de desenvolvimento em áreas como comunicação, socialização e autonomia. Agir cedo potencializa resultados a longo prazo.",
      icon: "time-outline"
    },
    {
      title: "5. Apoio adequado",
      content: "Cada pessoa no espectro tem necessidades diferentes. O suporte adequado (terapias, adaptações e acompanhamento) melhora a qualidade de vida e favorece o desenvolvimento individual.",
      icon: "heart-half-outline"
    },
  ],
  "3-1": [
    {
      title: "Comunicação Verbal",
      content: "Pode variar de ausência de fala até linguagem fluente. Algumas pessoas apresentam atraso, ecolalia (repetição de palavras) ou uso diferente da linguagem. Compreender esse perfil evita exigir padrões inadequados e permite estimular a comunicação de forma funcional.",
      icon: "chatbubble-outline"
    },
    {
      title: "Comunicação Não-Verbal",
      content: "Inclui gestos, expressões faciais, contato visual e linguagem corporal. Muitas pessoas com TEA utilizam ou interpretam esses sinais de forma diferente. Valorizar essa forma de comunicação amplia o entendimento e reduz falhas na interação.",
      icon: "hand-right-outline"
    },
    {
      title: "Sistemas Alternativos",
      content: "São recursos usados quando a fala é limitada ou ausente, como figuras (PECS), aplicativos ou dispositivos de comunicação. Esses sistemas permitem que a pessoa se expresse, reduzindo frustração e aumentando a autonomia.",
      icon: "tablet-landscape-outline"
    },
    {
      title: "Comunicação Clara",
      content: "Mensagens diretas e objetivas facilitam a compreensão. Evitar ambiguidades, ironias ou metáforas ajuda, pois muitas pessoas no espectro interpretam a linguagem de forma literal.",
      icon: "text-outline"
    },
    {
      title: "Tempo para processar",
      content: "Pessoas com TEA podem precisar de mais tempo para compreender e responder. Respeitar esse tempo evita pressão, melhora a qualidade da resposta e torna a comunicação mais eficaz.",
      icon: "hourglass-outline"
    },
  ],
  "3-2": [
    {
      title: "O que é Meltdown?",
      content: "É uma reação intensa a sobrecarga emocional ou sensorial. Ocorre quando a pessoa perde a capacidade de se autorregular naquele momento. Não é voluntário nem controlado conscientemente.",
      icon: "flame-outline"
    },
    {
      title: "Sinais de Meltdown",
      content: "Podem variar, mas geralmente incluem:\n\n- Choro intenso ou gritos\n- Agitação ou movimentos repetitivos aumentados\n- Tentativa de fugir ou se isolar\n- Dificuldade de comunicação\n\nEsses sinais indicam que a pessoa está sobrecarregada.",
      icon: "warning-outline"
    },
    {
      title: "Diferença da Birra",
      content: "Birra costuma ter objetivo (ex: conseguir algo) e pode cessar com negociação ou mudança de atenção.\n\nMeltdown não tem intenção de manipular; é uma resposta involuntária ao excesso de estímulos ou estresse.",
      icon: "git-compare-outline"
    },
    {
      title: "Como ajudar",
      content: "Como agir em momentos de crise:\n\n- Reduzir estímulos (barulho, luz, pessoas)\n- Manter calma e falar pouco, de forma clara\n- Oferecer um espaço seguro\n- Evitar confrontos ou punições\n\nO foco é ajudar a pessoa a se regular.",
      icon: "hand-left-outline"
    },
    {
      title: "Prevenção",
      content: "Estratégias preventivas:\n\n- Identificar gatilhos (sons, ambientes, mudanças)\n- Manter rotina previsível\n- Preparar para mudanças com antecedência\n- Respeitar limites sensoriais\n\nA prevenção reduz a frequência e intensidade dos episódios.",
      icon: "shield-checkmark-outline"
    },
  ],
  "3-3": [
    {
      title: "Rotina e previsibilidade",
      content: "Estruturas claras reduzem incerteza e ansiedade. Antecipar atividades e manter horários estáveis facilita a compreensão do que vai acontecer e melhora a adaptação a tarefas e mudanças.",
      icon: "calendar-outline"
    },
    {
      title: "Regulação sensorial",
      content: "Ajustar o ambiente (luz, som, estímulos) e oferecer estratégias (pausas, objetos sensoriais) ajuda a manter o equilíbrio. Isso reduz sobrecarga e melhora atenção, comportamento e bem-estar.",
      icon: "headset-outline"
    },
    {
      title: "Elogio positivo",
      content: "Reforçar comportamentos adequados aumenta a probabilidade de repetição. O elogio deve ser específico e imediato, destacando exatamente o que foi bem feito.",
      icon: "thumbs-up-outline"
    },
    {
      title: "Escolhas",
      content: "Oferecer opções controladas (ex: “quer fazer A ou B?”) promove autonomia e reduz resistência. A pessoa se sente mais segura ao participar das decisões.",
      icon: "list-outline"
    },
    {
      title: "Paciência e empatia",
      content: "Respeitar o tempo e as dificuldades individuais melhora a comunicação e o vínculo. A empatia permite interpretar comportamentos como expressão de necessidades, não como desobediência.",
      icon: "heart-circle-outline"
    },
  ],
  "4-1": [
    {
      title: "Análise do Comportamento (ABA)",
      content: "ABA (Applied Behavior Analysis) é uma abordagem baseada em evidências que analisa a relação entre comportamento e ambiente. Identifica antecedentes e consequências para ensinar habilidades (comunicação, autonomia) e reduzir comportamentos que dificultam o dia a dia. Utiliza metas claras, reforço positivo e acompanhamento de dados.",
      icon: "analytics-outline"
    },
    {
      title: "Fonoaudiologia",
      content: "Atua na comunicação e na linguagem (compreensão e expressão), além de aspectos como articulação e pragmática (uso social da linguagem). Ajuda a ampliar formas de se comunicar, incluindo, quando necessário, recursos alternativos.",
      icon: "mic-outline"
    },
    {
      title: "Terapia Ocupacional",
      content: "Foca na funcionalidade nas atividades diárias (alimentação, vestir-se, escola, lazer). Trabalha coordenação, planejamento motor, adaptação de tarefas e organização da rotina, promovendo maior independência.",
      icon: "body-outline"
    },
    {
      title: "Terapia da fala",
      content: "Intervenção específica para desenvolvimento da fala: produção de sons, fluência, ritmo e clareza. Complementa a fonoaudiologia quando há dificuldades na articulação ou inteligibilidade da fala.",
      icon: "chatbox-outline"
    },
    {
      title: "Integração Sensorial",
      content: "Abordagem da terapia ocupacional que trabalha a forma como o cérebro processa estímulos (som, luz, toque, movimento). Utiliza atividades estruturadas para melhorar a modulação sensorial, reduzindo sobrecarga e favorecendo atenção e participação.",
      icon: "pulse-outline"
    },
  ],
  "4-2": [
    {
      title: "Avalie necessidades",
      content: "A escolha de abordagens deve partir de uma avaliação individual. Identificar dificuldades, habilidades e objetivos permite selecionar intervenções adequadas e evitar estratégias genéricas.",
      icon: "search-outline"
    },
    {
      title: "Equipe multidisciplinar",
      content: "O TEA envolve diferentes áreas (comunicação, comportamento, sensorial, motor). Uma equipe com profissionais diversos garante uma visão completa e intervenções complementares.",
      icon: "people-outline"
    },
    {
      title: "Baseado em evidências",
      content: "Priorizar métodos com comprovação científica aumenta a eficácia e reduz o risco de intervenções ineficazes. Decisões devem ser guiadas por resultados validados.",
      icon: "checkmark-done-outline"
    },
    {
      title: "Personalizado",
      content: "Cada pessoa no espectro é única. As abordagens precisam ser adaptadas ao perfil, respeitando ritmo, interesses e necessidades específicas.",
      icon: "person-circle-outline"
    },
    {
      title: "Consistência",
      content: "A aplicação contínua das estratégias é essencial para resultados. Repetição, rotina e alinhamento entre família, escola e profissionais reforçam o aprendizado e a evolução.",
      icon: "sync-outline"
    },
  ],
  "4-3": [
    {
      title: "Papel dos pais",
      content: "Os pais são mediadores do desenvolvimento no dia a dia. Aplicam estratégias em casa, observam comportamentos e reforçam habilidades. A consistência familiar potencializa os resultados das intervenções.",
      icon: "home-outline"
    },
    {
      title: "Aprendizado contínuo",
      content: "O conhecimento sobre TEA evolui e cada fase da vida traz novas demandas. Buscar informação atualizada permite ajustar estratégias e tomar decisões mais eficazes.",
      icon: "book-outline"
    },
    {
      title: "Suporte emocional",
      content: "Ambiente seguro e acolhedor reduz ansiedade e favorece a autorregulação. Validação emocional e previsibilidade ajudam na adaptação e no engajamento.",
      icon: "heart-outline"
    },
    {
      title: "Comunicação com profissional",
      content: "Troca frequente com a equipe garante alinhamento de objetivos e estratégias. Relatar progressos e dificuldades permite ajustes mais precisos nas intervenções.",
      icon: "chatbubbles-outline"
    },
    {
      title: "Autocuidado",
      content: "Cuidar de si evita sobrecarga e melhora a qualidade do cuidado oferecido. Pais descansados e apoiados conseguem manter consistência, paciência e clareza nas ações.",
      icon: "fitness-outline"
    },
  ],
  "5-1": [
    {
      title: "Preparação",
      content: "Antecipar a rotina escolar (horários, regras, espaços) reduz incerteza e ansiedade. Visitas prévias, apresentação de professores e materiais facilitam a transição e aumentam a previsibilidade.",
      icon: "school-outline"
    },
    {
      title: "Histórias sociais",
      content: "São narrativas curtas e objetivas que descrevem situações e comportamentos esperados. Ajudam a compreender o que vai acontecer e como agir, melhorando a adaptação a contextos sociais.",
      icon: "book-outline"
    },
    {
      title: "Plano de Adaptação",
      content: "Documento com objetivos, estratégias e ajustes individualizados (ex: tempo extra, instruções simplificadas). Garante que a escola atenda às necessidades específicas do aluno.",
      icon: "document-text-outline"
    },
    {
      title: "Ambiente estruturado",
      content: "Organização clara de espaço e rotina (sinalizações, etapas visuais, regras explícitas) facilita a compreensão e reduz distrações, favorecendo o aprendizado.",
      icon: "grid-outline"
    },
    {
      title: "Acompanhamento",
      content: "Monitorar continuamente o progresso permite ajustar estratégias. A comunicação entre escola, família e profissionais assegura intervenções consistentes e eficazes.",
      icon: "eye-outline"
    },
  ],
  "5-2": [
    {
      title: "Lei Berenice Piana",
      content: "Lei nº 12.764/2012: Estabelece a Política Nacional de Proteção dos Direitos da Pessoa com TEA e reconhece o autismo como deficiência para todos os efeitos legais. Isso garante acesso a saúde, educação e assistência, além de vedar discriminação.",
      icon: "document-text-outline"
    },
    {
      title: "Lei de Inclusão",
      content: "Lei Brasileira de Inclusão nº 13.146/2015: Define direitos amplos, incluindo acessibilidade, educação inclusiva e participação social. Obriga instituições a promover adaptações razoáveis e elimina barreiras de acesso.",
      icon: "shield-checkmark-outline"
    },
    {
      title: "Direitos Educacionais",
      content: "Asseguram matrícula em escola regular, sem recusa, e suporte adequado (como adaptações pedagógicas e, quando necessário, acompanhante). Garantem igualdade de oportunidades no aprendizado.",
      icon: "school-outline"
    },
    {
      title: "Documentação",
      content: "Laudos e relatórios profissionais formalizam o diagnóstico e as necessidades da pessoa. São instrumentos fundamentais para acessar direitos, benefícios e serviços especializados.",
      icon: "folder-open-outline"
    },
    {
      title: "Defesa dos Direitos",
      content: "Envolve conhecer e reivindicar os direitos garantidos por lei. Pode incluir diálogo com instituições, registro de reclamações e busca de apoio legal para assegurar inclusão e respeito.",
      icon: "ribbon-outline"
    },
  ],
  "5-3": [
    {
      title: "Comunicação clara e objetiva",
      content: "Troca de informações direta entre professor e aluno reduz ambiguidades. Instruções simples e específicas facilitam a compreensão e a execução das atividades.",
      icon: "chatbubbles-outline"
    },
    {
      title: "Conhecimento do perfil do aluno",
      content: "Compreender as características, interesses e dificuldades permite adaptar estratégias de ensino. Isso torna o aprendizado mais eficiente e reduz barreiras.",
      icon: "person-outline"
    },
    {
      title: "Adaptação de estratégias",
      content: "Uso de recursos visuais, divisão de tarefas e flexibilização de atividades ajudam na participação e no desempenho acadêmico.",
      icon: "create-outline"
    },
    {
      title: "Rotina e previsibilidade",
      content: "Manter uma estrutura organizada e antecipar mudanças diminui ansiedade e melhora o engajamento do aluno em sala de aula.",
      icon: "calendar-outline"
    },
    {
      title: "Parceria com família e equipe",
      content: "Alinhamento com responsáveis e profissionais garante consistência nas estratégias e acompanhamento adequado do desenvolvimento.",
      icon: "handshake-outline"
    },
  ],
};

window.CASE_1 = {
  id: "case1",
  title: "CASO 01 — EVIDÊNCIA ZERO",
  tagline:
    "Todo álibi perfeito esconde uma verdade inconveniente. Todo assassinato limpo deixa um fio solto.",

  cover: {
    image: "./assets/cases/case1-cover.png",
    headline: "EVIDÊNCIA ZERO",
    intro:
      "Henrique Valença morreu às 22:41h. Ou talvez não. O relógio parou, mas o tempo continuou mentindo. Em um apartamento impecável demais para ser real, uma única pergunta ecoa: quando um álibi é tão perfeito, o que ele está escondendo?",
  },

  people: ["livia", "sofia", "bruno", "camila", "jonas", "eduardo"],

  // ✅ locations continua sendo SÓ uma lista de lugares (id + name)
  locations: [
    {
      id: "apt-vitima",
      name: "Apartamento da Vítima",
      node: "scene",
      image: "./assets/evidence/apt-vitima.png",
      atmosphere:
        "Interior limpo demais, organização encenada, tempo como assinatura.",
    },
    {
      id: "corredor-servico",
      name: "Corredor de Serviço",
      node: "camera",
      image: "./assets/locations/corredor-servico.png",
      atmosphere: "Setor técnico, ângulo incompleto, câmera 12-B.",
    },
    {
      id: "garagem-leste",
      name: "Garagem Leste",
      node: "garage",
      image: "./assets/locations/garagem-leste.png",
      atmosphere:
        "Entrada lateral, cobertura falha, rota sem registro completo.",
    },
    {
      id: "portaria",
      name: "Portaria",
      node: "doorman",
      image: "./assets/locations/portaria.png",
      atmosphere: "Controle humano, troca de turno, permissividade.",
    },
    {
      id: "clinica",
      name: "Clínica Santa Helena",
      node: "clinic",
      image: "./assets/locations/clinica.png",
      atmosphere: "Ambiente clínico, papelada médica, rastros formais.",
    },
    {
      id: "escritorio",
      name: "Valença & Irmão",
      node: "office2",
      image: "./assets/locations/escritorio.png",
      atmosphere: "Burocracia, contratos, morte como cláusula.",
    },
  ],

  evidences: ["ev-1", "ev-2", "ev-3"],

  crime: {
    headline: "A morte não foi rápida. Foi controlada.",
    time: "22:41",
    summary:
      "Sedação leve para reduzir resistência. Estrangulamento eficiente, sem luta. A cena foi editada — não aconteceu por impulso.",
    details: [
      "Laudo preliminar: asfixia mecânica (estrangulamento) + sedação leve.",
      "Sem sinais de luta. Sem bagunça. Sem pressa.",
      "Arma provável: garrote improvisado; detalhe metálico reflete luz às 22:41.",
      "22:37–22:49: intervalo crítico onde o sistema perde pedaços (tempo apagado).",
    ],
    image: "./assets/evidence/autopsy-report.png",
    caption:
      "Quando o método é limpo, alguém teve tempo — e acesso a esse tempo.",
  },

  motives: {
    livia: {
      surface: "Ciúmes e ressentimento corporativo.",
      real: "Reputação e controle: Henrique ameaçava expor acordos e reverter poder.",
      gains: [
        "Silêncio definitivo",
        "Controle da narrativa",
        "Eliminação de risco reputacional",
      ],
      crimeStyle: ["planejado", "distanciado", "terceirizado"],
    },
    sofia: {
      surface: "Nenhum (apenas testemunha).",
      real: "Medo e autopreservação: aceitaria roteiro para continuar invisível.",
      gains: ["Proteção", "Não virar alvo"],
      crimeStyle: ["omissão", "distorção", "silêncio"],
    },
    bruno: {
      surface: "Herança, seguro, controle da empresa.",
      real: "Poder e sucessão: Henrique virou gargalo; morte resolve disputa sem negociação.",
      gains: ["Controle total", "Seguro", "Fim da instabilidade"],
      crimeStyle: ["planejado", "terceirizado", "financeiro"],
    },
    camila: {
      surface: "Funcionária sem motivo aparente.",
      real: "Sobrevivência e poder silencioso: controla tempo, acessos e versões.",
      gains: [
        "Proteção",
        "Manutenção do controle operacional",
        "Evitar virar bode expiatório",
      ],
      crimeStyle: ["coordenação", "logística", "apagamento indireto"],
    },
    jonas: {
      surface: "Suborno/corrupção.",
      real: "Controle do sistema: indispensável, conhece pontos cegos e o servidor.",
      gains: ["Manter status quo", "Proteger segredos", "Pagamento/benefício"],
      crimeStyle: ["execução técnica", "precisão", "apagão"],
    },
    eduardo: {
      surface: "Médico (sem motivo).",
      real: "Autoproteção: prescrição fora do padrão ou pressão de terceiros.",
      gains: ["Silêncio do paciente", "Evitar escândalo"],
      crimeStyle: ["facilitação", "negligência calculada", "cobertura"],
    },
  },

  weapons: [
    {
      id: "wp_garrote_wire",
      label: "ARMA A",
      name: "Garrote improvisado (fio + alça)",
      type: "estrangulamento",
      linkedTo: ["jonas"],
      image: "./assets/evidence/arma_a.png",
      description:
        "Instrumento fino compatível com marcas simétricas de laço. Execução limpa exige técnica e controle do ambiente.",
      truthScore: 10,
    },
    {
      id: "wp_silk_cord",
      label: "ARMA B",
      name: "Cordão de seda / acessório (disfarçado)",
      type: "estrangulamento",
      linkedTo: ["livia", "camila"],
      image: "./assets/evidence/arma_b.png",
      description:
        "Parece item pessoal (moda/decoração), mas pode funcionar como laço. Ideal para plantio de narrativa.",
    },
    {
      id: "wp_master_keychain",
      label: "ARMA C",
      name: "Chave mestra / chaveiro metálico (reflexo 22:41)",
      type: "facilitador",
      linkedTo: ["jonas"],
      image: "./assets/evidence/arma_c.png",
      description:
        "Acesso e mobilidade. O metal que brilha em frame é menos arma e mais assinatura de quem controla portas.",
    },
    {
      id: "wp_zolpidem_bottle",
      label: "ARMA D",
      name: "Frasco de zolpidem (dose baixa)",
      type: "sedacao",
      linkedTo: ["eduardo", "camila"],
      image: "./assets/evidence/arma_d.png",
      description:
        "Sedação prévia não mata, mas reduz resistência. A pergunta vira: quem tinha acesso ao sono de Henrique?",
    },
    {
      id: "wp_scripted_video",
      label: "ARMA E",
      name: "Vídeo retransmitido / álibi 'perfeito' (arquivo)",
      type: "narrativa",
      linkedTo: ["livia"],
      image: "./assets/evidence/arma_e.png",
      description:
        "Não mata o corpo — mata a investigação. Perfeição digital como arma para prender a culpa em alguém.",
    },
    {
      id: "wp_contracts_insurance",
      label: "ARMA F",
      name: "Contrato/Seguro (alteração 23 dias antes)",
      type: "motivacao",
      linkedTo: ["bruno"],
      image: "./assets/evidence/arma_f.png",
      description:
        "Não é arma física, é o gatilho do porquê. A morte como assinatura financeira.",
    },
  ],

  solutionPool: [
    {
      killer: "jonas",
      weapons: ["wp_garrote_wire", "wp_master_keychain"],
      motive: "real",
      requires: ["access-log", "autopsy-report"],
      logic:
        "Execução técnica durante apagão controlado. Jonas age como executor.",
    },
    {
      killer: "bruno",
      weapons: ["wp_garrote_wire", "wp_master_keychain"],
      motive: "real",
      requires: ["insurance-change", "access-log"],
      logic:
        "Bruno planeja, Jonas executa. Crime financeiro com braço operacional.",
    },
    {
      killer: "camila",
      weapons: ["wp_zolpidem_bottle", "wp_master_keychain"],
      motive: "real",
      requires: ["camila-schedule", "autopsy-report"],
      logic: "Camila coordena sedação e janela. Execução terceirizada.",
    },
    {
      killer: "eduardo",
      weapons: ["wp_zolpidem_bottle"],
      motive: "real",
      requires: ["sedative-prescription", "autopsy-report"],
      logic: "Sedação deliberada + negligência criminosa.",
    },
    {
      killer: "livia",
      weapons: ["wp_scripted_video"],
      motive: "surface",
      requires: ["livia-alibi-metadata"],
      logic:
        "Narrativa como arma. Não executa, mas tenta vencer a investigação.",
    },
  ],

  weapon: {
    id: "weapon-garrote",
    badge: "ARQUIVO — ARMA DO CRIME",
    title: "GARROTE IMPROVISADO",
    subtitle: "Corda/fio fino com detalhe metálico — controle, não impulso.",
    image: "./assets/evidence/weapon-garrote.png",
    summary:
      "O padrão das marcas cervicais sugere um instrumento estreito (corda/fio) aplicado de forma uniforme. A sedação prévia reduz resistência e elimina gritos, permitindo execução silenciosa e sem luta.",
    details: [
      "Marcas finas e simétricas: compatíveis com laço (não mãos).",
      "Força aplicada com constância: indica controle e técnica.",
      "Sedação leve antecede o ato: facilita imobilização e diminui reação.",
      "Possível componente metálico (anel/gancho/chave): reflexo em 22:41 sugere 'peça' no laço.",
    ],
    linkedKillerId: "jonas",
    confidence: "forte",
    evidence: {
      id: "weapon-garrote",
      title: "ARMA DO CRIME — Garrote improvisado",
      text: "Instrumento provável: corda/fio fino (garrote) com detalhe metálico. Sedação leve anterior sugere execução planejada e silenciosa.",
      weight: "forte",
      image: "./assets/evidence/weapon-garrote.png",
      caption: "Quando a morte é limpa, a arma não é força — é método.",
    },
    signature: {
      sedation: true,
      strangulation: true,
      noDefensiveInjuries: true,
      timeMarker: "22:41",
    },
  },

  victim: {
    name: "Henrique Valença",
    image: "./assets/characters/henrique.png",
    summary:
      "Empresário de sucesso, vida aparentemente ordenada. Mas debaixo do tapete persiano, a poeira nunca para de se mover.",
    epitaph:
      "Alguém o chamava de sócio. Outro, de irmão. Um terceiro, de amante. Mas naquela noite, todos o chamaram de problema.",
    notes: [
      "Seguro de vida milionário alterado 23 dias antes da morte.",
      "Dois celulares. Um para o mundo, outro para o que o mundo não podia saber.",
      "Agenda do último mês: buracos que não são esquecimento, são apagamentos.",
      "Laudo: morte por asfixia mecânica, mas primeiro veio o sono.",
      "Relógio parado em 22:41. A polícia diz acidente. Eu digo: assinatura.",
    ],
  },

  suspects: [
    {
      id: "livia",
      name: "Lívia Moreau",
      image: "./assets/characters/livia.png",
      role: "Acusada — Ex-sócia e amante",
      tags: ["Álibi digital", "Fria", "Controle absoluto"],
      bio: {
        who: "Ex-sócia estratégica de Henrique na Valença & Irmão. Inteligência fria, discurso treinado e uma reputação construída para não depender de ninguém.",
        relation:
          "Foi amante e parceira de negócios. Henrique conhecia o lado íntimo dela — e ela conhecia as rotinas, acessos e fraquezas do prédio.",
        motive:
          "Henrique ameaçava expor um acordo antigo e reverter uma divisão societária. Para Lívia, reputação é capital — e capital não sangra em público.",
        notes: [
          "Álibi digital impecável em 22:41.",
          "Quando pressionada, troca emoção por precisão.",
          "Evita falar de Camila — como se fosse um assunto perigoso.",
        ],
      },
    },
    {
      id: "sofia",
      name: "Sofia Klein",
      image: "./assets/characters/sofia.png",
      role: "Testemunha ocular — Vizinha",
      tags: ["Detalhes demais", "Memória ensaiada"],
      bio: {
        who: "Vizinha do andar de cima. Observadora, ansiosa e socialmente 'inofensiva' — o tipo de pessoa que sabe de tudo porque ninguém a leva a sério.",
        relation:
          "Via Henrique com frequência no elevador e nos corredores. Conhece padrões do prédio e reconhece rostos (e horários) melhor do que deveria.",
        motive:
          "Sofia não quer ser protagonista. Quer segurança. Se alguém a pressionou, ela pode ter aceitado um roteiro para continuar sendo 'só uma vizinha'.",
        notes: [
          "Lembra de detalhes com precisão desconfortável.",
          "Muda o tom quando você mostra provas (como frame 12-B).",
          "Tende a se contradizer quando há 'ruído' na investigação.",
        ],
      },
    },
    {
      id: "bruno",
      name: "Bruno Valença",
      image: "./assets/characters/bruno.png",
      role: "Irmão e sócio",
      tags: ["Herdeiro", "Luto eficiente", "Controle financeiro"],
      bio: {
        who: "Irmão mais novo e sócio majoritário na Valença & Irmão. Aparência impecável, fala medida. Sempre parece dois passos à frente — e um sentimento atrás.",
        relation:
          "Irmão e parceiro de negócios. Conhecia a rotina, os conflitos e os segredos corporativos de Henrique. Tinha acesso indireto a contratos, advogados e decisões sensíveis.",
        motive:
          "Dinheiro, poder, sobrevivência da empresa — e o tipo de inveja que não faz barulho. Se a morte resolve uma disputa, ela vira solução, não tragédia.",
        notes: [
          "Evita detalhes e terceiriza responsabilidade (“jurídico”, “contabilidade”).",
          "Faz perguntas de volta para medir o que você sabe.",
          "Quanto mais prova você tem, mais ele tenta reduzir tudo a burocracia.",
        ],
      },
    },
    {
      id: "camila",
      name: "Camila Rios",
      image: "./assets/characters/camila.png",
      role: "Assistente executiva",
      tags: ["Agenda", "Controle de horários", "Acesso a sistemas"],
      bio: {
        who: "Assistente executiva de Henrique Valença. Organiza a vida dele como quem administra um país: agendas, acessos, recados, rotas, prioridades. Não levanta a voz — levanta paredes.",
        relation:
          "Braço direito funcional. Sabe onde Henrique estava, com quem falou, o que assinou e o que tentou esconder. Às vezes, conhece mais o homem do que a própria família.",
        motive:
          "Lealdade comprada, medo bem administrado e o poder silencioso de quem controla o tempo dos outros. Se Henrique caiu, Camila podia estar se protegendo… ou cobrando uma dívida antiga.",
        notes: [
          "Responde com linguagem corporativa e frases curtas.",
          "Evita datas e horários — a menos que você prove que já sabe.",
          "Quando encurralada, ela 'coopera' oferecendo um alvo alternativo.",
        ],
      },
    },
    {
      id: "jonas",
      name: "Jonas Pacheco",
      image: "./assets/characters/jonas.png",
      role: "Chefe de segurança",
      tags: ["Acesso total", "Falhas convenientes", "Chaves e câmeras"],
      bio: {
        who: "Chefe de segurança do condomínio. Vinte anos de prédio, vinte anos de rotinas, vícios e atalhos. Fala como procedimento — e age como quem conhece os pontos cegos.",
        relation:
          "Conhecia Henrique por padrão de acesso: horários, visitas, reclamações, câmeras. A relação era 'institucional', mas institucional demais para quem sabe onde o servidor fica.",
        motive:
          "Dinheiro por fora, proteção de alguém de cima ou a velha lealdade corporativa de quem virou dono do sistema. Jonas não precisa matar: basta desligar o mundo por 12 minutos.",
        notes: [
          "Desvia com jargão técnico para parecer inquestionável.",
          "Quando encurralado, tenta te fazer sentir incompetente.",
          "Se a pressão sobe, ele oferece um bode expiatório (normalmente Lívia).",
        ],
      },
    },
    {
      id: "eduardo",
      name: "Dr. Eduardo Salles",
      image: "./assets/characters/eduardo.png",
      role: "Médico particular",
      tags: ["Sedativos", "Ética flexível", "Sigilo como escudo"],
      bio: {
        who: "Médico particular de Henrique Valença. Reputação impecável, ética 'adaptável'. Sabe que um prontuário pode salvar uma vida — ou destruir uma.",
        relation:
          "Acompanhava Henrique há anos, com consultas discretas e prescrições recorrentes para sono e ansiedade. Henrique confiava nele para dormir — e talvez para calar.",
        motive:
          "Medo de escândalo (prescrição fora do padrão), pressão de terceiros (quem paga também dita conduta) ou participação indireta: alguém usou seu nome/sistema para viabilizar a sedação.",
        notes: [
          "Responde com termos técnicos para controlar a conversa.",
          "Quando encurralado, se abriga no sigilo médico.",
          "Se você mostrar evidências, ele muda o tom: de superior para defensivo.",
        ],
      },
    },
  ],

  interviews: {
    livia: {
      title: "Entrevista — Lívia Moreau",
      intro:
        "Lívia responde como quem já ensaiou todas as possibilidades. O problema: perfeição costuma ter custo.",
      questions: [
        {
          id: "where2241",
          label: "Onde você estava às 22:41?",
          answers: [
            {
              when: { hasEvidence: ["livia-alibi-metadata"] },
              text: "Eu já te disse. Videochamada. Só que… você não veio aqui pra ouvir a versão bonita, né? Você viu os metadados. Então vamos pular o teatro: alguém retransmitiu. Não fui eu.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Em uma videochamada. Logs, duração, IP. Tudo está nos registros. Eu não tenho nada além da verdade — e da paciência.",
              effects: { certainty: 1, noise: 0 },
            },
          ],
        },

        {
          id: "relationship",
          label: "Qual era sua relação com Henrique Valença?",
          answers: [
            {
              when: { minCertainty: 4 },
              text: "Você já sabe o suficiente pra fazer essa pergunta desse jeito. Eu fui… próxima. Parceira, às vezes. Erro de cálculo, outras. Henrique colecionava pessoas como coleciona contratos.",
              effects: { certainty: 1, noise: 0 },
            },
            {
              when: { default: true },
              text: "Ex-sócios. Ponto. O resto é ruído que as pessoas adoram porque faz parecer que entendem alguma coisa.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "sedation",
          label: "O laudo fala em sedação leve. Você sabia de algo?",
          answers: [
            {
              when: {
                hasEvidence: ["autopsy-report", "sedative-prescription"],
              },
              text: "Sedação leve não aparece por acaso. E não é coisa de briga doméstica. Isso é… método. Se você tem o laudo e a prescrição, então sabe que a pergunta certa não é 'se aconteceu' — é 'quem tinha acesso'.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Sedação? Então não foi impulso. Quem fez isso queria controle. Eu não sou médica. Procure quem administra sono — não quem administra empresas.",
              effects: { certainty: 1, noise: 0 },
            },
            {
              when: { default: true },
              text: "Eu não tenho ideia do que você está falando. Se existe laudo, ele responde melhor do que eu.",
              effects: { certainty: 0, noise: 0 },
            },
          ],
        },

        {
          id: "camila",
          label: "E Camila Rios? O que ela era pra ele?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule"] },
              text: "A dona do tempo. Camila não organiza agendas — organiza versões. Se você viu mudança de horários, então sabe: alguém abriu uma janela e chamou isso de coincidência.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Assistente. E uma assistente competente sabe demais. Henrique gostava de gente útil — até o dia em que o útil vira ameaça.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "bruno",
          label: "Bruno ganhou algo com isso?",
          answers: [
            {
              when: { hasEvidence: ["insurance-change"] },
              text: "Você viu o seguro, né? Então não precisa que eu traduza. Luto eficiente é o tipo de coisa que se mede em assinaturas e silêncio.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Eu não acompanho finanças familiares. Mas Bruno sempre pareceu… interessado em resolver 'pendências'.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "threat",
          label: "Henrique te ameaçou antes de morrer?",
          answers: [
            {
              when: { maxNoise: 1, minCertainty: 3 },
              text: "Ele não ameaçava. Ele insinuava. Henrique era bom em fazer você se sentir culpado por coisas que ele mesmo inventou. Se isso é ameaça, então sim: ele me cercava com palavras.",
              effects: { certainty: 1, noise: 0 },
            },
            {
              when: { default: true },
              text: "Não. E se eu dissesse que sim, você faria uma história. Eu não dou histórias de graça.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },
      ],
    },

    sofia: {
      title: "Entrevista — Sofia Klein",
      intro:
        "Sofia fala com clareza demais. Às vezes, isso é memória. Às vezes, é roteiro.",
      questions: [
        {
          id: "whatSaw",
          label: "O que você viu exatamente?",
          answers: [
            {
              when: { hasEvidence: ["frame-12b"] },
              text: "Eu… eu vi alguém no corredor. Mas se você tem esse frame… então você já sabe que não era ela. Eu só não queria ser a pessoa que disse isso primeiro.",
              // ✅ depoimento forte, mas não “prova limpa”
              effects: { certainty: 2, noise: 1 },
            },
            {
              when: { default: true },
              text: "Uma silhueta. Alta. Ombros largos. Um reflexo metálico. Eu ouvi passos… e depois, silêncio.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "whereFrom",
          label: "De onde você viu? Exatamente onde estava?",
          answers: [
            {
              when: { hasEvidence: ["sofia-overdetail"] },
              text: "Eu estava… perto da minha porta. É que eu já contei isso tantas vezes que parece maior na minha cabeça. Talvez eu tenha… preenchido lacunas.",
              // ✅ “preencher lacunas” aumenta ruído
              effects: { certainty: 0, noise: 1 },
            },
            {
              when: { maxNoise: 1 },
              text: "No patamar do meu andar. Porta entreaberta. Eu não saí. Eu só ouvi e olhei. Eu juro.",
              effects: { certainty: 1, noise: 0 },
            },
            {
              when: { default: true },
              text: "Eu estava no meu andar. Perto da escada. Eu… eu não sei medir isso. Só sei que vi o suficiente pra ficar com medo.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "details",
          label: "Você lembra de detalhes demais. Por quê?",
          answers: [
            {
              when: { minCertainty: 4, maxNoise: 1 },
              text: "Porque eu reparo. Sempre reparei. E naquele dia… eu senti que precisava lembrar. Como se alguém fosse perguntar. Como se eu tivesse sido avisada.",
              // ✅ era “limpo demais” para uma fala. Mantém força, adiciona ruído leve.
              effects: { certainty: 2, noise: 1 },
            },
            {
              when: { default: true },
              text: "Eu não sei… minha cabeça fica repetindo as coisas. Eu lembro do reflexo, do som, do tempo. Não é teatro. É pânico.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "metal",
          label: "Esse reflexo metálico: era o quê?",
          answers: [
            {
              when: { hasEvidence: ["frame-12b"] },
              text: "No vídeo parece uma coisa no pescoço… mas eu pensei que fosse uma chave ou um crachá. Eu não consegui ver direito — eu só vi a luz bater e… pronto.",
              // ✅ “não consegui ver direito” → não pode ser prova limpa
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Algo pequeno. Um brilho rápido. Eu pensei em corrente… ou chave. Foi um segundo, detetive.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "heard",
          label: "Você ouviu algo além dos passos?",
          answers: [
            {
              when: { minCertainty: 3 },
              text: "Uma porta. Bem suave. Como se alguém soubesse exatamente como fechar sem fazer barulho. E depois… nada. Isso foi o pior.",
              // ✅ sensação forte, mas ainda depoimento
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Só passos e… um silêncio estranho. Não teve grito. Não teve briga. Foi como se a noite tivesse prendido a respiração.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "whyNow",
          label: "Por que você demorou pra contar isso?",
          answers: [
            {
              when: { maxNoise: 1, minCertainty: 3 },
              text: "Porque eu fiquei com medo. E porque… alguém me disse que eu podia 'estar confundindo'. Eu aceitei a sugestão. Foi mais fácil dormir assim.",
              // ✅ mantém forte, mas não “prova limpa”
              effects: { certainty: 2, noise: 1 },
            },
            {
              when: { default: true },
              text: "Porque eu não queria virar parte disso. Eu sou só uma vizinha. Eu tenho trabalho, vida… eu não queria que meu nome entrasse nessa história.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },
      ],
    },

    bruno: {
      title: "Entrevista — Bruno Valença",
      intro:
        "Bruno trata luto como contrato. A emoção entra em cláusula pequena.",
      questions: [
        {
          id: "insurance",
          label: "Por que o seguro foi alterado 23 dias antes?",
          answers: [
            {
              when: { hasEvidence: ["insurance-change"] },
              text: "Questões empresariais. Planejamento. Henrique era paranoico com sucessão. E eu estava apenas… sendo responsável.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Que seguro? Eu não acompanho detalhes, isso é com jurídico.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "relationship",
          label: "Como era sua relação com Henrique nas últimas semanas?",
          answers: [
            {
              when: { minCertainty: 4, maxNoise: 1 },
              text: "Tensa. Porque ele adiava decisões importantes. E eu… eu cansei de carregar a empresa nas costas enquanto ele guardava segredos como se fossem patrimônio.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Normal. Irmãos discutem. Só isso. Nada fora do comum.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "where2241",
          label: "Onde você estava às 22:41?",
          answers: [
            {
              when: { hasEvidence: ["access-log"] },
              text: "Em casa. E antes que você puxe os logs do prédio: eu não tenho acesso a isso. Quem mexe com registro é segurança. Não sou eu.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Em casa. Cheguei cedo. Eu não estava lá quando isso aconteceu.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "beneficiary",
          label: "Você era o principal beneficiário?",
          answers: [
            {
              when: { hasEvidence: ["insurance-change"] },
              text: "Se você está sugerindo algo, diga. Sim, eu era beneficiário. Porque eu era o sócio que ficaria com a responsabilidade. Isso não é crime, é consequência.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Eu não sei. Isso é com o jurídico. Você está misturando tragédia com burocracia.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "aboutLivia",
          label: "O que você acha da Lívia Moreau?",
          answers: [
            {
              when: { hasEvidence: ["livia-alibi-metadata"] },
              text: "Brilhante. Perigosa. E agora você está me dizendo que o álibi dela é… questionável. Interessante. Mas cuidado: gente assim não age sozinha.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Ela era um problema anunciado. Henrique insistiu nela. Eu não.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "aboutCamila",
          label: "Camila controlava a agenda dele. Ela era leal a quem?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule"] },
              text: "Camila era leal ao trabalho. E trabalho, detetive… às vezes significa lealdade a quem paga. Eu não vou acusar ninguém sem prova.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Camila era eficiente. Henrique gostava de gente eficiente.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "pressure",
          label: "Você pressionou Henrique para assinar alguma coisa?",
          answers: [
            {
              when: { minCertainty: 4 },
              text: "Eu pressionei por decisões. Não por morte. Se você nunca pressionou alguém, você nunca teve uma empresa.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Não. Isso é absurdo.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "finalMove",
          label:
            "Se eu te disser que isso foi planejado, o que você me responde?",
          answers: [
            {
              when: { hasEvidence: ["access-log", "autopsy-report"] },
              text: "Eu respondo que planejamento exige estrutura. E estrutura exige gente com acesso. Segurança. Agenda. Rotina. Você está olhando para o lugar certo… só talvez para a pessoa errada.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Eu respondo que você está dramatizando. Isso é uma investigação, não um romance.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },
      ],
    },

    camila: {
      title: "Entrevista — Camila Rios",
      intro:
        "Camila não reage: calcula. Como se cada frase tivesse sido aprovada por compliance.",
      questions: [
        {
          id: "schedule",
          label: "Sua agenda mudou entre 22:20 e 23:00. Por quê?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule"] },
              text: "Reagendamentos. Henrique mudava tudo em cima da hora. Você sabe como ele era. Só que… nessa noite… foi diferente. Eu não gosto de lacunas. E aquela janela virou uma lacuna.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Minha agenda é privada. Se a polícia quiser, peça judicial.",
              effects: { certainty: 0, noise: 2 },
            },
          ],
        },

        {
          id: "where2241",
          label: "Onde você estava às 22:41?",
          answers: [
            {
              when: { hasEvidence: ["access-log"] },
              text: "Não no prédio. E antes que você tente conectar isso ao apagão: eu não tenho acesso ao terminal da segurança. Quem tem é Jonas.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Trabalhando de casa. Henrique me acionou mais cedo. Depois… silêncio.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "relation",
          label: "Qual era sua relação real com Henrique?",
          answers: [
            {
              when: { minCertainty: 4, maxNoise: 2 },
              text: "Profissional. Mas Henrique… gostava de confundir limites. Ele achava que tudo era negociável. Eu não.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Eu era funcionária. Henrique era meu chefe. Apenas isso.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "access",
          label: "Você tinha acesso às senhas, e-mails e sistemas dele?",
          answers: [
            {
              when: { minNoise: 3 },
              text: "Você está tentando me pintar como hacker. Eu tinha acesso operacional — calendário, logística, autorização. Isso não é 'controle'. É trabalho.",
              effects: { certainty: 0, noise: 2 },
            },
            {
              when: { default: true },
              text: "Acesso operacional. Não administrativo. O suficiente para fazer a vida funcionar, não para apagar rastros.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "autopsy",
          label:
            "A perícia indica sedação antes do estrangulamento. Quem saberia disso na rotina dele?",
          answers: [
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Henrique tomava coisas para dormir quando estava sob pressão. Não é novidade. A diferença é: naquela noite, alguém garantiu que ele não acordasse a tempo de resistir.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Eu não sou médica. Eu organizo reuniões, não dosagens.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "jonas",
          label: "Jonas Pacheco: você confiava nele?",
          answers: [
            {
              when: { hasEvidence: ["access-log"] },
              text: "Confiar é uma palavra cara. Eu respeitava a utilidade dele. Jonas sabe onde a câmera não pega. Isso não é opinião, é arquitetura.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Ele fazia o trabalho dele. Eu fazia o meu.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "bruno",
          label: "Bruno tinha influência sobre você?",
          answers: [
            {
              when: { hasEvidence: ["insurance-change"] },
              text: "Bruno gosta de se apresentar como 'responsável'. Responsáveis sempre querem assinatura — e silêncio.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Ele era sócio. Eu reportava ao Henrique.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "livia",
          label: "E a Lívia? Ela seria capaz?",
          answers: [
            {
              when: { hasEvidence: ["livia-alibi-metadata"] },
              text: "Lívia é controle. Controle não combina com 'erro'. Se o álibi dela tem falhas, alguém mexeu. E quem mexe no digital… raramente suja as mãos.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Eu não comento vida pessoal do Henrique. Isso sempre dá problema.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "frame",
          label: "Uma câmera pegou uma silhueta às 22:41. Isso te surpreende?",
          answers: [
            {
              when: { hasEvidence: ["frame-12b"] },
              text: "Surpreende o fato de alguém ter sido visto. Quem faz isso direito não aparece. Então ou foi descuido… ou foi mensagem.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Câmeras pegam silhuetas. É o trabalho delas.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "threat",
          label: "Henrique temia alguém?",
          answers: [
            {
              when: { minCertainty: 5 },
              text: "Sim. Mas medo em Henrique não era pânico — era cálculo. Ele falava em 'blindagem', em 'remover riscos'. E pessoas, detetive… também viram risco.",
              effects: { certainty: 2, noise: 1 },
            },
            {
              when: { default: true },
              text: "Ele era paranoico com negócios. Isso não significa nada.",
              effects: { certainty: 1, noise: 1 },
            },
          ],
        },

        {
          id: "finalMove",
          label: "Você alterou algo em registros naquela noite?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule", "access-log"] },
              text: "Eu alterei agenda. Não log. O log… alguém quis que o tempo sumisse. Eu só… eu só tentei manter a empresa de pé quando o chão abriu.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Não.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },
      ],
    },

    jonas: {
      title: "Entrevista — Jonas Pacheco",
      intro:
        "Jonas fala como manual de segurança. A pergunta é: quem escreveu o manual.",
      questions: [
        {
          id: "blackout",
          label: "O sistema apagou 22:37–22:49. Coincidência?",
          answers: [
            {
              when: { hasEvidence: ["access-log"] },
              text: "Manutenção. Rotina. Você não entenderia a complexidade do sistema… mas entende de acusações, né?",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Falha técnica. Acontece. Raro, mas acontece.",
              effects: { certainty: 0, noise: 2 },
            },
          ],
        },

        {
          id: "serverAccess",
          label:
            "Quem tem acesso físico ao servidor e ao terminal de segurança?",
          answers: [
            {
              when: { hasEvidence: ["access-log"], minCertainty: 3 },
              text: "Acesso físico é controlado. Eu e mais uma pessoa autorizada. Mas você sabe como é: autorização não é confissão.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Equipe de segurança e administração. É padrão. Nada fora do comum.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "frame12b",
          label:
            "A câmera 12-B registrou uma silhueta às 22:41. Você viu isso?",
          answers: [
            {
              when: { hasEvidence: ["frame-12b"] },
              text: "Eu vi muita coisa em vinte anos. Silhueta não é pessoa. Reflexo não é prova. Você quer um nome… eu tenho rotinas.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Câmeras registram sombras. Sem identificação, é só ruído visual.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "blindSpots",
          label: "Por que a câmera 12-B cobre só 80% do corredor?",
          answers: [
            {
              when: { minCertainty: 4 },
              text: "Infraestrutura. Ângulo. Custo. Você não monta um prédio pensando em crime — monta pensando em morador reclamando de taxa.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Limitação técnica. Nada é 100%.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "henriqueRoutine",
          label: "Você conhecia a rotina do Henrique?",
          answers: [
            {
              when: { minNoise: 3 },
              text: "Eu conheço a rotina de todo mundo que acha que não tem rotina. Henrique era previsível: horários certos, visitas certas, pressa certa.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Eu conhecia o padrão de acesso. É meu trabalho.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "sedation",
          label:
            "A perícia sugere sedação antes do estrangulamento. Isso muda algo?",
          answers: [
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Sedação não é assunto de segurança. Mas se você me pergunta: crime planejado costuma vir com apagão — de corpo ou de câmera.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Não é comigo.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "camila",
          label: "Camila alterou agenda entre 22:20–23:00. Você falou com ela?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule"] },
              text: "Camila fala com todo mundo quando quer que algo aconteça sem parecer que aconteceu. Mas não comigo. Eu só executo procedimento.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Não.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "bruno",
          label: "Bruno ganhou com a morte. Ele te procurou em algum momento?",
          answers: [
            {
              when: { hasEvidence: ["insurance-change"] },
              text: "Eu não comento moradores. Ainda mais os que pagam caro por silêncio.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Não tenho nada a declarar sobre isso.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "livia",
          label: "Você acha que a Lívia é culpada?",
          answers: [
            {
              when: { hasEvidence: ["livia-alibi-metadata"] },
              text: "Culpada? Eu não sei. Mas um álibi perfeito é igual a câmera perfeita: só existe quando alguém ajusta.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Não faço acusações. Faço relatórios.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "pressure",
          label: "Você está nervoso, Jonas.",
          answers: [
            {
              when: { minCertainty: 5, hasEvidence: ["access-log"] },
              text: "Eu não estou nervoso. Eu estou cansado. E você está insistindo em uma narrativa que não entende. Se quer culpado, procure em quem lucra — não em quem trabalha.",
              effects: { certainty: 2, noise: 2 },
            },
            {
              when: { default: true },
              text: "Eu estou bem. Próxima pergunta.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },
      ],
    },

    eduardo: {
      title: "Entrevista — Dr. Eduardo Salles",
      intro:
        "Eduardo escolhe palavras como quem dosa remédio. E remédio também pode ser arma.",
      questions: [
        {
          id: "sedative",
          label: "Você prescreveu sedativos para Henrique?",
          answers: [
            {
              when: {
                hasEvidence: ["sedative-prescription", "autopsy-report"],
              },
              text: "Prescrevi, sim. Dose baixa. Terapêutica. Mas se isso apareceu no laudo… então alguém administrou sem meu acompanhamento. E alguém queria que ele apagasse antes de morrer.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { hasEvidence: ["sedative-prescription"] },
              text: "Prescrevi hipnótico em dose baixa. Isso não mata. Mas eu não posso afirmar quem administrou — prescrição não é execução.",
              effects: { certainty: 1, noise: 0 },
            },
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Se houve sedação comprovada, eu preciso ver origem e lote. Laudo indica presença, não autoria. Alguém pode ter usado um medicamento obtido por outros meios.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Tenho sigilo médico. Sem autorização formal, eu não posso comentar.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "dose",
          label: "Essa dose é compatível com o que o laudo indica?",
          answers: [
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Compatível com indução de sono, não com óbito. A função é reduzir vigília e resistência. Se houve estrangulamento, a sedação é um facilitador — não a causa.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Sem laudo e sem valores laboratoriais, é especulação.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "whyHenrique",
          label: "Por que Henrique precisava disso? Ele tinha medo de quê?",
          answers: [
            {
              when: { minNoise: 3 },
              text: "Ele falava em 'ameaças', mas nunca dizia nomes. Gente importante costuma ter medo de duas coisas: perder controle… e virar manchete.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Insônia e ansiedade são comuns. Henrique era exigente consigo mesmo.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "systemAccess",
          label: "Quem tinha acesso ao seu sistema de prescrições e receitas?",
          answers: [
            {
              when: { minCertainty: 4, hasEvidence: ["autopsy-report"] },
              text: "A clínica tem camadas de acesso. Eu assino, mas há auxiliares que lançam dados. Se alguém adulterou qualquer coisa… foi por dentro. E isso me preocupa.",
              effects: { certainty: 2, noise: 1 },
            },
            {
              when: { default: true },
              text: "Acesso é restrito. Não é algo que 'qualquer um' faz.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "camila",
          label: "Camila tinha acesso a informações médicas do Henrique?",
          answers: [
            {
              when: { hasEvidence: ["camila-schedule"] },
              text: "Assistentes executivas costumam 'organizar' consultas. Elas não deveriam ver prontuário, mas… a prática nem sempre respeita o protocolo.",
              effects: { certainty: 1, noise: 1 },
            },
            {
              when: { default: true },
              text: "Não comento terceiros. Sigilo.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "pressure",
          label: "Você está sendo pressionado por alguém, doutor?",
          answers: [
            {
              when: { minCertainty: 5 },
              text: "Eu sou médico. Eu lido com pressão o tempo todo. A diferença é quando a pressão vem de quem tem dinheiro… e não de quem tem dor.",
              effects: { certainty: 1, noise: 2 },
            },
            {
              when: { default: true },
              text: "Não.",
              effects: { certainty: 0, noise: 1 },
            },
          ],
        },

        {
          id: "finalLine",
          label:
            "Se alguém usou um sedativo para facilitar a morte… o que isso diz sobre o assassino?",
          answers: [
            {
              when: { hasEvidence: ["autopsy-report"] },
              text: "Diz que não foi impulso. Foi intenção. E intenção exige acesso: ao corpo, ao ambiente… e ao sono.",
              effects: { certainty: 2, noise: 0 },
            },
            {
              when: { default: true },
              text: "Diz que alguém planejou reduzir resistência. Isso é o oposto de um crime passional.",
              effects: { certainty: 1, noise: 0 },
            },
          ],
        },
      ],
    },
  },

  evidencesMaster: [
    {
      id: "ev-1",
      label: "EVIDÊNCIA 01",
      image: "./assets/evidence/evidencia1.png",
      weight: "strong",
    },
    {
      id: "ev-2",
      label: "EVIDÊNCIA 02",
      image: "./assets/evidence/evidencia2.png",
      weight: "strong",
    },
    {
      id: "ev-3",
      label: "EVIDÊNCIA 03",
      image: "./assets/evidence/evidencia3.png",
      weight: "medium",
    },
  ],

  nodes: {
    start: {
      badge: "PRÓLOGO",
      title: "A HORA QUE NÃO EXISTE",
      text: "22:41 não é um horário. É uma assinatura.",
      choices: [
        { label: "EXAMINAR A CENA", to: "scene" },
        { label: "DESMONTAR O ÁLIBI", to: "alibi" },
        { label: "PERGUNTAR AO CORPO", to: "autopsy" },
      ],
    },

    scene: {
      badge: "ARQUIVO — CENA",
      title: "O RELÓGIO QUE PAROU",
      text: "O apartamento é limpo demais. Mas o tempo não mente — ele só é editado.",
      choices: [
        {
          label: "COLETAR RELÓGIO (22:41)",
          clue: {
            id: "watch-2241",
            title: "RELÓGIO PARADO EM 22:41",
            text: "Relógio de pulso encontrado parado em 22:41. Marcador temporal/assinatura: pode indicar minuto da execução, queda abrupta ou manipulação pós-fato. Deve ser cruzado com câmeras, portaria e logs apagados (22:37–22:49).",
            weight: "forte",
          },
          to: "start",
        },
        {
          label: "CONFERIR CLUSTER DA MESA",
          clue: {
            id: "table-staging",
            title: "MESA ORGANIZADA DEMAIS",
            text: "Papéis alinhados e copo com condensação discreta sugerem encenação ou manipulação consciente. A ordem pode ser tão informativa quanto o conteúdo.",
            weight: "medio",
          },
          to: "start",
        },
        { label: "ENCERRAR", to: "start" },
      ],
    },

    camera: {
      badge: "ARQUIVO — CÂMERA",
      title: "FRAME 12-B",
      text: "O corredor não mente. Ele só não mostra tudo de uma vez.",
      media: {
        src: "./assets/locations/corredor-servico.png",
        alt: "Corredor de serviço — câmera 12-B (imagem bruta)",
        caption:
          "Registro bruto da câmera do corredor de serviço. Sem tratamento. Sem recorte. Apenas o que foi captado.",
      },
      choices: [
        {
          label: "EXTRAIR FRAME 12-B",
          to: "frame12b",
        },
        {
          label: "ENCERRAR",
          to: "start",
        },
      ],
    },
    frame12b: {
      badge: "ARQUIVO — CÂMERA",
      title: "O BRILHO QUE NÃO DEVERIA EXISTIR",
      text: "Quando o tempo para, pequenos detalhes denunciam quem ainda estava em movimento.",
      media: {
        src: "./assets/collectables/frame-12b.png",
        alt: "Frame 12-B extraído com reflexo metálico",
        caption:
          "Frame isolado e ampliado do corredor de serviço às 22:41. Um reflexo metálico aparece fora do padrão esperado.",
      },
      choices: [
        {
          label: "ARQUIVAR FRAME COMO PROVA",
          clue: {
            id: "frame-12b",
            title: "BRILHO NO CORREDOR",
            text: "Frame ampliado revela reflexo metálico compatível com chaveiro ou chave mestra às 22:41. Indício de acesso físico durante o intervalo apagado.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    garage: {
      badge: "ARQUIVO — GARAGEM",
      title: "A ENTRADA QUE NÃO APARECE",
      text: "A garagem leste não falha sempre. Só quando alguém sabe onde olhar.",
      media: {
        src: "./assets/locations/garagem-leste.png",
        alt: "Garagem leste — visão geral",
        caption:
          "Registro fotográfico da garagem leste. Área de circulação comum, sem anomalias aparentes.",
      },
      choices: [
        {
          label: "RECONSTRUIR ROTA LATERAL",
          to: "garageRoute",
        },
        {
          label: "ENCERRAR",
          to: "start",
        },
      ],
    },

    garageRoute: {
      badge: "ARQUIVO — GARAGEM",
      title: "ROTA LATERAL",
      text: "Entre a cancela e o elevador, existe um intervalo curto demais para ser acaso.",
      media: {
        src: "./assets/collectables/garage-route.png",
        alt: "Mapa parcial da garagem com rota lateral destacada",
        caption:
          "Reconstrução visual da rota lateral sem cobertura efetiva de câmeras.",
      },
      choices: [
        {
          label: "ARQUIVAR ROTA COMO PROVA",
          clue: {
            id: "garage-entry",
            title: "ROTA LATERAL",
            text: "Existe um intervalo sem cobertura efetiva entre a cancela e o elevador de serviço. Entrada possível sem registro visual direto.",
            weight: "medio",
          },
          to: "start",
        },
      ],
    },

    doorman: {
      badge: "ARQUIVO — PORTARIA",
      title: "O TURNO QUE FALHOU",
      text: "Sistemas registram. Pessoas interpretam.",
      media: {
        src: "./assets/locations/portaria.png",
        alt: "Portaria do edifício — visão frontal",
        caption: "Registro fotográfico da portaria durante troca de turno.",
      },
      choices: [
        {
          label: "ANALISAR TROCA DE TURNO",
          to: "doormanShift",
        },
        {
          label: "ENCERRAR",
          to: "start",
        },
      ],
    },

    doormanShift: {
      badge: "ARQUIVO — PORTARIA",
      title: "LACUNA NA PORTARIA",
      text: "Entre um uniforme e outro, ninguém estava realmente olhando.",
      media: {
        src: "./assets/collectables/doorman-shift.png",
        alt: "Registro de troca de turno com lacuna temporal",
        caption: "Registro incompleto de troca de turno entre 22:37 e 22:49.",
      },
      choices: [
        {
          label: "ARQUIVAR LACUNA",
          clue: {
            id: "doorman-shift-gap",
            title: "LACUNA NA PORTARIA",
            text: "Troca de turno com registro incompleto no intervalo crítico. Entrada/saída sem validação formal.",
            weight: "medio",
          },
          to: "start",
        },
      ],
    },

    clinic: {
      badge: "ARQUIVO — CLÍNICA",
      title: "A DOSE CERTA",
      text: "Dormir também é uma forma de controle.",
      media: {
        src: "./assets/locations/clinica.png",
        alt: "Consultório médico — mesa de atendimento",
        caption: "Consultório médico. Ambiente clínico, organizado.",
      },
      choices: [
        {
          label: "EXAMINAR PRESCRIÇÃO",
          to: "clinicPrescription",
        },
        {
          label: "ENCERRAR",
          to: "start",
        },
      ],
    },

    clinicPrescription: {
      badge: "ARQUIVO — CLÍNICA",
      title: "ZOLPIDEM",
      text: "A dose não mata. Ela prepara.",
      media: {
        src: "./assets/collectables/prescription-zolpidem.png",
        alt: "Receituário médico com sedativo",
        caption:
          "Prescrição recente de zolpidem. Dose compatível com indução de sono profundo.",
      },
      choices: [
        {
          label: "ARQUIVAR PRESCRIÇÃO",
          clue: {
            id: "sedative-prescription",
            title: "ZOLPIDEM",
            text: "Prescrição recente de sedativo em dose compatível com indução de sono.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    office2: {
      badge: "ARQUIVO — ESCRITÓRIO",
      title: "A MORTE COMO CLÁUSULA",
      text: "Documentos não matam. Mas ensinam por que alguém decide matar.",
      media: {
        src: "./assets/locations/escritorio.png",
        alt: "Mesa de escritório corporativo",
        caption:
          "Mesa organizada com documentos financeiros e pasta de seguro.",
      },
      choices: [
        {
          label: "ABRIR ALTERAÇÃO DO SEGURO",
          to: "officeInsurance",
        },
        {
          label: "ENCERRAR",
          to: "start",
        },
      ],
    },

    officeInsurance: {
      badge: "ARQUIVO — ESCRITÓRIO",
      title: "ALTERAÇÃO DE SEGURO",
      text: "Quando o papel muda, o destino muda junto.",
      media: {
        src: "./assets/collectables/insurance-change.png",
        alt: "Documento de seguro com alteração recente",
        caption: "Seguro de vida alterado 23 dias antes da morte.",
      },
      choices: [
        {
          label: "ARQUIVAR DOCUMENTO",
          clue: {
            id: "insurance-change",
            title: "ALTERAÇÃO DE SEGURO",
            text: "Seguro de vida alterado 23 dias antes. Beneficiário único: Bruno.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    alibi: {
      badge: "ARQUIVO — ÁLIBI",
      title: "O DIGITAL NÃO SANGRA",
      text: "Lívia Moreau estava em uma chamada perfeita demais para ser humana.",
      choices: [
        {
          label: "ANALISAR METADADOS",
          clue: {
            id: "livia-alibi-metadata",
            title: "ÁLIBI LIMPO DEMAIS",
            text: "Compressão incompatível com transmissão ao vivo.",
            weight: "medio",
          },
          to: "start",
        },
        { label: "ENCERRAR", to: "start" },
      ],
    },

    witness: {
      badge: "ARQUIVO — TESTEMUNHA",
      title: "DETALHES DEMAIS",
      text: "Sofia lembra mais do que deveria.",
      choices: [
        {
          label: "CONFRONTAR",
          clue: {
            id: "sofia-overdetail",
            title: "EXCESSO DE DETALHES",
            text: "Detalhes incompatíveis com a posição.",
            weight: "medio",
          },
          to: "start",
        },
      ],
    },

    office: {
      badge: "ARQUIVO — SÓCIO",
      title: "LUTO EFICIENTE",
      text: "Bruno lucrou com a morte.",
      choices: [
        {
          label: "ANALISAR SEGURO",
          clue: {
            id: "insurance-change",
            title: "ALTERAÇÃO DE SEGURO",
            text: "Beneficiário único: Bruno.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    camilaLead: {
      badge: "ARQUIVO — ASSISTENTE",
      title: "A DONA DO TEMPO",
      text: "Camila controla agendas.",
      choices: [
        {
          label: "CRUZAR HORÁRIOS",
          clue: {
            id: "camila-schedule",
            title: "JANELA DE OPORTUNIDADE",
            text: "Agenda alterada entre 22:20–23:00.",
            weight: "medio",
          },
          to: "start",
        },
      ],
    },

    access: {
      badge: "ARQUIVO — SEGURANÇA",
      title: "O HOMEM DAS CHAVES",
      text: "Jonas apagou o tempo.",
      choices: [
        {
          label: "VERIFICAR LOGS",
          clue: {
            id: "access-log",
            title: "APAGÃO CONTROLADO",
            text: "Logs apagados manualmente.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    doctor: {
      badge: "ARQUIVO — MÉDICO",
      title: "A DOSE CERTA",
      text: "Sedação antes da morte.",
      media: {
        src: "./assets/locations/clinica.png",
        alt: "Clínica Santa Helena — área clínica",
        caption: "Registro fotográfico associado ao atendimento médico.",
      },
      choices: [
        {
          label: "VER PRESCRIÇÃO",
          clue: {
            id: "sedative-prescription",
            title: "ZOLPIDEM",
            text: "Sedação prévia.",
            weight: "forte",
          },
          to: "start",
        },
      ],
    },

    autopsy: {
      badge: "ATO II",
      title: "A LINGUAGEM DOS MORTOS",
      text: "O corpo confirma: execução.",
      choices: [
        {
          label: "GUARDAR LAUDO",
          clue: {
            id: "autopsy-report",
            title: "MORTE EM DUAS ETAPAS",
            text: "Sedação + estrangulamento.",
            weight: "forte",
          },
          to: "start",
        },
        { label: "SEGUIR REMÉDIO", to: "doctor" },
      ],
    },
  },
};

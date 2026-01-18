/* =========================
   EVIDÊNCIA ZERO — app.js 
========================= */

const STORAGE_KEY = "evidencia_zero_case1_v1";
const UI_KEY = "evidencia_zero_ui_v1";
const RARE_EXTRA_EVIDENCE_ID = "watch-2241";

function loadUI() {
  try {
    return (
      JSON.parse(localStorage.getItem(UI_KEY)) || {
        invOpen: false,
        invTab: "clues", // clues | suspects | weapons
      }
    );
  } catch {
    return { invOpen: false, invTab: "clues" };
  }
}

function saveUI(uiState) {
  localStorage.setItem(UI_KEY, JSON.stringify(uiState));
}

const CASE = window.CASE_1;

if (!CASE) {
  throw new Error(
    "CASE_1 não foi carregado. Verifique se index.html inclui ./cases/case1.js antes do app.js"
  );
}
/* =========================
   INTRO PROGRESS (texto do jornal)
========================= */

const INTRO_PROGRESS = [
  {
    id: "stage0_first_contact",
    when: { evidenceMax: 0 },
    text: "Nada aqui é acidental.\n\nOs arquivos abaixo compõem o material bruto da investigação.\nNenhum deles conta a história inteira.\n\nObserve os detalhes.\nTire suas próprias conclusões.",
  },
  {
    id: "stage1_first_clues",
    when: { evidenceMin: 1, evidenceMax: 2 },
    text: "Um arquivo não é uma resposta.\nÉ apenas um ponto de vista.\n\nCompare.\nO que parece claro sozinho muda quando colocado ao lado de outro.",
  },
  {
    id: "stage2_contradictions",
    when: { evidenceMin: 3, noiseMin: 2 },
    text: "As versões não se alinham.\n\nIsso não é erro.\nÉ o padrão.\n\nConfronte depoimentos com a linha do tempo.",
  },
  {
    id: "stage3_patterns",
    when: { evidenceMin: 4, certaintyMin: 4 },
    text: "Neste ponto, não faltam informações.\nFalta leitura.\n\nDetalhes isolados confundem.\nConjuntos revelam intenção.",
  },
  {
    id: "stage4_almost_sure",
    when: { evidenceMin: 5, certaintyMin: 7, noiseMax: 4 },
    text: "Quando tudo parece fazer sentido,\né quando o erro costuma entrar.\n\nReleia o que você descartou.",
  },
  {
    id: "stage5_endgame",
    when: { evidenceMin: 6, certaintyMin: 10 },
    text: "Não existe resposta perfeita.\n\nExiste a versão que você consegue sustentar\ndiante do que foi dito, omitido\ne deixado para trás.",
  },
];

function pickProgressIntro(state) {
  const evidenceCount = Array.isArray(state?.evidence)
    ? state.evidence.length
    : 0;
  const certainty = Number(state?.metrics?.certainty ?? 0);
  const noise = Number(state?.metrics?.noise ?? 0);

  const matches = (rule = {}) => {
    if (rule.evidenceMin != null && evidenceCount < rule.evidenceMin)
      return false;
    if (rule.evidenceMax != null && evidenceCount > rule.evidenceMax)
      return false;

    if (rule.certaintyMin != null && certainty < rule.certaintyMin)
      return false;
    if (rule.certaintyMax != null && certainty > rule.certaintyMax)
      return false;

    if (rule.noiseMin != null && noise < rule.noiseMin) return false;
    if (rule.noiseMax != null && noise > rule.noiseMax) return false;

    return true;
  };

  for (const item of INTRO_PROGRESS) {
    if (matches(item.when)) return item.text;
  }

  return INTRO_PROGRESS[0].text;
}

/* =========================
   RNG helpers
========================= */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

// =========================
// KILLER WEIGHTS (balance)
// =========================

const KILLER_WEIGHTS = {
  bruno: 1.2,
  camila: 1.0,
  jonas: 0.9,
  eduardo: 0.8,
  livia: 0.7,
  sofia: 0.9,
};

function pickWeighted(weightMap, rng) {
  const entries = Object.entries(weightMap).filter(([, w]) => Number(w) > 0);

  // fallback seguro
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, w]) => sum + Number(w), 0);
  let roll = rng() * total;

  for (const [id, w] of entries) {
    roll -= Number(w);
    if (roll <= 0) return id;
  }
  return entries[entries.length - 1][0];
}

function buildWeightsFromSuspects(suspectIds) {
  const out = {};
  for (const id of suspectIds) {
    out[id] = KILLER_WEIGHTS[id] ?? 1; // default = 1
  }
  return out;
}

function rollChance(rng, p) {
  return rng() < p;
}

/* =========================
   SOLUTION ENGINE (TOP)
========================= */

function shuffleDeterministic(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickMotivationVariant(rng) {
  // você pode ajustar o peso: 70% real, 30% surface
  return rng() < 0.7 ? "real" : "surface";
}

function pickFallGuyId({ killerId, rng }) {
  // Padrão clássico: Lívia é o bode expiatório "natural"
  // Mas deixo determinístico e variado por seed:
  const pool = (CASE.suspects || [])
    .map((s) => s.id)
    .filter((id) => id !== killerId);

  // preferências (ordem): livia > bruno > camila > jonas > eduardo > sofia
  const preferred = ["livia", "bruno", "camila", "jonas", "eduardo", "sofia"];

  const ranked = preferred.filter((id) => pool.includes(id));
  if (ranked.length) return ranked[Math.floor(rng() * ranked.length)];

  // fallback
  return pool.length ? pool[Math.floor(rng() * pool.length)] : "livia";
}

/**
 * Define um "kit de erro convincente" (plausível mas falso).
 * Ideia: se o jogador escolher essas armas/evidências "bonitas" e errar os pilares,
 * o jogo dá o veredito exclusivo de "condenação por erro".
 */

function deriveFallGuyTrap({ killerId, fallGuyId }) {
  // trap base: prova que "parece" muito forte pro público (narrativa),
  // mas não fecha os pilares do crime real.
  const trap = {
    // Armas que tendem a enganar (ajusta livremente)
    weapons: [],
    // Evidências que sustentam a narrativa errada
    evidences: [],
  };

  // Se o bode expiatório for Lívia → trap de álibi digital/arquivo
  if (fallGuyId === "livia") {
    trap.weapons = ["wp_scripted_video"]; // "arma narrativa"
    trap.evidences = ["livia-alibi-metadata"]; // o jogador pensa "peguei!"
    return trap;
  }

  // Se for Bruno → trap de contrato/seguro (parece motivo fechado)
  if (fallGuyId === "bruno") {
    trap.weapons = ["wp_contracts_insurance"];
    trap.evidences = ["insurance-change"];
    return trap;
  }

  // Se for Camila → trap de agenda (parece logística/controle)
  if (fallGuyId === "camila") {
    trap.weapons = ["wp_zolpidem_bottle"];
    trap.evidences = ["camila-schedule"];
    return trap;
  }

  // Se for Jonas → trap de logs (parece “ele apagou, logo ele fez”)
  if (fallGuyId === "jonas") {
    trap.weapons = ["wp_master_keychain"];
    trap.evidences = ["access-log"]; // (sem o frame, fica “meia verdade”)
    return trap;
  }

  // Eduardo → trap de sedação (vira “culpado” por ser médico)
  if (fallGuyId === "eduardo") {
    trap.weapons = ["wp_zolpidem_bottle"];
    trap.evidences = ["sedative-prescription"];
    return trap;
  }

  // Sofia → trap de testemunha (pouco comum, mas possível)
  if (fallGuyId === "sofia") {
    trap.weapons = []; // não precisa de arma aqui, é “testemunho”
    trap.evidences = ["sofia-overdetail"];
    return trap;
  }

  return trap;
}

function weaponById(id) {
  return (CASE.weapons || []).find((w) => w.id === id) || null;
}

function suspectById(id) {
  return (CASE.suspects || []).find((s) => s.id === id) || null;
}

function pickCoherentWeaponsForKiller({ killerId, weapons, rng }) {
  const linked = weapons.filter((w) => (w.linkedTo || []).includes(killerId));
  const pool = linked.length ? linked : weapons.slice();

  const wA = pool.find((w) => w.id === "wp_garrote_wire");
  const wC = pool.find((w) => w.id === "wp_master_keychain");

  // ⭐ Preferência máxima: A + C (se possível)
  if (wA && wC) return [wA.id, wC.id];

  // 1) tenta achar 1 arma de estrangulamento ligada
  const strang = pool.filter((w) => w.type === "estrangulamento");
  // 2) tenta achar um facilitador/ponte
  const support = pool.filter((w) =>
    ["facilitador", "sedacao", "narrativa"].includes(w.type)
  );

  const picked = [];

  // pega estrangulamento primeiro
  if (strang.length) {
    const s = pickOne(shuffleDeterministic(strang, rng), rng);
    picked.push(s.id);
  }

  // depois pega suporte
  if (support.length) {
    const s2 = pickOne(
      shuffleDeterministic(
        support.filter((x) => !picked.includes(x.id)),
        rng
      ),
      rng
    );
    if (s2) picked.push(s2.id);
  }

  // fallback: completa até 2 com itens do pool
  if (picked.length < 2) {
    const rest = shuffleDeterministic(
      pool.filter((x) => !picked.includes(x.id)),
      rng
    );
    for (const r of rest) {
      if (picked.length >= 2) break;
      picked.push(r.id);
    }
  }

  // se ainda assim não deu 2 (caso raro), duplica com qualquer arma global
  if (picked.length < 2) {
    const restAll = shuffleDeterministic(
      weapons.filter((x) => !picked.includes(x.id)),
      rng
    );
    for (const r of restAll) {
      if (picked.length >= 2) break;
      picked.push(r.id);
    }
  }

  return picked.slice(0, 2);
}

function deriveRequiresFromSolution({
  weaponIds,
  killerId,
  motiveVariant,
  rng, // ✅ RNG determinístico
}) {
  const req = new Set();

  // 🔒 Âncora fixa do caso
  req.add("autopsy-report");

  const wObjs = weaponIds.map((id) => weaponById(id)).filter(Boolean);

  for (const w of wObjs) {
    if (w.type === "sedacao") {
      req.add("sedative-prescription");
    }

    if (w.id === "wp_scripted_video") {
      req.add("livia-alibi-metadata");
    }

    if (w.id === "wp_contracts_insurance") {
      req.add("insurance-change");
    }

    if (w.id === "wp_master_keychain") {
      req.add("frame-12b");
      req.add("access-log");
    }
  }

  /* =========================
     ÂNCORA OPCIONAL (determinística)
     - 35% dos casos exigem o tempo (watch-2241)
     - depende da seed, nunca muda depois
  ========================= */
  if (rng() < 0.35) {
    req.add("watch-2241");
  }

  /* =========================
     Ajustes por assassino (opcional)
     Use só se quiser caracterizar melhor
  ========================= */
  if (killerId === "bruno" && rng() < 0.6) {
    req.add("insurance-change");
  }

  if (killerId === "sofia" && rng() < 0.5) {
    req.add("frame-12b");
  }

  return Array.from(req);
}

function buildLogicText({ killerId, motiveVariant, motiveText, weaponIds }) {
  const killer = suspectById(killerId);
  const wNames = weaponIds
    .map((id) => weaponById(id))
    .filter(Boolean)
    .map((w) => `${w.label} (${w.name})`);

  const killerName = killer?.name || killerId;

  return [
    `${killerName} não precisava de força — precisava de janela.`,
    `Motivo (${motiveVariant}): ${motiveText || "—"}`,
    `Peças-chave: ${wNames.length ? wNames.join(" + ") : "—"}.`,
    `O método foi controlado: primeiro sono, depois laço. E o tempo sumiu quando alguém tinha acesso ao tempo.`,
  ].join(" ");
}

function generateCoherentSolution() {
  const seed = Math.floor(Math.random() * 1e9);
  const rng = mulberry32(seed);

  const suspects = (CASE.suspects || []).map((s) => s.id);
  const weapons = CASE.weapons || [];
  const motives = CASE.motives || {};
  const opportunities = CASE.opportunities || {};

  // 1) escolhe assassino (puro aleatório agora — dá pra pesar depois)
  const killerId =
    pickWeighted(buildWeightsFromSuspects(suspects), rng) ||
    pickOne(suspects, rng);

  // 1.5) escolhe "culpado por erro" (bode expiatório) — determinístico por seed
  const fallGuyId = pickFallGuyId({ killerId, rng });
  const fallGuyTrap = deriveFallGuyTrap({ killerId, fallGuyId });

  // 2) motivo (real/surface)
  const motiveVariant = pickMotivationVariant(rng);
  const motive = motives[killerId] || {};
  const motiveText = motive[motiveVariant] || "";

  // 3) oportunidade (guarda no solution pra entrevistas/logic)
  const opportunity = opportunities[killerId] || null;

  // 4) escolhe 2 armas coerentes
  const weaponIds = pickCoherentWeaponsForKiller({ killerId, weapons, rng });

  // 5) requires e lógica final
  const requires = deriveRequiresFromSolution({
    weaponIds,
    killerId,
    motiveVariant,
    rng,
  });
  const logic = buildLogicText({
    killerId,
    motiveVariant,
    motiveText,
    weaponIds,
  });
  const rare = rollChance(rng, 0.12);
  const rareRequires = rare ? [RARE_EXTRA_EVIDENCE_ID] : [];

  return {
    seed,
    killerId,
    weaponIds,
    motiveVariant,
    motiveText,
    opportunity,
    requires,
    logic,
    fallGuyId,
    fallGuyTrap,
    rare,
    rareTag: rare ? "FINAL RARO" : null,
    rareRequires,
  };
}

function ensureSolution(state) {
  if (state.solution) return state;
  state.solution = generateCoherentSolution();
  saveState(state);
  return state;
}

/* =========================
   UI refs
========================= */
const ui = {
  app: document.getElementById("app"),
  btnBackToCover: document.getElementById("btnBackToCover"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  btnCloseModal: document.getElementById("btnCloseModal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  toast: document.getElementById("toast"),
};

/* =========================
   Crime scene assets + hotspots (case1)
========================= */
const CRIME_SCENE = {
  sceneImage: "./assets/evidence/apt-vitima.png",
  evidences: {
    1: {
      id: "ev1-smartphone",
      label: "EVIDÊNCIA 01",
      officialName:
        "Aparelho Celular (Smartphone) — Item coletado junto ao contorno corporal",
      type: "objeto",
      location: "Piso da sala, próximo ao contorno corporal (lado esquerdo)",
      zoomImage: "./assets/evidence/evidencia1.png",
      forensicText:
        "O aparelho estava com a tela apagada e sem sinais de impacto. Há marcas de manuseio recentes no vidro (smudges), sugerindo uso pouco antes do evento. A posição próxima ao contorno corporal indica queda ou descarte imediato. Deve ser correlacionado a logs de chamadas/mensagens e geolocalização para estimar atividade no intervalo crítico.",
    },
    2: {
      id: "ev2-watch",
      label: "EVIDÊNCIA 02",
      officialName: "Relógio de Pulso — Marcador temporal (parado em 22:41)",
      type: "objeto",
      location: "Mesa lateral (aparador), à direita da cena principal",
      zoomImage: "./assets/evidence/evidencia2.png",
      forensicText:
        "O mostrador apresenta tempo parado em 22:41. O estado do relógio (posição, integridade e possíveis micro-riscos) sugere interrupção abrupta ou manipulação pós-fato. É um marcador narrativo forte: pode refletir o minuto da ação, a hora de uma queda, ou uma assinatura intencional. Requer confronto com registros (portaria/câmeras) e consistência do intervalo de apagamento.",
      clue: {
        id: "watch-2241",
        title: "RELÓGIO PARADO EM 22:41",
        text: "Relógio de pulso parado em 22:41. Âncora do tempo/assinatura: pode indicar minuto da execução, queda abrupta ou manipulação pós-fato. Cruzar com câmeras, portaria e logs (22:37–22:49).",
        weight: "forte",
      },
    },
    3: {
      id: "ev3-table-cluster",
      label: "EVIDÊNCIA 03",
      officialName:
        "Objeto sobre Mesa de Centro — Conjunto documental e itens pessoais (papéis, copo, chaves)",
      type: "conjunto",
      location: "Mesa de centro da sala (área de estar)",
      zoomImage: "./assets/evidence/evidencia3.png",
      forensicText:
        "Conjunto organizado demais para um ambiente pós-confronto. O copo apresenta marca de condensação discreta (umidade recente) e os papéis estão alinhados, sugerindo manipulação consciente ou encenação. As chaves e o fob podem vincular o fluxo de entrada/saída e o acesso a áreas internas. A ordem pode ser tão informativa quanto o conteúdo.",
    },
  },

  hotspots: [
    { ev: 1, x: 33, y: 60 },
    { ev: 2, x: 86, y: 40 },
    { ev: 3, x: 36, y: 32 },
  ],
};

const SCENES = {
  portaria: {
    id: "portaria",
    title: "Portaria",
    image: "./assets/locations/portaria.png",
    hint: "Ambiente de acesso e registros. Procure sinais discretos.",
    evidences: {
      1: {
        label: "ARMA P1",
        officialName: "Computador da portaria — Logs de acesso",
        type: "Registro",
        location: "Portaria (balcão / terminal)",
        zoomImage: "./assets/evidence/portaria_logs.png",
        x: 60,
        y: 45,
        forensicText:
          "Tela/registro de acesso com atividade no intervalo crítico. Dados sensíveis devem estar ilegíveis, mas a presença do log e o padrão temporal são relevantes.",
        clue: {
          id: "access-log",
          title: "LOG DE ACESSO — PORTARIA",
          text: "Registro de acessos/entradas no intervalo crítico. Serve para confrontar linha do tempo, portões e presença real no prédio.",
          weight: "forte",
        },
        effects: { certainty: 2, noise: 0 },
      },
      2: {
        label: "ARMA P2",
        officialName: "Livro de registros — Linha rasurada",
        type: "Documento",
        location: "Portaria (livro físico)",
        zoomImage: "./assets/evidence/livro_portaria.png",
        x: 47,
        y: 60,
        forensicText:
          "Linha de troca de turno/registro com rasura evidente. A rasura é o dado: indica tentativa de corrigir narrativa após o evento.",
        clue: {
          id: "doorman-register",
          title: "LIVRO DA PORTARIA — RASURA",
          text: "Registro físico com linha rasurada no período crítico. Sinal de ajuste manual na narrativa oficial.",
          weight: "medio",
        },
        effects: { certainty: 1, noise: 0 },
      },
    },
  },

  "corredor-servico": {
    id: "corredor-servico",
    title: "Corredor de Serviço",
    image: "./assets/locations/corredor-servico.png",
    hint: "Piso gasto, iluminação fria. Procure reflexos, marcas e pequenas inconsistências.",
    evidences: {
      1: {
        label: "ARMA CS1",
        officialName: "Reflexo metálico no piso — corredor de serviço",
        type: "Vestígio",
        location: "Corredor de serviço (setor técnico)",
        zoomImage: "./assets/evidence/corredor_zoom.png",
        x: 78,
        y: 70,
        forensicText:
          "Reflexo metálico discreto identificado no piso do corredor de serviço, compatível com objeto pequeno de superfície polida. A orientação do brilho sugere deslocamento em área de iluminação contínua, possivelmente associado a chaveiro ou chave mestra em movimento.",
        clue: {
          id: "frame-12b",
          title: "BRILHO METÁLICO NO CORREDOR",
          text: "Reflexo metálico compatível com chaveiro ou chave mestra no corredor de serviço. Indício de deslocamento por rota técnica fora do campo principal das câmeras.",
          weight: "forte",
        },
        effects: { certainty: 2, noise: 0 },
      },
    },
  },

  clinica: {
    id: "clinica",
    title: "Clínica",
    image: "./assets/locations/clinica.png",
    hint: "Ambiente clínico controlado. Nem tudo está no centro do quadro.",
    evidences: {
      1: {
        label: "ARMA CL1",
        officialName: "Gaveteiro — Pilha de prescrições (Zolpidem)",
        type: "Documento",
        location: "Clínica (gaveteiro / balcão)",
        zoomImage: "./assets/evidence/receitas_clinica.png",
        x: 50,
        y: 50,
        forensicText:
          "Pilha de prescrições/receituários associada a sedativos. Sem nomes legíveis. A repetição e o volume sugerem padrão, não exceção.",
        clue: {
          id: "sedative-prescription",
          title: "PRESCRIÇÕES — SEDATIVOS (ZOLPIDEM)",
          text: "Prescrições recorrentes de sedativos. Elemento que sustenta sedação prévia e abre vínculo com responsável médico.",
          weight: "forte",
        },
        effects: { certainty: 2, noise: 0 },
      },
    },
  },

  escritorio: {
    id: "escritorio",
    title: "Escritório",
    image: "./assets/locations/escritorio.png",
    hint: "Ordem demais pode ser uma pista. Procure detalhes ‘incidentalmente’ presentes.",
    evidences: {
      1: {
        label: "ARMA E1",
        officialName: "Apólice / alteração recente — Seguro de vida",
        type: "Documento",
        location: "Escritório (pasta / mesa)",
        zoomImage: "./assets/evidence/apolice.png",
        x: 80,
        y: 60,
        forensicText:
          "Documento de seguro com sinal de atualização recente. Não ler nomes/CPF — o importante é a existência do vínculo financeiro e a data de modificação.",
        clue: {
          id: "insurance-change",
          title: "SEGURO — ALTERAÇÃO RECENTE",
          text: "Apólice com evidência de modificação recente. Vínculo financeiro direto com o pós-crime.",
          weight: "forte",
        },
        effects: { certainty: 2, noise: 0 },
      },
      2: {
        label: "ARMA E2",
        officialName: "Receituário médico — Zolpidem",
        type: "Documento",
        location: "Escritório de Bruno (mesa)",
        zoomImage: "./assets/evidence/receita.png",
        x: 60,
        y: 68,
        forensicText:
          "Receituário médico de zolpidem em nome de Henrique Valença, encontrado sobre a mesa do escritório de Bruno. A presença do documento fora do ambiente clínico sugere acesso indireto ou retenção intencional da prescrição.",
        clue: {
          id: "sedative-prescription",
          title: "SEDATIVO — PRESCRIÇÃO EM NOME DA VÍTIMA",
          text: "Prescrição de zolpidem vinculada à vítima. Reforça a hipótese de sedação prévia fora do ambiente clínico.",
          weight: "medio",
        },
        effects: { certainty: 1, noise: 0 },
      },
    },
  },

  "garagem-leste": {
    id: "garagem-leste",
    title: "Garagem",
    image: "./assets/locations/garagem-leste.png",
    hint: "Concreto, manchas, marcas de pneu… procure algo fora do padrão.",
    evidences: {
      1: {
        label: "ARMA CS1",
        officialName: "Frame / evidência visual — Câmeras desligadas",
        type: "Imagem",
        location: "Garagem-leste (ponto cego / câmera)",
        zoomImage: "./assets/evidence/frame-12b.png",
        x: 50,
        y: 20,
        forensicText:
          "Recorte que sugere apagamento proposital ou indisponibilidade de câmera no intervalo crítico. O valor está na interrupção, não na nitidez.",
        clue: {
          id: "frame-12b",
          title: "FRAME 12B — CORREDOR (CÂMERA OFF)",
          text: "Recorte/registro que aponta interrupção proposital de vigilância no intervalo crítico.",
          weight: "forte",
        },
        effects: { certainty: 2, noise: 0 },
      },
    },
  },
};

function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[ch])
  );
}

/* =========================
   STATE
========================= */
function freshState() {
  return {
    caseId: CASE.id,
    startedAt: null,
    visited: {
      locations: {},
      people: {},
      nodes: {},
      weapons: {}, // visitou/examinou arma
    },
    evidence: [],
    collected: {
      weapons: [], // ids das armas marcadas como relevantes
    },
    metrics: {
      certainty: 0,
      noise: 0,
    },
    solution: null,
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return freshState();

  try {
    const st = JSON.parse(raw);

    const next = {
      ...freshState(),
      ...st,
      metrics: { ...freshState().metrics, ...(st.metrics || {}) },
      visited: { ...freshState().visited, ...(st.visited || {}) },
      collected: { ...freshState().collected, ...(st.collected || {}) },
    };

    // harden
    next.visited.locations ||= {};
    next.visited.people ||= {};
    next.visited.nodes ||= {};
    next.visited.weapons ||= {};
    next.evidence = Array.isArray(next.evidence) ? next.evidence : [];
    next.collected.weapons = Array.isArray(next.collected.weapons)
      ? next.collected.weapons
      : [];

    return next;
  } catch {
    return freshState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function wipeState() {
  localStorage.removeItem(STORAGE_KEY);
}

/* =========================
   TOAST / MODAL
========================= */
function toast(msg) {
  ui.toast.textContent = msg;
  ui.toast.hidden = false;
  ui.toast.classList.remove("pop");
  void ui.toast.offsetWidth;
  ui.toast.classList.add("pop");
  setTimeout(() => (ui.toast.hidden = true), 2200);
}

/* =========================
   MODAL STACK (Voltar)
========================= */
let MODAL_STACK = [];

function ensureModalBackButton() {
  // tenta achar um header pai do título (depende do seu HTML)
  const titleEl = ui.modalTitle;
  if (!titleEl) return;

  const header =
    titleEl.closest(".modal-head") || titleEl.parentElement || titleEl;

  // cria o botão se ainda não existir
  let backBtn = document.getElementById("btnModalBack");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.id = "btnModalBack";
    backBtn.className = "btn ghost";
    backBtn.type = "button";
    backBtn.textContent = "← Voltar";
    backBtn.style.marginRight = "10px";

    // coloca antes do título
    header.insertBefore(backBtn, titleEl);

    backBtn.addEventListener("click", () => {
      modalGoBack();
    });
  }

  // mostra/oculta conforme stack
  backBtn.hidden = MODAL_STACK.length === 0;
}

function modalGoBack() {
  if (MODAL_STACK.length === 0) return;

  const prev = MODAL_STACK.pop();
  // reabre o anterior sem empilhar de novo
  openModal(prev.title, prev.html, { push: false });
}

function openModal(title, html, opts = {}) {
  const { push = true, clearStack = false } = opts;

  if (clearStack) MODAL_STACK = [];

  // se já existe um modal aberto e vamos abrir outro, empilha o atual
  if (push && ui.modal && ui.modal.hidden === false) {
    MODAL_STACK.push({
      title: ui.modalTitle?.textContent || "Detalhes",
      html: ui.modalBody?.innerHTML || "",
    });
  }

  ui.modalTitle.textContent = title || "Detalhes";
  ui.modalBody.innerHTML = html || "";
  ui.modal.hidden = false;

  // garante botão voltar e visibilidade correta
  ensureModalBackButton();
}

function closeModal(opts = {}) {
  const { clearStack = false } = opts; // ✅ padrão = false
  if (clearStack) MODAL_STACK = [];

  ui.modal.hidden = true;
  ui.modalBody.innerHTML = "";

  ensureModalBackButton();
}

/* =========================
   CASE HELPERS
========================= */
function getNode(nodeId) {
  return CASE.nodes?.[nodeId] || null;
}

function ensureEvidenceArray(state) {
  if (!Array.isArray(state.evidence)) state.evidence = [];
}

function addEvidence(state, clue, sourceNodeId) {
  if (!clue?.id) return;

  const exists = (state.evidence || []).some((e) => e.id === clue.id);
  if (exists) {
    toast("Essa pista já está no arquivo.");
    return;
  }

  state.evidence.push({
    id: clue.id,
    title: clue.title || clue.id,
    text: clue.text || "",
    weight: clue.weight || "",
    image: clue.image || "",
    caption: clue.caption || "",
    sourceNode: sourceNodeId || "",
  });

  saveState(state);
  toast(`Evidência coletada: ${clue.title || clue.id}`);
}

function applyEffects(state, effects) {
  if (!effects) return;
  state.metrics.certainty += Number(effects.certainty || 0);
  state.metrics.noise += Number(effects.noise || 0);
  saveState(state);
}

function hasEvidenceIds(state, ids = []) {
  const set = new Set((state.evidence || []).map((e) => e.id));
  return (ids || []).every((id) => set.has(id));
}

function checkRequirements(state, reqIds = []) {
  return (reqIds || []).every((req) =>
    (state.evidence || []).some((e) => e.id === req)
  );
}

function hasWeapons(state, ids = []) {
  const set = new Set(state.collected?.weapons || []);
  return (ids || []).every((id) => set.has(id));
}

function notHasWeapons(state, ids = []) {
  const set = new Set(state.collected?.weapons || []);
  return (ids || []).every((id) => !set.has(id));
}

/**
 * Avalia "when" (entrevistas e outros sistemas).
 * Suporta:
 * - hasEvidence: []
 * - hasWeapons: []
 * - notHasWeapons: []
 * - minCertainty / maxNoise / minNoise
 * - default: true
 */
function matchesWhen(state, when) {
  if (!when) return false;
  if (when.default) return true;

  if (when.hasEvidence && !hasEvidenceIds(state, when.hasEvidence))
    return false;
  if (when.hasWeapons && !hasWeapons(state, when.hasWeapons)) return false;
  if (when.notHasWeapons && !notHasWeapons(state, when.notHasWeapons))
    return false;

  const c = Number(state.metrics?.certainty || 0);
  const n = Number(state.metrics?.noise || 0);

  if (Number.isFinite(when.minCertainty) && c < Number(when.minCertainty))
    return false;
  if (Number.isFinite(when.maxNoise) && n > Number(when.maxNoise)) return false;
  if (Number.isFinite(when.minNoise) && n < Number(when.minNoise)) return false;

  return true;
}

function pickInterviewAnswer({ answers, state, suspectId }) {
  const solution = state.solution;
  const certainty = state.metrics?.certainty || 0;
  const noise = state.metrics?.noise || 0;
  const evidenceIds = (state.evidence || []).map((e) => e.id);

  function matchesWhen(when = {}) {
    if (when.default) return true;

    if (when.hasEvidence) {
      if (!when.hasEvidence.every((id) => evidenceIds.includes(id)))
        return false;
    }

    if (when.minCertainty != null && certainty < when.minCertainty)
      return false;

    if (when.maxNoise != null && noise > when.maxNoise) return false;

    return true;
  }

  // 1️⃣ respostas válidas pelo "when"
  const valid = answers.filter((a) => matchesWhen(a.when));
  if (valid.length === 0) return answers[0];

  const metaOk = (a) => {
    const m = a?.meta;
    if (!m) return true;

    // assassino
    if (m === "killerOnly") return solution?.killerId === suspectId;
    if (m === "notKiller") return solution?.killerId !== suspectId;

    // fall guy (bode expiatório)
    if (m === "fallGuyOnly") return solution?.fallGuyId === suspectId;
    if (m === "notFallGuy") return solution?.fallGuyId !== suspectId;

    // específico por id
    if (m?.startsWith?.("killerIs:")) {
      const id = m.split(":")[1];
      return solution?.killerId === id;
    }
    if (m?.startsWith?.("killerIsNot:")) {
      const id = m.split(":")[1];
      return solution?.killerId !== id;
    }

    return true;
  };

  // ✅ aqui estava o bug: era valid.filter, não validMeta.filter
  const validMeta = valid.filter(metaOk);
  if (validMeta.length === 0) return valid[0];

  // 2️⃣ SE É O ASSASSINO → protege narrativa
  if (solution?.killerId === suspectId) {
    // prefere respostas que geram mais ruído que certeza
    const defensive = validMeta.filter(
      (a) => (a.effects?.noise || 0) > (a.effects?.certainty || 0)
    );
    if (defensive.length) return defensive[0];
  }

  // 3️⃣ SE NÃO É O ASSASSINO → tende a entregar algo
  if (solution?.killerId !== suspectId) {
    const revealing = validMeta.filter(
      (a) => (a.effects?.certainty || 0) >= (a.effects?.noise || 0)
    );
    if (revealing.length) return revealing[0];
  }

  // 4️⃣ fallback neutro
  return validMeta[0];
}

/* =========================
   Mapeamento HUB → nodes
========================= */
const LOCATION_TO_NODE = {
  "apt-vitima": "scene",
  "corredor-servico": "camera",
  "garagem-leste": "garage",
  portaria: "doorman",
  clinica: "clinic",
  escritorio: "office2",
};

const PERSON_TO_NODE = {
  livia: "alibi",
  sofia: "witness",
  bruno: "office",
  camila: "camilaLead",
  jonas: "access",
  eduardo: "doctor",
};

/* =========================
   PEOPLE (Perfis & Entrevistas)
========================= */
function getPersonById(personId) {
  return (CASE.suspects || []).find((p) => p.id === personId) || null;
}

function openPeopleModal(state) {
  const people = CASE.suspects || [];

  openModal(
    "Pessoas — Perfis & Entrevistas",
    people
      .map((p) => {
        const img = p.image ? escapeHtml(p.image) : "";
        return `
          <div class="item">
            <div style="display:flex;gap:12px;align-items:center;">
              ${
                img
                  ? `<img src="${img}" alt="${escapeHtml(
                      p.name
                    )}" style="width:64px;height:64px;border-radius:12px;object-fit:cover;" />`
                  : `<div style="width:64px;height:64px;border-radius:12px;background:rgba(255,255,255,.06);"></div>`
              }
              <div style="flex:1;">
                <b>${escapeHtml(p.name)}</b>
                <div class="meta">${escapeHtml(p.role || "")}</div>
                ${
                  Array.isArray(p.tags) && p.tags.length
                    ? `<div class="tiny dim" style="margin-top:6px;">${p.tags
                        .slice(0, 3)
                        .map((t) => `• ${escapeHtml(t)}`)
                        .join(" ")}</div>`
                    : ""
                }
              </div>
            </div>

            <div class="item-actions" style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn" data-profile="${escapeHtml(
                p.id
              )}">Ver ficha</button>
              <button class="btn primary" data-interview="${escapeHtml(
                p.id
              )}">Entrevistar</button>
            </div>
          </div>
        `;
      })
      .join("")
  );

  setTimeout(() => {
    ui.modalBody.querySelectorAll("[data-profile]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-profile");

        openPersonProfileModal(loadState(), id);
      });
    });

    ui.modalBody.querySelectorAll("[data-interview]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-interview");

        openInterviewModal(loadState(), id);
      });
    });
  }, 0);
}

function openPersonProfileModal(state, personId) {
  const person = getPersonById(personId);

  if (!person) {
    openModal("Erro", `<div class="tiny dim">Pessoa inválida.</div>`);
    return;
  }

  // marca que você "viu" essa pessoa
  state.visited ||= {};
  state.visited.people ||= {};
  state.visited.people[personId] = true;
  saveState(state);

  const img = person.image ? escapeHtml(person.image) : "";
  const bio = person.bio || {};
  const notes = Array.isArray(bio.notes) ? bio.notes : [];

  openModal(
    `Ficha — ${escapeHtml(person.name)}`,
    `
      <div class="profile">
        <div class="profile-media">
          ${
            img
              ? `<img class="profile-img" src="${img}" alt="${escapeHtml(
                  person.name
                )}" />`
              : `<div class="profile-img placeholder">Sem imagem</div>`
          }
        </div>

        <div class="profile-info">
          <div class="profile-kicker">ARQUIVO • PERFIL</div>
          <div class="profile-name">${escapeHtml(person.name)}</div>
          <div class="meta">${escapeHtml(person.role || "")}</div>

          <div style="height:12px"></div>

          ${
            bio.who
              ? `<div class="profile-block">
                  <div class="profile-block-title">Quem é</div>
                  <div class="tiny">${escapeHtml(bio.who)}</div>
                </div>`
              : ""
          }

          ${
            bio.relation
              ? `<div class="profile-block">
                  <div class="profile-block-title">Relação com a vítima</div>
                  <div class="tiny">${escapeHtml(bio.relation)}</div>
                </div>`
              : ""
          }

          ${
            bio.motive
              ? `<div class="profile-block">
                  <div class="profile-block-title">Possível motivo</div>
                  <div class="tiny">${escapeHtml(bio.motive)}</div>
                </div>`
              : ""
          }

          ${
            notes.length
              ? `<div class="profile-block">
                  <div class="profile-block-title">Notas</div>
                  <ul class="profile-notes">
                    ${notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}
                  </ul>
                </div>`
              : ""
          }

          <div class="profile-actions" style="justify-content:flex-start;gap:8px;">
            <button class="btn primary" id="btnGoInterview">Entrevistar</button>
            <button class="btn ghost" id="btnBackPeopleFromProfile">Voltar</button>
          </div>
        </div>
      </div>
    `
  );

  setTimeout(() => {
    document.getElementById("btnGoInterview")?.addEventListener("click", () => {
      closeModal();
      openInterviewModal(loadState(), personId);
    });

    document
      .getElementById("btnBackPeopleFromProfile")
      ?.addEventListener("click", () => {
        closeModal();
        openPeopleModal(loadState());
      });
  }, 0);
}

function openInterviewModal(state, personId) {
  const person = getPersonById(personId);
  const interview = CASE.interviews?.[personId];

  if (!person) {
    openModal(
      "Erro",
      `<div class="tiny dim">Pessoa inválida: <b>${escapeHtml(
        personId
      )}</b></div>`
    );
    return;
  }

  if (!interview || !Array.isArray(interview.questions)) {
    openModal(
      "Entrevista indisponível",
      `<div class="tiny dim">Ainda não existe roteiro de entrevista para <b>${escapeHtml(
        person.name
      )}</b>.</div>
       <div style="height:12px"></div>
       <button class="btn" id="btnBackPeople">Voltar</button>`
    );

    setTimeout(() => {
      document
        .getElementById("btnBackPeople")
        ?.addEventListener("click", () => {
          closeModal();
          openPeopleModal(loadState());
        });
    }, 0);

    return;
  }

  // marca visitado (pra inventário)
  state.visited ||= {};
  state.visited.people ||= {};
  state.visited.people[personId] = true;
  saveState(state);

  const img = person.image ? escapeHtml(person.image) : "";

  const questionsHtml = interview.questions
    .map((q) => {
      return `
        <button class="btn" style="width:100%;text-align:left;white-space:normal;"
          data-ask="${escapeHtml(personId)}" data-q="${escapeHtml(q.id)}">
          <b>${escapeHtml(q.label)}</b>
          <div class="tiny dim" style="margin-top:6px;">Fazer pergunta</div>
        </button>
        <div style="height:8px"></div>
      `;
    })
    .join("");

  openModal(
    interview.title || `Entrevista — ${person.name}`,
    `
      <div class="profile">
        <div class="profile-media">
          ${
            img
              ? `<img class="profile-img" src="${img}" alt="${escapeHtml(
                  person.name
                )}" />`
              : `<div class="profile-img placeholder">Sem imagem</div>`
          }
        </div>

        <div class="profile-info">
          <div class="profile-kicker">INTERROGATÓRIO</div>
          <div class="profile-name">${escapeHtml(person.name)}</div>
          <div class="profile-summary">${escapeHtml(
            interview.intro || ""
          )}</div>

          <div style="height:14px"></div>
          <div class="tiny dim"><b>Perguntas</b></div>
          <div style="height:10px"></div>

          ${questionsHtml}

          <div class="profile-actions">
            <button class="btn ghost" id="btnBackPeople2">Voltar</button>
          </div>
        </div>
      </div>
    `
  );

  setTimeout(() => {
    document.getElementById("btnBackPeople2")?.addEventListener("click", () => {
      closeModal();
      openPeopleModal(loadState());
    });

    ui.modalBody.querySelectorAll("[data-ask]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-ask");
        const qid = btn.getAttribute("data-q");
        askInterviewQuestion(loadState(), pid, qid);
      });
    });
  }, 0);
}

function askInterviewQuestion(state, personId, questionId) {
  const person = getPersonById(personId);
  const interview = CASE.interviews?.[personId];
  const q = interview?.questions?.find((x) => x.id === questionId);

  if (!person || !interview || !q) return;

  const ans = pickInterviewAnswer({
    answers: q.answers,
    state,
    suspectId: personId,
  });
  const answerText = ans?.text || "…";
  const effects = ans?.effects;

  // ID estável do "recorte" da entrevista
  const clueId = `int-${personId}-${questionId}`;

  // NÃO arquiva automaticamente: só prepara
  openModal(
    `${person.name} responde`,
    `
      <div class="tiny dim"><b>Pergunta:</b> ${escapeHtml(q.label)}</div>
      <div style="height:12px"></div>

      <div class="notice">
        <div class="p">${escapeHtml(answerText)}</div>
      </div>

      <div style="height:14px"></div>
      <div class="tiny dim">
        Você quer <b>arquivar</b> esta resposta no inventário como evidência?
      </div>

      <div style="height:12px"></div>
      <div class="profile-actions" style="justify-content:flex-start;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="btnArchiveInterview">Arquivar como evidência</button>
        <button class="btn" id="btnDiscardInterview">Descartar</button>
        <button class="btn ghost" id="btnBackToInterview">Voltar às perguntas</button>
      </div>
    `
  );

  setTimeout(() => {
    document
      .getElementById("btnBackToInterview")
      ?.addEventListener("click", () => {
        closeModal();
        openInterviewModal(loadState(), personId);
      });

    document
      .getElementById("btnDiscardInterview")
      ?.addEventListener("click", () => {
        toast("Resposta descartada (não entrou no inventário).");
        closeModal();
        openInterviewModal(loadState(), personId);
      });

    document
      .getElementById("btnArchiveInterview")
      ?.addEventListener("click", () => {
        const st = loadState();

        addEvidence(
          st,
          {
            id: clueId,
            title: `Entrevista: ${person.name} — ${q.label}`,
            text: answerText,
            weight: "entrevista",
            image: person.image || "",
            caption: "Registro de depoimento coletado em interrogatório.",
          },
          `interview:${personId}`
        );

        if (effects) applyEffects(st, effects);

        toast("Entrevista arquivada no inventário.");
        closeModal();
        openInterviewModal(loadState(), personId);
      });
  }, 0);
}

/* =========================
   RENDER: COVER
========================= */
function renderCover(state) {
  ui.btnBackToCover.hidden = true;

  const hasProgress = !!state.startedAt;

  ui.app.innerHTML = `
    <section class="cover-hero cover-hero--full">
      <!-- imagem ocupando 100% do bloco -->
      <img class="cover-bg" src="./assets/ui/pasta-mesa.jpg" alt="" aria-hidden="true" />

      <!-- conteúdo por cima (título + texto + botões) -->
      <div class="cover-overlay">
        <div class="cover-glass">

          <h1 class="cover-title">${escapeHtml(
            CASE.cover?.headline || "EVIDÊNCIA ZERO"
          )}</h1>

          <p class="cover-sub2">
            Um hub investigativo. Locais, pessoas, peças soltas. Nenhuma ordem correta.
          </p>

          <div class="cover-footnote">
            Dica de leitura: trate cada pista como narrativa — não como verdade.
            Atalhos não existem. Só versões.
          </div>

          <div class="cover-actions2">
            <button class="btn primary" id="btnStart">
              ${hasProgress ? "Continuar investigação" : "Começar investigação"}
            </button>
            <button class="btn" id="btnRestart">Recomeçar</button>
            <button class="btn danger" id="btnWipe">Apagar progresso</button>
          </div>

          
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnStart").addEventListener("click", () => {
    const next = loadState();
    if (!next.startedAt) next.startedAt = new Date().toISOString();

    ensureSolution(next);

    saveState(next);
    renderHub(next);
    toast("Investigação iniciada.");
  });

  document.getElementById("btnRestart").addEventListener("click", () => {
    const next = freshState();
    next.startedAt = new Date().toISOString();

    ensureSolution(next);

    saveState(next);
    renderHub(next);
    toast("Recomeçado. Página em branco.");
  });

  document.getElementById("btnWipe").addEventListener("click", () => {
    if (!confirm("Apagar todo o progresso?")) return;
    wipeState();
    renderCover(freshState());
    toast("Progresso apagado.");
  });
}

/* =========================
  MODALS: Victim / Crime / Scene
========================= */
function openVictimModalWithImage() {
  const v = CASE.victim || {};
  const img = v.image ? escapeHtml(v.image) : "";

  openModal(
    "VÍTIMA",
    `
    <div class="profile">
      <div class="profile-media">
        ${
          img
            ? `<img class="profile-img" src="${img}" alt="${escapeHtml(
                v.name || "Vítima"
              )}" />`
            : `<div class="profile-img placeholder">Sem imagem</div>`
        }
      </div>

      <div class="profile-info">
        <div class="profile-kicker">ARQUIVO • PERFIL</div>
        <div class="profile-name">${escapeHtml(v.name || "—")}</div>
        <div class="profile-summary">${escapeHtml(v.summary || "")}</div>

        ${
          Array.isArray(v.notes) && v.notes.length
            ? `
            <div class="profile-block">
              <div class="profile-block-title">Notas</div>
              <ul class="profile-notes">
                ${v.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}
              </ul>
            </div>
          `
            : ""
        }

        <div class="profile-actions">
          <button class="btn ghost" id="btnBackHubFromVictim">Voltar ao HUB</button>
        </div>
      </div>
    </div>
    `
  );

  document
    .getElementById("btnBackHubFromVictim")
    ?.addEventListener("click", () => {
      closeModal();
      renderHub(loadState());
    });
}

function openCrimeModal(state) {
  state = state || loadState();

  const c = CASE.crime || {};
  const img = c.image ? escapeHtml(c.image) : "";

  openModal(
    "CRIME",
    `
    <div class="profile">
      <div class="profile-media">
        ${
          img
            ? `<img class="profile-img" src="${img}" alt="Crime" />`
            : `<div class="profile-img placeholder">Sem imagem</div>`
        }
      </div>

      <div class="profile-info">
        <div class="profile-kicker">ARQUIVO • OCORRÊNCIA</div>
        <div class="profile-name">${escapeHtml(c.time || "Crime")}</div>

        ${
          c.headline
            ? `<div class="crime-headline">${escapeHtml(c.headline)}</div>`
            : ""
        }

        ${
          c.summary
            ? `<div class="profile-summary">${escapeHtml(c.summary)}</div>`
            : ""
        }

        <div class="profile-actions">
          <button class="btn primary" data-modal-action="crime:scene">Abrir Cena do Crime</button>
          <button class="btn" data-modal-action="crime:autopsy">Abrir Perícia</button>
          <button class="btn ghost" data-modal-action="crime:hub">Voltar ao HUB</button>
        </div>
      </div>
    </div>
    `
  );
}

function renderAutopsyModal(data) {
  const html = `
    <section class="laudo">
      <header class="laudo-head">
        <span class="laudo-tag">${escapeHtml(
          data.issuingAuthority || "INSTITUTO MÉDICO LEGAL"
        )}</span>
        ${
          data.confidential
            ? `<span class="laudo-stamp">CONFIDENCIAL</span>`
            : ""
        }
        <h2>${escapeHtml(data.documentType || "Laudo de Autópsia")}</h2>
        <p class="laudo-case">Caso ${escapeHtml(
          data.caseId || "—"
        )} • Data ${escapeHtml(data.date || "—")}</p>
      </header>

      <div class="laudo-grid">
        <section class="laudo-block">
          <h3>Identificação</h3>
          <p><b>Vítima:</b> ${escapeHtml(data.victim?.name || "—")}</p>
          <p><b>Sexo:</b> ${escapeHtml(data.victim?.sex || "—")}</p>
          <p><b>Idade:</b> ${escapeHtml(data.victim?.age ?? "—")}</p>
          <p><b>Altura:</b> ${escapeHtml(data.victim?.heightCm ?? "—")} cm</p>
          <p><b>Peso:</b> ${escapeHtml(data.victim?.weightKg ?? "—")} kg</p>
        </section>

        <section class="laudo-block">
          <h3>Causa e modo</h3>
          <p>${escapeHtml(data.death?.cause || "—")}</p>
          <p><b>Modo:</b> ${escapeHtml(data.death?.manner || "—")}</p>
          ${
            data.death?.estimatedTimeOfDeath
              ? `<p><b>Janela:</b> ${escapeHtml(
                  data.death.estimatedTimeOfDeath.from || "—"
                )} – ${escapeHtml(
                  data.death.estimatedTimeOfDeath.to || "—"
                )}</p>`
              : ""
          }
        </section>

        <section class="laudo-block" style="grid-column: 1 / -1;">
          <h3>Achados corporais</h3>
          <ul>
            ${(data.bodyFindings || [])
              .map((i) => `<li>${escapeHtml(i)}</li>`)
              .join("")}
          </ul>
        </section>

        ${
          data.toxicologySummary
            ? `
            <section class="laudo-block">
              <h3>Resumo toxicológico</h3>
              <p><b>Sedativos:</b> ${
                data.toxicologySummary.sedativesDetected
                  ? "Detectados"
                  : "Não detectados"
              }</p>
              <p><b>Dosagem:</b> ${escapeHtml(
                data.toxicologySummary.dosage || "—"
              )}</p>
              <p><b>Interpretação:</b> ${escapeHtml(
                data.toxicologySummary.interpretation || "—"
              )}</p>
            </section>
            `
            : ""
        }

        <section class="laudo-block destaque" style="grid-column: 1 / -1;">
          <h3>Observações</h3>
          <p>${escapeHtml(data.additionalNotes || "—")}</p>
          ${
            data.medicalExaminer
              ? `<div class="laudo-hr"></div>
                 <p><b>Médico Legista:</b> ${escapeHtml(
                   data.medicalExaminer.name || "—"
                 )} (${escapeHtml(
                  data.medicalExaminer.registration || "—"
                )})</p>`
              : ""
          }
        </section>
      </div>

      <footer class="laudo-actions">
        <button class="btn primary"
          data-modal-action="autopsy:collect"
          data-autopsy='${escapeHtml(JSON.stringify(data))}'>
          Guardar como evidência
        </button>
        <button class="btn ghost" data-modal-action="autopsy:ignore">Ignorar</button>
      </footer>
    </section>
  `;

  openModal("PERÍCIA — LAUDO", html);

  // (opcional) aplica a skin do laudo no modal
  document.querySelector(".modal-card")?.classList.add("modal--laudo");

  setTimeout(() => {
    document
      .getElementById("btnCollectAutopsy")
      ?.addEventListener("click", () => {
        collectAutopsyEvidence(data);
      });
    document
      .getElementById("btnIgnoreAutopsy")
      ?.addEventListener("click", () => {
        closeModal();
      });
  }, 0);
}

function collectAutopsyEvidence(data) {
  const state = loadState();

  addEvidence(
    state,
    {
      id: "autopsy-report", // ✅ casa com solution.requires
      title: `Laudo de Autópsia — ${data.caseId || "—"}`,
      text: [
        data.death?.cause ? `Causa: ${data.death.cause}` : null,
        data.death?.manner ? `Modo: ${data.death.manner}` : null,
        data.toxicologySummary?.interpretation
          ? `Toxicológico: ${data.toxicologySummary.interpretation}`
          : null,
        data.additionalNotes ? `Observações: ${data.additionalNotes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      weight: "pericia",
      image: "./assets/evidence/laudo-autopsia.png", // se existir (ou deixa "")
      caption: "Documento pericial — leitura do jogador.",
      sourceNode: "autopsy",
    },
    "autopsy"
  );

  toast("Laudo de autópsia adicionado ao inventário.");
  closeModal();
}

async function openAutopsyModal() {
  const res = await fetch("./assets/data/autopsia-hvc-2241.json");
  const autopsy = await res.json();
  renderAutopsyModal(autopsy);
}

function addEvidenceToInventory(state, ev) {
  ensureEvidenceArray(state);

  // 1) mantém o registro pericial (ev2-watch etc.)
  const exists = state.evidence.some((x) => x.id === ev.id);
  if (!exists) {
    state.evidence.push({
      id: ev.id,
      title: `${ev.label} — ${ev.officialName}`,
      note: ev.location,
      image: ev.zoomImage,
      type: ev.type,
      text: ev.forensicText || "",
      weight: "cena",
      caption: "Registro pericial (cena do crime).",
      sourceNode: "crime-scene",
    });
  }

  // 2) ✅ novo: se essa evidência tiver clue, arquiva também como pista “de verdade”
  if (ev.clue?.id) {
    const clueExists = state.evidence.some((x) => x.id === ev.clue.id);
    if (!clueExists) {
      state.evidence.push({
        id: ev.clue.id,
        title: ev.clue.title || ev.clue.id,
        text: ev.clue.text || "",
        weight: ev.clue.weight || "cena",
        image: ev.zoomImage || "",
        caption: "Âncora narrativa coletada na cena do crime.",
        sourceNode: "scene",
      });
    }
  }
}

function addSceneEvidenceToInventory(state, sceneId, evNumber, ev) {
  ensureEvidenceArray(state);

  const recordId = `loc:${sceneId}:ev${evNumber}`;

  // 1) registro pericial do zoom
  const exists = state.evidence.some((x) => x.id === recordId);
  if (!exists) {
    state.evidence.push({
      id: recordId,
      title: `${ev.label} — ${ev.officialName}`,
      note: ev.location,
      image: ev.zoomImage,
      type: ev.type,
      text: ev.forensicText || "",
      weight: "local",
      caption: `Registro pericial (location: ${sceneId}).`,
      sourceNode: `location:${sceneId}`,
    });
  }

  // 2) se tiver clue (pista “real”), arquiva também
  if (ev.clue?.id) {
    const clueExists = state.evidence.some((x) => x.id === ev.clue.id);
    if (!clueExists) {
      state.evidence.push({
        id: ev.clue.id,
        title: ev.clue.title || ev.clue.id,
        text: ev.clue.text || "",
        weight: ev.clue.weight || "local",
        image: ev.zoomImage || "",
        caption: `Pista coletada em ${sceneId}.`,
        sourceNode: `location:${sceneId}`,
      });
    }
  }

  // 3) efeitos (certeza/ruído) opcionais
  if (ev.effects) applyEffects(state, ev.effects);
}

function openCrimeEvidenceModal(state, evNumber) {
  const ev = CRIME_SCENE.evidences[evNumber];
  if (!ev) return;

  openModal(
    `${ev.label}`,
    `
      <img src="${escapeHtml(ev.zoomImage)}" alt="${escapeHtml(
      ev.officialName
    )}" />

      <div class="forensic-block">
        <div class="forensic-kicker">Relato pericial</div>
        <div class="forensic-title">${escapeHtml(ev.officialName)}</div>
        <div class="forensic-meta">
          <b>Tipo:</b> ${escapeHtml(ev.type)}<br/>
          <b>Local:</b> ${escapeHtml(ev.location)}<br/><br/>
          ${escapeHtml(ev.forensicText)}
        </div>
      </div>

      <div class="tiny dim" style="margin-top:12px;">
        Deseja <b>coletar</b> esta evidência no inventário?
      </div>

      <div class="profile-actions" style="justify-content:flex-start;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="btnCollectEv">Coletar</button>
        <button class="btn" id="btnIgnoreEv">Ignorar</button>
        <button class="btn ghost" id="btnBackToScene">Voltar à cena</button>
      </div>
    `
  );

  setTimeout(() => {
    document.getElementById("btnBackToScene")?.addEventListener("click", () => {
      closeModal({ clearStack: true });
      openCrimeSceneModal(loadState());
    });

    document.getElementById("btnIgnoreEv")?.addEventListener("click", () => {
      toast("Evidência ignorada (não entrou no inventário).");
      modalGoBack();
    });

    document.getElementById("btnCollectEv")?.addEventListener("click", () => {
      const st = loadState();

      addSceneEvidenceToInventory(st, "apt-vitima", evNumber, ev);
      saveState(st);

      toast(`Evidência coletada: ${ev.label}`);
      modalGoBack();
    });
  }, 0);
}

function openCrimeSceneModal(state) {
  state.visited ||= {};
  state.visited.locations ||= {};
  state.visited.locations["apt-vitima"] = true;
  saveState(state);

  const hotspotsHtml = CRIME_SCENE.hotspots
    .map(
      (h) => `
        <button
          class="hotspot"
          type="button"
          data-ev="${h.ev}"
          style="left:${h.x}%; top:${h.y}%;"
          aria-label="Abrir evidência ${h.ev}"
          title="Abrir evidência ${h.ev}"
        ></button>
      `
    )
    .join("");

  openModal(
    "Cena do Crime — Apartamento 1204",
    `
      <div class="tiny dim" style="margin-bottom:10px;">
        Clique na imagem para investigar pontos de interesse. Nem tudo está visível à primeira vista.
      </div>

      <div class="scene-wrap scene-investigate">
        <img class="scene-img" src="${escapeHtml(
          CRIME_SCENE.sceneImage
        )}" alt="Cena do crime com marcadores de evidência" />
        ${hotspotsHtml}
      </div>

      <div class="profile-actions">
        <button class="btn primary" data-modal-action="scene:close">Fechar</button>
      </div>
    `
  );

  setTimeout(() => {
    const close = document.getElementById("btnCloseScene");
    if (close) close.addEventListener("click", closeModal);

    
  }, 0);
}

function openSceneModal(state, sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return;

  openModal(
    scene.title,
    `
      <div class="scene-layout scene-investigate">
        <div class="scene-image-wrap">
          <img class="scene-image" src="${escapeHtml(
            scene.image
          )}" alt="${escapeHtml(scene.title)}"/>

          ${Object.entries(scene.evidences || {})
            .map(
              ([num, ev]) => `
            <button
              class="hotspot"
              data-scene="${escapeHtml(sceneId)}"
              data-ev="${escapeHtml(num)}"
              style="left:${ev.x}%; top:${ev.y}%;"
              aria-label="Investigar ponto de interesse"
            ></button>
          `
            )
            .join("")}
        </div>

        <div class="scene-hint">${escapeHtml(scene.hint || "")}</div>
      </div>
    `
  );

  setTimeout(() => {
    
  }, 0);
}

function openSceneEvidenceModal(state, sceneId, evNumber) {
  const scene = SCENES[sceneId];
  const ev = scene?.evidences?.[evNumber];
  if (!scene || !ev) return;

  openModal(
    `${ev.label}`,
    `
      <img src="${escapeHtml(ev.zoomImage)}" alt="${escapeHtml(
      ev.officialName
    )}" />

      <div class="forensic-block">
        <div class="forensic-kicker">Relato pericial</div>
        <div class="forensic-title">${escapeHtml(ev.officialName)}</div>
        <div class="forensic-meta">
          <b>Tipo:</b> ${escapeHtml(ev.type)}<br/>
          <b>Local:</b> ${escapeHtml(ev.location)}<br/><br/>
          ${escapeHtml(ev.forensicText || "")}
        </div>
      </div>

      <div class="tiny dim" style="margin-top:12px;">
        Deseja <b>coletar</b> esta evidência no inventário?
      </div>

      <div class="profile-actions" style="justify-content:flex-start;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="btnCollectEv">Coletar</button>
        <button class="btn" id="btnIgnoreEv">Ignorar</button>
        <button class="btn ghost" id="btnBackToScene">Voltar à location</button>
      </div>
    `
  );

  setTimeout(() => {
    document.getElementById("btnBackToScene")?.addEventListener("click", () => {
      modalGoBack();
    });

    document.getElementById("btnIgnoreEv")?.addEventListener("click", () => {
      toast("Evidência ignorada (não entrou no inventário).");
      modalGoBack();
    });

    document.getElementById("btnCollectEv")?.addEventListener("click", () => {
      const st = loadState();

      // monta no formato que o addEvidenceToInventory espera
      const packed = {
        id: `${sceneId}-ev${evNumber}`, // id estável
        label: ev.label,
        officialName: ev.officialName,
        type: ev.type,
        location: ev.location,
        zoomImage: ev.zoomImage,
        forensicText: ev.forensicText || "",
        clue: ev.clue || null, // se você quiser que algumas virem "pista real"
      };

      addEvidenceToInventory(st, packed);
      saveState(st);

      toast(`Evidência coletada: ${ev.label}`);
      modalGoBack();
    });
  }, 0);
}

/* =========================
   WEAPONS HUB
========================= */
function addWeaponToInventory(state, weapon) {
  state.collected ||= {};
  state.collected.weapons ||= [];

  if (state.collected.weapons.includes(weapon.id)) {
    toast("Essa arma já está marcada como relevante.");
    return;
  }

  state.collected.weapons.push(weapon.id);

  // opcional: também vira pista
  ensureEvidenceArray(state);
  const evId = `weapon:${weapon.id}`;
  const exists = state.evidence.some((x) => x.id === evId);

  if (!exists) {
    state.evidence.push({
      id: evId,
      title: `${weapon.label} — ${weapon.name}`,
      text: weapon.description || "",
      weight: "arma",
      image: weapon.image || "",
      caption: weapon.type ? `Tipo: ${weapon.type}` : "",
      sourceNode: "weapons-hub",
    });
  }

  saveState(state);
  toast(`Arma marcada: ${weapon.name}`);
}

function openWeaponModal(state, weaponId) {
  const w = (CASE.weapons || []).find((x) => x.id === weaponId);
  if (!w) return;

  state.visited ||= {};
  state.visited.weapons ||= {};
  state.visited.weapons[w.id] = true;
  saveState(state);

  const already = (state.collected?.weapons || []).includes(w.id);
  const img = w.image ? escapeHtml(w.image) : "";

  openModal(
    `${escapeHtml(w.label)} — ${escapeHtml(w.name)}`,
    `
      <div class="profile">
        <div class="profile-media">
          ${
            img
              ? `<img class="profile-img" src="${img}" alt="${escapeHtml(
                  w.name
                )}" />`
              : `<div class="profile-img placeholder">Sem imagem</div>`
          }
          <div class="tiny dim" style="margin-top:10px;">
            <b>Tipo:</b> ${escapeHtml(w.type || "—")}
          </div>
        </div>

        <div class="profile-info">
          <div class="profile-kicker">ARQUIVO • ARMAS</div>
          <div class="profile-name">${escapeHtml(w.name)}</div>
          <div class="profile-summary">${escapeHtml(w.description || "")}</div>

          ${
            Array.isArray(w.linkedTo) && w.linkedTo.length
              ? `<div class="tiny dim" style="margin-top:12px;">
                   <b>Associada a:</b> ${escapeHtml(w.linkedTo.join(", "))}
                 </div>`
              : ""
          }

          <div class="profile-actions" style="justify-content:flex-start;margin-top:14px;">
            <button class="btn primary" id="btnWeaponMark">
              ${already ? "Já marcada no inventário" : "Marcar como relevante"}
            </button>
            <button class="btn ghost" id="btnWeaponBack">Voltar</button>
          </div>
        </div>
      </div>
    `
  );

  document.getElementById("btnWeaponBack")?.addEventListener("click", () => {
    closeModal();
    openWeaponsHubModal(loadState());
  });

  document.getElementById("btnWeaponMark")?.addEventListener("click", () => {
    const st = loadState();
    if ((st.collected?.weapons || []).includes(w.id)) {
      toast("Já está no inventário.");
      return;
    }
    addWeaponToInventory(st, w);
    closeModal();
    openWeaponModal(loadState(), w.id);
  });
}

function openWeaponsHubModal(state) {
  const weapons = CASE.weapons || [];
  const collected = new Set(state.collected?.weapons || []);

  openModal(
    "Armas do Crime",
    `
      <div class="tiny dim">
        Itens associados a suspeitos. Só um é verdadeiro — o resto é narrativa, plantio ou distração.
      </div>
      <div style="height:12px"></div>

      ${weapons
        .map((w) => {
          const img = w.image ? escapeHtml(w.image) : "";
          const isMarked = collected.has(w.id);
          return `
            <div class="item">
              <div style="display:flex;gap:12px;align-items:center;">
                ${
                  img
                    ? `<img src="${img}" alt="${escapeHtml(w.name)}"
                        style="width:64px;height:64px;border-radius:12px;object-fit:cover;" />`
                    : `<div style="width:64px;height:64px;border-radius:12px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center" class="tiny dim">IMG</div>`
                }
                <div style="flex:1;">
                  <b>${escapeHtml(w.label)} — ${escapeHtml(w.name)}</b>
                  <div class="meta">${escapeHtml(w.type || "")}</div>
                  <div class="tiny dim" style="margin-top:6px;">
                    ${escapeHtml((w.description || "").slice(0, 120))}${
            (w.description || "").length > 120 ? "…" : ""
          }
                  </div>
                </div>
              </div>

              <div class="item-actions" style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn primary" data-open-weapon="${escapeHtml(
                  w.id
                )}">Examinar</button>
                <button class="btn ${
                  isMarked ? "ghost" : ""
                }" data-mark-weapon="${escapeHtml(w.id)}">
                  ${isMarked ? "Marcada" : "Marcar relevante"}
                </button>
              </div>
            </div>
          `;
        })
        .join("")}

      <div style="height:8px"></div>
      <button class="btn ghost" id="btnWeaponsBackHub">Voltar ao HUB</button>
    `
  );

  setTimeout(() => {
    ui.modalBody.querySelectorAll("[data-open-weapon]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-open-weapon");
        closeModal();
        openWeaponModal(loadState(), id);
      });
    });

    ui.modalBody.querySelectorAll("[data-mark-weapon]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-mark-weapon");
        const w = (CASE.weapons || []).find((x) => x.id === id);
        if (!w) return;
        const st = loadState();
        addWeaponToInventory(st, w);
        closeModal();
        openWeaponsHubModal(loadState());
      });
    });

    document
      .getElementById("btnWeaponsBackHub")
      ?.addEventListener("click", () => {
        closeModal();
        renderHub(loadState());
      });
  }, 0);
}

/* =========================
   NODE MODAL (abre nodes reais do CASE_1)
========================= */
function openNodeModal(nodeId, state) {
  const st = state || loadState();
  const node = getNode(nodeId);

  st.visited ||= {};
  st.visited.nodes ||= {};
  st.visited.locations ||= {};
  st.visited.people ||= {};

  if (!node) {
    openModal(
      "Arquivo incompleto",
      `<div class="tiny dim">Node <b>${escapeHtml(
        nodeId
      )}</b> não existe no CASE_1.</div>`
    );
    return;
  }

  st.visited.nodes[nodeId] = true;
  saveState(st);

  const media = node.media?.src
    ? `
      <div style="height:12px"></div>
      <div class="tiny dim">
        <img src="${escapeHtml(node.media.src)}" alt="${escapeHtml(
        node.media.alt || ""
      )}" style="width:100%;border-radius:12px;display:block;" />
        ${
          node.media.caption
            ? `<div style="height:8px"></div><div class="tiny dim">${escapeHtml(
                node.media.caption
              )}</div>`
            : ""
        }
      </div>
    `
    : "";

  const choices = (node.choices || [])
    .map((ch, idx) => {
      const hasClue = !!ch.clue?.id;
      const clueLine = hasClue
        ? `<div class="tiny dim">+ pista: <b>${escapeHtml(
            ch.clue.title || ch.clue.id
          )}</b></div>`
        : `<div class="tiny dim">—</div>`;
      return `
        <button class="btn ${
          idx === 0 ? "primary" : ""
        }" data-node-choice="${escapeHtml(
        nodeId
      )}" data-choice-index="${idx}" style="width:100%;text-align:left;white-space:normal;">
          <div><b>${escapeHtml(ch.label)}</b></div>
          ${clueLine}
        </button>
        <div style="height:8px"></div>
      `;
    })
    .join("");

  openModal(
    `${escapeHtml(node.badge || "Arquivo")} — ${escapeHtml(node.title || "")}`,
    `
      <div class="badge"><span class="badge-dot"></span><span>${escapeHtml(
        node.badge || "NÓ"
      )}</span></div>
      <div style="height:12px"></div>

      <div class="tiny">${escapeHtml(node.text || "")}</div>
      ${media}

      <div style="height:14px"></div>
      <div class="tiny dim"><b>Escolhas</b></div>
      <div style="height:8px"></div>

      ${choices || `<div class="tiny dim">Sem escolhas neste nó.</div>`}

      <div style="height:8px"></div>
      <button class="btn ghost" id="btnBackHubFromNode">Voltar ao HUB</button>
    `
  );

  ui.modalBody.querySelectorAll("[data-node-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fromNodeId = btn.getAttribute("data-node-choice");
      const idx = Number(btn.getAttribute("data-choice-index"));
      const fromNode = getNode(fromNodeId);
      const choice = fromNode?.choices?.[idx];
      if (!choice) return;

      const next = loadState(); // pega o estado mais recente

      if (choice.clue) addEvidence(next, choice.clue, fromNodeId);
      if (choice.effects) applyEffects(next, choice.effects);

      saveState(next);

      const to = choice.to;
      if (!to || !getNode(to)) {
        toast(`Destino "${to}" ainda não está disponível.`);
        closeModal();
        renderHub(loadState());
        return;
      }

      openNodeModal(to, loadState());
    });
  });

  document
    .getElementById("btnBackHubFromNode")
    ?.addEventListener("click", () => {
      closeModal();
      renderHub(loadState());
    });
}

/* =========================
   INVENTORY DRAWER
========================= */
function renderInventoryDrawer(state) {
  const uiState = loadUI();
  const suspects = CASE.suspects || [];
  const ev = state.evidence || [];
  const tab = uiState.invTab || "clues";

  const weaponsAll = CASE.weapons || [];
  const weaponsMarked = (state.collected?.weapons || [])
    .map((id) => weaponsAll.find((w) => w.id === id))
    .filter(Boolean);

  const seenSuspects = suspects.filter((s) => state.visited?.people?.[s.id]);

  const cluesHtml =
    ev.length === 0
      ? `<div class="tiny dim">Nenhuma pista coletada ainda.</div>`
      : ev
          .slice()
          .reverse()
          .map(
            (e) => `
        <div class="inv-item">
          <div class="title">${escapeHtml(e.title || e.id)}</div>
          <div class="meta">${escapeHtml(
            (e.text || e.note || "").slice(0, 140)
          )}${(e.text || e.note || "").length > 140 ? "…" : ""}</div>
        </div>
      `
          )
          .join("");

  const suspectsHtml =
    seenSuspects.length === 0
      ? `<div class="tiny dim">Você ainda não abriu nenhum suspeito/testemunha.</div>`
      : seenSuspects
          .map(
            (s) => `
        <div class="inv-item">
          <div class="title">${escapeHtml(s.name)}</div>
          <div class="meta">${escapeHtml(s.role || "")}</div>
          <div style="height:10px"></div>
          <button class="btn" data-inv-open-person="${escapeHtml(
            s.id
          )}">Abrir</button>
        </div>
      `
          )
          .join("");

  const weaponsHtml =
    weaponsMarked.length === 0
      ? `<div class="tiny dim">Você ainda não marcou nenhuma arma como relevante.</div>`
      : weaponsMarked
          .map(
            (w) => `
        <div class="inv-item">
          <div class="title">${escapeHtml(w.label)} — ${escapeHtml(
              w.name
            )}</div>
          <div class="meta">${escapeHtml(w.type || "")}<br/>${escapeHtml(
              (w.description || "").slice(0, 120)
            )}${(w.description || "").length > 120 ? "…" : ""}</div>
          <div style="height:10px"></div>
          <button class="btn" data-inv-open-weapon="${escapeHtml(
            w.id
          )}">Abrir</button>
        </div>
      `
          )
          .join("");

  return `
    <div class="inventory-backdrop ${
      uiState.invOpen ? "open" : ""
    }" id="invBackdrop"></div>

    <aside class="inventory-drawer ${
      uiState.invOpen ? "open" : ""
    }" id="invDrawer" aria-hidden="${uiState.invOpen ? "false" : "true"}">
      <div class="inventory-head">
        <div>
          <div class="inventory-title">Inventário</div>
          <div class="tiny dim">Certeza: ${
            state.metrics?.certainty || 0
          } • Ruído: ${state.metrics?.noise || 0}</div>
        </div>
        <button class="btn ghost" id="btnInvClose" aria-label="Fechar inventário">✕</button>
      </div>

      <div class="inventory-tabs">
        <button class="tab ${
          tab === "clues" ? "active" : ""
        }" data-inv-tab="clues">
          Pistas <span class="inv-badge">${ev.length}</span>
        </button>
        <button class="tab ${
          tab === "suspects" ? "active" : ""
        }" data-inv-tab="suspects">
          Suspeitos <span class="inv-badge">${seenSuspects.length}</span>
        </button>
        <button class="tab ${
          tab === "weapons" ? "active" : ""
        }" data-inv-tab="weapons">
          Armas <span class="inv-badge">${weaponsMarked.length}</span>
        </button>
      </div>

      <div class="inventory-body">
        ${
          tab === "clues"
            ? cluesHtml
            : tab === "suspects"
            ? suspectsHtml
            : weaponsHtml
        }
      </div>
    </aside>
  `;
}

/* =========================
   RENDER: HUB
========================= */
function renderHub(state) {
  ui.btnBackToCover.hidden = false;

  const evCount = (state.evidence || []).length;

  const topActions = document.querySelector(".top-actions");
  if (topActions) {
    topActions.innerHTML = `
      <button class="btn" id="btnInvToggle">
        Inventário <span class="inv-badge">${evCount}</span>
      </button>
      <button class="btn ghost" id="btnBackToCover">Voltar</button>
    `;
  }

  const IMG = {
    crime: "./assets/ui/news-crime.png",
    victim: "./assets/ui/profile-generic.png",
    weapons: "./assets/ui/thumb-armas.png",
    locations: "./assets/ui/thumb-locais.png",
    people: "./assets/ui/thumb-suspeitos.png",
    conclusion: "./assets/ui/thumb-conclusao.jpg",
  };

  const crimeHeadline = pickProgressIntro(state);

  ui.app.innerHTML = `
    <div class="hub-layout">
      <section class="main-cards">

        <!-- CRIME = JORNAL -->
        <div class="nav-card nav-card--news ${
          state.solution?.rare ? "rare-variant" : ""
        }" id="cardCrime" data-open="crime">
          <div class="news-photo">
          ${
            state.solution?.rare
              ? `
              <div class="rare-stamp-wrap">
                <span class="rare-stamp" title="Existe uma variação rara possível neste caso.">
                  <span class="dot"></span>
                  POSSÍVEL VARIAÇÃO
                </span>
              </div>
    `
              : ""
          }
            <div class="news-photo">
              <img src="${escapeHtml(IMG.crime)}" alt="Cena (genérica)">
            </div>
            <span class="news-strip">Edição Especial</span>
          </div>

          <div class="news-body">
            <div class="news-meta">
              <span class="paper-tag">JORNAL</span>
              <span class="paper-date"> ABR • 23:50</span>
              <span class="paper-loc">Centro • SP</span>
            </div>

            <h3 class="news-headline">Evidência Zero</h3>
            <div class="news-rule"></div>
            <p class="news-sub">${escapeHtml(crimeHeadline)}</p>

            <div class="news-footer">
              <span class="byline">Arquivo de Investigação • Evidência Zero</span>
              <span class="stamp-mini">ABRIR</span>
            </div>
          </div>
        </div>

        <!-- VÍTIMA = PASTA / ARQUIVO (GENÉRICO) -->
        <div class="nav-card nav-card--file" id="cardVictim">
          <div class="card-inner">
            <div class="thumb">
              <img src="${escapeHtml(IMG.victim)}" alt="Foto genérica"/>
            </div>
            <div class="body">
              <div class="tag"><span class="dot"></span>PERFIL</div>
              <h3>Vítima</h3>
              <p class="meta">Arquivo pessoal • informações básicas</p>
            </div>
            <div class="stamp-mini">ABRIR</div>
          </div>
        </div>

        <!-- ARMAS = PASTA -->
        <div class="nav-card nav-card--file" id="cardWeapons">
          <div class="card-inner">
            <div class="thumb">
              <img src="${escapeHtml(IMG.weapons)}" alt="Armas"/>
            </div>
            <div class="body">
              <div class="tag amber"><span class="dot"></span>OBJETOS</div>
              <h3>Armas</h3>
              <p class="meta">${
                (CASE.weapons || []).length
              } itens associados</p>
            </div>
            <div class="stamp-mini">COLETA</div>
          </div>
        </div>

        <!-- LOCAIS = PASTA -->
        <div class="nav-card nav-card--file" id="cardLocations">
          <div class="card-inner">
            <div class="thumb">
              <img src="${escapeHtml(IMG.locations)}" alt="Locais"/>
            </div>
            <div class="body">
              <div class="tag"><span class="dot"></span>MAPA</div>
              <h3>Locais</h3>
              <p class="meta">${
                (CASE.locations || []).length
              } locais disponíveis</p>
            </div>
            <div class="stamp-mini">ROTA</div>
          </div>
        </div>

        <!-- PESSOAS = PASTA -->
        <div class="nav-card nav-card--file" id="cardPeople">
          <div class="card-inner">
            <div class="thumb">
              <img src="${escapeHtml(
                IMG.people
              )}" alt="Suspeitos & Testemunhas"/>
            </div>
            <div class="body">
              <div class="tag"><span class="dot"></span>ENTREVISTAS</div>
              <h3>Suspeitos & Testemunhas</h3>
              <p class="meta">${(CASE.suspects || []).length} pessoas</p>
            </div>
            <div class="stamp-mini">VOZES</div>
          </div>
        </div>

        <!-- CONCLUSÃO = RELATÓRIO -->
        <div class="nav-card nav-card--report" id="cardConclusion" data-open="conclusao">
          <div class="report-head">
            <div class="report-kicker">RELATÓRIO CONCLUSIVO</div>
            <h3>Conclusão da Investigação</h3>
            <p class="meta">Síntese das evidências, vínculos e linha provável dos eventos.</p>
          </div>

          <div class="report-body">
            <div class="report-line">
              <b>Status</b>
              <span>Em elaboração</span>
            </div>
            <div class="report-line">
              <b>Hipótese principal</b>
              <span>Homicídio com contenção e sedação prévia</span>
            </div>
            <div class="report-line">
              <b>Próximo passo</b>
              <span>Confrontar depoimentos × linha do tempo</span>
            </div>
          </div>

          <div class="report-footer">
            <span class="stamp-mini">GERAR</span>
          </div>
        </div>

      </section>
    </div>

    ${renderInventoryDrawer(state)}
  `;

  // ===== binds (mantém sua navegação) =====
  document.getElementById("cardCrime").onclick = () =>
    openCrimeModal(loadState());
  document.getElementById("cardVictim").onclick = () =>
    openVictimModalWithImage();
  document.getElementById("cardWeapons").onclick = () =>
    openWeaponsHubModal(loadState());

  document.getElementById("cardLocations").onclick = () => {
    openModal(
      "Locais",
      (CASE.locations || [])
        .map((l) => {
          const isApt = l.id === "apt-vitima";

          // 🔧 AQUI ENTRA O TRECHO QUE VOCÊ PERGUNTOU
          const sceneThumb = SCENES?.[l.id]?.image;
          const img = sceneThumb
            ? escapeHtml(sceneThumb)
            : l.image
            ? escapeHtml(l.image)
            : "";

          return `
              <div class="item">
                <div style="display:flex;gap:12px;align-items:center;">
                  ${
                    img
                      ? `<img src="${img}"
                          alt="${escapeHtml(l.name)}"
                          style="width:84px;height:64px;border-radius:12px;object-fit:cover;" />`
                      : `<div style="width:84px;height:64px;border-radius:12px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center" class="tiny dim">IMG</div>`
                  }

                <div style="flex:1;">
                  <b>${escapeHtml(l.name)}</b>
                  <div class="meta">${escapeHtml(l.atmosphere || "")}</div>
                  ${
                    l.clue
                      ? `<div class="tiny dim" style="margin-top:8px;">${escapeHtml(
                          l.clue
                        )}</div>`
                      : ""
                  }
                </div>
              </div>

              <div class="item-actions" style="margin-top:10px;">
                ${
                  isApt
                    ? `<button class="btn primary" data-open-crime-scene="1">Abrir cena do crime</button>`
                    : `<button class="btn" data-open-location="${escapeHtml(
                        l.id
                      )}">Investigar</button>`
                }
              </div>
            </div>
          `;
        })
        .join("")
    );

    setTimeout(() => {
      ui.modalBody
        .querySelectorAll("[data-open-crime-scene]")
        .forEach((btn) => {
          btn.addEventListener("click", () => {
            closeModal();
            openCrimeSceneModal(loadState());
          });
        });

      ui.modalBody.querySelectorAll("[data-open-location]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const locId = btn.getAttribute("data-open-location");

          // 1) se existir scene com hotspots/zoom → abre scene
          if (SCENES?.[locId]) {
            closeModal();
            const st = loadState();

            // marca visitado (igual você faz na cena do crime)
            st.visited ||= {};
            st.visited.locations ||= {};
            st.visited.locations[locId] = true;
            saveState(st);

            openSceneModal(st, locId);
            return;
          }

          // 2) senão, cai no node normal (texto/mídia/choices)
          // ✅ prioridade: hotspot scene igual cena do crime
          if (SCENES?.[locId]) {
            closeModal();
            openSceneModal(loadState(), locId);
            return;
          }

          // fallback (se algum local ainda for só node)
          const nodeId = LOCATION_TO_NODE?.[locId];
          if (!nodeId)
            return toast("Esse local ainda não tem scene/node ligado.");
          closeModal();
          openNodeModal(nodeId, loadState());
        });
      });
    }, 0);
  };

  document.getElementById("cardPeople").onclick = () =>
    openPeopleModal(loadState());
  document.getElementById("cardConclusion").onclick = () =>
    renderConclusion(loadState());
}

/* =========================
   CONCLUSION
========================= */

function renderConclusion(state) {
  const suspects = CASE.suspects || [];
  const weapons = CASE.weapons || [];
  const evidences = state.evidence || [];
  const solution = state.solution;

  // defaults (se já existir algo salvo no state no futuro, você pode puxar daqui)
  const defaultMethod = "Sedação + estrangulamento";

  openModal(
    "CONCLUSÃO — INTERROGATÓRIO FINAL",
    `
  <div class="conclu2" data-step="1">
    <header class="conclu2-head">
      <div class="conclu2-badge">
        <span class="dot"></span>
        <span>TESE FINAL • INTERROGATÓRIO</span>
      </div>

      <div class="conclu2-title">Monte sua tese em etapas.</div>
      <div class="conclu2-sub">
        Uma escolha por vez. O laudo ao lado se preenche conforme você decide.
      </div>

      <div class="conclu2-progress">
        <div class="step-pill active" data-step-pill="1">1 • Culpado</div>
        <div class="step-pill" data-step-pill="2">2 • Método</div>
        <div class="step-pill" data-step-pill="3">3 • Armas</div>
        <div class="step-pill" data-step-pill="4">4 • Provas</div>
        <div class="step-pill" data-step-pill="5">5 • Revisão</div>
      </div>
    </header>

    <div class="conclu2-grid">
      <!-- ESQUERDA: INTERROGATÓRIO (ETAPAS) -->
      <section class="conclu2-left">

        <!-- STEP 1 -->
        <div class="step-panel" data-step-panel="1">
          <div class="step-kicker">Pergunta 1/5</div>
          <h3 class="step-q">Quem matou Henrique Valença?</h3>
          <p class="step-hint">Escolha um nome. Você poderá voltar depois.</p>

          <div class="choice">
            <label class="tiny dim">Culpado</label>
            <select id="finalSuspect" class="input">
              ${suspects
                .map(
                  (p) =>
                    `<option value="${p.id}">${escapeHtml(p.name)}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="step-actions">
            <button class="btn primary" data-next>Confirmar</button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div class="step-panel" data-step-panel="2" hidden>
          <div class="step-kicker">Pergunta 2/5</div>
          <h3 class="step-q">Como foi executado?</h3>
          <p class="step-hint">O método define o “esqueleto” da sua narrativa.</p>

          <div class="choice">
            <label class="tiny dim">Método</label>
            <select id="finalMethod" class="input">
              <option ${
                defaultMethod === "Sedação + estrangulamento" ? "selected" : ""
              }>Sedação + estrangulamento</option>
              <option>Força física</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="step-actions">
            <button class="btn ghost" data-prev>Voltar</button>
            <button class="btn primary" data-next>Confirmar</button>
          </div>
        </div>

        <!-- STEP 3 -->
        <div class="step-panel" data-step-panel="3" hidden>
          <div class="step-kicker">Pergunta 3/5</div>
          <h3 class="step-q">Quais objetos sustentam a execução?</h3>
          <p class="step-hint">Marque apenas o que você realmente usará.</p>

          <div class="step-topbar">
            <div class="tiny dim">Selecionadas</div>
            <span class="count-pill" id="pillWeaponCount">0</span>
          </div>

          <div class="list" id="weaponsChecklist">
            ${
              weapons.length === 0
                ? `<div class="empty">Nenhuma arma cadastrada.</div>`
                : weapons
                    .map((w) => {
                      const desc = (w.description || "").slice(0, 130);
                      const more =
                        (w.description || "").length > 130 ? "…" : "";
                      return `
                        <label class="pick-row">
                          <input type="checkbox" class="finalWeapon" value="${escapeHtml(
                            w.id
                          )}"/>
                          <span class="pick-card">
                            <span class="pick-top">
                              <span class="pick-title">${escapeHtml(
                                w.label
                              )} — ${escapeHtml(w.name)}</span>
                              ${
                                w.type
                                  ? `<span class="pick-chip">${escapeHtml(
                                      w.type
                                    )}</span>`
                                  : ""
                              }
                            </span>
                            <span class="pick-sub">${escapeHtml(
                              desc
                            )}${more}</span>
                          </span>
                        </label>
                      `;
                    })
                    .join("")
            }
          </div>

          <div class="step-actions">
            <button class="btn ghost" data-prev>Voltar</button>
            <button class="btn primary" data-next>Confirmar</button>
          </div>
        </div>

        <!-- STEP 4 -->
        <div class="step-panel" data-step-panel="4" hidden>
          <div class="step-kicker">Pergunta 4/5</div>
          <h3 class="step-q">Quais provas tornam isso inevitável?</h3>
          <p class="step-hint">Evidência demais vira ruído. Selecione as que fecham o conjunto.</p>

          ${
            solution?.rare
              ? `<div class="hint" style="margin: 10px 0 12px;">
                  <b>Variação rara detectada:</b> pode exigir uma âncora extra de evidência.
                </div>`
              : ""
          }

          <div class="step-topbar">
            <div class="tiny dim">Selecionadas</div>
            <span class="count-pill" id="pillEvidenceCount">0</span>
          </div>

          <div class="list" id="evidenceChecklist">
            ${
              evidences.length === 0
                ? `<div class="empty">Nenhuma evidência disponível.</div>`
                : evidences
                    .slice()
                    .reverse()
                    .map((e) => {
                      const snippet = (e.text || e.note || "").slice(0, 140);
                      const more =
                        (e.text || e.note || "").length > 140 ? "…" : "";
                      const weight = e.weight
                        ? `<span class="pick-chip ghost">${escapeHtml(
                            e.weight
                          )}</span>`
                        : "";
                      return `
                        <label class="pick-row">
                          <input type="checkbox" class="finalEvidence" value="${escapeHtml(
                            e.id
                          )}"/>
                          <span class="pick-card">
                            <span class="pick-top">
                              <span class="pick-title">${escapeHtml(
                                e.title || e.id
                              )}</span>
                              ${weight}
                            </span>
                            <span class="pick-sub">${escapeHtml(
                              snippet
                            )}${more}</span>
                          </span>
                        </label>
                      `;
                    })
                    .join("")
            }
          </div>

          <div class="hint">
            Dica: use poucas peças — as que fecham o método e a linha do tempo.
          </div>

          <div class="step-actions">
            <button class="btn ghost" data-prev>Voltar</button>
            <button class="btn primary" data-next>Revisar tese</button>
          </div>
        </div>

        <!-- STEP 5 -->
        <div class="step-panel" data-step-panel="5" hidden>
          <div class="step-kicker">Revisão 5/5</div>
          <h3 class="step-q">Você está pronta para submeter?</h3>
          <p class="step-hint">Confira o laudo ao lado. Se estiver firme, finalize.</p>

          <div class="review-box">
            <div class="tiny dim">
              Certeza: <b>${Number(state.metrics?.certainty || 0)}</b> •
              Ruído: <b>${Number(state.metrics?.noise || 0)}</b>
            </div>
          </div>

          <div class="step-actions">
            <button class="btn ghost" data-prev>Voltar</button>
            <button class="btn ghost" id="btnCloseConclusion">Fechar</button>
            <button class="btn primary" id="btnSubmitConclusion">Submeter tese</button>
          </div>
        </div>

      </section>

      <!-- DIREITA: LAUDO (AUTO-PREENCHIDO) -->
      <aside class="conclu2-right">
        <div class="laudo-mini">
          <div class="laudo-mini-head">
            <div class="laudo-mini-kicker">RELATÓRIO FINAL</div>
            <div class="laudo-mini-title">TESE • COERÊNCIA</div>
          </div>

          <div class="laudo-mini-body">
            <div class="laudo-line">
              <b>Vítima</b>
              <span>Henrique Valença</span>
            </div>

            <div class="laudo-line">
              <b>Culpado</b>
              <span id="laudoSuspect">—</span>
            </div>

            <div class="laudo-line">
              <b>Método</b>
              <span id="laudoMethod">—</span>
            </div>

            <div class="laudo-line">
              <b>Armas selecionadas</b>
              <span><span id="laudoWeaponsCount">0</span></span>
            </div>

            <div class="laudo-line">
              <b>Provas selecionadas</b>
              <span><span id="laudoEvidenceCount">0</span></span>
            </div>

            <div class="laudo-hr"></div>

            <div class="laudo-mini-note">
              <b>Critério do sistema:</b> culpado + armas + evidências.<br/>
              <span class="tiny dim">Nada aqui é acidental. Só é prova se sustenta o conjunto.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
  `
  );

  setTimeout(() => {
    // --- helpers ---
    const root = document.querySelector(".conclu2");
    const panels = Array.from(document.querySelectorAll("[data-step-panel]"));
    const pills = Array.from(document.querySelectorAll("[data-step-pill]"));

    const qs = (sel) => document.querySelector(sel);
    const qsa = (sel) => Array.from(document.querySelectorAll(sel));

    const stepOf = () => Number(root?.getAttribute("data-step") || 1);

    const showStep = (n) => {
      if (!root) return;
      root.setAttribute("data-step", String(n));
      panels.forEach((p) => {
        const pn = Number(p.getAttribute("data-step-panel"));
        p.hidden = pn !== n;
      });
      pills.forEach((pill) => {
        const pn = Number(pill.getAttribute("data-step-pill"));
        pill.classList.toggle("active", pn === n);
        pill.classList.toggle("done", pn < n);
      });
    };

    const updateCounts = () => {
      const wc = qsa(".finalWeapon:checked").length;
      const ec = qsa(".finalEvidence:checked").length;

      const pw = qs("#pillWeaponCount");
      const pe = qs("#pillEvidenceCount");
      if (pw) pw.textContent = String(wc);
      if (pe) pe.textContent = String(ec);

      const lwc = qs("#laudoWeaponsCount");
      const lec = qs("#laudoEvidenceCount");
      if (lwc) lwc.textContent = String(wc);
      if (lec) lec.textContent = String(ec);
    };

    const updateLaudo = () => {
      const suspectId = qs("#finalSuspect")?.value || "";
      const suspectName = suspects.find((s) => s.id === suspectId)?.name || "—";
      const method = qs("#finalMethod")?.value || "—";

      const ls = qs("#laudoSuspect");
      const lm = qs("#laudoMethod");
      if (ls) ls.textContent = suspectName;
      if (lm) lm.textContent = method;

      updateCounts();
    };

    // --- step navigation ---
    root?.addEventListener("click", (ev) => {
      const btnNext = ev.target?.closest("[data-next]");
      const btnPrev = ev.target?.closest("[data-prev]");

      if (btnNext) {
        const n = stepOf();
        showStep(Math.min(5, n + 1));
      }
      if (btnPrev) {
        const n = stepOf();
        showStep(Math.max(1, n - 1));
      }
    });

    // --- live updates ---
    qs("#finalSuspect")?.addEventListener("change", updateLaudo);
    qs("#finalMethod")?.addEventListener("change", updateLaudo);

    qsa(".finalWeapon, .finalEvidence").forEach((el) => {
      el.addEventListener("change", updateCounts);
    });

    // --- submit/close ---
    qs("#btnSubmitConclusion")?.addEventListener("click", () => {
      evaluateConclusion(loadState());
    });
    qs("#btnCloseConclusion")?.addEventListener("click", () => {
      closeModal();
    });

    // init
    updateLaudo();
    showStep(1);
  }, 0);
}
function buildConfidentialAnalysisHtml(state, player = {}) {
  const sol = state.solution;
  if (!sol) return `<div class="tiny dim">Sem solução gerada.</div>`;

  const killer = suspectById(sol.killerId);
  const killerName = killer?.name || sol.killerId;

  const weaponNames = (sol.weaponIds || [])
    .map((id) => weaponById(id))
    .filter(Boolean)
    .map((w) => `${w.label} — ${w.name}`);

  const reqTitles = (sol.requires || []).map((id) => {
    const found = (state.evidence || []).find((e) => e.id === id);
    return found?.title || id;
  });

  const rareNote =
    sol.rare === true
      ? `<div class="tiny dim" style="margin-top:10px;">
          <b>Nota:</b> esta seed contém uma variação rara possível.
        </div>`
      : "";

  return `
    <div class="notice">
      <div class="tiny dim"><b>ARQUIVO CONFIDENCIAL — ANÁLISE INTERNA</b></div>
      <div style="height:10px"></div>

      <div class="p"><b>Culpado real:</b> ${escapeHtml(killerName)}</div>
      <div class="p"><b>Motivo (${escapeHtml(
        sol.motiveVariant
      )}):</b> ${escapeHtml(sol.motiveText || "—")}</div>

      <div style="height:10px"></div>
      <div class="p"><b>Peças-chave (objetos):</b><br/>${
        weaponNames.length
          ? weaponNames.map((x) => `• ${escapeHtml(x)}`).join("<br/>")
          : "—"
      }</div>

      <div style="height:10px"></div>
      <div class="p"><b>Pilares exigidos (o que “fecha” o caso):</b><br/>${
        reqTitles.length
          ? reqTitles.map((x) => `• ${escapeHtml(x)}`).join("<br/>")
          : "—"
      }</div>

      <div style="height:10px"></div>
      <div class="p"><b>Lógica do caso:</b><br/>${escapeHtml(
        sol.logic || "—"
      )}</div>

      ${rareNote}

      <div style="height:12px"></div>
      <div class="tiny dim">
        Isto não é a versão pública. É a leitura que o sistema usa para julgar coerência.
      </div>
    </div>
  `;
}

function evaluateConclusion(state) {
  const solution = state.solution;

  if (!solution) {
    toast("Solução não inicializada.");
    return;
  }

  const killer = document.getElementById("finalSuspect")?.value || null;

  const selectedWeapons = Array.from(
    document.querySelectorAll(".finalWeapon:checked")
  ).map((i) => i.value);

  const selectedEvidenceIds = Array.from(
    document.querySelectorAll(".finalEvidence:checked")
  ).map((i) => i.value);

  const selectedEvidence = Array.from(
    document.querySelectorAll(".finalEvidence:checked")
  ).map((i) => i.value);

  let score = 0;

  /* =========================
     1️⃣ Assassino
  ========================= */
  if (killer === solution.killerId) {
    score += 2;
  }

  /* =========================
     2️⃣ Armas (match exato)
     - mesmas armas
     - mesma quantidade
  ========================= */
  const solutionWeapons = solution.weaponIds || [];

  const weaponMatch =
    selectedWeapons.length === solutionWeapons.length &&
    solutionWeapons.every((w) => selectedWeapons.includes(w));

  if (weaponMatch) {
    score += 2;
  }

  /* =========================
     3️⃣ Evidências obrigatórias
  ========================= */
  const hasBaseRequirements = checkRequirements(state, solution.requires || []);
  if (hasBaseRequirements) score += 2;
  const hasRareRequirements = (solution.rareRequires || []).every((id) =>
    selectedEvidence.includes(id)
  );

  const fallGuyId = solution.fallGuyId;
  const trap = solution.fallGuyTrap || { weapons: [], evidences: [] };

  // "erro convincente" = escolheu o bode expiatório + usou a armadilha narrativa
  const pickedFallGuy = killer === fallGuyId;

  const usedTrapWeapon =
    trap.weapons.length === 0
      ? false
      : trap.weapons.every((w) => selectedWeapons.includes(w));

  const usedTrapEvidence =
    trap.evidences.length === 0
      ? false
      : trap.evidences.every((e) => selectedEvidenceIds.includes(e));

  // E NÃO cumpriu o que realmente era obrigatório
  const failedRealRequirements = !(solution.requires || []).every((req) =>
    (state.evidence || []).some((e) => e.id === req)
  );

  // critério final do "final por erro"
  const triggerFallGuyVerdict =
    pickedFallGuy &&
    failedRealRequirements &&
    usedTrapWeapon &&
    usedTrapEvidence;

  if (triggerFallGuyVerdict) {
    closeModal();

    const fg = suspectById(fallGuyId);
    const fgName = fg?.name || fallGuyId;

    openModal(
      "VEREDITO — CONDENAÇÃO POR ERRO",
      `
        <p>
          <b>Você construiu uma tese convincente — e condenou a pessoa errada.</b><br/>
          A narrativa fechava bem no papel. O público compraria. A imprensa aplaudiria.
          Mas os pilares do crime real não estavam completos.
        </p>

        <div class="notice" style="margin-top:12px;">
          <div class="tiny dim"><b>Condenado (por erro investigativo):</b> ${escapeHtml(
            fgName
          )}</div>
          <div style="height:8px"></div>
          <div class="p">
            O caso termina com um culpado “aceitável”. E o verdadeiro assassino
            aprende a melhor lição possível: <b>o mundo não precisa da verdade — só de uma história.</b>
          </div>
        </div>

        <div style="height:12px"></div>
        <div class="tiny dim">
          Dica: quando o final raro existe, ele costuma nascer de um erro elegante.
          Volte, colete os pilares (laudo, acesso, câmera, clínica) e tente de novo.
        </div>
      `
    );

    return;
  }

  closeModal();

  const isWin = score >= 5;
  const isRareWin = isWin && solution.rare === true && hasRareRequirements;

  /* =========================
     VEREDITO
  ========================= */
  if (score >= 5) {
    openModal(
      "VEREDITO",
      `
      <p>
        <b>${
          isRareWin
            ? "VOCÊ ENCONTROU UM FINAL RARO."
            : "Você desmontou a coreografia do crime."
        }</b>
        <br/>
        ${
          isRareWin
            ? `Algumas versões não acontecem sempre — só quando a combinação de pessoas, janela e método se alinha.
               Você não apenas acertou: você atravessou a variação mais difícil de aparecer.`
            : solution.logic ||
              "A verdade se sustentou por coerência, método e prova."
        }
      </p>
      `
    );
  } else if (score >= 3) {
    openModal(
      "VEREDITO",
      `
      <p>
        Você chegou perto. A narrativa era plausível — mas não resistiria a um júri.
      </p>
      `
    );
  } else if (score >= 3) {
    openModal(
      "VEREDITO",
      `
      <p>
        Você chegou perto. A narrativa era plausível — mas não resistiria a um júri.
      </p>

      <div style="height:12px"></div>
      <button class="btn" id="btnConfidential">Ver análise confidencial</button>
      `
    );

    setTimeout(() => {
      document
        .getElementById("btnConfidential")
        ?.addEventListener("click", () => {
          openModal(
            "ANÁLISE CONFIDENCIAL",
            buildConfidentialAnalysisHtml(loadState(), {
              killer,
              selectedWeapons,
              selectedEvidenceIds,
              score,
            })
          );
        });
    }, 0);
  } else {
    openModal(
      "VEREDITO",
      `
      <p>
        A narrativa oficial venceu. O verdadeiro assassino permanece invisível.
      </p>

      <div style="height:12px"></div>
      <button class="btn" id="btnConfidential">Ver análise confidencial</button>
      `
    );

    setTimeout(() => {
      document
        .getElementById("btnConfidential")
        ?.addEventListener("click", () => {
          openModal(
            "ANÁLISE CONFIDENCIAL",
            buildConfidentialAnalysisHtml(loadState(), {
              killer,
              selectedWeapons,
              selectedEvidenceIds,
              score,
            })
          );
        });
    }, 0);
  }
}

/* =========================
   GLOBAL EVENTS
========================= */
ui.btnBackToCover.addEventListener("click", () => {
  closeModal();
  renderCover(loadState());
});

ui.btnCloseModal.addEventListener("click", () => closeModal());
ui.modalBackdrop.addEventListener("click", () => closeModal());

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !ui.modal.hidden) closeModal();
});

/* =========================
   MODAL — EVENT DELEGATION (STACK SAFE)
========================= */
document.addEventListener("click", (e) => {
  if (ui.modal.hidden) return;

  // ações por data-action
  const actionBtn = e.target.closest("[data-modal-action]");
  if (actionBtn) {
    const action = actionBtn.getAttribute("data-modal-action");

    switch (action) {
      case "crime:scene":
        openCrimeSceneModal(loadState());
        return;

      case "crime:autopsy":
        openAutopsyModal();
        return;

      case "crime:hub":
        closeModal({ clearStack: true });
        renderHub(loadState());
        return;

      case "scene:close":
        closeModal(); // mantém stack
        return;

      case "ev:closeAll":
        closeModal({ clearStack: true });
        return;

      case "autopsy:collect": {
        const raw = actionBtn.getAttribute("data-autopsy");
        if (!raw) return;
        collectAutopsyEvidence(JSON.parse(raw));
        return;
      }

      case "autopsy:ignore":
        closeModal();
        return;
    }
  }

  
  // hotspots (cena do crime OU outras scenes)
  const hs = e.target.closest(".hotspot[data-ev]");
  if (!hs) return;

  const sceneId = hs.getAttribute("data-scene");

  // scene genérica (portaria/clinica/etc)
  if (sceneId) {
    const evKey = hs.getAttribute("data-ev");
    openSceneEvidenceModal(loadState(), sceneId, evKey);
    return;
  }

  // cena do crime (sem data-scene)
  const evNum = Number(hs.getAttribute("data-ev"));
  openCrimeEvidenceModal(loadState(), evNum);
  return;
});

document.addEventListener("click", (e) => {
  // Inventário: toggle
  const toggle = e.target.closest("#btnInvToggle");
  if (toggle) {
    const uiState = loadUI();
    uiState.invOpen = !uiState.invOpen;
    saveUI(uiState);
    renderHub(loadState());
    return;
  }

  // Inventário: close
  const closeBtn = e.target.closest("#btnInvClose");
  const backdrop = e.target.closest("#invBackdrop");
  if (closeBtn || backdrop) {
    const uiState = loadUI();
    uiState.invOpen = false;
    saveUI(uiState);
    renderHub(loadState());
    return;
  }

  // Inventário: tabs
  const tabBtn = e.target.closest("[data-inv-tab]");
  if (tabBtn) {
    const uiState = loadUI();
    uiState.invTab = tabBtn.getAttribute("data-inv-tab");
    saveUI(uiState);
    renderHub(loadState());
    return;
  }

  // Inventário: abrir pessoa
  const invOpenPerson = e.target.closest("[data-inv-open-person]");
  if (invOpenPerson) {
    const id = invOpenPerson.getAttribute("data-inv-open-person");
    const st = loadState();

    const uiState = loadUI();
    uiState.invOpen = false;
    saveUI(uiState);

    closeModal();
    openPersonProfileModal(st, id);
    return;
  }

  // Inventário: abrir arma
  const invOpenWeapon = e.target.closest("[data-inv-open-weapon]");
  if (invOpenWeapon) {
    const id = invOpenWeapon.getAttribute("data-inv-open-weapon");
    const st = loadState();

    const uiState = loadUI();
    uiState.invOpen = false;
    saveUI(uiState);

    closeModal();
    openWeaponModal(st, id);
    return;
  }

  // NAVBAR: Voltar
  const back = e.target.closest("#btnBackToCover");
  if (back) {
    closeModal();
    renderCover(loadState());
    return;
  }
});

/* =========================
   BOOT
========================= */
function boot() {
  const state = loadState();
  // garante que solução exista ao iniciar/continuar
  if (state.startedAt) ensureSolution(state);
  renderCover(state);
}

boot();

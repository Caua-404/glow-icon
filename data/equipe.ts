import type { Servico } from "./servicos";

export type ProfissionalId =
  | "eduarda-vieira"
  | "larissa-moura"
  | "camila-rocha"
  | "bianca-alves";

export type AmbienteId = "unhas" | "cabelo" | "cilios" | "maquiagem";

/** Ponto na panorâmica do salão: x/y em % da imagem, zoom da câmera. */
export type FocoCamera = { x: number; y: number; zoom: number };

/** 1 habilitada, 2 experiente, 3 especialista */
export type Nivel = 1 | 2 | 3;

export const ROTULO_NIVEL: Record<Nivel, string> = {
  1: "habilitada",
  2: "experiente",
  3: "especialista",
};

export type Especialidade = {
  nome: string;
  nivel: Nivel;
  /** serviços do catálogo que esta especialidade cobre */
  servicos: string[];
};

export type Avaliacao = {
  nome: string;
  /** AAAA-MM-DD */
  data: string;
  nota: 1 | 2 | 3 | 4 | 5;
  comentario: string;
};

export type Profissional = {
  id: ProfissionalId;
  nome: string;
  especialidade: string;
  frase: string;
  foto: string;
  ambiente: AmbienteId;
  foco: FocoCamera;
  /** três miniaturas de trabalhos */
  trabalhos: [string, string, string];
  especialidades: Especialidade[];
  avaliacoes: [Avaliacao, Avaliacao, Avaliacao];
};

export const FOTO_SALAO = "/img/ambientes/salao.png";

export function fotoAmbiente(ambiente: AmbienteId): string {
  return `/img/ambientes/${ambiente}.png`;
}

/** Selo da categoria na capa. */
export const SELO_AMBIENTE: Record<AmbienteId, string> = {
  unhas: "Unhas",
  cabelo: "Cabelo",
  cilios: "Cílios e Sobrancelhas",
  maquiagem: "Maquiagem",
};

export const equipe: Profissional[] = [
  {
    id: "eduarda-vieira",
    nome: "Eduarda Vieira",
    especialidade: "Nail designer",
    frase: "Acabamento limpo e unhas que duram.",
    foto: "/img/equipe/eduarda-vieira.png",
    ambiente: "unhas",
    foco: { x: 15, y: 55, zoom: 2.6 },
    trabalhos: [
      "/img/servicos/esmaltacao-gel.jpg",
      "/img/servicos/fibra-vidro.jpg",
      "/img/servicos/baby-boomer.jpg",
    ],
    especialidades: [
      {
        nome: "Unhas em gel",
        nivel: 3,
        servicos: [
          "esmaltacao-gel",
          "banho-gel",
          "encapsulado",
          "baby-boomer",
          "esmaltacao-gel-pes",
        ],
      },
      {
        nome: "Alongamento",
        nivel: 3,
        servicos: [
          "fibra-vidro",
          "poligel",
          "manutencao-15-20",
          "manutencao-20-30",
          "manutencao-31",
          "unha-caida",
        ],
      },
      { nome: "Manicure e pedicure", nivel: 2, servicos: ["manicure", "manicure-pe", "retificacao-dedao"] },
    ],
    avaliacoes: [
      { nome: "Marina S.", data: "2026-10-21", nota: 5, comentario: "Fiz nail design em gel e durou mais de três semanas sem descascar. Atendimento calmo e pontual." },
      { nome: "Larissa M.", data: "2026-09-30", nota: 5, comentario: "Ela ouviu o que eu queria e sugeriu um formato que combinou com a minha mão." },
      { nome: "Tatiane R.", data: "2026-09-12", nota: 4, comentario: "Resultado lindo. Só atrasou uns dez minutos para começar." },
    ],
  },
  {
    id: "larissa-moura",
    nome: "Larissa Moura",
    especialidade: "Trancista",
    frase: "Tranças pensadas para o seu cabelo e o seu dia a dia.",
    foto: "/img/equipe/larissa-moura.png",
    ambiente: "cabelo",
    foco: { x: 42, y: 52, zoom: 2.6 },
    trabalhos: [
      "/img/servicos/tranca-boxeadora.jpg",
      "/img/servicos/tranca-box-braids.jpg",
      "/img/servicos/tranca-nago-cabeca.jpg",
    ],
    especialidades: [
      {
        nome: "Tranças tradicionais",
        nivel: 3,
        servicos: [
          "tranca-boxeadora",
          "tranca-lateral",
          "tranca-nago-topo",
          "tranca-nago-cabeca",
          "tranca-desenhada",
        ],
      },
      {
        nome: "Tranças com extensão",
        nivel: 3,
        servicos: [
          "tranca-box-braids",
          "tranca-ghana",
          "tranca-fulani",
          "tranca-french",
          "tranca-boho",
          "tranca-gypsy",
        ],
      },
    ],
    avaliacoes: [
      { nome: "Jéssica P.", data: "2026-10-25", nota: 5, comentario: "Tranças firmes e leves, sem repuxar. Terminou no tempo que ela tinha avisado." },
      { nome: "Renata C.", data: "2026-10-02", nota: 5, comentario: "Box braids do jeito que pedi, sem eu precisar explicar duas vezes." },
      { nome: "Fernanda L.", data: "2026-08-29", nota: 4, comentario: "A nagô ficou ótima, mas o salão estava cheio e esperei um pouco." },
    ],
  },
  {
    id: "camila-rocha",
    nome: "Camila Rocha",
    especialidade: "Cílios e sobrancelhas",
    frase: "Olhar marcante sem exagero.",
    foto: "/img/equipe/camila-rocha.png",
    ambiente: "cilios",
    foco: { x: 70, y: 55, zoom: 2.6 },
    trabalhos: [
      "/img/servicos/cilios-fox.jpg",
      "/img/servicos/cilios-mega-volume.jpg",
      "/img/servicos/sobrancelhas-henna.jpg",
    ],
    especialidades: [
      {
        nome: "Cílios",
        nivel: 3,
        servicos: [
          "cilios-volume-brasileiro",
          "cilios-manut-brasileiro",
          "cilios-fox",
          "cilios-volume-egipcio",
          "cilios-manut-egipcio",
          "cilios-mega-volume",
          "cilios-manut-mega",
          "cilios-tufinho",
        ],
      },
      { nome: "Sobrancelhas", nivel: 3, servicos: ["design-sobrancelhas", "sobrancelhas-henna", "buco"] },
    ],
    avaliacoes: [
      { nome: "Beatriz A.", data: "2026-10-30", nota: 5, comentario: "Volume brasileiro natural, do jeito que eu queria. Explicou todos os cuidados depois." },
      { nome: "Camila D.", data: "2026-10-09", nota: 5, comentario: "Sobrancelha desenhada com calma, respeitando o meu formato." },
      { nome: "Patrícia G.", data: "2026-09-18", nota: 4, comentario: "Os cílios ficaram bons. Vale lembrar que a manutenção é a cada 15 dias." },
    ],
  },
  {
    id: "bianca-alves",
    nome: "Bianca Alves",
    especialidade: "Maquiadora",
    frase: "Pele luminosa, para o dia ou para a festa.",
    foto: "/img/equipe/bianca-alves.png",
    ambiente: "maquiagem",
    foco: { x: 94, y: 50, zoom: 2.2 },
    trabalhos: [
      "/img/servicos/maquiagem-social.jpg",
      "/img/servicos/maquiagem-noiva.jpg",
      "/img/servicos/design-sobrancelhas.jpg",
    ],
    especialidades: [
      {
        nome: "Maquiagem",
        nivel: 3,
        servicos: ["maquiagem-social", "maquiagem-noiva"],
      },
    ],
    avaliacoes: [
      { nome: "Helena V.", data: "2026-10-28", nota: 5, comentario: "Maquiagem de formatura que durou a festa toda. Pele bonita nas fotos e ao vivo." },
      { nome: "Priscila N.", data: "2026-10-08", nota: 5, comentario: "Ficou no estilo que pedi, sem pesar. Pontual e atenciosa." },
      { nome: "Amanda K.", data: "2026-09-16", nota: 4, comentario: "A maquiagem de noiva ficou linda. Só achei o tempo um pouco justo no dia." },
    ],
  },
];

export function profissionalPorId(id: string): Profissional | undefined {
  return equipe.find((p) => p.id === id);
}

export function indiceProfissional(id: ProfissionalId): number {
  return equipe.findIndex((p) => p.id === id);
}

/** Loop: +1 próxima, -1 anterior. */
export function profissionalAdjacente(id: ProfissionalId, delta: number): Profissional {
  const i = indiceProfissional(id);
  const n = equipe.length;
  return equipe[(i + delta + n * 8) % n];
}

/**
 * A foto é mais larga que a tela (left 50% + top 50%).
 * translate(-x%, -y%) coloca o ponto no centro; o zoom nasce nele.
 * Sem clamp: x>85 chega na penteadeira, não fica preso no meio do recorte.
 */
export function transformFoco(foco: FocoCamera, zoom = foco.zoom) {
  return {
    x: `${-foco.x}%`,
    y: `${-foco.y}%`,
    scale: zoom,
    originX: foco.x / 100,
    originY: foco.y / 100,
  };
}

/** Média das avaliações, com uma casa decimal. */
export function notaMedia(p: Profissional): number {
  const soma = p.avaliacoes.reduce((t, a) => t + a.nota, 0);
  return Math.round((soma / p.avaliacoes.length) * 10) / 10;
}

export function formatarNota(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

/** Maior nível da profissional no serviço (0 = não realiza). */
export function nivelNoServico(p: Profissional, servicoId: string): 0 | Nivel {
  return p.especialidades.reduce<0 | Nivel>(
    (maior, e) => (e.servicos.includes(servicoId) && e.nivel > maior ? e.nivel : maior),
    0,
  );
}

/** Quem realiza o serviço, na ordem da equipe. Qualquer uma da lista pode atender. */
export function profissionaisDoServico(servico: Pick<Servico, "id">): Profissional[] {
  return equipe.filter((p) => nivelNoServico(p, servico.id) > 0);
}

export function estrelas(n: Nivel): string {
  return "★".repeat(n);
}

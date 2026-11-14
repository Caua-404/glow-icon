import type { Servico } from "./servicos";

export type ProfissionalId = "ana-paula" | "bianca" | "carla" | "duda";

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
  /** três miniaturas de trabalhos */
  trabalhos: [string, string, string];
  especialidades: Especialidade[];
  avaliacoes: [Avaliacao, Avaliacao, Avaliacao];
};

export const equipe: Profissional[] = [
  {
    id: "ana-paula",
    nome: "Ana Paula",
    especialidade: "Nail designer",
    frase: "Acabamento limpo e unhas que duram.",
    foto: "/img/equipe/ana-paula.jpg",
    trabalhos: [
      "/img/equipe/ana-paula-unhas.jpg",
      "/img/equipe/ana-paula-alongamento.jpg",
      "/img/equipe/ana-paula-baby-boomer.jpg",
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
    id: "bianca",
    nome: "Bianca",
    especialidade: "Trancista",
    frase: "Tranças pensadas para o seu cabelo e o seu dia a dia.",
    foto: "/img/equipe/bianca.jpg",
    trabalhos: [
      "/img/equipe/bianca-boxeadora.jpg",
      "/img/equipe/bianca-box-braids.jpg",
      "/img/equipe/bianca-nago.jpg",
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
    id: "carla",
    nome: "Carla",
    especialidade: "Cílios e sobrancelhas",
    frase: "Olhar marcante sem exagero.",
    foto: "/img/equipe/carla.jpg",
    trabalhos: [
      "/img/equipe/carla-fox.jpg",
      "/img/equipe/carla-mega-volume.jpg",
      "/img/equipe/carla-henna.jpg",
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
    id: "duda",
    nome: "Duda",
    especialidade: "Unhas e sobrancelhas",
    frase: "Acabamento limpo nas unhas e no olhar.",
    foto: "/img/equipe/duda.jpg",
    trabalhos: [
      "/img/equipe/duda-gel.jpg",
      "/img/equipe/duda-sobrancelha.jpg",
      "/img/equipe/duda-tufinho.jpg",
    ],
    especialidades: [
      { nome: "Manicure e gel", nivel: 2, servicos: ["manicure", "manicure-pe", "esmaltacao-gel", "banho-gel", "esmaltacao-gel-pes"] },
      { nome: "Sobrancelhas", nivel: 2, servicos: ["design-sobrancelhas", "sobrancelhas-henna", "buco"] },
      { nome: "Cílios tufinho", nivel: 1, servicos: ["cilios-tufinho"] },
    ],
    avaliacoes: [
      { nome: "Aline T.", data: "2026-10-27", nota: 5, comentario: "A esmaltação em gel durou três semanas e combinou com o que eu pedi." },
      { nome: "Gabriela N.", data: "2026-10-05", nota: 4, comentario: "O design da sobrancelha ficou no tom que combinamos. Demorou um pouco mais que o previsto." },
      { nome: "Isabela F.", data: "2026-09-21", nota: 5, comentario: "Adorei o tufinho: ficou leve e as fotos saíram ótimas." },
    ],
  },
];

export function profissionalPorId(id: string): Profissional | undefined {
  return equipe.find((p) => p.id === id);
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

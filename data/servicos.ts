// Preços da tabela do salão (artes de novembro de 2026).
// Tranças: valor inicial; o orçamento final depende de comprimento, volume e modelo.
// Durações são estimativas só para encaixar o horário.

import { nivelNoServico, equipe, type ProfissionalId } from "./equipe";

export type CategoriaId = "unhas" | "trancas" | "cilios" | "sobrancelhas" | "maquiagem";
export type GrupoId =
  | "maos"
  | "decoracoes"
  | "pes"
  | "trancas-tradicionais"
  | "trancas-extensao"
  | "cilios"
  | "sobrancelhas"
  | "maquiagem";
export type UnidadePreco = "par" | "cada";

export const categorias: { id: CategoriaId; nome: string }[] = [
  { id: "unhas", nome: "Unhas" },
  { id: "trancas", nome: "Tranças" },
  { id: "cilios", nome: "Cílios" },
  { id: "sobrancelhas", nome: "Sobrancelhas" },
  { id: "maquiagem", nome: "Maquiagem" },
];

export const grupos: { id: GrupoId; nome: string }[] = [
  { id: "maos", nome: "Mãos" },
  { id: "decoracoes", nome: "Decorações" },
  { id: "pes", nome: "Pés" },
  { id: "trancas-tradicionais", nome: "Tranças tradicionais" },
  { id: "trancas-extensao", nome: "Tranças com extensão" },
  { id: "cilios", nome: "Cílios" },
  { id: "sobrancelhas", nome: "Sobrancelhas" },
  { id: "maquiagem", nome: "Maquiagem" },
];

/** Parte do corpo trabalhada. Duas profissionais não atendem a mesma região ao mesmo tempo. */
export type Regiao = "maos" | "pes" | "cabelo" | "rosto" | "olhos";

export type Servico = {
  id: string;
  nome: string;
  /** uma frase curta, sem promessa de resultado */
  descricao: string;
  categoria: CategoriaId;
  grupo: GrupoId;
  duracaoMin: number;
  preco: number;
  /** preço de tabela é o valor mínimo (trancas) */
  aPartirDe?: boolean;
  /** "o par" ou "cada", quando o preço não é do serviço inteiro */
  unidade?: UnidadePreco;
  foto: string;
  regiao: Regiao;
  /**
   * Precedência dentro do atendimento, em sequência: menor vem primeiro.
   * Empatou: vale a ordem em que a cliente adicionou.
   */
  ordem: number;
  /**
   * Em quantos dias costuma valer voltar (usado em "Hora de voltar").
   * Sem valor: o serviço não tem retorno (decoração, buço, unha caída).
   */
  retornoDias?: number;
  profissionais: ProfissionalId[];
  maisPedido?: boolean;
  /** outros serviços para sugerir no pedido */
  relacionados: string[];
  beneficios: string[];
  cuidados: string;
  /** texto longo do modal */
  detalhe: string;
};

const catalogo: Omit<
  Servico,
  "profissionais" | "relacionados" | "beneficios" | "cuidados" | "detalhe"
>[] = [
  // —— Mãos
  { id: "fibra-vidro", nome: "Aplicação na fibra de vidro", descricao: "Alongamento em fibra de vidro, no formato combinado.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 21, duracaoMin: 150, preco: 170, foto: "/img/servicos/fibra-vidro.jpg" },
  { id: "poligel", nome: "Aplicação no poligel", descricao: "Alongamento em poligel, no formato combinado.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 21, duracaoMin: 150, preco: 170, foto: "/img/servicos/poligel.jpg" },
  { id: "esmaltacao-gel", nome: "Esmaltação em gel", descricao: "Esmaltação em gel nas unhas naturais.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 3, retornoDias: 21, duracaoMin: 90, preco: 130, maisPedido: true, foto: "/img/servicos/esmaltacao-gel.jpg" },
  { id: "banho-gel", nome: "Banho em gel", descricao: "Camada de gel para fortalecer a unha natural.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 3, retornoDias: 21, duracaoMin: 75, preco: 120, foto: "/img/servicos/banho-gel.jpg" },
  { id: "manutencao-15-20", nome: "Manutenção de 15 a 20 dias", descricao: "Reposição e ajuste no prazo de 15 a 20 dias.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 18, duracaoMin: 90, preco: 100, foto: "/img/servicos/fibra-vidro.jpg" },
  { id: "manutencao-20-30", nome: "Manutenção de 20 a 30 dias", descricao: "Reposição e ajuste no prazo de 20 a 30 dias.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 21, duracaoMin: 120, preco: 120, foto: "/img/servicos/fibra-vidro.jpg" },
  { id: "manutencao-31", nome: "Manutenção de 31 dias ou mais", descricao: "Reposição e ajuste depois de 31 dias.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 21, duracaoMin: 150, preco: 150, foto: "/img/servicos/fibra-vidro.jpg" },
  { id: "unha-caida", nome: "Manutenção com unha caída", descricao: "Reposição de uma unha caída.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, duracaoMin: 20, preco: 10, unidade: "cada", foto: "/img/servicos/fibra-vidro.jpg" },
  { id: "manicure", nome: "Manicure tradicional", descricao: "Cutilagem, lixamento e esmaltação comum.", categoria: "unhas", grupo: "maos", regiao: "maos", ordem: 2, retornoDias: 10, duracaoMin: 45, preco: 35, foto: "/img/servicos/manicure.jpg" },

  // —— Decorações
  { id: "encapsulado", nome: "Encapsulado", descricao: "Encapsulado no par de unhas.", categoria: "unhas", grupo: "decoracoes", regiao: "maos", ordem: 4, duracaoMin: 20, preco: 20, unidade: "par", foto: "/img/servicos/encapsulado.jpg" },
  { id: "baby-boomer", nome: "Baby boomer", descricao: "Degradê baby boomer no par de unhas.", categoria: "unhas", grupo: "decoracoes", regiao: "maos", ordem: 4, duracaoMin: 20, preco: 10, unidade: "par", foto: "/img/servicos/baby-boomer.jpg" },

  // —— Pés
  { id: "esmaltacao-gel-pes", nome: "Esmaltação em gel (pés)", descricao: "Esmaltação em gel nos pés.", categoria: "unhas", grupo: "pes", regiao: "pes", ordem: 3, retornoDias: 21, duracaoMin: 60, preco: 70, foto: "/img/servicos/pedicure-pes.jpg" },
  { id: "retificacao-dedao", nome: "Retificação de dedão", descricao: "Ajuste no par de dedões.", categoria: "unhas", grupo: "pes", regiao: "pes", ordem: 2, duracaoMin: 25, preco: 30, unidade: "par", foto: "/img/servicos/retificacao-dedao.jpg" },
  { id: "manicure-pe", nome: "Manicure tradicional pé", descricao: "Cutilagem, lixamento e esmaltação comum nos pés.", categoria: "unhas", grupo: "pes", regiao: "pes", ordem: 2, retornoDias: 15, duracaoMin: 45, preco: 35, foto: "/img/servicos/pedicure-pes.jpg" },

  // —— Tranças tradicionais (valores iniciais)
  { id: "tranca-boxeadora", nome: "Boxeadora natural", descricao: "Trança boxeadora no cabelo natural. Valor inicial.", categoria: "trancas", grupo: "trancas-tradicionais", regiao: "cabelo", ordem: 2, retornoDias: 30, duracaoMin: 90, preco: 70, aPartirDe: true, foto: "/img/servicos/tranca-boxeadora.jpg" },
  { id: "tranca-lateral", nome: "Trança lateral", descricao: "Trança lateral. Valor inicial.", categoria: "trancas", grupo: "trancas-tradicionais", regiao: "cabelo", ordem: 2, retornoDias: 21, duracaoMin: 60, preco: 50, aPartirDe: true, foto: "/img/servicos/tranca-lateral.jpg" },
  { id: "tranca-nago-topo", nome: "Nagô no topo", descricao: "Nagô só no topo da cabeça. Valor inicial.", categoria: "trancas", grupo: "trancas-tradicionais", regiao: "cabelo", ordem: 2, retornoDias: 30, duracaoMin: 90, preco: 80, aPartirDe: true, foto: "/img/servicos/tranca-nago-topo.jpg" },
  { id: "tranca-nago-cabeca", nome: "Nagô cabeça toda", descricao: "Nagô na cabeça toda. Valor inicial.", categoria: "trancas", grupo: "trancas-tradicionais", regiao: "cabelo", ordem: 2, retornoDias: 45, duracaoMin: 180, preco: 120, aPartirDe: true, foto: "/img/servicos/tranca-nago-cabeca.jpg" },
  { id: "tranca-desenhada", nome: "Tranças desenhadas", descricao: "Tranças desenhadas. Valor inicial.", categoria: "trancas", grupo: "trancas-tradicionais", regiao: "cabelo", ordem: 2, retornoDias: 30, duracaoMin: 120, preco: 90, aPartirDe: true, foto: "/img/servicos/tranca-desenhada.jpg" },

  // —— Tranças com extensão (valores iniciais)
  { id: "tranca-box-braids", nome: "Box Braids", descricao: "Box braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 300, preco: 400, aPartirDe: true, foto: "/img/servicos/tranca-box-braids.jpg" },
  { id: "tranca-ghana", nome: "Ghana Braids", descricao: "Ghana braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 240, preco: 220, aPartirDe: true, foto: "/img/servicos/tranca-ghana.jpg" },
  { id: "tranca-fulani", nome: "Fulani", descricao: "Fulani braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 300, preco: 350, aPartirDe: true, foto: "/img/servicos/tranca-fulani.jpg" },
  { id: "tranca-french", nome: "French Braids", descricao: "French braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 300, preco: 380, aPartirDe: true, foto: "/img/servicos/tranca-french.jpg" },
  { id: "tranca-boho", nome: "Boho Braids", descricao: "Boho braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 300, preco: 420, aPartirDe: true, foto: "/img/servicos/tranca-boho.jpg" },
  { id: "tranca-gypsy", nome: "Gypsy Braids", descricao: "Gypsy braids com extensão. Valor inicial.", categoria: "trancas", grupo: "trancas-extensao", regiao: "cabelo", ordem: 2, retornoDias: 60, duracaoMin: 300, preco: 450, aPartirDe: true, foto: "/img/servicos/tranca-gypsy.jpg" },

  // —— Cílios
  { id: "cilios-volume-brasileiro", nome: "Volume Brasileiro", descricao: "Extensão de cílios no volume brasileiro.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 120, preco: 130, foto: "/img/servicos/cilios-volume-brasileiro.jpg" },
  { id: "cilios-manut-brasileiro", nome: "Manutenção volume brasileiro", descricao: "Manutenção da extensão volume brasileiro.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 60, preco: 90, foto: "/img/servicos/cilios-volume-brasileiro.jpg" },
  { id: "cilios-fox", nome: "Fox", descricao: "Extensão de cílios no efeito fox.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 150, preco: 150, foto: "/img/servicos/cilios-fox.jpg" },
  { id: "cilios-volume-egipcio", nome: "Volume Egípcio", descricao: "Extensão de cílios no volume egípcio.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 150, preco: 150, foto: "/img/servicos/cilios-volume-egipcio.jpg" },
  { id: "cilios-manut-egipcio", nome: "Manutenção volume egípcio", descricao: "Manutenção da extensão volume egípcio.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 75, preco: 100, foto: "/img/servicos/cilios-volume-egipcio.jpg" },
  { id: "cilios-mega-volume", nome: "Mega Volume", descricao: "Extensão de cílios no mega volume.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 180, preco: 170, foto: "/img/servicos/cilios-mega-volume.jpg" },
  { id: "cilios-manut-mega", nome: "Manutenção mega volume", descricao: "Manutenção da extensão mega volume.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 18, duracaoMin: 90, preco: 130, foto: "/img/servicos/cilios-mega-volume.jpg" },
  { id: "cilios-tufinho", nome: "Cílios Tufinho", descricao: "Aplicação de cílios tufinho.", categoria: "cilios", grupo: "cilios", regiao: "olhos", ordem: 2, retornoDias: 10, duracaoMin: 45, preco: 55, foto: "/img/servicos/cilios-tufinho.jpg" },

  // —— Sobrancelhas
  { id: "sobrancelhas-henna", nome: "Design com henna", descricao: "Design de sobrancelhas com henna.", categoria: "sobrancelhas", grupo: "sobrancelhas", regiao: "rosto", ordem: 2, retornoDias: 15, duracaoMin: 45, preco: 70, foto: "/img/servicos/sobrancelhas-henna.jpg" },
  { id: "design-sobrancelhas", nome: "Design simples", descricao: "Design de sobrancelhas, sem henna.", categoria: "sobrancelhas", grupo: "sobrancelhas", regiao: "rosto", ordem: 1, retornoDias: 20, duracaoMin: 20, preco: 40, foto: "/img/servicos/design-sobrancelhas.jpg" },
  { id: "buco", nome: "Buço", descricao: "Depilação do buço.", categoria: "sobrancelhas", grupo: "sobrancelhas", regiao: "rosto", ordem: 1, duracaoMin: 15, preco: 20, foto: "/img/servicos/buco.jpg" },

  // —— Maquiagem
  { id: "maquiagem-social", nome: "Maquiagem social", descricao: "Maquiagem para festa, formatura ou ensaio.", categoria: "maquiagem", grupo: "maquiagem", regiao: "rosto", ordem: 2, retornoDias: 1, duracaoMin: 75, preco: 180, aPartirDe: true, foto: "/img/servicos/maquiagem-social.jpg" },
  { id: "maquiagem-noiva", nome: "Maquiagem de noiva", descricao: "Maquiagem de noiva, com teste combinado à parte.", categoria: "maquiagem", grupo: "maquiagem", regiao: "rosto", ordem: 2, duracaoMin: 150, preco: 450, aPartirDe: true, foto: "/img/servicos/maquiagem-noiva.jpg" },
];

const RELACIONADOS: Record<string, string[]> = {
  "fibra-vidro": ["encapsulado", "manicure-pe"],
  poligel: ["encapsulado", "baby-boomer"],
  "esmaltacao-gel": ["manicure-pe", "encapsulado"],
  "banho-gel": ["manicure-pe", "esmaltacao-gel"],
  "manutencao-15-20": ["encapsulado", "baby-boomer"],
  "manutencao-20-30": ["encapsulado", "baby-boomer"],
  "manutencao-31": ["encapsulado", "esmaltacao-gel-pes"],
  "unha-caida": ["encapsulado"],
  manicure: ["manicure-pe", "esmaltacao-gel"],
  encapsulado: ["baby-boomer", "esmaltacao-gel"],
  "baby-boomer": ["encapsulado", "esmaltacao-gel"],
  "esmaltacao-gel-pes": ["manicure", "retificacao-dedao"],
  "retificacao-dedao": ["manicure-pe", "esmaltacao-gel-pes"],
  "manicure-pe": ["manicure", "esmaltacao-gel-pes"],
  "tranca-boxeadora": ["tranca-lateral", "tranca-desenhada"],
  "tranca-lateral": ["tranca-boxeadora", "tranca-nago-topo"],
  "tranca-nago-topo": ["tranca-nago-cabeca", "tranca-desenhada"],
  "tranca-nago-cabeca": ["tranca-nago-topo", "tranca-desenhada"],
  "tranca-desenhada": ["tranca-nago-topo", "tranca-boxeadora"],
  "tranca-box-braids": ["tranca-boho", "tranca-fulani"],
  "tranca-ghana": ["tranca-french", "tranca-fulani"],
  "tranca-fulani": ["tranca-box-braids", "tranca-boho"],
  "tranca-french": ["tranca-ghana", "tranca-box-braids"],
  "tranca-boho": ["tranca-gypsy", "tranca-box-braids"],
  "tranca-gypsy": ["tranca-boho", "tranca-fulani"],
  "cilios-volume-brasileiro": ["design-sobrancelhas", "cilios-manut-brasileiro"],
  "cilios-manut-brasileiro": ["sobrancelhas-henna", "buco"],
  "cilios-fox": ["design-sobrancelhas", "sobrancelhas-henna"],
  "cilios-volume-egipcio": ["design-sobrancelhas", "cilios-manut-egipcio"],
  "cilios-manut-egipcio": ["sobrancelhas-henna", "buco"],
  "cilios-mega-volume": ["design-sobrancelhas", "cilios-manut-mega"],
  "cilios-manut-mega": ["sobrancelhas-henna", "buco"],
  "cilios-tufinho": ["design-sobrancelhas", "buco"],
  "sobrancelhas-henna": ["buco", "cilios-volume-brasileiro"],
  "design-sobrancelhas": ["buco", "sobrancelhas-henna"],
  buco: ["design-sobrancelhas", "sobrancelhas-henna"],
  "maquiagem-social": ["design-sobrancelhas", "maquiagem-noiva"],
  "maquiagem-noiva": ["design-sobrancelhas", "maquiagem-social"],
};

const BENEFICIOS: Record<CategoriaId, string[]> = {
  unhas: [
    "Formato combinado na hora, sem surpresa no fim.",
    "Acabamento limpo, para durar o ciclo combinado.",
    "Feito na mesa da nail designer do salão.",
  ],
  trancas: [
    "Modelo combinado com o seu cabelo e a sua rotina.",
    "Tensão ajustada para não machucar o couro.",
    "Valor inicial: o orçamento fecha no salão.",
  ],
  cilios: [
    "Efeito combinado no mapa dos olhos.",
    "Fios leves, para o dia a dia ou para a foto.",
    "Manutenção combinada conforme o volume.",
  ],
  sobrancelhas: [
    "Desenho no seu formato, sem raspar o que não precisa.",
    "Henna ou design simples, conforme o pedido.",
    "Pode somar buço no mesmo atendimento.",
  ],
  maquiagem: [
    "Pele no seu tom, para o dia ou para a festa.",
    "Dura o evento, com retoque se precisar.",
    "Teste de noiva combinado à parte.",
  ],
};

const CUIDADOS: Record<CategoriaId, string> = {
  unhas: "Evite produtos de limpeza sem luva e água muito quente no primeiro dia. Se uma unha descolar, volte para o ajuste — não puxe.",
  trancas: "Não molhe nas primeiras 24 horas. Durma com touca de cetim e hidrate o couro cabeludo. O valor final depende de comprimento e volume.",
  cilios: "Não molhe, não use vapor e não esfregue os olhos por 24 horas. Evite máscara oleosa e cílios postiços por cima.",
  sobrancelhas: "Se for henna, não molhe a região na primeira hora. Evite esfoliar e expor ao sol forte no mesmo dia.",
  maquiagem: "Leve um lenço e o batom para retoque se a festa for longa. Demaquile com produto adequado no fim do dia, sem esfregar.",
};

const DETALHES: Record<string, string> = {
  "fibra-vidro": "Alongamento em fibra de vidro, no formato combinado na mesa. O tempo inclui preparação, aplicação e acabamento.",
  poligel: "Alongamento em poligel, no formato combinado. Indicado para quem quer estrutura com um pouco mais de flexibilidade.",
  "esmaltacao-gel": "Esmaltação em gel sobre a unha natural. Cor e acabamento combinados na hora; dura o ciclo de crescimento.",
  "banho-gel": "Camada de gel para fortalecer a unha natural, sem alongar. Bom para quem quebra a unha com facilidade.",
  "manutencao-15-20": "Reposição e ajuste no prazo de 15 a 20 dias. Preenche o crescimento e corrige o que descolou.",
  "manutencao-20-30": "Reposição e ajuste no prazo de 20 a 30 dias. Pode incluir um pouco mais de preenchimento.",
  "manutencao-31": "Reposição depois de 31 dias. Em alguns casos vale refazer o alongamento; a profissional avalia na hora.",
  "unha-caida": "Reposição de uma unha caída, cobrada por unidade. Leva poucos minutos se o restante estiver em ordem.",
  manicure: "Cutilagem, lixamento e esmaltação comum. Acabamento clássico, para quem não quer gel.",
  encapsulado: "Encapsulado no par de unhas, sobre o alongamento ou o gel. O efeito fica sob a camada, sem relevo.",
  "baby-boomer": "Degradê baby boomer no par. Combina com alongamento ou banho em gel.",
  "esmaltacao-gel-pes": "Esmaltação em gel nos pés. Mesma durabilidade das mãos, no formato do seu pé.",
  "retificacao-dedao": "Ajuste no par de dedões, para quem usa salto ou sente o canto encravar.",
  "manicure-pe": "Cutilagem, lixamento e esmaltação comum nos pés.",
  "tranca-boxeadora": "Trança boxeadora no cabelo natural. Valor inicial: o orçamento fecha no salão, conforme volume e comprimento.",
  "tranca-lateral": "Trança lateral. Valor inicial, ajustado no dia conforme o cabelo.",
  "tranca-nago-topo": "Nagô só no topo da cabeça. Valor inicial.",
  "tranca-nago-cabeca": "Nagô na cabeça toda. Valor inicial; o tempo depende da densidade.",
  "tranca-desenhada": "Tranças desenhadas, no desenho combinado. Valor inicial.",
  "tranca-box-braids": "Box braids com extensão. Valor inicial, conforme tamanho e quantidade de fios.",
  "tranca-ghana": "Ghana braids com extensão. Valor inicial.",
  "tranca-fulani": "Fulani braids com extensão. Valor inicial.",
  "tranca-french": "French braids com extensão. Valor inicial.",
  "tranca-boho": "Boho braids com extensão. Valor inicial.",
  "tranca-gypsy": "Gypsy braids com extensão. Valor inicial.",
  "cilios-volume-brasileiro": "Extensão no volume brasileiro: cheio, sem pesar. O mapa é combinado na hora.",
  "cilios-manut-brasileiro": "Manutenção do volume brasileiro, para repor os fios que caíram no ciclo.",
  "cilios-fox": "Efeito fox, alongado no canto externo. Combinado no mapa dos olhos.",
  "cilios-volume-egipcio": "Volume egípcio, mais marcado. Indicado para quem quer o olhar fechado na foto.",
  "cilios-manut-egipcio": "Manutenção do volume egípcio.",
  "cilios-mega-volume": "Mega volume, o mais cheio da tabela. Leva mais tempo na maca.",
  "cilios-manut-mega": "Manutenção do mega volume.",
  "cilios-tufinho": "Tufinho para um efeito rápido, de festa ou de fim de semana.",
  "sobrancelhas-henna": "Design com henna, para preencher falhas por alguns dias. A cor é combinada na hora.",
  "design-sobrancelhas": "Design simples, sem henna. Limpa o formato e respeita o fio.",
  buco: "Depilação do buço, rápida, no mesmo atendimento das sobrancelhas se quiser.",
  "maquiagem-social": "Maquiagem para festa, formatura ou ensaio. Pele no seu tom; o estilo é combinado na cadeira.",
  "maquiagem-noiva": "Maquiagem de noiva. O teste é combinado à parte, em outro dia.",
};

export const servicos: Servico[] = catalogo.map((s) => ({
  ...s,
  profissionais: equipe
    .filter((p) => nivelNoServico(p, s.id) > 0)
    .sort((a, b) => nivelNoServico(b, s.id) - nivelNoServico(a, s.id))
    .map((p) => p.id),
  relacionados: RELACIONADOS[s.id] ?? [],
  beneficios: BENEFICIOS[s.categoria],
  cuidados: CUIDADOS[s.categoria],
  detalhe: DETALHES[s.id] ?? s.descricao,
}));

export function servicoPorId(id: string): Servico | undefined {
  return servicos.find((s) => s.id === id);
}

export function servicosDaProfissional(id: ProfissionalId): Servico[] {
  return servicos.filter((s) => s.profissionais.includes(id));
}

export function fotoDoServico(s: Servico): string {
  return s.foto;
}

/** Agrupa mantendo a ordem de `categorias`. */
export function agruparPorCategoria(lista: Servico[]) {
  return categorias
    .map((c) => ({ categoria: c, itens: lista.filter((s) => s.categoria === c.id) }))
    .filter((g) => g.itens.length > 0);
}

/** Agrupa pela ordem da tabela (mãos, decorações, pés, tranças…). */
export function agruparPorGrupo(lista: Servico[]) {
  return grupos
    .map((g) => ({ grupo: g, itens: lista.filter((s) => s.grupo === g.id) }))
    .filter((g) => g.itens.length > 0);
}

export function formatarPreco(valor: number): string {
  const inteiro = Math.trunc(valor);
  const centavos = Math.round((valor - inteiro) * 100)
    .toString()
    .padStart(2, "0");
  const comMilhar = inteiro
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${comMilhar},${centavos}`;
}

/** Preço como na tabela: "a partir de R$ 70,00", "R$ 20,00 o par". */
export function rotuloPreco(s: Pick<Servico, "preco" | "aPartirDe" | "unidade">): string {
  const base = formatarPreco(s.preco);
  const comUnidade =
    s.unidade === "par" ? `${base} o par` : s.unidade === "cada" ? `${base} cada` : base;
  return s.aPartirDe ? `a partir de ${comUnidade}` : comUnidade;
}

/** Relacionados[] do serviço, ainda fora da sacola. */
export function servicosRelacionados(
  origem: Servico,
  _profissionalId: ProfissionalId,
  jaNaSacola: ReadonlySet<string>,
  limite = 3,
): Servico[] {
  const lista: Servico[] = [];
  const vistos = new Set<string>();
  for (const id of origem.relacionados) {
    if (jaNaSacola.has(id) || vistos.has(id)) continue;
    const s = servicoPorId(id);
    if (!s) continue;
    vistos.add(id);
    lista.push(s);
    if (lista.length >= limite) break;
  }
  return lista;
}

/** Até `limite` sugestões a partir de todos os itens da sacola. */
export function relacionadosDaSacola(idsSacola: ReadonlySet<string>, limite = 2): Servico[] {
  const lista: Servico[] = [];
  const vistos = new Set<string>(idsSacola);
  for (const id of idsSacola) {
    const origem = servicoPorId(id);
    if (!origem) continue;
    for (const rid of origem.relacionados) {
      if (vistos.has(rid)) continue;
      const s = servicoPorId(rid);
      if (!s) continue;
      vistos.add(rid);
      lista.push(s);
      if (lista.length >= limite) return lista;
    }
  }
  return lista;
}

/** Três fotos para o modal: a do serviço e duas da mesma categoria. */
export function galeriaDoServico(s: Servico): [string, string, string] {
  const extra = servicos
    .filter((x) => x.categoria === s.categoria && x.foto !== s.foto)
    .map((x) => x.foto)
    .filter((foto, i, arr) => arr.indexOf(foto) === i);
  const a = extra[0] ?? s.foto;
  const b = extra[1] ?? extra[0] ?? s.foto;
  return [s.foto, a, b];
}

export function formatarDuracao(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

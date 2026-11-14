// Preços da tabela do salão (artes de novembro de 2026).
// Tranças: valor inicial; o orçamento final depende de comprimento, volume e modelo.
// Durações são estimativas só para encaixar o horário.

import { nivelNoServico, equipe, type ProfissionalId } from "./equipe";

export type CategoriaId = "unhas" | "trancas" | "cilios" | "sobrancelhas";
export type GrupoId =
  | "maos"
  | "decoracoes"
  | "pes"
  | "trancas-tradicionais"
  | "trancas-extensao"
  | "cilios"
  | "sobrancelhas";
export type UnidadePreco = "par" | "cada";

export const categorias: { id: CategoriaId; nome: string }[] = [
  { id: "unhas", nome: "Unhas" },
  { id: "trancas", nome: "Tranças" },
  { id: "cilios", nome: "Cílios" },
  { id: "sobrancelhas", nome: "Sobrancelhas" },
];

export const grupos: { id: GrupoId; nome: string }[] = [
  { id: "maos", nome: "Mãos" },
  { id: "decoracoes", nome: "Decorações" },
  { id: "pes", nome: "Pés" },
  { id: "trancas-tradicionais", nome: "Tranças tradicionais" },
  { id: "trancas-extensao", nome: "Tranças com extensão" },
  { id: "cilios", nome: "Cílios" },
  { id: "sobrancelhas", nome: "Sobrancelhas" },
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
};

const catalogo: Omit<Servico, "profissionais">[] = [
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
];

export const servicos: Servico[] = catalogo.map((s) => ({
  ...s,
  profissionais: equipe
    .filter((p) => nivelNoServico(p, s.id) > 0)
    .sort((a, b) => nivelNoServico(b, s.id) - nivelNoServico(a, s.id))
    .map((p) => p.id),
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

export function formatarDuracao(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

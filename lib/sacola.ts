"use client";

import { useSyncExternalStore } from "react";
import { profissionalPorId, profissionaisDoServico } from "@/data/equipe";
import { servicoPorId } from "@/data/servicos";
import type { ItemPacote } from "./pacote";

// Sacola de serviços: o que a cliente marcou para agendar junto. Fica só neste aparelho
// (localStorage) para o contador do header e o modal enxergarem a mesma lista.

export type ItemSacola = {
  servicoId: string;
  /** profissional que a cliente trocou; sem valor, vale a recomendada */
  profissionalId?: string;
};

const CHAVE = "glow-sacola";
const VAZIA: ItemSacola[] = [];

let cache: ItemSacola[] | null = null;
const ouvintes = new Set<() => void>();

function valido(x: unknown): x is ItemSacola {
  if (typeof x !== "object" || x === null) return false;
  const i = x as Record<string, unknown>;
  return (
    typeof i.servicoId === "string" &&
    (i.profissionalId === undefined || typeof i.profissionalId === "string")
  );
}

/** Lista atual. Mantém a mesma referência até algo mudar (exigência do useSyncExternalStore). */
export function sacolaAtual(): ItemSacola[] {
  if (typeof window === "undefined") return VAZIA;
  if (cache) return cache;
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lista: unknown = bruto ? JSON.parse(bruto) : [];
    cache = Array.isArray(lista) ? lista.filter(valido) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function gravar(nova: ItemSacola[]) {
  cache = nova;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(nova));
  } catch {
    /* sem armazenamento: a sacola vale só enquanto a página estiver aberta */
  }
  ouvintes.forEach((f) => f());
}

export function noSacola(servicoId: string): boolean {
  return sacolaAtual().some((i) => i.servicoId === servicoId);
}

export function adicionarNaSacola(servicoId: string, profissionalId?: string) {
  const atual = sacolaAtual();
  if (atual.some((i) => i.servicoId === servicoId)) return;
  gravar([...atual, { servicoId, profissionalId }]);
}

export function removerDaSacola(servicoId: string) {
  gravar(sacolaAtual().filter((i) => i.servicoId !== servicoId));
}

export function alternarNaSacola(servicoId: string) {
  if (noSacola(servicoId)) removerDaSacola(servicoId);
  else adicionarNaSacola(servicoId);
}

export function escolherProfissionalNaSacola(servicoId: string, profissionalId: string) {
  gravar(sacolaAtual().map((i) => (i.servicoId === servicoId ? { ...i, profissionalId } : i)));
}

/** Troca a sacola inteira (usado por "Agendar de novo" e "Repetir este pacote"). */
export function substituirSacola(itens: ItemSacola[]) {
  const vistos = new Set<string>();
  gravar(
    itens.filter((i) => {
      if (vistos.has(i.servicoId)) return false;
      vistos.add(i.servicoId);
      return true;
    }),
  );
}

export function esvaziarSacola() {
  gravar([]);
}

function assinar(f: () => void) {
  ouvintes.add(f);
  // outra aba mexeu na sacola: relê do armazenamento
  const aoMudar = (e: StorageEvent) => {
    if (e.key === CHAVE || e.key === null) {
      cache = null;
      f();
    }
  };
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", aoMudar);
  };
}

/** Sacola atual, reativa. No servidor (e na hidratação) devolve lista vazia. */
export function useSacola(): ItemSacola[] {
  return useSyncExternalStore(assinar, sacolaAtual, () => VAZIA);
}

/** Monta o pacote a partir da sacola. Sem profissional escolhida, usa a recomendada. */
export function itensDaSacola(sacola: ItemSacola[], preferidaId?: string): ItemPacote[] {
  return sacola.flatMap((i) => {
    const servico = servicoPorId(i.servicoId);
    if (!servico) return [];
    const quem = profissionaisDoServico(servico);
    if (quem.length === 0) return [];
    const marcada = i.profissionalId ? profissionalPorId(i.profissionalId) : undefined;
    const naLista = marcada && quem.some((p) => p.id === marcada.id) ? marcada : undefined;
    const preferida = preferidaId ? quem.find((p) => p.id === preferidaId) : undefined;
    return [{ servico, profissional: naLista ?? preferida ?? quem[0] }];
  });
}

export function resumoSacola(itens: ItemSacola[]): { qtd: number; min: number; reais: number } {
  let min = 0;
  let reais = 0;
  let qtd = 0;
  for (const i of itens) {
    const s = servicoPorId(i.servicoId);
    if (!s) continue;
    qtd += 1;
    min += s.duracaoMin;
    reais += s.preco;
  }
  return { qtd, min, reais };
}

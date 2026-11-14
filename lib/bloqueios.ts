"use client";

import { useSyncExternalStore } from "react";

// Horários que a cliente reservou neste aparelho (localStorage).
// Bloqueiam a profissional naquele intervalo, para ninguém agendar por cima.

export type Bloqueio = {
  id: string;
  /** AAAA-MM-DD */
  dia: string;
  profissionalId: string;
  /** minutos desde 00:00 */
  inicio: number;
  fim: number;
  servicoId: string;
};

const CHAVE = "glow-agenda-bloqueios";
const VAZIO: Bloqueio[] = [];

let cache: Bloqueio[] | null = null;
const ouvintes = new Set<() => void>();

function valido(x: unknown): x is Bloqueio {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.dia === "string" &&
    typeof b.profissionalId === "string" &&
    typeof b.servicoId === "string" &&
    typeof b.inicio === "number" &&
    typeof b.fim === "number"
  );
}

/** Lista atual. Mantém a mesma referência até algo mudar (exigência do useSyncExternalStore). */
export function bloqueiosAtuais(): Bloqueio[] {
  if (typeof window === "undefined") return VAZIO;
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

function avisar() {
  ouvintes.forEach((f) => f());
}

export function adicionarBloqueios(novos: Bloqueio[]) {
  cache = [...bloqueiosAtuais(), ...novos];
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cache));
  } catch {
    /* sem armazenamento: o bloqueio vale só enquanto a página estiver aberta */
  }
  avisar();
}

/** Libera os intervalos reservados neste aparelho. */
export function removerBloqueios(ids: string[]) {
  if (ids.length === 0) return;
  cache = bloqueiosAtuais().filter((b) => !ids.includes(b.id));
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cache));
  } catch {
    /* sem armazenamento: vale só enquanto a página estiver aberta */
  }
  avisar();
}

function assinar(f: () => void) {
  ouvintes.add(f);
  // outra aba reservou: relê do armazenamento
  const aoMudar = (e: StorageEvent) => {
    if (e.key === CHAVE || e.key === null) {
      cache = null;
      avisar();
    }
  };
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", aoMudar);
  };
}

/** Bloqueios atuais, reativo. No servidor (e na hidratação) devolve lista vazia. */
export function useBloqueios(): Bloqueio[] {
  return useSyncExternalStore(assinar, bloqueiosAtuais, () => VAZIO);
}

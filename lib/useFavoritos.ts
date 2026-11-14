"use client";

import { useCallback, useEffect, useState } from "react";

const CHAVE = "glow-favoritos";

/** Favoritos das inspirações, salvos no localStorage deste aparelho. */
export function useFavoritos() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const lista: unknown = JSON.parse(bruto);
        if (Array.isArray(lista)) setIds(lista.filter((x): x is string => typeof x === "string"));
      }
    } catch {
      /* dados inválidos: começa vazio */
    }
  }, []);

  const alternar = useCallback((id: string) => {
    setIds((atual) => {
      const proximo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id];
      try {
        localStorage.setItem(CHAVE, JSON.stringify(proximo));
      } catch {
        /* sem armazenamento: vale só nesta visita */
      }
      return proximo;
    });
  }, []);

  const ehFavorito = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ehFavorito, alternar };
}

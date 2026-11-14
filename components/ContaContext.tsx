"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import EntrarModal from "./EntrarModal";

type Ctx = {
  abrirEntrar: () => void;
};

const ContaCtx = createContext<Ctx | null>(null);

export function useContaUi(): Ctx {
  const ctx = useContext(ContaCtx);
  if (!ctx) throw new Error("useContaUi fora do ContaProvider");
  return ctx;
}

export function ContaProvider({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const abrirEntrar = useCallback(() => setAberto(true), []);
  const valor = useMemo(() => ({ abrirEntrar }), [abrirEntrar]);

  return (
    <ContaCtx.Provider value={valor}>
      {children}
      <EntrarModal aberto={aberto} onFechar={() => setAberto(false)} />
    </ContaCtx.Provider>
  );
}

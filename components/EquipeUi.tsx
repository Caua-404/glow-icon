"use client";

import { createContext, useContext } from "react";

export type EquipeUi = {
  naProfissional: boolean;
  /** Painel claro à esquerda: a logo do header fica escura. */
  fundoClaro: boolean;
  qtdSacola: number;
  voltarAoSalao: () => void;
  abrirAgendar: () => void;
};

const Ctx = createContext<EquipeUi | null>(null);

export function EquipeUiProvider({
  value,
  children,
}: {
  value: EquipeUi;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEquipeUi(): EquipeUi | null {
  return useContext(Ctx);
}

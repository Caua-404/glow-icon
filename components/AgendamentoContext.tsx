"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { adicionarNaSacola } from "@/lib/sacola";
import AgendamentoModal, { type PreSelecao } from "./AgendamentoModal";

type Ctx = {
  /** Abre o modal único de agendamento, opcionalmente já com profissional e/ou serviço. */
  abrir: (pre?: PreSelecao) => void;
};

const AgendamentoCtx = createContext<Ctx | null>(null);

export function useAgendamento(): Ctx {
  const ctx = useContext(AgendamentoCtx);
  if (!ctx) throw new Error("useAgendamento fora do AgendamentoProvider");
  return ctx;
}

export function AgendamentoProvider({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [pre, setPre] = useState<PreSelecao>({});

  const abrir = useCallback((p?: PreSelecao) => {
    if (p?.servicoId) adicionarNaSacola(p.servicoId, p.profissionalId);
    setPre(p ?? {});
    setAberto(true);
  }, []);

  const valor = useMemo(() => ({ abrir }), [abrir]);

  return (
    <AgendamentoCtx.Provider value={valor}>
      {children}
      <AgendamentoModal aberto={aberto} pre={pre} onFechar={() => setAberto(false)} />
    </AgendamentoCtx.Provider>
  );
}

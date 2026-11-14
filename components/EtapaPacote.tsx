"use client";

import { useMemo } from "react";
import {
  agruparPorCategoria,
  formatarDuracao,
  formatarPreco,
  servicos,
} from "@/data/servicos";
import type { Bloqueio } from "@/lib/bloqueios";
import {
  avaliarCandidato,
  faixa,
  totalReais,
  verificar,
  type ItemPacote,
  type ModoPacote,
} from "@/lib/pacote";
import BarraTempo from "./BarraTempo";

type Props = {
  principal: ItemPacote;
  extras: ItemPacote[];
  modo: ModoPacote;
  onModo: (m: ModoPacote) => void;
  inicio: number;
  chaveDia: string;
  bloqueios: Bloqueio[];
  onAdicionar: (item: ItemPacote) => void;
  onRemover: (servicoId: string) => void;
  onContinuar: () => void;
};

const MODOS: { id: ModoPacote; rotulo: string; ajuda: string }[] = [
  {
    id: "sequencia",
    rotulo: "Em sequência",
    ajuda: "Um serviço depois do outro, na ordem em que costumam ser feitos (por exemplo, remoção antes do alongamento).",
  },
  {
    id: "simultaneo",
    rotulo: "Ao mesmo tempo",
    ajuda:
      "Profissionais diferentes atendem juntas e cada uma começa no horário escolhido. Serviços da mesma profissional seguem em sequência.",
  },
];

export default function EtapaPacote(props: Props) {
  const { principal, extras, modo, onModo, inicio, chaveDia, bloqueios } = props;
  const itens = useMemo(() => [principal, ...extras], [principal, extras]);

  const vereditoAtual = verificar(itens, modo, inicio, chaveDia, bloqueios);
  const plano = vereditoAtual.plano;

  // cada modo só fica disponível se o pacote atual cabe nele
  const modoOk: Record<ModoPacote, { ok: boolean; motivo?: string }> = {
    sequencia: okDoModo("sequencia"),
    simultaneo: okDoModo("simultaneo"),
  };
  function okDoModo(m: ModoPacote) {
    const v = verificar(itens, m, inicio, chaveDia, bloqueios);
    return v.ok ? { ok: true } : { ok: false, motivo: v.motivo };
  }

  const noPacote = new Set(itens.map((i) => i.servico.id));
  const grupos = agruparPorCategoria(servicos.filter((s) => !noPacote.has(s.id)));

  return (
    <div className="space-y-8">
      {/* barra de tempo: fica visível enquanto a cliente rola a lista */}
      <div className="sticky top-0 z-10 -mx-1 -mt-1 bg-fundo px-1 pb-3 pt-1">
        <BarraTempo plano={plano} inicio={inicio} modo={modo} />
      </div>

      <section aria-labelledby="pacote-modo">
        <p id="pacote-modo" className="rotulo">
          Como os serviços acontecem
        </p>
        <div role="group" aria-labelledby="pacote-modo" className="r-pill mt-3 grid grid-cols-2 gap-1 bg-superficie p-1">
          {MODOS.map((m) => {
            const ativo = modo === m.id;
            const livre = modoOk[m.id].ok;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={ativo}
                disabled={!livre && !ativo}
                onClick={() => onModo(m.id)}
                className={`r-pill min-h-11 text-sm transition-colors disabled:opacity-45 ${
                  ativo ? "sombra-1 bg-card text-tinta" : "text-suave hover:text-tinta"
                }`}
              >
                {m.rotulo}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-suave">
          {MODOS.find((m) => m.id === modo)?.ajuda}
        </p>
        {MODOS.filter((m) => m.id !== modo && !modoOk[m.id].ok).map((m) => (
          <p key={m.id} className="mt-1 text-xs leading-relaxed text-suave">
            {m.rotulo} indisponível: {modoOk[m.id].motivo}
          </p>
        ))}
      </section>

      <section aria-labelledby="pacote-lista">
        <p id="pacote-lista" className="rotulo">
          Seu pacote
        </p>
        <ul className="mt-3 space-y-2">
          {plano.intervalos.map((i) => (
            <li
              key={i.item.servico.id}
              className="r-md sombra-1 flex items-center justify-between gap-3 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm">{i.item.servico.nome}</p>
                <p className="text-xs text-suave">
                  {i.item.profissional.nome} · {faixa(i.inicio, i.fim)} ·{" "}
                  {formatarPreco(i.item.servico.preco)}
                </p>
              </div>
              {i.item.servico.id === principal.servico.id ? (
                <span className="shrink-0 text-xs text-suave">Escolhido</span>
              ) : (
                <button
                  type="button"
                  onClick={() => props.onRemover(i.item.servico.id)}
                  aria-label={`Remover ${i.item.servico.nome}`}
                  className="btn-linha shrink-0 !min-h-10 !px-4"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pacote-add">
        <p id="pacote-add" className="rotulo">
          Adicionar ao pacote
        </p>
        <div className="mt-3 space-y-6">
          {grupos.map(({ categoria, itens: lista }) => (
            <div key={categoria.id}>
              <h3 className="titulo mb-2 text-2xl font-normal">{categoria.nome}</h3>
              <ul className="space-y-2">
                {lista.map((s) => {
                  const c = avaliarCandidato(s, itens, modo, inicio, chaveDia, bloqueios);
                  const idMotivo = `motivo-${s.id}`;
                  return (
                    <li
                      key={s.id}
                      className={`r-md flex items-center justify-between gap-3 px-4 py-3 ${
                        c.ok ? "sombra-1 bg-card" : "bg-superficie"
                      }`}
                    >
                      <div className={`min-w-0 ${c.ok ? "" : "opacity-80"}`}>
                        <p className="text-sm">{s.nome}</p>
                        <p className="text-xs text-suave">
                          {formatarDuracao(s.duracaoMin)} · com {c.profissional.nome} ·{" "}
                          {formatarPreco(s.preco)}
                        </p>
                        {!c.ok && (
                          <p id={idMotivo} className="mt-1 text-xs leading-snug text-tinta">
                            {c.motivo}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={!c.ok}
                        aria-describedby={c.ok ? undefined : idMotivo}
                        aria-label={`Adicionar ${s.nome}`}
                        onClick={() =>
                          c.ok && props.onAdicionar({ servico: s, profissional: c.profissional })
                        }
                        className="btn-linha shrink-0 !min-h-10 !px-4 disabled:pointer-events-none disabled:opacity-40"
                      >
                        Adicionar
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-linha pt-5">
        <p className="text-sm text-suave">Total até aqui</p>
        <p className="titulo text-3xl font-normal">{formatarPreco(totalReais(itens))}</p>
      </div>
      <button type="button" onClick={props.onContinuar} className="btn-acento w-full">
        Continuar
      </button>
    </div>
  );
}

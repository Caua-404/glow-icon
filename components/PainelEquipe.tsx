"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { profissionalPorId, type Profissional } from "@/data/equipe";
import {
  agruparPorGrupo,
  formatarDuracao,
  formatarPreco,
  relacionadosDaSacola,
  rotuloPreco,
  servicoPorId,
  servicosDaProfissional,
  type GrupoId,
  type Servico,
} from "@/data/servicos";
import { linkWhatsapp } from "@/data/site";
import { montarMensagemInteresse } from "@/lib/pedido";
import {
  adicionarNaSacola,
  itensDaSacola,
  removerDaSacola,
  resumoSacola,
  useSacola,
  type ItemSacola,
} from "@/lib/sacola";
import ModalServico from "./ModalServico";

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

type Props = {
  p: Profissional;
  reduzido: boolean;
  fecho: boolean;
  onFecho: (v: boolean) => void;
  onVoltar: () => void;
};

export default function PainelEquipe({ p, reduzido, fecho, onFecho, onVoltar }: Props) {
  const sacola = useSacola();
  const idsSacola = useMemo(() => new Set(sacola.map((i) => i.servicoId)), [sacola]);
  const lista = servicosDaProfissional(p.id);
  const grupos = agruparPorGrupo(lista);
  const totais = resumoSacola(sacola);
  const sugestoes = useMemo(() => relacionadosDaSacola(idsSacola, 2), [idsSacola]);
  const gruposPedido = useMemo(() => agruparPedido(sacola), [sacola]);

  const [grupoId, setGrupoId] = useState<GrupoId>(grupos[0]?.grupo.id ?? "maos");
  const [modal, setModal] = useState<Servico | null>(null);
  const [viuSugestao, setViuSugestao] = useState(false);
  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState<"manhã" | "tarde" | null>(null);
  const [dias, setDias] = useState<string[]>([]);

  const grupoAtual = grupos.find((g) => g.grupo.id === grupoId) ?? grupos[0];

  useEffect(() => {
    if (sacola.length === 0) setViuSugestao(false);
  }, [sacola.length]);

  const mostrarSugestao = fecho && !viuSugestao && sugestoes.length > 0;

  const t = (i: number) =>
    reduzido ? { duration: 0.3 } : { delay: i * 0.08, duration: 0.5, ease: EASE };

  function adicionar(s: Servico) {
    if (idsSacola.has(s.id)) return;
    const pid = s.profissionais.includes(p.id) ? p.id : s.profissionais[0];
    adicionarNaSacola(s.id, pid);
  }

  function remover(s: Servico) {
    removerDaSacola(s.id);
  }

  function alternar(s: Servico) {
    if (idsSacola.has(s.id)) remover(s);
    else adicionar(s);
  }

  function dispensarSugestao() {
    setViuSugestao(true);
  }

  function enviar() {
    if (!nome.trim() || !periodo) return;
    const url = linkWhatsapp(
      montarMensagemInteresse({
        nome,
        periodo,
        dias,
        grupos: gruposPedido.map((g) => ({
          profissional: g.p.nome,
          servicos: g.itens.map((s) => ({
            nome: s.nome,
            duracao: formatarDuracao(s.duracaoMin),
            preco: rotuloPreco(s),
          })),
        })),
        duracao: formatarDuracao(totais.min),
        total: formatarPreco(totais.reais),
      }),
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function toggleDia(d: string) {
    setDias((atual) => (atual.includes(d) ? atual.filter((x) => x !== d) : [...atual, d]));
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-tinta">
      <motion.button
        type="button"
        initial={reduzido ? { opacity: 0 } : { opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0)}
        onClick={onVoltar}
        className="mb-3 self-start text-sm text-suave underline-offset-4 hover:underline"
      >
        Voltar ao salão
      </motion.button>

      <motion.div
        initial={reduzido ? { opacity: 0 } : { opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0)}
        className="flex items-center gap-4"
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-superficie ring-1 ring-linha">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.foto} alt="" className="h-full w-full object-cover object-[center_12%]" />
        </span>
        <span>
          <span className="rotulo block">{p.especialidade}</span>
          <span className="titulo mt-1 block text-[2rem] font-light leading-none md:text-5xl">
            {p.nome}
          </span>
        </span>
      </motion.div>

      {fecho ? (
        <form
          className="mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
        >
          {mostrarSugestao && (
            <div className="space-y-3">
              <p className="titulo text-2xl font-light leading-tight">Quer aproveitar e fazer também?</p>
              <ul className="space-y-2">
                {sugestoes.map((s) => (
                  <li
                    key={s.id}
                    className="r-md flex items-center justify-between gap-3 bg-card px-3 py-3 text-tinta ring-1 ring-linha"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm leading-snug">{s.nome}</span>
                      <span className="mt-0.5 block text-xs text-suave">
                        {rotuloPreco(s)} · {formatarDuracao(s.duracaoMin)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => adicionar(s)}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--r-md)] bg-[var(--madeira-escura)] px-3 text-sm leading-none text-[#F7F3EE]"
                    >
                      Adicionar
                      <Mais />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={dispensarSugestao} className="text-sm text-suave underline-offset-4 hover:underline">
                Agora não
              </button>
            </div>
          )}

          {gruposPedido.length > 0 ? (
            <ul className="space-y-5">
              {gruposPedido.map((g) => (
                <li key={g.p.id}>
                  <div className="flex items-center gap-2.5">
                    <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.p.foto} alt="" className="h-full w-full object-cover object-[center_12%]" />
                    </span>
                    <span className="titulo text-lg font-light leading-none">{g.p.nome}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {g.itens.map((s) => (
                      <li key={s.id} className="flex items-start justify-between gap-3 py-1">
                        <span className="min-w-0">
                          <span className="block text-sm leading-snug">{s.nome}</span>
                          <span className="text-xs text-suave">{formatarDuracao(s.duracaoMin)}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-0.5">
                          <span className="titulo text-base leading-none">{rotuloPreco(s)}</span>
                          <button
                            type="button"
                            onClick={() => remover(s)}
                            className="text-[11px] text-[#9a4a4a]"
                          >
                            Remover
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-suave">
              Sem serviços na sacola ainda. Envie seu nome e o período, que combinamos o restante no WhatsApp.
            </p>
          )}

          {totais.qtd > 0 && (
            <div className="r-md bg-superficie px-4 py-3 ring-1 ring-[var(--dourado)]/60">
              <p className="flex items-baseline justify-between gap-3 text-sm text-suave">
                <span>Tempo estimado</span>
                <span>{formatarDuracao(totais.min)}</span>
              </p>
              <p className="mt-2 flex items-baseline justify-between gap-3">
                <span className="rotulo">Total</span>
                <span className="titulo text-[2rem] font-light leading-none">{formatarPreco(totais.reais)}</span>
              </p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-suave">
            Valores podem variar conforme avaliação no salão.
          </p>

          <label className="block text-sm">
            <span className="rotulo">Seu nome</span>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              className="r-md mt-2 min-h-11 w-full bg-card px-3 text-tinta outline-none ring-1 ring-linha focus:ring-2 focus:ring-madeira"
            />
          </label>
          <fieldset>
            <legend className="rotulo">Período preferido</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["manhã", "tarde"] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  aria-pressed={periodo === op}
                  onClick={() => setPeriodo(op)}
                  className={`r-md min-h-11 capitalize ${
                    periodo === op ? "btn-acento !leading-none" : "btn-linha"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="rotulo">Dias opcionais</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DIAS.map((d) => {
                const on = dias.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleDia(d)}
                    className={`r-pill min-h-9 px-3 text-xs ${
                      on ? "bg-[var(--madeira-escura)] text-[#F7F3EE]" : "bg-card text-tinta ring-1 ring-linha"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <button type="submit" disabled={!nome.trim() || !periodo} className="btn-acento w-full !leading-none disabled:opacity-40">
            Enviar pedido pelo WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onFecho(false)}
            className="btn-linha w-full"
          >
            Voltar aos serviços
          </button>
        </form>
      ) : (
        <>
          {grupos.length > 1 && (
            <motion.div
              initial={reduzido ? { opacity: 0 } : { opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={t(1)}
              className="-mx-1 mt-4 flex shrink-0 gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Categorias"
            >
              {grupos.map(({ grupo }) => {
                const ativo = grupo.id === (grupoAtual?.grupo.id ?? grupoId);
                return (
                  <button
                    key={grupo.id}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => setGrupoId(grupo.id)}
                    className={`r-pill shrink-0 px-3 py-1.5 text-xs leading-none ${
                      ativo
                        ? "bg-[var(--madeira-escura)] text-[#F7F3EE]"
                        : "bg-card text-tinta ring-1 ring-linha"
                    }`}
                  >
                    {grupo.nome}
                  </button>
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={reduzido ? { opacity: 0 } : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={t(2)}
            className="relative mt-3 min-h-0 flex-1"
          >
            <ul className="h-full space-y-2 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {grupoAtual?.itens.map((s) => (
                <LinhaServico
                  key={s.id}
                  s={s}
                  naSacola={idsSacola.has(s.id)}
                  onSaiba={() => setModal(s)}
                  onAlternar={() => alternar(s)}
                />
              ))}
            </ul>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-fundo to-transparent"
            />
          </motion.div>
        </>
      )}

      {modal && (
        <ModalServico
          s={modal}
          naSacola={idsSacola.has(modal.id)}
          onFechar={() => setModal(null)}
          onAlternar={() => alternar(modal)}
        />
      )}
    </div>
  );
}

function agruparPedido(sacola: ItemSacola[]) {
  const itens = itensDaSacola(sacola);
  const ordem: string[] = [];
  const mapa = new Map<string, { p: Profissional; itens: Servico[] }>();
  for (const it of itens) {
    const id = it.profissional.id;
    if (!mapa.has(id)) {
      const p = profissionalPorId(id);
      if (!p) continue;
      mapa.set(id, { p, itens: [] });
      ordem.push(id);
    }
    mapa.get(id)!.itens.push(it.servico);
  }
  return ordem.map((id) => mapa.get(id)!);
}

function LinhaServico({
  s,
  naSacola,
  onSaiba,
  onAlternar,
}: {
  s: Servico;
  naSacola: boolean;
  onSaiba: () => void;
  onAlternar: () => void;
}) {
  return (
    <li
      className={`r-md bg-card px-3 py-3 text-tinta shadow-[var(--sombra-1)] ${
        naSacola ? "ring-1 ring-[var(--dourado)]" : "ring-1 ring-linha"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 text-sm leading-snug text-[#2a2019]">{s.nome}</p>
        <p className="titulo shrink-0 text-[1.2rem] leading-none text-[#2a2019]">{rotuloPreco(s)}</p>
      </div>
      <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#5c4e42]">{s.descricao}</p>
      <p className="mt-0.5 text-xs text-[#7a6a5c]">{formatarDuracao(s.duracaoMin)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSaiba}
          className="inline-flex min-h-10 items-center rounded-[var(--r-md)] px-3 text-sm leading-none text-[#2a2019] ring-1 ring-[var(--dourado)]"
        >
          Saiba mais
        </button>
        <button
          type="button"
          onClick={onAlternar}
          className={
            naSacola
              ? "inline-flex min-h-10 items-center rounded-[var(--r-md)] px-3 text-sm leading-none text-[#9a4a4a] ring-1 ring-[#c47a7a]/70"
              : "inline-flex min-h-10 items-center gap-1.5 rounded-[var(--r-md)] bg-[var(--madeira-escura)] px-3 text-sm leading-none text-[#F7F3EE]"
          }
        >
          {naSacola ? (
            "Remover"
          ) : (
            <>
              Adicionar
              <Mais />
            </>
          )}
        </button>
      </div>
    </li>
  );
}

function Mais() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
    </svg>
  );
}

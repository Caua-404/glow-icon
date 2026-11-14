"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  agruparPorGrupo,
  formatarDuracao,
  formatarPreco,
  rotuloPreco,
  servicos,
  type Servico,
} from "@/data/servicos";
import {
  dataExtenso,
  diaSemanaDe,
  formatarTelefone,
  mesDe,
  proximosDias,
  rotuloHora,
  type Dia,
} from "@/lib/agenda";
import { linkWhatsapp } from "@/data/site";
import { adicionarBloqueios, useBloqueios } from "@/lib/bloqueios";
import { registrarVisita, useCliente } from "@/lib/conta";
import {
  encaixar,
  faixa,
  horariosDoPacote,
  paraBloqueios,
  totalReais,
  type ModoPacote,
  type Plano,
} from "@/lib/pacote";
import {
  adicionarNaSacola,
  escolherProfissionalNaSacola,
  esvaziarSacola,
  itensDaSacola,
  removerDaSacola,
  resumoSacola,
  useSacola,
} from "@/lib/sacola";
import EtapaProfissionais from "./EtapaProfissionais";
import Mascote from "./Mascote";

export type PreSelecao = { profissionalId?: string; servicoId?: string };

type Etapa = "servico" | "profissional" | "dia" | "horario" | "dados" | "resumo" | "fim";

const titulos: Record<Etapa, string> = {
  servico: "Escolha os serviços",
  profissional: "Escolha quem atende",
  dia: "Escolha o dia",
  horario: "Escolha o horário",
  dados: "Seus dados",
  resumo: "Confira o resumo",
  fim: "Pedido enviado",
};

const mensagemMascote: Record<Etapa, string> = {
  servico: "O que vamos fazer?",
  profissional: "Com quem hoje?",
  dia: "Escolha o dia",
  horario: "Agora o horário",
  dados: "Quase lá!",
  resumo: "Quase lá!",
  fim: "Tudo certo! Te esperamos.",
};

type Props = { aberto: boolean; pre: PreSelecao; onFechar: () => void };

export default function AgendamentoModal({ aberto, pre, onFechar }: Props) {
  return <AnimatePresence>{aberto && <Painel pre={pre} onFechar={onFechar} />}</AnimatePresence>;
}

function ListaServicos({
  lista,
  preferidaId,
}: {
  lista: Servico[];
  preferidaId?: string;
}) {
  const sacola = useSacola();
  const ids = useMemo(() => new Set(sacola.map((i) => i.servicoId)), [sacola]);

  return (
    <div className="space-y-6">
      {agruparPorGrupo(lista).map(({ grupo, itens }) => (
        <div key={grupo.id}>
          <p className="rotulo mb-2">{grupo.nome}</p>
          <ul className="border-t border-linha">
            {itens.map((s) => {
              const marcado = ids.has(s.id);
              return (
                <li key={s.id} className="border-b border-linha">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={marcado}
                    onClick={() => {
                      if (marcado) removerDaSacola(s.id);
                      else {
                        const pro =
                          preferidaId && s.profissionais.includes(preferidaId as never)
                            ? preferidaId
                            : undefined;
                        adicionarNaSacola(s.id, pro);
                      }
                    }}
                    className="r-md -mx-3 flex min-h-14 w-[calc(100%+1.5rem)] items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-superficie"
                  >
                    <span
                      aria-hidden="true"
                      className={`r-sm flex h-5 w-5 shrink-0 items-center justify-center border ${
                        marcado ? "border-polish bg-polish" : "border-linha bg-card"
                      }`}
                    >
                      {marcado && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6.2 4.6 9 10 3"
                            stroke="var(--fundo)"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block">{s.nome}</span>
                      <span className="text-sm text-suave">{formatarDuracao(s.duracaoMin)}</span>
                    </span>
                    <span className="shrink-0 text-right text-sm">{rotuloPreco(s)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ResumoPacote({ plano }: { plano: Plano }) {
  return (
    <div>
      <ul className="border-t border-linha">
        {plano.intervalos.map((i) => (
          <li
            key={i.item.servico.id}
            className="flex items-start justify-between gap-4 border-b border-linha py-3 text-sm"
          >
            <div>
              <p>{i.item.servico.nome}</p>
              <p className="text-xs text-suave">
                {i.item.profissional.nome} · {faixa(i.inicio, i.fim)}
              </p>
            </div>
            <p className="shrink-0 text-right">{rotuloPreco(i.item.servico)}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between pt-4">
        <p className="text-sm text-suave">Total</p>
        <p className="titulo text-4xl font-normal">
          {formatarPreco(totalReais(plano.intervalos.map((i) => i.item)))}
        </p>
      </div>
    </div>
  );
}

function Painel({ pre, onFechar }: { pre: PreSelecao; onFechar: () => void }) {
  const dialogo = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const dias = useMemo(proximosDias, []);
  const cliente = useCliente();
  const sacola = useSacola();
  const bloqueios = useBloqueios();
  const preferidaId = pre.profissionalId;

  const [passo, setPasso] = useState(0);
  const [dia, setDia] = useState<Dia | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [modoPacote, setModoPacote] = useState<ModoPacote>("sequencia");
  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [telefone, setTelefone] = useState(cliente ? formatarTelefone(cliente.whatsapp) : "");
  const [erros, setErros] = useState<{ nome?: string; telefone?: string }>({});
  const [reserva, setReserva] = useState<Plano | null>(null);
  const [erroReserva, setErroReserva] = useState<string | null>(null);
  const [verMensagem, setVerMensagem] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const campoMensagem = useRef<HTMLTextAreaElement>(null);

  const etapas = useMemo<Etapa[]>(() => {
    const meio: Etapa[] = ["servico", "profissional", "dia", "horario"];
    if (!cliente) meio.push("dados");
    return [...meio, "resumo", "fim"];
  }, [cliente]);

  const etapa = etapas[Math.min(passo, etapas.length - 1)];
  const passosVisiveis = etapas.length - 1;

  const itens = useMemo(() => itensDaSacola(sacola, preferidaId), [sacola, preferidaId]);
  const totais = useMemo(() => resumoSacola(sacola), [sacola]);

  const horarios = useMemo(
    () => (dia && itens.length > 0 ? horariosDoPacote(dia, itens, bloqueios) : []),
    [dia, itens, bloqueios],
  );

  const inicioMin = hora ? (horarios.find((h) => h.rotulo === hora)?.minutos ?? null) : null;
  const veredito =
    dia && inicioMin !== null && itens.length > 0
      ? encaixar(itens, inicioMin, dia.chave, bloqueios)
      : null;
  const plano = reserva ?? (veredito?.ok ? veredito.plano : null);

  useEffect(() => {
    if (cliente) {
      setNome((n) => n || cliente.nome);
      setTelefone((t) => t || formatarTelefone(cliente.whatsapp));
    }
  }, [cliente]);

  const aoFechar = useRef(onFechar);
  useEffect(() => {
    aoFechar.current = onFechar;
  });

  useEffect(() => {
    const anteriorFoco = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      anteriorFoco?.focus();
    };
  }, []);

  useEffect(() => {
    titulo.current?.focus();
  }, [passo, etapa]);

  function aoTeclar(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      aoFechar.current();
      return;
    }
    if (e.key !== "Tab" || !dialogo.current) return;
    const focaveis = Array.from(
      dialogo.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focaveis.length === 0) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  }

  const avancar = () => setPasso((p) => Math.min(etapas.length - 1, p + 1));
  const voltar = () => setPasso((p) => Math.max(0, p - 1));

  async function copiarMensagem() {
    try {
      await navigator.clipboard.writeText(mensagemWhatsapp);
      setCopiado(true);
      return;
    } catch {
      /* cai no plano B */
    }
    const campo = campoMensagem.current;
    if (!campo) return;
    campo.focus();
    campo.select();
    setCopiado(document.execCommand("copy"));
  }

  function confirmar() {
    if (!dia || inicioMin === null || itens.length === 0) return;
    const v = encaixar(itens, inicioMin, dia.chave, bloqueios);
    if (!v.ok) {
      setErroReserva(v.motivo);
      return;
    }
    const novos = paraBloqueios(v.plano, dia.chave);
    adicionarBloqueios(novos);
    if (cliente) {
      registrarVisita({
        clienteId: cliente.id,
        dia: dia.chave,
        inicio: v.plano.intervalos[0].inicio,
        fim: v.plano.fim,
        modo: v.modo,
        itens: v.plano.intervalos.map((i) => ({
          servicoId: i.item.servico.id,
          profissionalId: i.item.profissional.id,
          inicio: i.inicio,
          fim: i.fim,
          preco: i.item.servico.preco,
        })),
        bloqueioIds: novos.map((b) => b.id),
        status: "agendado",
      });
    }
    setReserva(v.plano);
    setModoPacote(v.modo);
    setErroReserva(null);
    esvaziarSacola();
    const mensagem = `Olá! Gostaria de agendar ${v.plano.intervalos
      .map(
        (i) =>
          `${i.item.servico.nome} com ${i.item.profissional.nome} (${faixa(i.inicio, i.fim)})`,
      )
      .join("; ")}, em ${dataExtenso(dia)}. Total: ${formatarPreco(totalReais(v.plano.intervalos.map((i) => i.item)))}. Meu nome é ${nome.trim()} e meu telefone é ${telefone}.`;
    window.open(linkWhatsapp(mensagem), "_blank", "noopener,noreferrer");
    avancar();
  }

  function enviarDados(e: React.FormEvent) {
    e.preventDefault();
    const novos: { nome?: string; telefone?: string } = {};
    if (nome.trim().length < 2) novos.nome = "Informe seu nome.";
    if (telefone.replace(/\D/g, "").length < 10) novos.telefone = "Informe um telefone com DDD.";
    setErros(novos);
    if (Object.keys(novos).length === 0) avancar();
  }

  const quando = dia ? dataExtenso(dia) : "";
  const contexto =
    etapa !== "fim" && itens.length > 0
      ? [
          itens.length === 1
            ? itens[0].servico.nome
            : `${itens.length} serviços`,
          quando && `${quando}${hora ? ` às ${hora}` : ""}`,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

  const diferentes = plano ? new Set(plano.intervalos.map((i) => i.item.profissional.id)).size : 0;
  const mensagemWhatsapp = plano
    ? `Olá! Gostaria de agendar ${plano.intervalos
        .map(
          (i) =>
            `${i.item.servico.nome} com ${i.item.profissional.nome} (${faixa(i.inicio, i.fim)})`,
        )
        .join("; ")}, em ${quando}. Total: ${formatarPreco(totalReais(plano.intervalos.map((i) => i.item)))}. Meu nome é ${nome.trim()} e meu telefone é ${telefone}.`
    : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_srgb,var(--tinta)_55%,transparent)] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onFechar}
    >
      <motion.div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agendamento-titulo"
        tabIndex={-1}
        onKeyDown={aoTeclar}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sombra-3 flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[var(--r-lg)] bg-fundo outline-none sm:max-h-[85svh] sm:rounded-[var(--r-lg)]"
      >
        <div className="flex items-end justify-between gap-3 border-b border-linha pl-5 pr-4 pt-3 sm:pl-8 sm:pr-6">
          <div className="flex flex-col items-start justify-between self-stretch pb-1">
            <p className="rotulo">
              {etapa === "fim" ? "Concluído" : `Passo ${passo + 1} de ${passosVisiveis}`}
            </p>
            <button type="button" onClick={onFechar} className="-ml-2 min-h-11 px-2 text-sm">
              Fechar
            </button>
          </div>
          {etapa !== "fim" && (
            <Mascote size="sm" balao="esquerda" mensagem={mensagemMascote[etapa]} />
          )}
        </div>

        <p className="flex items-center gap-3 border-b border-linha bg-superficie px-5 py-3 text-xs leading-relaxed text-suave sm:px-8">
          <span className="r-pill sombra-1 shrink-0 bg-card px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-tinta">
            Simulação
          </span>
          <span>Nenhum horário é reservado de verdade e nada sai deste aparelho.</span>
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8">
          <h2
            id="agendamento-titulo"
            ref={titulo}
            tabIndex={-1}
            className="titulo text-4xl font-light outline-none"
          >
            {titulos[etapa]}
          </h2>
          {contexto && <p className="mt-2 text-sm text-suave">{contexto}</p>}
          {etapa === "servico" && preferidaId && (
            <p className="mt-2 text-sm text-suave">
              Você pode marcar mais de um. Os serviços de outras profissionais também entram na
              sacola.
            </p>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={etapa}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              {etapa === "servico" && (
                <ListaServicos lista={servicos} preferidaId={preferidaId} />
              )}

              {etapa === "profissional" && (
                <EtapaProfissionais
                  itens={itens}
                  onEscolher={escolherProfissionalNaSacola}
                  onContinuar={avancar}
                />
              )}

              {etapa === "dia" && (
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {dias.map((d) => {
                    const ativo = dia?.chave === d.chave;
                    return (
                      <li key={d.chave}>
                        <button
                          type="button"
                          disabled={!d.aberto}
                          aria-pressed={ativo}
                          onClick={() => {
                            if (dia?.chave !== d.chave) setHora(null);
                            setDia(d);
                            avancar();
                          }}
                          className={`r-md flex min-h-[4.25rem] w-full flex-col items-center justify-center text-center transition-colors ${
                            !d.aberto
                              ? "cursor-not-allowed bg-superficie text-suave opacity-60"
                              : ativo
                                ? "bg-tinta text-fundo shadow-[var(--sombra-2)]"
                                : "sombra-1 bg-card hover:bg-superficie"
                          }`}
                        >
                          <span className="text-xs uppercase tracking-widest opacity-70">
                            {diaSemanaDe(d)}
                          </span>
                          <span className="titulo text-2xl">{d.data.getDate()}</span>
                          <span className="text-xs opacity-70">
                            {d.aberto ? mesDe(d) : "fechado"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {etapa === "horario" && (
                <>
                  {horarios.filter((h) => h.livre).length === 0 ? (
                    <p className="text-sm text-suave">
                      Não há horário neste dia em que o pacote inteiro caiba. Volte e escolha outro
                      dia, ou tire um serviço da sacola.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {(
                        [
                          ["manha", "Manhã"],
                          ["tarde", "Tarde"],
                        ] as const
                      ).map(([periodo, rotulo]) => {
                        const doPeriodo = horarios.filter((h) => h.periodo === periodo && h.livre);
                        if (doPeriodo.length === 0) return null;
                        return (
                          <div key={periodo}>
                            <p className="rotulo mb-2">{rotulo}</p>
                            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {doPeriodo.map((h) => (
                                <li key={h.rotulo}>
                                  <button
                                    type="button"
                                    disabled={!h.livre}
                                    aria-pressed={hora === h.rotulo}
                                    aria-label={
                                      h.livre
                                        ? `${h.rotulo}, ${h.modo === "simultaneo" ? "ao mesmo tempo" : "em sequência"}`
                                        : `${h.rotulo}, não cabe`
                                    }
                                    onClick={() => {
                                      setHora(h.rotulo);
                                      if (h.modo) setModoPacote(h.modo);
                                      avancar();
                                    }}
                                    className={`r-md min-h-12 w-full text-sm transition-colors ${
                                      !h.livre
                                        ? "cursor-not-allowed bg-superficie text-suave line-through opacity-60"
                                        : hora === h.rotulo
                                          ? "bg-tinta text-fundo shadow-[var(--sombra-2)]"
                                          : "sombra-1 bg-card hover:bg-superficie"
                                    }`}
                                  >
                                    {h.rotulo}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {etapa === "dados" && (
                <form onSubmit={enviarDados} noValidate>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="ag-nome" className="rotulo block">
                        Nome
                      </label>
                      <input
                        id="ag-nome"
                        type="text"
                        autoComplete="name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-invalid={!!erros.nome}
                        aria-describedby={erros.nome ? "ag-nome-erro" : undefined}
                        className="r-md mt-2 min-h-12 w-full border border-linha bg-card px-4 text-base outline-none transition-shadow focus:border-polish focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--polish)_30%,transparent)]"
                      />
                      {erros.nome && (
                        <p id="ag-nome-erro" className="mt-1 text-sm">
                          {erros.nome}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="ag-tel" className="rotulo block">
                        Telefone
                      </label>
                      <input
                        id="ag-tel"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                        aria-invalid={!!erros.telefone}
                        aria-describedby={erros.telefone ? "ag-tel-erro" : undefined}
                        className="r-md mt-2 min-h-12 w-full border border-linha bg-card px-4 text-base outline-none transition-shadow focus:border-polish focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--polish)_30%,transparent)]"
                      />
                      {erros.telefone && (
                        <p id="ag-tel-erro" className="mt-1 text-sm">
                          {erros.telefone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn-acento mt-8 w-full">
                    Continuar
                  </button>
                </form>
              )}

              {etapa === "resumo" && plano && (
                <div>
                  <ResumoPacote plano={plano} />
                  <dl className="mt-6 border-t border-linha text-sm">
                    {[
                      ["Data", quando],
                      ["Início", rotuloHora(plano.intervalos[0].inicio)],
                      ["Fim", rotuloHora(plano.fim)],
                      ["Duração total", formatarDuracao(plano.totalMin)],
                      ...(diferentes > 1
                        ? [
                            [
                              "Os serviços são",
                              modoPacote === "sequencia" ? "em sequência" : "ao mesmo tempo",
                            ],
                          ]
                        : []),
                      ["Nome", nome.trim()],
                      ["Telefone", telefone],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 border-b border-linha py-3">
                        <dt className="text-suave">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {erroReserva && (
                    <p role="alert" className="r-md mt-6 bg-superficie px-4 py-3 text-sm leading-relaxed">
                      Este horário mudou: {erroReserva} Volte e escolha outro horário.
                    </p>
                  )}
                  <button type="button" onClick={confirmar} className="btn-acento mt-8 w-full">
                    Enviar no WhatsApp
                  </button>
                </div>
              )}

              {etapa === "fim" && plano && (
                <div>
                  <Mascote size="lg" mensagem={mensagemMascote.fim} className="mb-8" />
                  <ResumoPacote plano={plano} />
                  <p className="mt-6 text-sm leading-relaxed">
                    {quando}, das {rotuloHora(plano.intervalos[0].inicio)} às {rotuloHora(plano.fim)}.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-suave">
                    A mensagem abriu no WhatsApp do salão. Confirme por lá para o horário ficar
                    combinado. Remarcações com menos de 24 horas só pelo WhatsApp.
                  </p>
                  <a
                    href={linkWhatsapp(mensagemWhatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-acento mt-8 block w-full text-center"
                  >
                    Abrir WhatsApp de novo
                  </a>
                  <button
                    type="button"
                    aria-expanded={verMensagem}
                    aria-controls="mensagem-pedido"
                    onClick={() => setVerMensagem((v) => !v)}
                    className="btn-linha mt-3 w-full"
                  >
                    {verMensagem ? "Esconder mensagem" : "Ver mensagem"}
                  </button>
                  {verMensagem && (
                    <div id="mensagem-pedido" className="mt-4">
                      <p className="rotulo">Mensagem</p>
                      <textarea
                        ref={campoMensagem}
                        readOnly
                        rows={6}
                        value={mensagemWhatsapp}
                        onFocus={(e) => e.currentTarget.select()}
                        aria-label="Mensagem enviada ao salão"
                        className="r-md mt-2 w-full resize-none bg-superficie p-4 text-sm leading-relaxed"
                      />
                      <button type="button" onClick={copiarMensagem} className="btn-linha mt-3 w-full">
                        {copiado ? "Texto copiado" : "Copiar texto"}
                      </button>
                    </div>
                  )}
                  <button type="button" onClick={onFechar} className="btn-linha mt-3 w-full">
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {etapa === "servico" && (
          <div className="border-t border-linha px-5 py-3 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-sm leading-snug">
                {totais.qtd === 0
                  ? "Nenhum serviço na sacola"
                  : `${totais.qtd} ${totais.qtd === 1 ? "serviço" : "serviços"}`}
                {totais.qtd > 0 && (
                  <span className="text-suave">
                    {" "}
                    · {formatarDuracao(totais.min)} · {formatarPreco(totais.reais)}
                  </span>
                )}
              </p>
              <button
                type="button"
                disabled={totais.qtd === 0}
                onClick={avancar}
                className="btn-acento shrink-0 !min-h-10 !px-5 disabled:pointer-events-none disabled:opacity-40"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {passo > 0 && etapa !== "fim" && etapa !== "servico" && (
          <div className="border-t border-linha px-5 py-2 sm:px-8">
            <button
              type="button"
              onClick={voltar}
              className="min-h-11 text-sm underline-offset-4 hover:underline"
            >
              Voltar
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { profissionalPorId } from "@/data/equipe";
import { servicoPorId } from "@/data/servicos";
import { formatarTelefone } from "./agenda";
import { removerBloqueios } from "./bloqueios";
import type { ModoPacote } from "./pacote";

/** Código único da conta local. Não é senha e não é guardado. */
export const CODIGO_DEMO = "1234";

export const CLIENTE_DEMO_ID = "demo-mariana";
export const WHATSAPP_DEMO = "94984000000";

export type Cliente = {
  id: string;
  nome: string;
  /** só dígitos, com DDD */
  whatsapp: string;
  /** AAAA-MM-DD, opcional */
  aniversario?: string;
};

export type ItemVisita = {
  servicoId: string;
  profissionalId: string;
  inicio: number;
  fim: number;
  preco: number;
  demo?: boolean;
};

export type Visita = {
  id: string;
  clienteId: string;
  /** AAAA-MM-DD */
  dia: string;
  inicio: number;
  fim: number;
  modo: ModoPacote;
  itens: ItemVisita[];
  bloqueioIds: string[];
  status: "agendado" | "feito" | "cancelado";
};

export type Retorno = {
  servicoId: string;
  ultima: string;
  prevista: string;
  dias: number;
  /** negativa = atrasada */
  falta: number;
};

export type Habitos = {
  diaSemana: string | null;
  periodo: "manhã" | "tarde" | null;
  servicos: { id: string; nome: string; vezes: number }[];
  intervaloMedio: number | null;
  profissionalId: string | null;
};

const CHAVE_CLIENTES = "glow-clientes";
const CHAVE_SESSAO = "glow-sessao";
const CHAVE_VISITAS = "glow-visitas";

const CLIENTES_VAZIO: Cliente[] = [];
const VISITAS_VAZIO: Visita[] = [];

let cacheClientes: Cliente[] | null = null;
let cacheVisitas: Visita[] | null = null;
let cacheSessao: string | null | undefined;
let iniciado = false;
const SNAP_VAZIO: { cliente: Cliente | null; visitas: Visita[] } = { cliente: null, visitas: VISITAS_VAZIO };
let snap = SNAP_VAZIO;
const ouvintes = new Set<() => void>();

function montarSnap() {
  const id = sessaoAtual();
  const cliente = id ? (cacheClientes ?? []).find((c) => c.id === id) ?? null : null;
  const visitas = cliente
    ? (cacheVisitas ?? [])
        .filter((v) => v.clienteId === cliente.id)
        .sort((a, b) => b.dia.localeCompare(a.dia) || b.inicio - a.inicio)
    : VISITAS_VAZIO;
  snap = { cliente, visitas };
}

function avisar() {
  montarSnap();
  ouvintes.forEach((f) => f());
}

function soDigitos(v: string): string {
  return v.replace(/\D/g, "").slice(0, 11);
}

function clienteValido(x: unknown): x is Cliente {
  if (typeof x !== "object" || x === null) return false;
  const c = x as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.nome === "string" &&
    typeof c.whatsapp === "string" &&
    (c.aniversario === undefined || typeof c.aniversario === "string")
  );
}

function visitaValida(x: unknown): x is Visita {
  if (typeof x !== "object" || x === null) return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.clienteId === "string" &&
    typeof v.dia === "string" &&
    typeof v.inicio === "number" &&
    typeof v.fim === "number" &&
    Array.isArray(v.itens)
  );
}

function demoCliente(): Cliente {
  return {
    id: CLIENTE_DEMO_ID,
    nome: "Mariana Souza",
    whatsapp: WHATSAPP_DEMO,
    aniversario: "1998-04-12",
  };
}

/** Oito atendimentos de exemplo dos últimos 6 meses. Datas fixas em 2026. */
function demoVisitas(): Visita[] {
  const item = (
    servicoId: string,
    profissionalId: string,
    inicio: number,
    fim: number,
  ): ItemVisita => {
    const s = servicoPorId(servicoId);
    return {
      servicoId,
      profissionalId,
      inicio,
      fim,
      preco: s?.preco ?? 0,
    };
  };
  const v = (
    id: string,
    dia: string,
    inicio: number,
    fim: number,
    modo: ModoPacote,
    itens: ItemVisita[],
  ): Visita => ({
    id,
    clienteId: CLIENTE_DEMO_ID,
    dia,
    inicio,
    fim,
    modo,
    itens,
    bloqueioIds: [],
    status: "feito",
  });

  return [
    v("demo-1", "2026-05-16", 9 * 60, 9 * 60 + 45, "sequencia", [
      item("manicure", "eduarda-vieira", 9 * 60, 9 * 60 + 45),
    ]),
    v("demo-2", "2026-06-04", 14 * 60, 15 * 60, "simultaneo", [
      item("tranca-lateral", "larissa-moura", 14 * 60, 15 * 60),
      item("design-sobrancelhas", "camila-rocha", 14 * 60, 14 * 60 + 20),
    ]),
    v("demo-3", "2026-06-21", 9 * 60, 10 * 60 + 30, "sequencia", [
      item("esmaltacao-gel", "eduarda-vieira", 9 * 60, 10 * 60 + 30),
    ]),
    v("demo-4", "2026-07-11", 10 * 60, 11 * 60 + 30, "simultaneo", [
      item("tranca-boxeadora", "larissa-moura", 10 * 60, 11 * 60 + 30),
      item("manicure", "eduarda-vieira", 10 * 60, 10 * 60 + 45),
    ]),
    v("demo-5", "2026-08-08", 9 * 60, 11 * 60, "sequencia", [
      item("cilios-volume-brasileiro", "camila-rocha", 9 * 60, 11 * 60),
    ]),
    v("demo-6", "2026-09-05", 13 * 60, 18 * 60, "sequencia", [
      item("tranca-ghana", "larissa-moura", 13 * 60, 17 * 60),
      item("design-sobrancelhas", "camila-rocha", 17 * 60, 17 * 60 + 20),
    ]),
    v("demo-7", "2026-10-03", 9 * 60, 10 * 60 + 30, "sequencia", [
      item("manicure", "eduarda-vieira", 9 * 60, 9 * 60 + 45),
      item("manicure-pe", "eduarda-vieira", 9 * 60 + 45, 10 * 60 + 30),
    ]),
    v("demo-8", "2026-10-24", 9 * 60, 10 * 60 + 30, "simultaneo", [
      item("esmaltacao-gel", "eduarda-vieira", 9 * 60, 10 * 60 + 30),
      item("cilios-tufinho", "camila-rocha", 9 * 60, 9 * 60 + 45),
    ]),
  ];
}

function garantirDemo() {
  if (typeof window === "undefined" || iniciado) return;
  iniciado = true;
  let clientes = cacheClientes;
  let visitas = cacheVisitas;
  if (!clientes) {
    try {
      const bruto = localStorage.getItem(CHAVE_CLIENTES);
      const lista: unknown = bruto ? JSON.parse(bruto) : [];
      clientes = Array.isArray(lista) ? lista.filter(clienteValido) : [];
    } catch {
      clientes = [];
    }
  }
  if (!visitas) {
    try {
      const bruto = localStorage.getItem(CHAVE_VISITAS);
      const lista: unknown = bruto ? JSON.parse(bruto) : [];
      visitas = Array.isArray(lista) ? lista.filter(visitaValida) : [];
    } catch {
      visitas = [];
    }
  }
  let mudou = false;
  if (!clientes.some((c) => c.id === CLIENTE_DEMO_ID)) {
    clientes = [demoCliente(), ...clientes];
    mudou = true;
  }
  if (!visitas.some((v) => v.clienteId === CLIENTE_DEMO_ID)) {
    visitas = [...demoVisitas(), ...visitas];
    mudou = true;
  }
  cacheClientes = clientes;
  cacheVisitas = visitas;
  montarSnap();
  if (mudou) {
    try {
      localStorage.setItem(CHAVE_CLIENTES, JSON.stringify(clientes));
      localStorage.setItem(CHAVE_VISITAS, JSON.stringify(visitas));
    } catch {
      /* sem armazenamento: a demo vale só nesta sessão */
    }
  }
}

function clientesAtuais(): Cliente[] {
  if (typeof window === "undefined") return CLIENTES_VAZIO;
  garantirDemo();
  return cacheClientes ?? CLIENTES_VAZIO;
}

function visitasAtuais(): Visita[] {
  if (typeof window === "undefined") return VISITAS_VAZIO;
  garantirDemo();
  return cacheVisitas ?? VISITAS_VAZIO;
}

function sessaoAtual(): string | null {
  if (typeof window === "undefined") return null;
  if (cacheSessao !== undefined) return cacheSessao;
  try {
    cacheSessao = localStorage.getItem(CHAVE_SESSAO);
  } catch {
    cacheSessao = null;
  }
  return cacheSessao;
}

function gravarClientes(lista: Cliente[]) {
  cacheClientes = lista;
  try {
    localStorage.setItem(CHAVE_CLIENTES, JSON.stringify(lista));
  } catch {
    /* vale só nesta sessão */
  }
  avisar();
}

function gravarVisitas(lista: Visita[]) {
  cacheVisitas = lista;
  try {
    localStorage.setItem(CHAVE_VISITAS, JSON.stringify(lista));
  } catch {
    /* vale só nesta sessão */
  }
  avisar();
}

function gravarSessao(id: string | null) {
  cacheSessao = id;
  try {
    if (id) localStorage.setItem(CHAVE_SESSAO, id);
    else localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    /* vale só nesta sessão */
  }
  avisar();
}

export function clienteAtual(): Cliente | null {
  const id = sessaoAtual();
  if (!id) return null;
  return clientesAtuais().find((c) => c.id === id) ?? null;
}

export function whatsappDemoExibido(): string {
  return formatarTelefone(WHATSAPP_DEMO);
}

export function cadastrarCliente(dados: {
  nome: string;
  whatsapp: string;
  aniversario?: string;
}): { ok: true; cliente: Cliente } | { ok: false; motivo: string } {
  const nome = dados.nome.trim();
  const whatsapp = soDigitos(dados.whatsapp);
  if (nome.length < 2) return { ok: false, motivo: "Informe seu nome." };
  if (whatsapp.length < 10) return { ok: false, motivo: "Informe um WhatsApp com DDD." };
  const ja = clientesAtuais().find((c) => c.whatsapp === whatsapp);
  if (ja) {
    gravarSessao(ja.id);
    return { ok: true, cliente: ja };
  }
  const cliente: Cliente = {
    id: `c-${Date.now().toString(36)}`,
    nome,
    whatsapp,
    aniversario: dados.aniversario || undefined,
  };
  gravarClientes([...clientesAtuais(), cliente]);
  gravarSessao(cliente.id);
  return { ok: true, cliente };
}

export function entrarComWhatsapp(
  whatsapp: string,
  codigo: string,
): { ok: true; cliente: Cliente } | { ok: false; motivo: string } {
  if (codigo.trim() !== CODIGO_DEMO) {
    return { ok: false, motivo: `Use o código ${CODIGO_DEMO}.` };
  }
  const digits = soDigitos(whatsapp);
  if (digits.length < 10) return { ok: false, motivo: "Informe um WhatsApp com DDD." };
  garantirDemo();
  const cliente = clientesAtuais().find((c) => c.whatsapp === digits);
  if (!cliente) {
    return { ok: false, motivo: "Não encontramos este WhatsApp. Crie uma conta." };
  }
  gravarSessao(cliente.id);
  return { ok: true, cliente };
}

export function sairDaConta() {
  gravarSessao(null);
}

export function registrarVisita(
  dados: Omit<Visita, "id" | "status"> & { status?: Visita["status"] },
): Visita {
  const visita: Visita = {
    ...dados,
    id: `v-${Date.now().toString(36)}`,
    status: dados.status ?? "agendado",
  };
  gravarVisitas([...visitasAtuais(), visita]);
  return visita;
}

export function cancelarVisita(id: string): { ok: true } | { ok: false; motivo: string } {
  const lista = visitasAtuais();
  const visita = lista.find((v) => v.id === id);
  if (!visita) return { ok: false, motivo: "Este horário não está na sua conta." };
  if (visita.status === "cancelado") return { ok: false, motivo: "Este horário já foi cancelado." };
  if (visita.status === "feito") return { ok: false, motivo: "Atendimento já realizado." };
  removerBloqueios(visita.bloqueioIds);
  gravarVisitas(lista.map((v) => (v.id === id ? { ...v, status: "cancelado" as const } : v)));
  return { ok: true };
}

export function visitasDaCliente(clienteId: string): Visita[] {
  return visitasAtuais()
    .filter((v) => v.clienteId === clienteId)
    .sort((a, b) => b.dia.localeCompare(a.dia) || b.inicio - a.inicio);
}

function hojeIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

function somarDias(iso: string, dias: number): string {
  const [a, m, d] = iso.split("-").map(Number);
  const dt = new Date(a, m - 1, d);
  dt.setDate(dt.getDate() + dias);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

function diffDias(de: string, ate: string): number {
  const a = de.split("-").map(Number);
  const b = ate.split("-").map(Number);
  const da = new Date(a[0], a[1] - 1, a[2]).getTime();
  const db = new Date(b[0], b[1] - 1, b[2]).getTime();
  return Math.round((db - da) / 86400000);
}

function visitaPassou(v: Visita): boolean {
  const hoje = hojeIso();
  if (v.dia < hoje) return true;
  if (v.dia > hoje) return false;
  const agora = new Date();
  return v.fim <= agora.getHours() * 60 + agora.getMinutes();
}

export function proximoAgendamento(clienteId: string): Visita | null {
  const hoje = hojeIso();
  return (
    visitasAtuais()
      .filter((v) => v.clienteId === clienteId && v.status !== "cancelado" && !visitaPassou(v) && v.dia >= hoje)
      .sort((a, b) => a.dia.localeCompare(b.dia) || a.inicio - b.inicio)[0] ?? null
  );
}

export function historicoVisitas(clienteId: string): Visita[] {
  return visitasDaCliente(clienteId).filter((v) => v.status !== "cancelado");
}

/** Por serviço com retornoDias: última visita + prazo. Destaca vencidos e os próximos 7 dias. */
export function horaDeVoltar(clienteId: string): Retorno[] {
  const hoje = hojeIso();
  const feitas = visitasDaCliente(clienteId).filter((v) => v.status !== "cancelado" && visitaPassou(v));
  const ultima = new Map<string, string>();
  for (const v of feitas) {
    for (const i of v.itens) {
      const atual = ultima.get(i.servicoId);
      if (!atual || v.dia > atual) ultima.set(i.servicoId, v.dia);
    }
  }
  const lista: Retorno[] = [];
  for (const [servicoId, dia] of ultima) {
    const s = servicoPorId(servicoId);
    if (!s?.retornoDias) continue;
    const prevista = somarDias(dia, s.retornoDias);
    lista.push({
      servicoId,
      ultima: dia,
      prevista,
      dias: s.retornoDias,
      falta: diffDias(hoje, prevista),
    });
  }
  return lista.sort((a, b) => a.falta - b.falta || a.prevista.localeCompare(b.prevista));
}

export function destaqueRetorno(r: Retorno): boolean {
  return r.falta <= 7;
}

const DIA_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export function habitosDaCliente(clienteId: string): Habitos {
  const feitas = visitasDaCliente(clienteId).filter((v) => v.status !== "cancelado");
  if (feitas.length === 0) {
    return { diaSemana: null, periodo: null, servicos: [], intervaloMedio: null, profissionalId: null };
  }

  const dias = new Map<number, number>();
  const periodos = { manha: 0, tarde: 0 };
  const servicos = new Map<string, number>();
  const profs = new Map<string, number>();

  for (const v of feitas) {
    const [a, m, d] = v.dia.split("-").map(Number);
    const wd = new Date(a, m - 1, d).getDay();
    dias.set(wd, (dias.get(wd) ?? 0) + 1);
    if (v.inicio < 12 * 60) periodos.manha += 1;
    else periodos.tarde += 1;
    for (const i of v.itens) {
      servicos.set(i.servicoId, (servicos.get(i.servicoId) ?? 0) + 1);
      profs.set(i.profissionalId, (profs.get(i.profissionalId) ?? 0) + 1);
    }
  }

  const diaSemanaN = [...dias.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const profissionalId = [...profs.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topServicos = [...servicos.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, vezes]) => ({ id, nome: servicoPorId(id)?.nome ?? id, vezes }));

  const crono = [...feitas].sort((a, b) => a.dia.localeCompare(b.dia));
  let intervaloMedio: number | null = null;
  if (crono.length >= 2) {
    let soma = 0;
    for (let i = 1; i < crono.length; i++) soma += diffDias(crono[i - 1].dia, crono[i].dia);
    intervaloMedio = Math.round(soma / (crono.length - 1));
  }

  return {
    diaSemana: diaSemanaN === undefined ? null : DIA_SEMANA[diaSemanaN],
    periodo: periodos.manha === 0 && periodos.tarde === 0 ? null : periodos.manha >= periodos.tarde ? "manhã" : "tarde",
    servicos: topServicos,
    intervaloMedio,
    profissionalId,
  };
}

export function nomeDaProfissional(id: string): string {
  return profissionalPorId(id)?.nome ?? id;
}

export function dataBr(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function assinar(f: () => void) {
  ouvintes.add(f);
  const aoMudar = (e: StorageEvent) => {
    if (
      e.key === CHAVE_CLIENTES ||
      e.key === CHAVE_SESSAO ||
      e.key === CHAVE_VISITAS ||
      e.key === null
    ) {
      cacheClientes = null;
      cacheVisitas = null;
      cacheSessao = undefined;
      iniciado = false;
      garantirDemo();
      f();
    }
  };
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", aoMudar);
  };
}

function snapshotConta() {
  if (typeof window === "undefined") return SNAP_VAZIO;
  garantirDemo();
  return snap;
}

/** Cliente logada e as visitas dela. No servidor (e na hidratação) vem vazio. */
export function useConta(): { cliente: Cliente | null; visitas: Visita[] } {
  return useSyncExternalStore(assinar, snapshotConta, () => SNAP_VAZIO);
}

export function useCliente(): Cliente | null {
  return useConta().cliente;
}

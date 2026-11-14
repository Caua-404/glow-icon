// Monte seu pacote: vários serviços no mesmo atendimento, em sequência ou ao mesmo tempo.
// Tudo é calculado a partir do horário de início já escolhido.

import { nivelNoServico, profissionaisDoServico, type Profissional } from "@/data/equipe";
import type { Regiao, Servico } from "@/data/servicos";
import {
  BLOCOS,
  FECHA,
  aposAlmoco,
  chaveDia,
  conflito,
  rotuloHora,
  somarTrabalho,
  type Dia,
  type Horario,
} from "./agenda";
import type { Bloqueio } from "./bloqueios";

export type ModoPacote = "sequencia" | "simultaneo";

export type ItemPacote = { servico: Servico; profissional: Profissional };
export type Intervalo = { item: ItemPacote; inicio: number; fim: number };

export type Plano = {
  intervalos: Intervalo[];
  /** fim do último serviço */
  fim: number;
  /** minutos de trabalho (sem o almoço) */
  totalMin: number;
  /** fim do expediente (18:00) */
  limite: number;
};

export type Veredito = { ok: true; plano: Plano } | { ok: false; plano: Plano; motivo: string };

export function fimDoBloco(_inicio?: number): number {
  return FECHA;
}

/** Por `ordem` do serviço; empatou, vale a ordem em que a cliente adicionou. */
export function ordenar(itens: ItemPacote[]): ItemPacote[] {
  return itens
    .map((item, i) => ({ item, i }))
    .sort((a, b) => a.item.servico.ordem - b.item.servico.ordem || a.i - b.i)
    .map((x) => x.item);
}

/**
 * Em sequência: um serviço depois do outro, na ordem de precedência (`ordem`), e não na
 * ordem do clique.
 * Ao mesmo tempo: cada profissional começa no horário escolhido; os serviços da mesma
 * profissional continuam um depois do outro (ela não atende duas coisas juntas).
 */
export function planejar(itens: ItemPacote[], modo: ModoPacote, inicio: number): Plano {
  const intervalos: Intervalo[] = [];
  const ordenados = ordenar(itens);
  if (modo === "sequencia") {
    let cursor = aposAlmoco(inicio);
    for (const item of ordenados) {
      const comeca = aposAlmoco(cursor);
      const fim = somarTrabalho(comeca, item.servico.duracaoMin);
      intervalos.push({ item, inicio: comeca, fim });
      cursor = fim;
    }
  } else {
    const pistas = new Map<string, number>();
    for (const item of ordenados) {
      const comeca = aposAlmoco(pistas.get(item.profissional.id) ?? inicio);
      const fim = somarTrabalho(comeca, item.servico.duracaoMin);
      intervalos.push({ item, inicio: comeca, fim });
      pistas.set(item.profissional.id, fim);
    }
  }
  const fim = intervalos.reduce((m, i) => Math.max(m, i.fim), inicio);
  const trabalho = intervalos.reduce((s, i) => s + i.item.servico.duracaoMin, 0);
  const totalMin =
    modo === "sequencia"
      ? trabalho
      : Math.max(
          ...Array.from(
            new Set(intervalos.map((i) => i.item.profissional.id)),
            (id) =>
              intervalos
                .filter((i) => i.item.profissional.id === id)
                .reduce((s, i) => s + i.item.servico.duracaoMin, 0),
          ),
          0,
        );
  return { intervalos, fim, totalMin, limite: FECHA };
}

const NA_REGIAO: Record<Regiao, string> = {
  maos: "nas mãos",
  pes: "nos pés",
  cabelo: "no cabelo",
  rosto: "no rosto",
  olhos: "nos olhos",
};

/** Mesma região, ou olhos com rosto: duas pessoas não trabalham nisso ao mesmo tempo. */
function mesmaArea(a: Regiao, b: Regiao): boolean {
  return a === b || (a === "olhos" && b === "rosto") || (a === "rosto" && b === "olhos");
}

function minuscula(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

/**
 * Ao mesmo tempo só vale para regiões diferentes. Confere cada par que se sobrepõe no
 * tempo (serviços da mesma profissional já ficam em sequência, então não se sobrepõem).
 */
function motivoRegioes(intervalos: Intervalo[]): string | null {
  for (let i = 0; i < intervalos.length; i++) {
    for (let j = i + 1; j < intervalos.length; j++) {
      const a = intervalos[i];
      const b = intervalos[j];
      if (a.inicio >= b.fim || b.inicio >= a.fim) continue;
      const sa = a.item.servico;
      const sb = b.item.servico;
      if (!mesmaArea(sa.regiao, sb.regiao)) continue;
      const nomes = `${sa.nome} e ${minuscula(sb.nome)}`;
      return sa.regiao === sb.regiao
        ? `${nomes} são ${NA_REGIAO[sa.regiao]}; precisam ser em sequência.`
        : `${nomes} são feitos no rosto, perto dos olhos; precisam ser em sequência.`;
    }
  }
  return null;
}

/** Cabe no expediente e nas agendas de cada profissional? Se não, diz por quê. */
export function verificar(
  itens: ItemPacote[],
  modo: ModoPacote,
  inicio: number,
  chaveDia: string,
  bloqueios: Bloqueio[],
): Veredito {
  const plano = planejar(itens, modo, inicio);
  if (modo === "simultaneo") {
    const motivo = motivoRegioes(plano.intervalos);
    if (motivo) return { ok: false, plano, motivo };
  }
  for (const { item, inicio: de, fim } of plano.intervalos) {
    if (fim > FECHA) {
      return {
        ok: false,
        plano,
        motivo: `Terminaria às ${rotuloHora(fim)}, depois do fim do expediente (18:00).`,
      };
    }
    const c = conflito(item.profissional.id, chaveDia, de, fim, bloqueios);
    if (c) {
      const motivo = c.reserva
        ? `${item.profissional.nome} já tem horário reservado das ${rotuloHora(c.de)} às ${rotuloHora(c.ate)}.`
        : `${item.profissional.nome} está ocupada às ${rotuloHora(c.de)}.`;
      return { ok: false, plano, motivo };
    }
  }
  return { ok: true, plano };
}

/**
 * Tenta ao mesmo tempo (quando as regiões permitem); se não couber, tenta em sequência.
 * É a regra usada na lista de horários da sacola.
 */
export function encaixar(
  itens: ItemPacote[],
  inicio: number,
  chaveDia: string,
  bloqueios: Bloqueio[],
): Veredito & { modo: ModoPacote } {
  const sim = verificar(itens, "simultaneo", inicio, chaveDia, bloqueios);
  if (sim.ok) return { ...sim, modo: "simultaneo" };
  const seq = verificar(itens, "sequencia", inicio, chaveDia, bloqueios);
  return { ...seq, modo: "sequencia" };
}

const PASSO_MIN = 30;

/** Horários do dia em que o pacote inteiro cabe (ao mesmo tempo ou em sequência). */
export function horariosDoPacote(
  dia: Dia,
  itens: ItemPacote[],
  bloqueios: Bloqueio[],
): Array<Horario & { modo: ModoPacote | null }> {
  if (!dia.aberto || itens.length === 0) return [];
  const agora = new Date();
  const hoje = chaveDia(agora) === dia.chave;
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const lista: Array<Horario & { modo: ModoPacote | null }> = [];
  BLOCOS.forEach(([abre, fecha], bloco) => {
    for (let t = abre; t < fecha; t += PASSO_MIN) {
      if (hoje && t <= minutosAgora + 30) continue;
      const v = encaixar(itens, t, dia.chave, bloqueios);
      lista.push({
        rotulo: rotuloHora(t),
        minutos: t,
        livre: v.ok,
        modo: v.ok ? v.modo : null,
        periodo: bloco === 0 ? "manha" : "tarde",
      });
    }
  });
  return lista;
}

export type Candidato =
  | { ok: true; profissional: Profissional }
  | { ok: false; profissional: Profissional; motivo: string };

/**
 * Para um serviço que ainda não está no pacote: escolhe a primeira profissional
 * da equipe que consegue encaixar. Se ninguém consegue, devolve o motivo.
 */
export function avaliarCandidato(
  servico: Servico,
  itens: ItemPacote[],
  modo: ModoPacote,
  inicio: number,
  chaveDia: string,
  bloqueios: Bloqueio[],
): Candidato {
  const quem = profissionaisDoServico(servico).sort(
    (a, b) => nivelNoServico(b, servico.id) - nivelNoServico(a, servico.id),
  );
  let primeiroMotivo = "";
  for (const profissional of quem) {
    const v = verificar([...itens, { servico, profissional }], modo, inicio, chaveDia, bloqueios);
    if (v.ok) return { ok: true, profissional };
    if (!primeiroMotivo) {
      // dá uma pista quando o outro modo resolveria
      const outro: ModoPacote = modo === "sequencia" ? "simultaneo" : "sequencia";
      const resolve = verificar([...itens, { servico, profissional }], outro, inicio, chaveDia, bloqueios).ok;
      primeiroMotivo = resolve
        ? `${v.motivo} Cabe se for ${outro === "simultaneo" ? "ao mesmo tempo" : "em sequência"}.`
        : v.motivo;
    }
  }
  return { ok: false, profissional: quem[0], motivo: primeiroMotivo };
}

export function totalReais(itens: ItemPacote[]): number {
  return itens.reduce((t, i) => t + i.servico.preco, 0);
}

export function paraBloqueios(plano: Plano, chaveDia: string): Bloqueio[] {
  const lote = Date.now().toString(36);
  return plano.intervalos.map((i, n) => ({
    id: `${lote}-${n}`,
    dia: chaveDia,
    profissionalId: i.item.profissional.id,
    inicio: i.inicio,
    fim: i.fim,
    servicoId: i.item.servico.id,
  }));
}

/** "09:00 às 10:30" */
export function faixa(inicio: number, fim: number): string {
  return `${rotuloHora(inicio)} às ${rotuloHora(fim)}`;
}

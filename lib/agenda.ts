// Agenda local. Horários livres, salvo reservas feitas neste aparelho.
// O salão confirma de verdade pelo WhatsApp.

import { bloqueiosAtuais, type Bloqueio } from "./bloqueios";

export const ABRE = 8 * 60;
export const ALMOCO_INICIO = 12 * 60;
export const ALMOCO_FIM = 13 * 60;
export const FECHA = 18 * 60;

/** Horários em que dá para começar: 8h–12h e 13h–18h. */
export const BLOCOS: ReadonlyArray<readonly [number, number]> = [
  [ABRE, ALMOCO_INICIO],
  [ALMOCO_FIM, FECHA],
];

export const DIAS_VISIVEIS = 14;
const PASSO_MIN = 30;

const diaSemanaCurto = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const mesCurto = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export type Dia = { chave: string; data: Date; aberto: boolean };
export type Horario = { rotulo: string; minutos: number; livre: boolean; periodo: "manha" | "tarde" };

export function chaveDia(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

/** Próximos 14 dias a partir de hoje. Domingo vem como fechado. */
export function proximosDias(): Dia[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: DIAS_VISIVEIS }, (_, i) => {
    const data = new Date(base);
    data.setDate(base.getDate() + i);
    return { chave: chaveDia(data), data, aberto: data.getDay() !== 0 };
  });
}

export function rotuloHora(minutos: number): string {
  const h = String(Math.floor(minutos / 60)).padStart(2, "0");
  const m = String(minutos % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function diaSemanaDe(d: Dia): string {
  return diaSemanaCurto[d.data.getDay()];
}

export function mesDe(d: Dia): string {
  return mesCurto[d.data.getMonth()];
}

export function dataExtenso(d: Dia): string {
  return `${diaSemanaDe(d)}, ${d.data.getDate()} de ${mesDe(d)}`;
}

/** Se caiu no almoço, começa depois dele. */
export function aposAlmoco(minutos: number): number {
  return minutos >= ALMOCO_INICIO && minutos < ALMOCO_FIM ? ALMOCO_FIM : minutos;
}

/** Soma minutos de trabalho a partir de `inicio`, pulando 12h–13h. */
export function somarTrabalho(inicio: number, duracaoMin: number): number {
  let t = aposAlmoco(inicio);
  let resto = duracaoMin;
  while (resto > 0) {
    if (t < ALMOCO_INICIO) {
      const cabe = ALMOCO_INICIO - t;
      if (resto <= cabe) return t + resto;
      resto -= cabe;
      t = ALMOCO_FIM;
      continue;
    }
    return t + resto;
  }
  return t;
}

/**
 * O que impede a profissional de atender em [inicio, fim), ou null se está livre.
 * Só reservas feitas neste aparelho. O horário definitivo é o do WhatsApp.
 */
export function conflito(
  profissionalId: string,
  chave: string,
  inicio: number,
  fim: number,
  bloqueios: Bloqueio[] = bloqueiosAtuais(),
): { de: number; ate: number; reserva: boolean } | null {
  const reservado = bloqueios.find(
    (b) => b.dia === chave && b.profissionalId === profissionalId && b.inicio < fim && b.fim > inicio,
  );
  if (reservado) return { de: reservado.inicio, ate: reservado.fim, reserva: true };
  return null;
}

/** Horários do dia em que um serviço de `duracaoMin` termina até as 18h. */
export function horariosDoDia(
  dia: Dia,
  duracaoMin: number,
  profissionalId: string,
  bloqueios: Bloqueio[] = bloqueiosAtuais(),
): Horario[] {
  if (!dia.aberto) return [];
  const agora = new Date();
  const hoje = chaveDia(agora) === dia.chave;
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const lista: Horario[] = [];
  BLOCOS.forEach(([abre, fecha], bloco) => {
    for (let t = abre; t < fecha; t += PASSO_MIN) {
      if (hoje && t <= minutosAgora + 30) continue;
      const fim = somarTrabalho(t, duracaoMin);
      if (fim > FECHA) continue;
      lista.push({
        rotulo: rotuloHora(t),
        minutos: t,
        livre: conflito(profissionalId, dia.chave, t, fim, bloqueios) === null,
        periodo: bloco === 0 ? "manha" : "tarde",
      });
    }
  });
  return lista;
}

/** Primeiro horário livre (serviço de 30 min) nos próximos dias. Depende do relógio: use após montar. */
export function proximoHorario(
  profissionalId: string,
  bloqueios: Bloqueio[] = bloqueiosAtuais(),
): string | null {
  const dias = proximosDias();
  for (let i = 0; i < dias.length; i++) {
    const livre = horariosDoDia(dias[i], PASSO_MIN, profissionalId, bloqueios).find((h) => h.livre);
    if (livre) {
      const quando = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : `${diaSemanaDe(dias[i])}, ${dias[i].data.getDate()} ${mesDe(dias[i])}`;
      return `${quando}, ${livre.rotulo}`;
    }
  }
  return null;
}

export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

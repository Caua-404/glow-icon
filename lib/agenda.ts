// Agenda local: os horários ocupados são determinísticos (mesma profissional + dia + hora
// = mesmo resultado), para o card da equipe e o modal concordarem.

import { bloqueiosAtuais, type Bloqueio } from "./bloqueios";

/** Expediente em minutos: 8h às 12h e 13h às 18h. */
export const BLOCOS: ReadonlyArray<readonly [number, number]> = [
  [8 * 60, 12 * 60],
  [13 * 60, 18 * 60],
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

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function ocupado(profissionalId: string, chave: string, minutos: number): boolean {
  return hash(`${profissionalId}|${chave}|${minutos}`) % 100 < 30;
}

/**
 * O que impede a profissional de atender em [inicio, fim), ou null se está livre.
 * Regra única (usada por horariosDoDia e pelo pacote): vale o intervalo inteiro.
 * - reservas feitas neste aparelho: qualquer sobreposição com [inicio, fim) conflita;
 * - ocupação de exemplo: todas as células de 30 min dentro de [inicio, fim) precisam estar livres.
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
  for (let celula = Math.floor(inicio / PASSO_MIN) * PASSO_MIN; celula < fim; celula += PASSO_MIN) {
    if (ocupado(profissionalId, chave, celula)) {
      return { de: celula, ate: celula + PASSO_MIN, reserva: false };
    }
  }
  return null;
}

/** Horários do dia para um serviço de `duracaoMin`, que precisa terminar dentro do bloco. */
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
    for (let t = abre; t + duracaoMin <= fecha; t += PASSO_MIN) {
      if (hoje && t <= minutosAgora + 30) continue;
      lista.push({
        rotulo: rotuloHora(t),
        minutos: t,
        livre: conflito(profissionalId, dia.chave, t, t + duracaoMin, bloqueios) === null,
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

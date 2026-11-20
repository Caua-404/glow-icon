import { esmaltes } from "@/data/polish";
import { formatarDuracao, formatarPreco, rotuloPreco } from "@/data/servicos";
import { rotuloHora, type Dia } from "./agenda";
import { faixa, totalReais, type Plano } from "./pacote";

export const FORMAS_PAGAMENTO = [
  "Pix",
  "Dinheiro",
  "Cartão de débito",
  "Cartão de crédito",
] as const;

export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number];

const DIAS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

export function dataDoPedido(dia: Dia): string {
  const [ano, mes, d] = dia.chave.split("-");
  return `${DIAS[dia.data.getDay()]}, ${d}/${mes}/${ano}`;
}

function esmalteEscolhido(): string | null {
  if (typeof document === "undefined") return null;
  const id = document.documentElement.getAttribute("data-polish") ?? "nude";
  return esmaltes.find((e) => e.id === id)?.nome ?? null;
}

export function montarMensagemPedido(p: {
  nome: string;
  telefone: string;
  primeiraVisita: boolean;
  pagamento: FormaPagamento;
  observacao: string;
  dia: Dia;
  plano: Plano;
}): string {
  const temUnha = p.plano.intervalos.some((i) => i.item.servico.categoria === "unhas");
  const cor = temUnha ? esmalteEscolhido() : null;
  const servicos = p.plano.intervalos.map((i, n) => {
    const s = i.item.servico;
    return [
      `${n + 1}. ${s.nome}`,
      `   Com ${i.item.profissional.nome} · ${faixa(i.inicio, i.fim)} · ${formatarDuracao(s.duracaoMin)}`,
      `   ${rotuloPreco(s)}`,
    ].join("\n");
  });

  const linhas = [
    `Oi, tudo bem? Me chamo ${p.nome.trim()}.`,
    "",
    "Queria confirmar este horário:",
    "",
    `Quando: ${dataDoPedido(p.dia)}`,
    `Chegada: ${rotuloHora(p.plano.intervalos[0].inicio)}`,
    `Término previsto: ${rotuloHora(p.plano.fim)}`,
    p.primeiraVisita ? "É a minha primeira visita." : "Já fui no salão.",
    "",
    "Serviços",
    ...servicos,
    "",
    "Valores",
    `Total: ${formatarPreco(totalReais(p.plano.intervalos.map((i) => i.item)))}`,
    `Pagamento: ${p.pagamento}`,
  ];

  const extras: string[] = [];
  if (cor) extras.push(`Cor de esmalte no site: ${cor}`);
  if (p.observacao.trim()) extras.push(p.observacao.trim());
  if (extras.length > 0) {
    linhas.push("", "Observação", ...extras);
  }

  linhas.push("", "Dá para confirmar esse horário?");
  return linhas.join("\n");
}

function listarDias(dias: string[]): string {
  if (dias.length === 1) return dias[0].toLowerCase();
  const ultimo = dias[dias.length - 1].toLowerCase();
  const resto = dias.slice(0, -1).map((d) => d.toLowerCase()).join(", ");
  return `${resto} ou ${ultimo}`;
}

/** Pedido pela tela da equipe: texto para o WhatsApp, em primeira pessoa. */
export function montarMensagemInteresse(p: {
  nome: string;
  periodo: "manhã" | "tarde";
  dias?: string[];
  grupos: { profissional: string; servicos: { nome: string; duracao: string; preco: string }[] }[];
  duracao: string;
  total: string;
}): string {
  const nome = p.nome.trim();
  const quando = p.periodo === "manhã" ? "de manhã" : "à tarde";
  const linhas = [`Oi, tudo bem? Me chamo ${nome}.`, ""];

  if (p.dias && p.dias.length > 0) {
    linhas.push(`Queria um horário ${quando}, de preferência ${listarDias(p.dias)}.`);
  } else {
    linhas.push(`Queria um horário ${quando}.`);
  }

  if (p.grupos.length > 0) {
    linhas.push("", "Serviços");
    for (const g of p.grupos) {
      linhas.push("", `Com a ${g.profissional}`);
      for (const s of g.servicos) {
        linhas.push(`• ${s.nome}`, `  ${s.duracao}  ·  ${s.preco}`);
      }
    }
    linhas.push(
      "",
      "Resumo",
      `Tempo estimado: ${p.duracao}`,
      `Total: ${p.total}`,
      "O valor pode variar um pouco na avaliação do salão.",
    );
  }

  linhas.push("", "Vocês têm algum horário assim?");
  return linhas.join("\n");
}

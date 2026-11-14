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
    "Olá, Glow Icon!",
    "",
    "Quero confirmar este horário:",
    "",
    "— Cliente —",
    `Nome: ${p.nome.trim()}`,
    `WhatsApp: ${p.telefone}`,
    `Primeira visita: ${p.primeiraVisita ? "Sim" : "Não"}`,
    "",
    "— Horário —",
    `Data: ${dataDoPedido(p.dia)}`,
    `Chegada: ${rotuloHora(p.plano.intervalos[0].inicio)}`,
    `Término previsto: ${rotuloHora(p.plano.fim)}`,
    "",
    "— Serviços —",
    ...servicos,
    "",
    "— Pagamento —",
    `Total: ${formatarPreco(totalReais(p.plano.intervalos.map((i) => i.item)))}`,
    `Forma: ${p.pagamento}`,
  ];

  const extras: string[] = [];
  if (cor) extras.push(`Cor de esmalte no site: ${cor}`);
  if (p.observacao.trim()) extras.push(p.observacao.trim());
  if (extras.length > 0) {
    linhas.push("", "— Observação —", ...extras);
  }

  linhas.push("", "Pode confirmar o horário, por favor?");
  return linhas.join("\n");
}

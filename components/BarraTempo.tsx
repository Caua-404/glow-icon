"use client";

import { equipe } from "@/data/equipe";
import { formatarDuracao } from "@/data/servicos";
import { rotuloHora } from "@/lib/agenda";
import type { Intervalo, ModoPacote, Plano } from "@/lib/pacote";

type Props = { plano: Plano; inicio: number; modo: ModoPacote };

const corDe = (profissionalId: string) =>
  `var(--pro-${Math.max(0, equipe.findIndex((p) => p.id === profissionalId)) + 1})`;

/**
 * Barra de tempo do pacote: do horário escolhido até o fim do expediente (18:00).
 * Cada serviço ocupa um trecho; o que sobra fica livre.
 * Ao mesmo tempo: uma faixa por profissional. Em sequência: uma faixa só.
 */
export default function BarraTempo({ plano, inicio, modo }: Props) {
  const janela = Math.max(30, plano.limite - inicio);
  const sobra = plano.limite - plano.fim;
  const fimDoBlocoRotulo = "fim do expediente";

  const faixas: { chave: string; nome?: string; itens: Intervalo[] }[] =
    modo === "simultaneo"
      ? Array.from(new Set(plano.intervalos.map((i) => i.item.profissional.id))).map((id) => ({
          chave: id,
          nome: equipe.find((p) => p.id === id)?.nome,
          itens: plano.intervalos.filter((i) => i.item.profissional.id === id),
        }))
      : [{ chave: "unica", itens: plano.intervalos }];

  const profissionais = Array.from(new Set(plano.intervalos.map((i) => i.item.profissional.id)));
  const resumo = `${formatarDuracao(plano.totalMin)}, das ${rotuloHora(inicio)} às ${rotuloHora(plano.fim)}. ${
    sobra > 0 ? `Sobram ${formatarDuracao(sobra)} até o ${fimDoBlocoRotulo}.` : `Preenche até o ${fimDoBlocoRotulo}.`
  }`;

  return (
    <div className="r-lg sombra-2 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1" aria-live="polite">
        <p className="titulo text-3xl font-normal leading-none">
          {formatarDuracao(plano.totalMin)}
          <span className="ml-2 font-sans text-xs text-suave">de duração total</span>
        </p>
        <p className="text-sm">
          {rotuloHora(inicio)} às {rotuloHora(plano.fim)}
        </p>
      </div>

      <div role="img" aria-label={resumo} className="mt-4 space-y-2">
        {faixas.map((f) => (
          <div key={f.chave}>
            {f.nome && <p className="mb-1 text-xs text-suave">{f.nome}</p>}
            <div className="r-sm relative h-9 overflow-hidden bg-superficie">
              {f.itens.map((i) => (
                <span
                  key={`${i.item.servico.id}-${i.inicio}`}
                  title={`${i.item.servico.nome}, ${rotuloHora(i.inicio)} às ${rotuloHora(i.fim)}`}
                  className="r-sm absolute inset-y-0 flex items-center overflow-hidden whitespace-nowrap px-2 text-[11px] leading-none text-tinta transition-[left,width] duration-300 ease-out"
                  style={{
                    left: `calc(${((i.inicio - inicio) / janela) * 100}% + 1px)`,
                    width: `calc(${((i.fim - i.inicio) / janela) * 100}% - 2px)`,
                    background: corDe(i.item.profissional.id),
                  }}
                >
                  {i.item.servico.nome}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-xs text-suave" aria-hidden="true">
        <span>{rotuloHora(inicio)}</span>
        <span>
          {rotuloHora(plano.limite)} {fimDoBlocoRotulo}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-suave">
        {sobra > 0
          ? `Sobram ${formatarDuracao(sobra)} até o ${fimDoBlocoRotulo}.`
          : `Preenche até o ${fimDoBlocoRotulo}.`}
      </p>

      {profissionais.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Legenda das cores">
          {profissionais.map((id) => (
            <li key={id} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="r-pill h-2.5 w-2.5"
                style={{ background: corDe(id) }}
              />
              {equipe.find((p) => p.id === id)?.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

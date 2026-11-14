"use client";

import Image from "next/image";
import { profissionaisDoServico } from "@/data/equipe";
import type { ItemPacote } from "@/lib/pacote";

type Props = {
  itens: ItemPacote[];
  onEscolher: (servicoId: string, profissionalId: string) => void;
  onContinuar: () => void;
};

export default function EtapaProfissionais({ itens, onEscolher, onContinuar }: Props) {
  return (
    <div className="space-y-8">
      {itens.map(({ servico, profissional }) => {
        const quem = profissionaisDoServico(servico);
        const recomendadaId = quem[0]?.id;
        return (
          <section key={servico.id} aria-labelledby={`pro-${servico.id}`}>
            <h3 id={`pro-${servico.id}`} className="titulo text-2xl font-normal">
              {servico.nome}
            </h3>
            <ul className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quem.map((p) => {
                const ativa = p.id === profissional.id;
                const recomendada = p.id === recomendadaId;
                return (
                  <li key={p.id} className="w-[9.5rem] shrink-0">
                    <button
                      type="button"
                      aria-pressed={ativa}
                      onClick={() => onEscolher(servico.id, p.id)}
                      className={`r-md flex h-full w-full flex-col overflow-hidden bg-card text-left ${
                        ativa
                          ? "shadow-[0_0_0_2px_var(--polish),var(--sombra-2)]"
                          : "sombra-1"
                      }`}
                    >
                      <span className="relative block aspect-[4/5] w-full bg-superficie">
                        <Image
                          src={p.foto}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </span>
                      <span className="p-2.5">
                        <span className="block text-sm leading-tight">{p.nome}</span>
                        {recomendada && (
                          <span className="mt-1 block text-[11px] leading-snug text-suave">
                            Recomendada para este serviço
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <button type="button" onClick={onContinuar} className="btn-acento w-full">
        Continuar
      </button>
    </div>
  );
}

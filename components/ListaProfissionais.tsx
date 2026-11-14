"use client";

import Image from "next/image";
import {
  equipe,
  estrelas,
  formatarNota,
  nivelNoServico,
  notaMedia,
  ROTULO_NIVEL,
  type Especialidade,
  type Profissional,
} from "@/data/equipe";
import type { Servico } from "@/data/servicos";

type Props = {
  /** serviço já escolhido, se houver: ordena por nível e marca a recomendada */
  servico: Servico | null;
  selecionada: Profissional | null;
  onEscolher: (p: Profissional) => void;
};

/** Até duas especialidades; as que cobrem o serviço escolhido vêm primeiro. */
function especialidadesDoCard(p: Profissional, servico: Servico | null): Especialidade[] {
  const cobre = (e: Especialidade) => !!servico && e.servicos.includes(servico.id);
  return [...p.especialidades]
    .sort((a, b) => Number(cobre(b)) - Number(cobre(a)) || b.nivel - a.nivel)
    .slice(0, 2);
}

export default function ListaProfissionais({ servico, selecionada, onEscolher }: Props) {
  const linhas = equipe
    .map((p) => ({ p, nivel: servico ? nivelNoServico(p, servico.id) : 0 }))
    .sort((a, b) => {
      if (!servico) return 0;
      return (
        Number(b.nivel > 0) - Number(a.nivel > 0) || b.nivel - a.nivel || notaMedia(b.p) - notaMedia(a.p)
      );
    });
  const recomendadaId = servico && linhas[0].nivel > 0 ? linhas[0].p.id : null;

  return (
    <ul className="grid grid-cols-2 gap-3 p-1 -m-1">
      {linhas.map(({ p, nivel }) => {
        const faz = !servico || nivel > 0;
        const ativa = selecionada?.id === p.id;
        return (
          <li key={p.id}>
            <button
              type="button"
              disabled={!faz}
              aria-pressed={ativa}
              onClick={() => onEscolher(p)}
              className={`r-lg flex h-full w-full flex-col overflow-hidden bg-card text-left transition-shadow disabled:opacity-50 ${
                ativa
                  ? "shadow-[0_0_0_2px_var(--polish),var(--sombra-3)]"
                  : "sombra-2 hover:shadow-[var(--sombra-3)]"
              }`}
            >
              <span className="relative block aspect-[4/5] w-full bg-superficie">
                <Image
                  src={p.foto}
                  alt={`${p.nome}, ${p.especialidade}`}
                  fill
                  sizes="(min-width: 640px) 260px, 45vw"
                  className="object-cover"
                />
                {p.id === recomendadaId && (
                  <span className="r-pill absolute left-2 top-2 max-w-[88%] bg-acento px-3 py-1.5 text-[11px] font-medium leading-tight text-acento-fg shadow-[var(--sombra-1)]">
                    Recomendada para este serviço
                  </span>
                )}
              </span>

              <span className="flex flex-1 flex-col p-3 sm:p-4">
                <span className="titulo text-2xl font-normal leading-tight">{p.nome}</span>
                <span className="mt-1 text-xs text-suave">
                  <span aria-hidden="true">★</span> {formatarNota(notaMedia(p))}{" "}
                  <span className="sr-only">de 5, </span>({p.avaliacoes.length} avaliações)
                </span>

                {faz ? (
                  <span className="mt-3 block space-y-2">
                    {especialidadesDoCard(p, servico).map((e) => (
                      <span key={e.nome} className="block text-xs leading-snug">
                        <span className="block">{e.nome}</span>
                        <span className="block text-suave">
                          <span aria-hidden="true">{estrelas(e.nivel)}</span> {ROTULO_NIVEL[e.nivel]}
                        </span>
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="mt-3 block text-xs leading-snug text-suave">
                    Não realiza este serviço.
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

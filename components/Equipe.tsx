"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  equipe,
  estrelas,
  formatarNota,
  notaMedia,
  ROTULO_NIVEL,
  type Profissional,
} from "@/data/equipe";
import { proximoHorario } from "@/lib/agenda";
import { useBloqueios } from "@/lib/bloqueios";
import { useAgendamento } from "./AgendamentoContext";
import Reveal from "./Reveal";

const dataBR = (iso: string) => iso.split("-").reverse().join("/");

function CardProfissional({ p, indice }: { p: Profissional; indice: number }) {
  const { abrir } = useAgendamento();
  const bloqueios = useBloqueios();
  // Depende do relógio do aparelho e das reservas: calcula só depois de montar.
  const [proximo, setProximo] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setProximo(proximoHorario(p.id, bloqueios));
  }, [p.id, bloqueios]);

  return (
    <Reveal as="li" delay={indice * 0.07} className="flex">
      <article className="group flex w-full flex-col">
        <div className="r-lg sombra-2 relative aspect-[3/4] overflow-hidden bg-card">
          <Image
            src={p.foto}
            alt={`${p.nome}, ${p.especialidade}`}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col pt-6">
          <h3 className="titulo text-4xl font-light">{p.nome}</h3>
          <p className="rotulo mt-2">{p.especialidade}</p>
          <p className="mt-3 text-sm">
            <span aria-hidden="true">★</span> {formatarNota(notaMedia(p))}
            <span className="sr-only"> de 5</span>
            <span className="text-suave"> ({p.avaliacoes.length} avaliações)</span>
          </p>
          <p className="mt-3 min-h-[2.85rem] text-sm leading-relaxed text-suave">{p.frase}</p>

          <ul className="mt-4 space-y-2" aria-label={`Especialidades de ${p.nome}`}>
            {[...p.especialidades]
              .sort((a, b) => b.nivel - a.nivel)
              .map((e) => (
                <li key={e.nome} className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{e.nome}</span>
                  <span className="shrink-0 text-xs text-suave">
                    <span aria-hidden="true">{estrelas(e.nivel)}</span> {ROTULO_NIVEL[e.nivel]}
                  </span>
                </li>
              ))}
          </ul>

          <ul className="mt-6 grid grid-cols-3 gap-2" aria-label={`Trabalhos de ${p.nome}`}>
            {p.trabalhos.map((src, i) => (
              <li key={src} className="r-sm relative aspect-square overflow-hidden bg-card">
                <Image
                  src={src}
                  alt={`Trabalho ${i + 1} de ${p.nome}`}
                  fill
                      sizes="(min-width: 1024px) 120px, 30vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>

          <details className="r-md sombra-1 group/aval mt-5 bg-card">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm [&::-webkit-details-marker]:hidden">
              Ver avaliações
              <span
                aria-hidden="true"
                className="text-lg leading-none text-suave transition-transform duration-200 group-open/aval:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="space-y-4 px-4 pb-4 pt-1">
              {p.avaliacoes.map((a) => (
                <li key={a.nome + a.data}>
                  <p className="text-xs text-suave">
                    {a.nome} · {dataBR(a.data)} · <span aria-hidden="true">★</span> {a.nota}
                    <span className="sr-only"> de 5</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{a.comentario}</p>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-6 flex items-baseline justify-between gap-3 border-t border-linha pt-4 text-sm">
            <span className="text-suave">Próximo horário</span>
            <span className="text-right" aria-live="polite">
              {proximo === undefined ? "\u00a0" : (proximo ?? "Sem horários")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => abrir({ profissionalId: p.id })}
            className="btn-acento mt-6 w-full"
          >
            Agendar com {p.nome}
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function Equipe() {
  return (
    <section id="equipe" className="border-t border-linha bg-fundo">
      <div className="container-glow py-24 md:py-36">
        <Reveal className="max-w-2xl">
          <p className="rotulo">Equipe</p>
          <h2 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">
            Quem atende você
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-suave">
            Cada profissional mostra o nível em cada especialidade. Agende com quem você quiser
            que atenda.
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {equipe.map((p, i) => (
            <CardProfissional key={p.id} p={p} indice={i % 4} />
          ))}
        </ul>
      </div>
    </section>
  );
}

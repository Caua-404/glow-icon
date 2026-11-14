"use client";

import { useEffect } from "react";
import Image from "next/image";
import { confianca, posicionamento, profissional } from "@/data/site";
import { useAgendamento } from "./AgendamentoContext";
import PolishSeletor from "./PolishSeletor";

/** Atraso (s) de cada bloco do hero; o CSS soma 1,5s depois do véu subir. */
const atraso = (s: number) => ({ ["--d" as string]: `${s}s` });

export default function Hero() {
  const { abrir } = useAgendamento();

  const [primeiroNome, ...resto] = profissional.nome.split(" ");
  const sobrenome = resto.join(" ");

  // Abertura: só na primeira visita da sessão. O boot do cliente marca "wait" (primeira vez)
  // ou "skip" (já viu); aqui, depois do primeiro paint, passa para "play" e lembra no sessionStorage.
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") !== "wait") return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        html.setAttribute("data-intro", "play");
        try {
          sessionStorage.setItem("glow-intro", "1");
        } catch {
          /* sem sessionStorage: a abertura toca de novo na próxima visita */
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section id="topo" className="ripado relative overflow-hidden pt-20">
      <div className="container-glow grid min-h-[calc(100svh-5rem)] grid-cols-12 items-center gap-x-6">
        {/* Texto */}
        <div className="col-span-12 py-12 md:col-span-7 md:py-20 md:pr-8">
          <div className="i-el i-fade" style={atraso(0.1)}>
            <span aria-hidden="true" className="mb-3 block h-px w-12 bg-dourado" />
            <p className="text-sm tracking-[0.12em] text-suave">Fundadora · Glow Icon</p>
          </div>

          <h1 className="titulo relative mt-6 w-fit text-[clamp(4.25rem,12vw,10rem)] font-light leading-[0.86] tracking-[-0.02em]">
            <span className="block">
              <span className="i-el i-wipe inline-block" style={atraso(0.2)}>
                {primeiroNome}
              </span>
            </span>
            <span className="block md:pl-[0.7em]">
              <span className="i-el i-wipe inline-block" style={atraso(0.32)}>
                {sobrenome}
              </span>
            </span>

            {/* a) traço de delineador contornando o nome, com um risco final para fora */}
            <svg
              aria-hidden="true"
              className="liner pointer-events-none absolute left-[-3%] top-[-9%] h-[118%] w-[106%] overflow-visible"
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M 3 24 C 3 10, 6 5, 18 4.5 L 82 4 C 94 4, 97 9, 97 20 C 97 32, 95 38, 84 39.5 L 20 40.5 C 8 41, 4 38, 3.5 27 Q 3 23, -2 19"
                pathLength={1}
                stroke="var(--dourado)"
                strokeWidth={0.65}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h1>

          <p
            className="titulo i-el i-up mt-8 text-3xl font-light italic md:text-5xl"
            style={atraso(0.7)}
          >
            {posicionamento}
          </p>

          <div className="i-el i-up mt-10 flex flex-wrap gap-3" style={atraso(0.85)}>
            <button type="button" onClick={() => abrir()} className="btn-acento">
              Agendar horário
            </button>
            <a href="#inspiracoes" className="btn-linha">
              Ver trabalhos
            </a>
          </div>

          <div className="i-el i-up mt-10" style={atraso(0.95)}>
            <PolishSeletor />
          </div>

          <dl
            className="i-el i-up mt-10 flex max-w-xl flex-wrap gap-x-10 gap-y-4 border-t border-linha pt-6"
            style={atraso(1.05)}
          >
            <div>
              <dt className="rotulo">Avaliação</dt>
              <dd className="titulo numero mt-2 text-3xl md:text-4xl">
                {confianca.nota}
                <span className="ml-1 font-sans text-xs text-suave">de 5</span>
              </dd>
            </div>
            <div>
              <dt className="rotulo">Experiência</dt>
              <dd className="titulo numero mt-2 text-3xl md:text-4xl">
                {profissional.anosExperiencia}
                <span className="ml-1 font-sans text-xs text-suave">anos</span>
              </dd>
            </div>
            <div>
              <dt className="rotulo">Cidade</dt>
              <dd className="titulo mt-2 text-3xl md:whitespace-nowrap md:text-4xl">
                {confianca.cidade}
              </dd>
            </div>
          </dl>
        </div>

        {/* Foto 4:5; moldura arredondada no topo, borda dourada a 8px */}
        <div className="col-span-12 pb-14 md:col-span-5 md:pb-0">
          <div className="i-el i-fade relative ml-auto w-[82%] md:ml-0 md:w-full" style={atraso(0.35)}>
            <div className="relative rounded-t-full rounded-b-[var(--r-lg)] p-2 [box-shadow:var(--sombra-3),inset_0_0_0_1px_var(--dourado)]">
              <div
                className="i-el i-fade relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[calc(var(--r-lg)-8px)] bg-superficie"
                style={atraso(0.8)}
              >
                <Image
                  src="/img/eduarda.png"
                  alt={`${profissional.nome}, fundadora do Glow Icon`}
                  fill
                  priority
                  sizes="(min-width: 768px) 480px, 82vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

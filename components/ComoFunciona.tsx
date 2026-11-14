"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Mascote from "./Mascote";

const passos = [
  {
    titulo: "Escolha o serviço ou a profissional",
    texto: "Comece por quem você quer que atenda ou pelo que você quer fazer.",
  },
  {
    titulo: "Escolha o horário",
    texto: "Veja os próximos 14 dias e escolha o dia e a hora que ficam bons para você.",
  },
  {
    titulo: "Confirme pelo WhatsApp",
    texto: "Envie o resumo pelo WhatsApp do salão e o horário fica combinado com a equipe.",
  },
];

/**
 * Um passo da linha do tempo. Cada passo cuida do trecho de linha que vai do seu
 * marcador até o próximo e o preenche na cor --polish conforme a "linha de leitura"
 * (65% da altura da tela) atravessa o passo durante a rolagem.
 */
function Passo({
  indice,
  titulo,
  texto,
  ultimo,
  semMovimento,
}: {
  indice: number;
  titulo: string;
  texto: string;
  ultimo: boolean;
  semMovimento: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  const [alcancado, setAlcancado] = useState(false);

  // Só muda de estado ao cruzar o limite (setState com o mesmo valor não renderiza de novo).
  useMotionValueEvent(scrollYProgress, "change", (v) => setAlcancado(v > 0));
  useEffect(() => {
    setAlcancado(scrollYProgress.get() > 0);
  }, [scrollYProgress]);

  const aceso = semMovimento || alcancado;

  return (
    <li
      ref={ref}
      className={`relative [--n:4.5rem] md:[--n:6rem] ${ultimo ? "" : "pb-16 md:pb-20"}`}
    >
      {/* trecho da linha até o próximo marcador */}
      {!ultimo && (
        <>
          <span
            aria-hidden="true"
            className="absolute -left-10 top-[calc(var(--n)/2)] h-full w-0.5 translate-x-[6px] bg-[color-mix(in_srgb,var(--tinta)_16%,transparent)] sm:-left-14"
          />
          <motion.span
            aria-hidden="true"
            className="absolute -left-10 top-[calc(var(--n)/2)] h-full w-0.5 origin-top translate-x-[6px] bg-polish sm:-left-14"
            style={{ scaleY: semMovimento ? 1 : scrollYProgress }}
          />
        </>
      )}

      {/* marcador */}
      <span
        aria-hidden="true"
        className={`r-pill absolute -left-10 top-[calc(var(--n)/2_-_7px)] h-3.5 w-3.5 shadow-[0_0_0_5px_var(--fundo)] transition-colors duration-300 sm:-left-14 ${
          aceso ? "bg-polish" : "bg-[color-mix(in_srgb,var(--tinta)_22%,var(--fundo))]"
        }`}
      />

      <span className="titulo numero block text-[length:var(--n)] font-light leading-none">
        {indice + 1}
      </span>
      <h3 className="mt-5 text-xl">{titulo}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-suave">{texto}</p>
    </li>
  );
}

export default function ComoFunciona() {
  const reduzir = useReducedMotion() ?? false;

  return (
    <section id="como-funciona" className="border-t border-linha bg-fundo">
      <div className="container-glow py-24 md:py-36">
        <h2 className="titulo max-w-2xl text-[clamp(2.75rem,6vw,5rem)] font-light">
          Como funciona
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-20">
          {/* celular: mascote antes da linha do tempo */}
          <div className="col-span-12 flex justify-center md:hidden">
            <Mascote size="lg" />
          </div>

          <ol className="col-span-12 pl-10 sm:pl-14 md:col-span-7">
            {passos.map((p, i) => (
              <Passo
                key={p.titulo}
                indice={i}
                titulo={p.titulo}
                texto={p.texto}
                ultimo={i === passos.length - 1}
                semMovimento={reduzir}
              />
            ))}
          </ol>

          {/* desktop: mascote ao lado, acompanhando a rolagem */}
          <div className="col-span-5 hidden md:block">
            <div className="sticky top-28 flex justify-center pt-4">
              <Mascote size="xl" />
            </div>
          </div>
        </div>

        <div className="sombra-2 r-lg mt-20 max-w-2xl bg-card p-7 md:mt-28 md:p-10">
          <p className="rotulo">Política de remarcação</p>
          <p className="titulo mt-3 text-3xl font-light leading-snug md:text-4xl">
            Remarcações com menos de 24 horas de antecedência só pelo WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

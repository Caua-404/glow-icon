"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  equipe,
  SELO_AMBIENTE,
  type Profissional,
} from "@/data/equipe";

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EASE_CHEGADA: [number, number, number, number] = [0.16, 1, 0.3, 1];
const N = equipe.length;

function offsetDe(ativo: number, i: number) {
  let d = i - ativo;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

type Props = {
  reduzir: boolean;
  pronta: boolean;
  onAbrir: (p: Profissional) => void;
};

export default function CarrosselCapa({ reduzir, pronta, onAbrir }: Props) {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [revelar, setRevelar] = useState(false);
  const arrastando = useRef(false);
  const pularClique = useRef(false);
  const chegando = useRef(true);
  const passo = useRef<(d: number) => void>(() => {});
  const autoplay = useRef<number>(0);

  const ir = useCallback((d: number) => {
    setAtivo((a) => (a + d + N) % N);
  }, []);

  passo.current = ir;

  useEffect(() => {
    if (!pronta) {
      setRevelar(false);
      chegando.current = true;
      return;
    }
    const mostrar = window.setTimeout(() => setRevelar(true), reduzir ? 0 : 180);
    const soltar = window.setTimeout(() => {
      chegando.current = false;
    }, reduzir ? 280 : 1700);
    return () => {
      window.clearTimeout(mostrar);
      window.clearTimeout(soltar);
    };
  }, [pronta, reduzir]);

  useEffect(() => {
    window.clearInterval(autoplay.current);
    if (reduzir || pausado || !revelar) return;
    const espera = window.setTimeout(() => {
      autoplay.current = window.setInterval(() => passo.current(1), 4000);
    }, chegando.current ? 1400 : 0);
    return () => {
      window.clearTimeout(espera);
      window.clearInterval(autoplay.current);
    };
  }, [reduzir, pausado, revelar]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        ir(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        ir(-1);
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [ir]);

  const pAtiva = equipe[ativo];

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => {
        if (!arrastando.current) setPausado(false);
      }}
      onTouchStart={() => setPausado(true)}
      onTouchEnd={() => {
        window.setTimeout(() => {
          if (!arrastando.current) setPausado(false);
        }, 600);
      }}
    >
      <div className="relative h-[min(52svh,26rem)] w-full max-w-[72rem] md:h-[48svh]">
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag={reduzir || !revelar ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => {
            arrastando.current = true;
            pularClique.current = false;
            setPausado(true);
          }}
          onDragEnd={(_, info) => {
            arrastando.current = false;
            let mudou = false;
            if (info.offset.x < -70 || info.velocity.x < -400) {
              ir(1);
              mudou = true;
            } else if (info.offset.x > 70 || info.velocity.x > 400) {
              ir(-1);
              mudou = true;
            }
            pularClique.current = mudou;
            window.setTimeout(() => {
              pularClique.current = false;
              setPausado(false);
            }, 160);
          }}
        >
          {equipe.map((p, i) => {
            const d = offsetDe(ativo, i);
            const visivel = Math.abs(d) <= 1;
            const centro = d === 0;
            const entrada = chegando.current && revelar;
            return (
              <motion.button
                key={p.id}
                type="button"
                disabled={!revelar}
                aria-hidden={!visivel || !revelar}
                aria-label={`${p.nome}, ${SELO_AMBIENTE[p.ambiente]}`}
                tabIndex={centro && revelar ? 0 : -1}
                initial={false}
                animate={{
                  x: `calc(-50% + ${d * 58}%)`,
                  y: revelar ? 0 : 64,
                  scale: revelar ? (centro ? 1 : 0.75) : 0.9,
                  opacity: revelar && visivel ? (centro ? 1 : 0.55) : 0,
                  filter: !revelar
                    ? "blur(10px) grayscale(25%) brightness(0.92)"
                    : centro
                      ? "blur(0px) grayscale(0%) brightness(1)"
                      : "blur(0px) grayscale(70%) brightness(0.85)",
                  zIndex: centro ? 4 : visivel ? 2 : 0,
                }}
                transition={
                  reduzir
                    ? { duration: 0.3 }
                    : entrada
                      ? {
                          duration: 1.15,
                          delay: 0.06 + Math.abs(d) * 0.2,
                          ease: EASE_CHEGADA,
                        }
                      : { duration: 0.5, ease: EASE }
                }
                onClick={() => {
                  if (pularClique.current) return;
                  if (centro) onAbrir(p);
                  else setAtivo(i);
                }}
                className="absolute left-1/2 top-0 h-full w-[min(72vw,20rem)] origin-bottom overflow-hidden rounded-[28px] text-left shadow-[0_18px_40px_rgb(0_0_0/0.28)] ring-1 ring-white/25"
                style={{ pointerEvents: revelar && visivel ? "auto" : "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.foto}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover object-[center_14%]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              </motion.button>
            );
          })}
        </motion.div>

        <motion.button
          type="button"
          aria-label="Anterior"
          onClick={() => ir(-1)}
          initial={false}
          animate={{ opacity: revelar ? 1 : 0 }}
          transition={{ duration: reduzir ? 0.3 : 0.7, delay: revelar ? 0.7 : 0, ease: EASE_CHEGADA }}
          className="absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white/90 ring-1 ring-white/25 backdrop-blur-sm md:left-2 md:h-11 md:w-11 lg:left-6"
          style={{ pointerEvents: revelar ? "auto" : "none" }}
        >
          <Seta dir="esq" />
        </motion.button>
        <motion.button
          type="button"
          aria-label="Próxima"
          onClick={() => ir(1)}
          initial={false}
          animate={{ opacity: revelar ? 1 : 0 }}
          transition={{ duration: reduzir ? 0.3 : 0.7, delay: revelar ? 0.7 : 0, ease: EASE_CHEGADA }}
          className="absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white/90 ring-1 ring-white/25 backdrop-blur-sm md:right-2 md:h-11 md:w-11 lg:right-6"
          style={{ pointerEvents: revelar ? "auto" : "none" }}
        >
          <Seta dir="dir" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pAtiva.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: revelar ? 1 : 0, y: revelar ? 0 : 12 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            duration: reduzir ? 0.3 : 0.85,
            delay: revelar ? 0.42 : 0,
            ease: EASE_CHEGADA,
          }}
          className="mt-4 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            {SELO_AMBIENTE[pAtiva.ambiente]}
          </p>
          <p className="titulo mt-1 text-[clamp(2rem,5vw,3.4rem)] font-light leading-none text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            {pAtiva.nome}
          </p>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: revelar ? 1 : 0 }}
        transition={{ duration: reduzir ? 0.3 : 0.7, delay: revelar ? 0.75 : 0, ease: EASE_CHEGADA }}
        className="mt-4 flex items-center justify-center gap-2"
        style={{ pointerEvents: revelar ? "auto" : "none" }}
      >
        {equipe.map((p, i) => (
          <button
            key={p.id}
            type="button"
            title={p.nome}
            aria-label={p.nome}
            aria-current={i === ativo ? true : undefined}
            onClick={() => setAtivo(i)}
            className="group relative flex h-6 items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === ativo ? "w-6 bg-white" : "w-2 bg-white/40 group-hover:bg-white/70"
              }`}
            />
            <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-2 py-1 text-[11px] text-white backdrop-blur-sm group-hover:block">
              {p.nome}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

function Seta({ dir }: { dir: "esq" | "dir" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      {dir === "esq" ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  formatarDuracao,
  galeriaDoServico,
  rotuloPreco,
  type Servico,
} from "@/data/servicos";

type Props = {
  s: Servico;
  naSacola: boolean;
  onFechar: () => void;
  onAlternar: () => void;
};

export default function ModalServico({ s, naSacola, onFechar, onAlternar }: Props) {
  const reduce = !!useReducedMotion();
  const fotos = galeriaDoServico(s);
  const [i, setI] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => setPronto(true), []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
      if (e.key === "ArrowRight") setI((n) => (n + 1) % fotos.length);
      if (e.key === "ArrowLeft") setI((n) => (n - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", tecla);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = prev;
    };
  }, [onFechar, fotos.length]);

  if (!pronto) return null;

  const modal = (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        className="absolute inset-0 bg-black/55"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="servico-titulo"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: reduce ? 0.2 : 0.35 }}
        className="relative z-[1] flex max-h-[min(92svh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-[#1c1612] text-[#f7f3ee] shadow-[0_24px_60px_rgb(0_0_0/0.45)]"
      >
        <div className="relative h-52 shrink-0 overflow-hidden sm:h-60">
          {fotos.map((src, n) => (
            <motion.div
              key={`${src}-${n}`}
              className="absolute inset-0"
              initial={false}
              animate={{ x: `${(n - i) * 100}%` }}
              transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 280, damping: 32 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} className="h-full w-full object-cover" />
            </motion.div>
          ))}
          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -350) setI((n) => (n + 1) % fotos.length);
              else if (info.offset.x > 50 || info.velocity.x > 350) setI((n) => (n - 1 + fotos.length) % fotos.length);
            }}
          />
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-[#f7f3ee] ring-1 ring-white/25"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {fotos.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Foto ${n + 1}`}
                onClick={() => setI(n)}
                className={`h-1.5 rounded-full ${n === i ? "w-5 bg-white" : "w-1.5 bg-white/45"}`}
              />
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="servico-titulo" className="titulo text-[1.7rem] font-light leading-none">
              {s.nome}
            </h2>
            <p className="titulo shrink-0 text-xl leading-none">{rotuloPreco(s)}</p>
          </div>
          <p className="mt-1 text-sm text-white/60">{formatarDuracao(s.duracaoMin)}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{s.detalhe}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/50">O que entra</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-white/85">
            {s.beneficios.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--dourado)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/50">Depois do atendimento</p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{s.cuidados}</p>
        </div>

        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onAlternar}
            className={
              naSacola
                ? "inline-flex min-h-11 w-full items-center justify-center rounded-[var(--r-md)] text-sm text-[#e8b4b4] ring-1 ring-[#e8b4b4]/50"
                : "btn-acento w-full gap-2 !leading-none"
            }
          >
            {naSacola ? (
              "Remover"
            ) : (
              <>
                Adicionar
                <Mais />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}

function Mais() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
    </svg>
  );
}

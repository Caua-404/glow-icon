"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { FotoEstudio } from "@/data/estudio";

type Props = {
  fotos: FotoEstudio[];
  indice: number | null;
  onMudar: (i: number) => void;
  onFechar: () => void;
};

export default function EstudioLightbox({ fotos, indice, onMudar, onFechar }: Props) {
  const aberto = indice !== null;
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const total = fotos.length;
  const atual = useRef({ indice, fotos, onMudar, onFechar });

  useEffect(() => {
    atual.current = { indice, fotos, onMudar, onFechar };
  });

  useEffect(() => {
    if (!aberto) return;
    const anteriorFoco = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botaoFechar.current?.focus();

    function tecla(e: KeyboardEvent) {
      const { indice: i, fotos: lista, onMudar: mudar, onFechar: fechar } = atual.current;
      if (e.key === "Escape") fechar();
      if (i === null || lista.length === 0) return;
      if (e.key === "ArrowLeft") mudar((i - 1 + lista.length) % lista.length);
      if (e.key === "ArrowRight") mudar((i + 1) % lista.length);
    }
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
      anteriorFoco?.focus();
    };
  }, [aberto]);

  const foto = indice !== null ? fotos[indice] : undefined;

  return (
    <AnimatePresence>
      {foto && indice !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${foto.titulo}, foto ${indice + 1} de ${total}`}
          className="fixed inset-0 z-50 flex flex-col bg-[#17120E] text-[#F3ECE3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onFechar}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <p className="text-sm text-[#B3A595]">
              {indice + 1} / {total}
            </p>
            <button
              ref={botaoFechar}
              type="button"
              onClick={onFechar}
              className="min-h-11 px-2 text-sm"
            >
              Fechar
            </button>
          </div>

          <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={foto.id}
                className="absolute inset-x-4 inset-y-0 sm:inset-x-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="100vw"
                  className="r-lg object-contain"
                />
              </motion.div>
            </AnimatePresence>
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onMudar((indice - 1 + total) % total)}
                  className="absolute left-0 top-1/2 hidden min-h-11 -translate-y-1/2 px-3 text-sm sm:block"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => onMudar((indice + 1) % total)}
                  className="absolute right-0 top-1/2 hidden min-h-11 -translate-y-1/2 px-3 text-sm sm:block"
                >
                  Próxima
                </button>
              </>
            )}
          </div>

          <div
            className="flex shrink-0 flex-wrap items-end justify-between gap-3 px-4 py-4 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="titulo text-2xl font-light">{foto.titulo}</p>
              <p className="mt-1 max-w-xl text-sm text-[#B3A595]">{foto.alt}</p>
            </div>
            {total > 1 && (
              <div className="flex gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => onMudar((indice - 1 + total) % total)}
                  className="min-h-11 px-3 text-sm"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => onMudar((indice + 1) % total)}
                  className="min-h-11 px-3 text-sm"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

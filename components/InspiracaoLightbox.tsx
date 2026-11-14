"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Inspiracao } from "@/data/inspiracoes";
import { profissionalPorId } from "@/data/equipe";
import { categorias } from "@/data/servicos";
import IconeCoracao from "./IconeCoracao";

type Props = {
  itens: Inspiracao[];
  indice: number | null;
  onMudar: (i: number) => void;
  onFechar: () => void;
  ehFavorito: (id: string) => boolean;
  alternar: (id: string) => void;
  onQueroEsse: (item: Inspiracao) => void;
};

export default function InspiracaoLightbox(props: Props) {
  const { itens, indice, onFechar, ehFavorito, alternar, onQueroEsse } = props;
  const aberto = indice !== null;
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const total = itens.length;

  // Handlers atuais sem reexecutar o efeito (que mexe em foco e rolagem).
  const atual = useRef(props);
  useEffect(() => {
    atual.current = props;
  });

  useEffect(() => {
    if (!aberto) return;
    const anteriorFoco = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botaoFechar.current?.focus();

    function tecla(e: KeyboardEvent) {
      const { indice: i, itens: lista, onMudar, onFechar: fechar } = atual.current;
      if (e.key === "Escape") fechar();
      if (i === null || lista.length === 0) return;
      if (e.key === "ArrowLeft") onMudar((i - 1 + lista.length) % lista.length);
      if (e.key === "ArrowRight") onMudar((i + 1) % lista.length);
    }
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
      anteriorFoco?.focus();
    };
  }, [aberto]);

  const item = indice !== null ? itens[indice] : undefined;
  const prof = item ? profissionalPorId(item.profissionalId) : undefined;
  const categoria = item ? categorias.find((c) => c.id === item.categoria)?.nome : undefined;
  const fav = item ? ehFavorito(item.id) : false;

  return (
    <AnimatePresence>
      {item && indice !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Inspiração ampliada"
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
                key={item.id}
                className="absolute inset-x-4 inset-y-0 sm:inset-x-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
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
                  onClick={() => props.onMudar((indice - 1 + total) % total)}
                  className="absolute left-0 top-1/2 hidden min-h-11 -translate-y-1/2 px-3 text-sm sm:block"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => props.onMudar((indice + 1) % total)}
                  className="absolute right-0 top-1/2 hidden min-h-11 -translate-y-1/2 px-3 text-sm sm:block"
                >
                  Próxima
                </button>
              </>
            )}
          </div>

          <div
            className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="titulo text-2xl font-light">{prof?.nome}</p>
              <p className="text-xs text-[#B3A595]">
                {prof?.especialidade}
                {categoria ? `, ${categoria}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alternar(item.id)}
                aria-pressed={fav}
                aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                className="r-pill flex h-11 w-11 items-center justify-center bg-[#F3ECE3]/10 transition-colors hover:bg-[#F3ECE3]/20"
              >
                <IconeCoracao cheio={fav} />
              </button>
              <button
                type="button"
                onClick={() => onQueroEsse(item)}
                className="btn-acento"
              >
                Quero esse
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

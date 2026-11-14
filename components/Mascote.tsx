"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Tamanho = "sm" | "md" | "lg" | "xl";

type Props = {
  size?: Tamanho;
  /** Texto do balão de fala. Sem texto, só o mascote aparece. */
  mensagem?: string;
  /** Lado do balão em relação ao mascote. */
  balao?: "esquerda" | "direita";
  className?: string;
};

// Arquivos originais: 400x562 e 800x1125 (proporção fixa).
const PROPORCAO = 562 / 400;
const LARGURA: Record<Tamanho, number> = { sm: 56, md: 104, lg: 168, xl: 300 };
const ARQUIVO: Record<Tamanho, string> = {
  sm: "/img/mascote/mascote-glow-400.webp",
  md: "/img/mascote/mascote-glow-400.webp",
  lg: "/img/mascote/mascote-glow-800.webp",
  xl: "/img/mascote/mascote-glow-800.webp",
};

export default function Mascote({ size = "md", mensagem, balao = "direita", className = "" }: Props) {
  const reduzir = useReducedMotion();
  const largura = LARGURA[size];
  const altura = Math.round(largura * PROPORCAO);
  const halo = Math.round(largura * 1.15);
  const noLadoDireito = balao === "direita";

  return (
    <motion.div
      className={`flex items-center gap-3 ${noLadoDireito ? "flex-row" : "flex-row-reverse"} ${className}`}
      initial={reduzir ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative shrink-0" style={{ width: largura, height: altura }}>
        {/* círculo na cor do esmalte: segura o corpo preto no modo escuro */}
        <span
          aria-hidden="true"
          className="mascote-halo absolute rounded-full"
          style={{
            width: halo,
            height: halo,
            left: "50%",
            top: "56%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="mascote-flutua relative h-full w-full">
          <Image
            src={ARQUIVO[size]}
            alt="Mascote Glow Icon"
            width={largura}
            height={altura}
            sizes={`${largura}px`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {mensagem && (
        <div
          className={`r-md sombra-1 relative max-w-[11rem] border border-[color-mix(in_srgb,var(--tinta)_20%,transparent)] bg-fundo px-3 py-2 font-sans text-[14px] leading-snug text-tinta ${
            size === "lg" ? "self-start" : ""
          }`}
        >
          {/* ponta do balão, voltada para o mascote */}
          <span
            aria-hidden="true"
            className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-fundo ${
              noLadoDireito
                ? "-left-[5px] border-b border-l"
                : "-right-[5px] border-r border-t"
            } border-[color-mix(in_srgb,var(--tinta)_20%,transparent)]`}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mensagem}
              className="block"
              initial={reduzir ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduzir ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mensagem}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

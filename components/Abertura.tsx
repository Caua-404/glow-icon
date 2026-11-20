"use client";

import { motion } from "framer-motion";
import LogoSvg from "./LogoSvg";

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

type Props = {
  visivel: boolean;
  abertas: boolean;
  reduzir: boolean;
  onPular: () => void;
};

export default function Abertura({ visivel, abertas, reduzir, onPular }: Props) {
  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[70] cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label="Pular abertura"
      onClick={onPular}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") onPular();
      }}
    >
      <div className="absolute inset-0" style={{ perspective: "1400px" }}>
        <motion.div
          className="porta-ripado porta-filete-dir absolute inset-y-0 left-0 w-1/2 origin-left"
          initial={false}
          animate={
            reduzir
              ? { opacity: abertas ? 0 : 1 }
              : {
                  x: abertas ? "-102%" : "0%",
                  rotateY: abertas ? -25 : 0,
                }
          }
          transition={reduzir ? { duration: 0.3 } : { duration: 1.1, ease: EASE }}
        />
        <motion.div
          className="porta-ripado porta-filete-esq absolute inset-y-0 right-0 w-1/2 origin-right"
          initial={false}
          animate={
            reduzir
              ? { opacity: abertas ? 0 : 1 }
              : {
                  x: abertas ? "102%" : "0%",
                  rotateY: abertas ? 25 : 0,
                }
          }
          transition={reduzir ? { duration: 0.3 } : { duration: 1.1, ease: EASE }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        initial={false}
        animate={{ opacity: abertas || reduzir ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <LogoSvg className="h-5 w-auto text-[#f7f3ee] drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] sm:h-6" />
      </motion.div>
    </div>
  );
}

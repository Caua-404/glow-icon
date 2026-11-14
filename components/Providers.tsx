"use client";

import { MotionConfig } from "framer-motion";
import { AgendamentoProvider } from "./AgendamentoContext";
import { ContaProvider } from "./ContaContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user": respeita prefers-reduced-motion (remove movimento, mantém opacidade)
    <MotionConfig reducedMotion="user">
      <ContaProvider>
        <AgendamentoProvider>{children}</AgendamentoProvider>
      </ContaProvider>
    </MotionConfig>
  );
}

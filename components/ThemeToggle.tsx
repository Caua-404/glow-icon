"use client";

import { useEffect, useState } from "react";

const CHAVE = "glow-tema";

export default function ThemeToggle() {
  const [escuro, setEscuro] = useState<boolean | null>(null);

  useEffect(() => {
    setEscuro(document.documentElement.classList.contains("dark"));
  }, []);

  function alternar() {
    const proximo = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", proximo);
    try {
      localStorage.setItem(CHAVE, proximo ? "escuro" : "claro");
    } catch {
      /* armazenamento indisponível: o tema vale só nesta sessão */
    }
    setEscuro(proximo);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      title={escuro ? "Modo claro" : "Modo escuro"}
      className="flex h-11 w-11 items-center justify-center"
    >
      {/* círculo meio preenchido: símbolo de contraste */}
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2a8 8 0 0 0 0 16Z" fill="currentColor" />
      </svg>
    </button>
  );
}

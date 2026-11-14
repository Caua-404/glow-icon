"use client";

import { useEffect } from "react";
import { posicionamento } from "@/data/site";

const FIM_MS = 2300;

function encerrar() {
  const html = document.documentElement;
  html.classList.add("abertura-fim");
  try {
    sessionStorage.setItem("glow-intro", "1");
  } catch {
    /* sem sessionStorage: a abertura toca de novo na próxima visita */
  }
}

/** Véu de papel na primeira visita: estrela, nome, e a folha sobe. */
export default function Abertura() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") === "skip") {
      html.classList.add("abertura-fim");
      return;
    }

    const pular = () => {
      html.setAttribute("data-intro", "skip");
      encerrar();
    };

    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") pular();
    };
    window.addEventListener("keydown", tecla);

    const fim = window.setTimeout(encerrar, FIM_MS);

    return () => {
      window.removeEventListener("keydown", tecla);
      window.clearTimeout(fim);
    };
  }, []);

  return (
    <div className="abertura" aria-hidden="true">
      <div
        className="abertura-folha ripado"
        onClick={() => {
          document.documentElement.setAttribute("data-intro", "skip");
          encerrar();
        }}
      >
        <div className="abertura-marca">
          <svg className="abertura-estrela" viewBox="0 0 24 24">
            <path
              d="M12 0C12.96 7.2 16.8 11.04 24 12 16.8 12.96 12.96 16.8 12 24 11.04 16.8 7.2 12.96 0 12 7.2 11.04 11.04 7.2 12 0Z"
              fill="var(--dourado)"
            />
          </svg>
          <p className="abertura-nome titulo">Glow Icon</p>
          <span className="abertura-risco" />
          <p className="abertura-frase">{posicionamento}</p>
        </div>
      </div>
    </div>
  );
}

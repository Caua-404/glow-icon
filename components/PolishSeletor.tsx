"use client";

import { useEffect, useState } from "react";
import { CHAVE_POLISH, esmaltes, type Esmalte } from "@/data/polish";

/**
 * "Escolha sua cor": troca --polish no site inteiro.
 * O valor vai para <html data-polish="...">; as cores vivem em globals.css.
 */
export default function PolishSeletor() {
  const [atual, setAtual] = useState<Esmalte["id"]>("nude");

  useEffect(() => {
    const salvo = document.documentElement.getAttribute("data-polish");
    const achado = esmaltes.find((e) => e.id === salvo);
    if (achado) setAtual(achado.id);
  }, []);

  function escolher(id: Esmalte["id"]) {
    setAtual(id);
    document.documentElement.setAttribute("data-polish", id);
    try {
      localStorage.setItem(CHAVE_POLISH, id);
    } catch {
      /* sem armazenamento: vale só nesta visita */
    }
  }

  const nomeAtual = esmaltes.find((e) => e.id === atual)?.nome;

  return (
    <div>
      <p className="rotulo" id="polish-rotulo">
        Escolha sua cor
        <span className="ml-3 normal-case tracking-normal text-tinta">{nomeAtual}</span>
      </p>
      <ul className="-ml-2 mt-2 flex items-center" aria-labelledby="polish-rotulo">
        {esmaltes.map((e) => {
          const ativo = e.id === atual;
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => escolher(e.id)}
                aria-pressed={ativo}
                aria-label={`Esmalte ${e.nome}`}
                title={e.nome}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span
                  className="block h-7 w-7 rounded-full border border-[color-mix(in_srgb,var(--tinta)_22%,transparent)] transition-transform duration-200 hover:scale-110"
                  style={{
                    background: `var(--sw-${e.id})`,
                    outline: ativo ? "1.5px solid var(--polish)" : "none",
                    outlineOffset: "3px",
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

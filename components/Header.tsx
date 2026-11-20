"use client";

import { useEffect, useRef, useState } from "react";
import { linkWhatsapp } from "@/data/site";
import { useEquipeUi } from "./EquipeUi";
import LogoSvg from "./LogoSvg";

const whatsapp = linkWhatsapp("Oi! Vi o site e queria tirar uma dúvida.");

export default function Header() {
  const equipeUi = useEquipeUi();
  const logoEscura = !!equipeUi?.fundoClaro;
  const navNaFoto = !!equipeUi;
  const qtd = equipeUi?.qtdSacola ?? 0;
  const [esconder, setEsconder] = useState(false);
  const ultimoY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setEsconder(y > ultimoY.current && y > 20);
      ultimoY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function irEquipe(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!equipeUi) return;
    e.preventDefault();
    equipeUi.voltarAoSalao();
  }

  function irAgendar(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    e.preventDefault();
    if (equipeUi) {
      equipeUi.abrirAgendar();
      return;
    }
    window.open(linkWhatsapp("Oi! Queria agendar um horário. Qual o próximo que tiverem?"), "_blank", "noopener,noreferrer");
  }

  const linkCls = navNaFoto
    ? "text-sm text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.7)] hover:text-white/90"
    : "text-sm text-tinta hover:text-tinta/80";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-0 bg-transparent transition-transform duration-300 ${
        esconder ? "max-md:-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 md:h-16 md:px-8">
        <a
          href={equipeUi ? "#equipe" : "/"}
          aria-label="Glow Icon, início"
          onClick={irEquipe}
          className={`min-w-0 ${logoEscura ? "text-tinta" : navNaFoto ? "text-white" : "text-tinta"}`}
        >
          <LogoSvg className="block h-[13px] w-auto max-w-full drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] sm:h-[16px]" />
        </a>

        <nav aria-label="Principal" className="flex items-center gap-4 sm:gap-6">
          <a href={equipeUi ? "#equipe" : "/"} onClick={irEquipe} className={linkCls}>
            Equipe
          </a>
          <a href="#agendar" onClick={irAgendar} className="btn-acento !min-h-9 gap-2 !px-4 !leading-none">
            <span className="leading-none">Agendar</span>
            {qtd > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1 text-[11px] leading-none">
                {qtd}
              </span>
            )}
          </a>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}

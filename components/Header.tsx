"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CONTA_HABILITADA } from "@/data/site";
import { useCliente } from "@/lib/conta";
import { resumoSacola, useSacola } from "@/lib/sacola";
import { useAgendamento } from "./AgendamentoContext";
import { useContaUi } from "./ContaContext";
import IconeSacola from "./IconeSacola";
import LogoSvg from "./LogoSvg";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#servicos", rotulo: "Serviços" },
  { href: "#equipe", rotulo: "Equipe" },
  { href: "#inspiracoes", rotulo: "Inspirações" },
  { href: "#contato", rotulo: "Contato" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const { abrir } = useAgendamento();
  const { abrirEntrar } = useContaUi();
  const cliente = useCliente();
  const sacola = useSacola();
  const qtd = resumoSacola(sacola).qtd;
  const primeiroNome = cliente?.nome.trim().split(/\s+/)[0];

  // Transparente no topo; ao rolar vira barra com blur e borda.
  useEffect(() => {
    const atualizar = () => setRolou(window.scrollY > 24);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  // Menu em tela cheia: trava a rolagem, fecha com Esc e ao passar para o layout desktop.
  useEffect(() => {
    if (!menuAberto) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const aoMudar = () => desktop.matches && setMenuAberto(false);
    window.addEventListener("keydown", tecla);
    desktop.addEventListener("change", aoMudar);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", tecla);
      desktop.removeEventListener("change", aoMudar);
    };
  }, [menuAberto]);

  const barra = rolou || menuAberto;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          menuAberto
            ? "border-linha bg-fundo"
            : rolou
              ? "border-linha bg-[color-mix(in_srgb,var(--fundo)_78%,transparent)] backdrop-blur-md"
              : "border-transparent bg-transparent"
        }`}
      >
        <div
          className={`container-glow grid grid-cols-[1fr_auto] items-center gap-2 transition-[height] duration-300 md:grid-cols-[1fr_auto_1fr] ${
            barra ? "h-14" : "h-20"
          }`}
        >
          <a href="#topo" aria-label="Glow Icon, início" className="justify-self-start">
            <LogoSvg
              animarEstrela
              className={`w-auto transition-[height] duration-300 ${
                barra ? "h-[14px] sm:h-[16px]" : "h-[15px] sm:h-[20px]"
              }`}
            />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative py-2 text-sm text-suave transition-colors duration-200 hover:text-tinta focus-visible:text-tinta"
              >
                {l.rotulo}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-dourado transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-1 sm:gap-2">
            <ThemeToggle />
            {CONTA_HABILITADA && cliente ? (
              <Link
                href="/conta"
                className="hidden min-h-11 items-center px-2 text-sm md:flex"
              >
                {primeiroNome}
              </Link>
            ) : (
              <button
                type="button"
                disabled={!CONTA_HABILITADA}
                title={CONTA_HABILITADA ? undefined : "Em breve"}
                onClick={() => {
                  if (!CONTA_HABILITADA) return;
                  setMenuAberto(false);
                  abrirEntrar();
                }}
                className="hidden min-h-11 items-center px-2 text-sm md:flex disabled:cursor-not-allowed disabled:opacity-40"
              >
                Entrar
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuAberto(false);
                abrir();
              }}
              aria-label={
                qtd === 0
                  ? "Sacola vazia"
                  : `Sacola, ${qtd} ${qtd === 1 ? "serviço" : "serviços"}`
              }
              className="relative flex h-11 w-11 items-center justify-center"
            >
              <IconeSacola />
              {qtd > 0 && (
                <span className="r-pill absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-acento px-1 text-[10px] font-medium text-acento-fg">
                  {qtd}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuAberto(false);
                abrir();
              }}
              className="btn-acento !min-h-10 !px-4"
            >
              Agendar
            </button>
            <button
              type="button"
              onClick={() => setMenuAberto((v) => !v)}
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              className="flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-200 ${
                    menuAberto ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-all duration-200 ${
                    menuAberto ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuAberto && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-fundo pt-14 md:hidden"
          >
            <ul className="container-glow">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-linha last:border-b-0">
                  <motion.a
                    href={l.href}
                    onClick={() => setMenuAberto(false)}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: "easeOut" }}
                    className="titulo flex items-baseline justify-between py-5 text-[clamp(2.75rem,13vw,4.5rem)] font-light leading-none"
                  >
                    {l.rotulo}
                    <span className="rotulo">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
              <li className="overflow-hidden border-b border-linha">
                {CONTA_HABILITADA && cliente ? (
                  <Link
                    href="/conta"
                    onClick={() => setMenuAberto(false)}
                    className="titulo flex py-5 text-[clamp(2.75rem,13vw,4.5rem)] font-light leading-none"
                  >
                    Minha conta
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={!CONTA_HABILITADA}
                    title={CONTA_HABILITADA ? undefined : "Em breve"}
                    onClick={() => {
                      if (!CONTA_HABILITADA) return;
                      setMenuAberto(false);
                      abrirEntrar();
                    }}
                    className="titulo flex py-5 text-[clamp(2.75rem,13vw,4.5rem)] font-light leading-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Entrar
                  </button>
                )}
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

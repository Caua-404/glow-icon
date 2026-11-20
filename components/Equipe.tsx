"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  equipe,
  fotoAmbiente,
  FOTO_SALAO,
  profissionalAdjacente,
  profissionalPorId,
  SELO_AMBIENTE,
  transformFoco,
  type FocoCamera,
  type Profissional,
  type ProfissionalId,
} from "@/data/equipe";
import { linkWhatsapp } from "@/data/site";
import { resumoSacola, useSacola } from "@/lib/sacola";
import Abertura from "./Abertura";
import CarrosselCapa from "./CarrosselCapa";
import { EquipeUiProvider } from "./EquipeUi";
import Header from "./Header";
import PainelEquipe from "./PainelEquipe";

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const FOCO_MEIO: FocoCamera = { x: 50, y: 50, zoom: 1 };
const VINHETA =
  "linear-gradient(to bottom, rgb(0 0 0 / 0.52) 0%, rgb(0 0 0 / 0.18) 12%, transparent 25%, transparent 75%, rgb(0 0 0 / 0.22) 88%, rgb(0 0 0 / 0.5) 100%)";

type Intro = "portas" | "abrindo" | "fim";

function esperar(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function jaViuAbertura() {
  try {
    return sessionStorage.getItem("glow-intro") === "1";
  } catch {
    return false;
  }
}

function lembrarAbertura() {
  try {
    sessionStorage.setItem("glow-intro", "1");
  } catch {
    /* sem sessionStorage */
  }
}

function precarregar() {
  const srcs = [FOTO_SALAO, ...equipe.map((p) => fotoAmbiente(p.ambiente)), ...equipe.map((p) => p.foto)];
  for (const src of srcs) {
    const img = new window.Image();
    img.src = src;
  }
}

export default function Equipe() {
  const reduce = !!useReducedMotion();
  const sacola = useSacola();
  const qtd = resumoSacola(sacola).qtd;
  const raiz = useRef<HTMLElement>(null);
  const geracao = useRef(0);
  const ocupada = useRef(false);

  const [intro, setIntro] = useState<Intro>("portas");
  const [id, setId] = useState<ProfissionalId | null>(null);
  const [foco, setFoco] = useState<FocoCamera>(FOCO_MEIO);
  const [ambienteOn, setAmbienteOn] = useState(false);
  const [detalheOn, setDetalheOn] = useState(false);
  const [retratoOn, setRetratoOn] = useState(false);
  const [fecho, setFecho] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [emMovimento, setEmMovimento] = useState(false);

  const escolhida = id ? profissionalPorId(id) : undefined;
  const introAtiva = intro !== "fim";
  const portasAbertas = intro !== "portas";
  const capaPronta = intro !== "portas";

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const pxInv = useTransform(px, (v) => -v);
  const pyInv = useTransform(py, (v) => -v);

  const pularAbertura = useCallback(() => {
    geracao.current += 1;
    setIntro("fim");
    lembrarAbertura();
  }, []);

  useEffect(() => {
    precarregar();
    document.documentElement.classList.add("salao-unico");
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      document.documentElement.classList.remove("salao-unico");
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (jaViuAbertura()) {
      setIntro("fim");
      return;
    }
    if (reduce) {
      setIntro("abrindo");
      const fade = window.setTimeout(() => {
        setIntro("fim");
        lembrarAbertura();
      }, 300);
      return () => window.clearTimeout(fade);
    }
    const abrir = window.setTimeout(() => setIntro("abrindo"), 300);
    const fim = window.setTimeout(() => {
      setIntro("fim");
      lembrarAbertura();
    }, 2000);
    return () => {
      window.clearTimeout(abrir);
      window.clearTimeout(fim);
    };
  }, [reduce]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && introAtiva) pularAbertura();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [introAtiva, pularAbertura]);

  const resetParallax = () => {
    px.set(0);
    py.set(0);
  };

  const onMouse = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !desktop || introAtiva) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    px.set(nx * 12);
    py.set(ny * 12);
  };

  const entrar = useCallback(
    async (p: Profissional) => {
      if (ocupada.current || id === p.id) return;
      if (intro === "portas") return;
      if (intro !== "fim") pularAbertura();
      ocupada.current = true;
      const g = ++geracao.current;
      setFecho(false);
      try {
        if (reduce) {
          setId(p.id);
          setFoco(p.foco);
          setRetratoOn(true);
          setAmbienteOn(true);
          setDetalheOn(true);
          return;
        }

        setEmMovimento(true);
        if (id) {
          setDetalheOn(false);
          setAmbienteOn(false);
          setRetratoOn(false);
          await esperar(380);
          if (g !== geracao.current) return;
          setId(p.id);
          setFoco(p.foco);
          await esperar(900);
          if (g !== geracao.current) return;
          setEmMovimento(false);
          setRetratoOn(true);
          setAmbienteOn(true);
          await esperar(100);
          if (g !== geracao.current) return;
          setDetalheOn(true);
          return;
        }

        setId(p.id);
        setFoco(p.foco);
        setRetratoOn(true);
        await esperar(600);
        if (g !== geracao.current) return;
        setAmbienteOn(true);
        await esperar(100);
        if (g !== geracao.current) return;
        setDetalheOn(true);
        await esperar(200);
        if (g !== geracao.current) return;
        setEmMovimento(false);
      } finally {
        if (g === geracao.current) ocupada.current = false;
      }
    },
    [id, reduce, intro, pularAbertura],
  );

  const voltar = useCallback(async () => {
    if (!id || ocupada.current) return;
    ocupada.current = true;
    const g = ++geracao.current;
    const atual = profissionalPorId(id);
    setFecho(false);
    setDetalheOn(false);
    setAmbienteOn(false);
    try {
      if (reduce) {
        setRetratoOn(false);
        setId(null);
        setFoco(FOCO_MEIO);
        return;
      }
      setEmMovimento(true);
      await esperar(350);
      if (g !== geracao.current) return;
      setRetratoOn(false);
      setId(null);
      setFoco(atual ? { ...atual.foco, zoom: 1 } : FOCO_MEIO);
      await esperar(900);
      if (g !== geracao.current) return;
      setEmMovimento(false);
      setFoco(FOCO_MEIO);
    } finally {
      if (g === geracao.current) ocupada.current = false;
    }
  }, [id, reduce]);

  const abrirAgendar = useCallback(() => {
    if (id) {
      setFecho(true);
      return;
    }
    window.open(linkWhatsapp("Oi! Queria agendar um horário. Qual o próximo que tiverem?"), "_blank", "noopener,noreferrer");
  }, [id]);

  const ui = useMemo(
    () => ({
      naProfissional: !!id,
      fundoClaro: !!id && desktop,
      qtdSacola: qtd,
      voltarAoSalao: () => {
        if (id) void voltar();
      },
      abrirAgendar,
    }),
    [id, desktop, qtd, voltar, abrirAgendar],
  );

  const cam = id
    ? transformFoco(foco)
    : transformFoco(FOCO_MEIO, intro === "portas" ? 1.25 : 1);
  const camBlur =
    id && emMovimento && !reduce
      ? ["blur(0px)", "blur(2px)", "blur(0px)"]
      : !id && intro === "portas" && !reduce
        ? "blur(6px)"
        : "blur(0px)";

  const transicaoCam = reduce
    ? { duration: 0.3 }
    : id
      ? { duration: 0.9, ease: EASE, filter: { duration: 0.9, times: [0, 0.5, 1] as number[] } }
      : { duration: 1.2, ease: EASE };

  return (
    <EquipeUiProvider value={ui}>
      <Header />
      <Abertura visivel={introAtiva} abertas={portasAbertas} reduzir={reduce} onPular={pularAbertura} />

      <section
        id="equipe"
        ref={raiz}
        onMouseMove={onMouse}
        onMouseLeave={resetParallax}
        className="relative h-svh min-h-svh overflow-hidden bg-[#cbb9a8]"
        aria-label="Equipe"
      >
        <motion.div className="absolute inset-0 overflow-hidden will-change-transform" style={{ x: px, y: py }}>
          <motion.div
            className="absolute left-1/2 top-1/2 h-full w-max will-change-transform"
            animate={{
              x: cam.x,
              y: cam.y,
              scale: cam.scale,
              originX: cam.originX,
              originY: cam.originY,
              filter: camBlur,
            }}
            transition={transicaoCam}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOTO_SALAO}
              alt="Salão Glow Icon visto de frente, com as estações de unhas, cabelo, cílios e maquiagem."
              className="pointer-events-none h-full w-auto max-w-none select-none"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {ambienteOn && escolhida && (
            <motion.div
              key={escolhida.ambiente}
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0.3 } : { duration: 0.5, ease: EASE }}
              style={{ x: px, y: py }}
            >
              <motion.div
                className="h-full w-full min-h-full will-change-transform"
                initial={reduce ? { scale: 1 } : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={reduce ? { duration: 0.3 } : { duration: 0.5, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoAmbiente(escolhida.ambiente)}
                  alt=""
                  className="h-full w-full min-h-full min-w-full object-cover"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 z-[1]" style={{ backgroundImage: VINHETA }} />

        <AnimatePresence>
          {!id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: capaPronta ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.3 : 0.45 }}
              className="absolute inset-x-0 top-0 z-10 px-5 pt-16 md:px-8 md:pt-[4.5rem]"
            >
              <h1 className="titulo max-w-2xl text-[clamp(1.7rem,4.2vw,3.1rem)] font-light leading-[1.08] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
                Escolha quem vai cuidar de você.
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {!id && (
          <motion.div
            initial={false}
            animate={{ opacity: capaPronta ? 1 : 0, y: capaPronta ? 0 : 28 }}
            transition={{ duration: reduce ? 0.3 : 0.55, delay: reduce ? 0 : capaPronta ? 0.15 : 0, ease: EASE }}
          >
            <CarrosselCapa reduzir={reduce} pronta={intro === "fim"} onAbrir={(p) => void entrar(p)} />
          </motion.div>
        )}

        {retratoOn && escolhida && (
          <motion.div
            className="absolute inset-x-0 top-14 z-20 h-[38%] md:inset-y-0 md:left-auto md:right-0 md:top-auto md:h-full md:w-[52%]"
            style={{ x: pxInv, y: pyInv }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 h-full cursor-grab active:cursor-grabbing md:h-[96%]"
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -450) {
                  void entrar(profissionalAdjacente(escolhida.id, 1));
                } else if (info.offset.x > 70 || info.velocity.x > 450) {
                  void entrar(profissionalAdjacente(escolhida.id, -1));
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={escolhida.foto}
                alt={`${escolhida.nome}, ${escolhida.especialidade}`}
                className="pointer-events-none h-full w-full object-contain object-bottom"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent md:h-24" />
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence>
          {detalheOn && escolhida && (
            <motion.aside
              initial={reduce ? { opacity: 0 } : desktop ? { opacity: 0, x: -32 } : { opacity: 0, y: 80 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={reduce ? { opacity: 0 } : desktop ? { opacity: 0, x: -24 } : { opacity: 0, y: 60 }}
              transition={reduce ? { duration: 0.3 } : { duration: 0.5, ease: EASE }}
              className="pointer-events-auto absolute inset-x-0 bottom-[6.75rem] z-30 h-[46%] overflow-hidden rounded-t-[28px] bg-fundo px-5 py-4 md:inset-y-0 md:bottom-0 md:left-0 md:right-auto md:h-full md:w-[45%] md:rounded-none md:px-8 md:pb-32 md:pt-20"
            >
              <PainelEquipe
                key={escolhida.id}
                p={escolhida}
                reduzido={reduce}
                fecho={fecho}
                onFecho={setFecho}
                onVoltar={() => void voltar()}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {detalheOn && escolhida && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: reduce ? 0.3 : 0.4 }}
              className="absolute inset-x-0 bottom-0 z-40 flex items-end bg-fundo px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2 md:w-[45%] md:px-8"
            >
              <div className="flex min-w-0 flex-1 justify-between gap-1" aria-label="Profissionais">
                {equipe.map((o) => {
                  const ativa = o.id === escolhida.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-current={ativa ? true : undefined}
                      onClick={() => void entrar(o)}
                      className="flex min-w-0 flex-1 flex-col items-center gap-1"
                    >
                      <span
                        className={`relative h-12 w-12 overflow-hidden rounded-full bg-superficie ${
                          ativa ? "ring-2 ring-[var(--dourado)] ring-offset-1 ring-offset-transparent" : "ring-1 ring-white/50"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={o.foto} alt="" className="h-full w-full object-cover object-[center_12%]" />
                      </span>
                      <span className="titulo max-w-full truncate text-[12px] leading-tight text-tinta md:text-[13px]">
                        {o.nome}
                      </span>
                      <span className="max-w-full truncate text-[9px] uppercase tracking-[0.12em] text-suave">
                        {SELO_AMBIENTE[o.ambiente]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </EquipeUiProvider>
  );
}

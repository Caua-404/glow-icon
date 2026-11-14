"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { inspiracoes, type Inspiracao } from "@/data/inspiracoes";
import { categorias, type CategoriaId } from "@/data/servicos";
import { useFavoritos } from "@/lib/useFavoritos";
import { useAgendamento } from "./AgendamentoContext";
import IconeCoracao from "./IconeCoracao";
import InspiracaoLightbox from "./InspiracaoLightbox";
import Mascote from "./Mascote";
import Reveal from "./Reveal";

type Filtro = "todas" | "favoritos" | CategoriaId;

export default function Inspiracoes() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [aberta, setAberta] = useState<number | null>(null);
  const { ids, ehFavorito, alternar } = useFavoritos();
  const { abrir } = useAgendamento();

  const itens = useMemo<Inspiracao[]>(() => {
    if (filtro === "todas") return inspiracoes;
    if (filtro === "favoritos") return inspiracoes.filter((i) => ids.includes(i.id));
    return inspiracoes.filter((i) => i.categoria === filtro);
  }, [filtro, ids]);

  const fechar = useCallback(() => setAberta(null), []);
  // Se o item aberto saiu da lista (ex.: desfavoritado no filtro Favoritos), fecha.
  const indiceAberto = aberta !== null && aberta < itens.length ? aberta : null;

  const chips: { id: Filtro; rotulo: string }[] = [
    { id: "todas", rotulo: "Todas" },
    ...categorias.map((c) => ({ id: c.id as Filtro, rotulo: c.nome })),
    { id: "favoritos", rotulo: `Minhas inspirações (${ids.length})` },
  ];

  return (
    <section id="inspiracoes" className="border-t border-linha bg-superficie">
      <div className="container-glow py-24 md:py-36">
        <Reveal className="max-w-2xl">
          <p className="rotulo">Inspirações</p>
          <h2 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">
            Trabalhos do salão
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-suave">
            Toque no coração para guardar o que você gostou. Os favoritos ficam neste aparelho.
          </p>
        </Reveal>

        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="mt-12 flex flex-wrap gap-2"
        >
          {chips.map((c) => {
            const ativo = filtro === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(c.id)}
                className={`r-md min-h-11 px-4 text-sm transition-colors ${
                  ativo
                    ? "bg-tinta text-fundo shadow-[var(--sombra-2)]"
                    : "sombra-1 bg-card text-suave hover:text-tinta"
                }`}
              >
                {c.rotulo}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filtro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10"
          >
            {itens.length === 0 ? (
              <div className="py-10">
                <Mascote
                  size="md"
                  mensagem={
                    filtro === "favoritos"
                      ? "Nenhuma inspiração salva ainda. Toque no coração para guardar."
                      : "Nada por aqui ainda."
                  }
                />
              </div>
            ) : (
              <ul className="columns-2 gap-3 md:columns-3 md:gap-5">
                {itens.map((item, i) => {
                  const fav = ehFavorito(item.id);
                  return (
                    <li key={item.id} className="relative mb-3 break-inside-avoid md:mb-5">
                      <button
                        type="button"
                        onClick={() => setAberta(i)}
                        aria-label={`Ampliar: ${item.alt}`}
                        className="r-lg sombra-2 group block w-full overflow-hidden bg-superficie"
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={item.w}
                          height={item.h}
                          sizes="(min-width: 1200px) 370px, (min-width: 768px) 30vw, 50vw"
                          className="h-auto w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => alternar(item.id)}
                        aria-pressed={fav}
                        aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                        className="r-pill sombra-1 absolute right-3 top-3 flex h-11 w-11 items-center justify-center bg-card text-tinta"
                      >
                        <IconeCoracao cheio={fav} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <InspiracaoLightbox
        itens={itens}
        indice={indiceAberto}
        onMudar={setAberta}
        onFechar={fechar}
        ehFavorito={ehFavorito}
        alternar={alternar}
        onQueroEsse={(item) => {
          setAberta(null);
          abrir({ profissionalId: item.profissionalId, servicoId: item.servicoId });
        }}
      />
    </section>
  );
}

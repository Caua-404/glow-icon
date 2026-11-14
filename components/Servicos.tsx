"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  agruparPorGrupo,
  categorias,
  fotoDoServico,
  formatarDuracao,
  formatarPreco,
  servicos,
  type CategoriaId,
  type Servico,
} from "@/data/servicos";
import { adicionarNaSacola, removerDaSacola, useSacola } from "@/lib/sacola";
import { useAgendamento } from "./AgendamentoContext";

function CardServico({ s }: { s: Servico }) {
  const { abrir } = useAgendamento();
  const sacola = useSacola();
  const na = sacola.some((i) => i.servicoId === s.id);
  const destaque = !!s.maisPedido;

  return (
    <li className="w-[80%] shrink-0 snap-start sm:w-[60%] md:w-auto">
      <article
        className={`r-lg flex h-full flex-col overflow-hidden ${
          destaque
            ? "bg-[color-mix(in_srgb,var(--polish)_14%,var(--card))] shadow-[0_0_0_2px_var(--polish),var(--sombra-3)]"
            : "sombra-2 bg-card"
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-superficie">
          <Image
            src={fotoDoServico(s)}
            alt={`${s.nome}, foto do serviço`}
            fill
            sizes="(min-width: 1200px) 370px, (min-width: 768px) 30vw, 80vw"
            className="object-cover"
          />
          {destaque && (
            <span className="r-pill absolute left-4 top-4 bg-acento px-3.5 py-1.5 text-xs font-medium text-acento-fg shadow-[var(--sombra-1)]">
              Mais pedido
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <h3 className="titulo text-[1.65rem] font-normal leading-tight">{s.nome}</h3>
          <p className="mt-2 text-sm leading-relaxed text-suave">{s.descricao}</p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-6">
            <div>
              {s.aPartirDe && <p className="rotulo mb-1">A partir de</p>}
              <p className="titulo text-[2.5rem] font-medium leading-none">
                {formatarPreco(s.preco)}
              </p>
              {s.unidade && (
                <p className="mt-1 text-xs text-suave">{s.unidade === "par" ? "o par" : "cada"}</p>
              )}
            </div>
            <p className="pb-1 text-right text-sm text-suave">{formatarDuracao(s.duracaoMin)}</p>
          </div>

          <button
            type="button"
            onClick={() => abrir({ servicoId: s.id })}
            aria-label={`Agendar ${s.nome}`}
            className="btn-acento mt-5 w-full"
          >
            Agendar
          </button>
          <button
            type="button"
            onClick={() => (na ? removerDaSacola(s.id) : adicionarNaSacola(s.id))}
            aria-pressed={na}
            className="btn-linha mt-2 w-full"
          >
            {na ? "Remover da sacola" : "Adicionar à sacola"}
          </button>
        </div>
      </article>
    </li>
  );
}

export default function Servicos() {
  const [aba, setAba] = useState<CategoriaId>("unhas");
  const base = useId();
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  const idAba = (id: string) => `${base}-aba-${id}`;
  const idPainel = `${base}-painel`;

  // Setas, Home e End movem entre as abas (padrão WAI-ARIA).
  function aoTeclar(e: React.KeyboardEvent, indice: number) {
    const total = categorias.length;
    let destino = -1;
    if (e.key === "ArrowRight") destino = (indice + 1) % total;
    else if (e.key === "ArrowLeft") destino = (indice - 1 + total) % total;
    else if (e.key === "Home") destino = 0;
    else if (e.key === "End") destino = total - 1;
    if (destino < 0) return;
    e.preventDefault();
    setAba(categorias[destino].id);
    abas.current[destino]?.focus();
  }

  return (
    <section id="servicos" className="border-t border-linha bg-superficie">
      <div className="container-glow py-24 md:py-36">
        <div className="max-w-2xl">
          <h2 className="titulo text-[clamp(2.75rem,6vw,5rem)] font-light">Serviços e valores</h2>
          <p className="mt-6 text-sm leading-relaxed text-suave">
            Valores da tabela do salão. Nas tranças, o preço é o valor inicial: o orçamento final
            depende do comprimento, do volume e do modelo. O tempo ao lado de cada serviço é
            aproximado.
          </p>
        </div>

        {/* Abas por categoria; no celular rolam para o lado se não couberem */}
        <div className="-mx-6 mt-12 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          <div role="tablist" aria-label="Categorias de serviço" className="flex w-max gap-2 md:w-auto md:flex-wrap">
            {categorias.map((c, i) => {
              const ativa = c.id === aba;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    abas.current[i] = el;
                  }}
                  id={idAba(c.id)}
                  type="button"
                  role="tab"
                  aria-selected={ativa}
                  aria-controls={idPainel}
                  tabIndex={ativa ? 0 : -1}
                  onClick={() => setAba(c.id)}
                  onKeyDown={(e) => aoTeclar(e, i)}
                  className={`r-pill min-h-11 whitespace-nowrap px-5 text-sm font-medium transition-colors ${
                    ativa
                      ? "bg-tinta text-fundo shadow-[var(--sombra-2)]"
                      : "sombra-1 bg-card text-suave hover:text-tinta"
                  }`}
                >
                  {c.nome}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={aba}
          id={idPainel}
          role="tabpanel"
          aria-labelledby={idAba(aba)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {agruparPorGrupo(servicos.filter((s) => s.categoria === aba)).map(({ grupo, itens }) => (
            <div key={grupo.id} className="mt-8 first:mt-0 md:mt-10 md:first:mt-6">
              <p className="rotulo px-6 md:px-0">{grupo.nome}</p>
              {/* Celular: carrossel com snap. Desktop: grade de 3 colunas. */}
              <ul className="-mx-6 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 [scroll-padding-inline:1.5rem] [scrollbar-width:none] md:mx-0 md:mt-5 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
                {itens.map((s) => (
                  <CardServico key={s.id} s={s} />
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

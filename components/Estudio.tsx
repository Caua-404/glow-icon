"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { fotosEstudio } from "@/data/estudio";
import EstudioLightbox from "./EstudioLightbox";
import Reveal from "./Reveal";

function classeMosaico(id: string) {
  if (id === "recepcao") return "col-span-2 aspect-[16/9] md:col-span-8";
  if (id === "estacao") {
    return "col-span-2 aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto md:h-full md:min-h-0";
  }
  if (id === "sala") return "col-span-2 aspect-[16/9] md:col-span-8";
  return "col-span-1 aspect-[4/3] md:col-span-3";
}

export default function Estudio() {
  const [aberta, setAberta] = useState<number | null>(null);
  const fechar = useCallback(() => setAberta(null), []);

  return (
    <section id="estudio" className="ripado border-t border-linha bg-fundo">
      <div className="container-glow py-24 md:py-36">
        <Reveal className="max-w-2xl">
          <p className="rotulo">O espaço</p>
          <h2 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">
            O estúdio
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-suave">
            Recepção, mesa de unhas e a luz do atendimento. O salão fica em Canaã dos
            Carajás.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
          {fotosEstudio.map((foto, i) => (
            <li key={foto.id} className={classeMosaico(foto.id)}>
              <button
                type="button"
                onClick={() => setAberta(i)}
                aria-label={`Ampliar: ${foto.titulo}`}
                className="r-lg sombra-2 group relative block h-full w-full overflow-hidden bg-superficie"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes={
                    foto.id === "recepcao" || foto.id === "sala"
                      ? "(min-width: 768px) 66vw, 100vw"
                      : foto.id === "estacao"
                        ? "(min-width: 768px) 33vw, 100vw"
                        : "(min-width: 768px) 25vw, 50vw"
                  }
                  className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(23_18_14/0.55))] px-3 pb-3 pt-10 text-left text-sm text-[#F3ECE3] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {foto.titulo}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <EstudioLightbox
        fotos={fotosEstudio}
        indice={aberta}
        onMudar={setAberta}
        onFechar={fechar}
      />
    </section>
  );
}

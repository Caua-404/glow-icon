import { contato, horarios, linkWhatsapp } from "@/data/site";
import Reveal from "./Reveal";

export default function Contato() {
  return (
    <section id="contato" className="border-t border-linha bg-superficie">
      <div className="container-glow py-24 md:py-36">
        <Reveal className="max-w-2xl">
          <p className="rotulo">Contato</p>
          <h2 className="titulo mt-4 text-[clamp(2.75rem,6vw,5rem)] font-light">
            Fale com o salão
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12">
          <Reveal className="col-span-12 md:col-span-5">
            <h3 className="rotulo">Horário de atendimento</h3>
            <dl className="mt-4">
              {horarios.map((h) => (
                <div
                  key={h.dia}
                  className="flex justify-between gap-6 border-b border-linha py-3 text-sm"
                >
                  <dt>{h.dia}</dt>
                  <dd className="text-suave">{h.horas}</dd>
                </div>
              ))}
            </dl>

            <h3 className="rotulo mt-10">WhatsApp</h3>
            <p className="titulo numero mt-2 text-4xl font-light">{contato.whatsappExibido}</p>
            <a
              href={linkWhatsapp("Olá! Gostaria de agendar um horário no Glow Icon.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-acento mt-4 w-full sm:w-auto"
            >
              Chamar no WhatsApp
            </a>

            <h3 className="rotulo mt-10">Instagram</h3>
            <a
              href={contato.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block min-h-11 py-2 text-lg underline underline-offset-4"
            >
              {contato.instagram}
            </a>
          </Reveal>

          <Reveal delay={0.08} className="col-span-12 md:col-span-7">
            <div className="r-lg sombra-2 overflow-hidden bg-card">
              <iframe
                title="Glow Icon em Canaã dos Carajás, Pará"
                src="https://maps.google.com/maps?q=Cana%C3%A3%20dos%20Caraj%C3%A1s%20Par%C3%A1&z=13&output=embed"
                className="aspect-[4/3] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-sm text-suave">
              Canaã dos Carajás - PA. Confirme o ponto de referência pelo WhatsApp.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import LogoSvg from "./LogoSvg";
import { contato, links, linkWhatsapp, posicionamento } from "@/data/site";

export default function Footer() {
  return (
    <footer className="ripado border-t border-linha bg-fundo">
      <div className="container-glow py-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <a href="#topo" aria-label="Glow Icon, voltar ao topo" className="inline-block">
              <LogoSvg className="h-[20px] w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-sm text-suave">{posicionamento}</p>
          </div>

          <nav aria-label="Rodapé" className="col-span-6 md:col-span-3">
            <p className="rotulo">Navegar</p>
            <ul className="mt-4 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-block min-h-8 py-1 text-sm hover:underline">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-4">
            <p className="rotulo">Contato</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={linkWhatsapp("Olá! Gostaria de agendar um horário no Glow Icon.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block min-h-8 py-1 text-sm hover:underline"
                >
                  {contato.whatsappExibido}
                </a>
              </li>
              <li>
                <a
                  href={contato.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block min-h-8 py-1 text-sm hover:underline"
                >
                  {contato.instagram}
                </a>
              </li>
              <li className="py-1 text-sm text-suave">Seg a sáb, 8h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-linha pt-6 text-xs text-suave">
          <p>© {new Date().getFullYear()} Glow Icon</p>
          <p>Canaã dos Carajás - PA</p>
        </div>
      </div>
    </footer>
  );
}

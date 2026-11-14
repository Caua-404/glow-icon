type Props = {
  variante?: "horizontal" | "icone";
  className?: string;
};

/**
 * Mostra a versão preta no tema claro e a branca no tema escuro.
 * Arquivos em /public/logo.
 */
export default function Logo({ variante = "horizontal", className = "" }: Props) {
  const base = `/logo/logo-${variante}`;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}-preto.svg`} alt="Glow Icon" className={`dark:hidden ${className}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}-branco.svg`} alt="Glow Icon" className={`hidden dark:block ${className}`} />
    </>
  );
}

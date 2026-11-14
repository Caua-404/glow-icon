type Props = {
  className?: string;
  /** Faz a estrela surgir com um brilho único na abertura do hero. */
  animarEstrela?: boolean;
};

/** Partículas finas que saem do centro da estrela (12, 15). Valores fixos: sem aleatório no render. */
const PARTICULAS = Array.from({ length: 14 }, (_, i) => {
  const ang = (i / 14) * Math.PI * 2 + (i % 2) * 0.22;
  const dist = 20 + ((i * 7) % 5) * 7; // 20 a 48 (unidades do viewBox)
  return {
    dx: Math.round(Math.cos(ang) * dist * 10) / 10,
    dy: Math.round(Math.sin(ang) * dist * 10) / 10,
    r: i % 3 === 0 ? 1.5 : i % 3 === 1 ? 1.1 : 0.8,
    atraso: 1.15 + (i % 4) * 0.03,
  };
});

/**
 * Logo horizontal (estrela + GLOW ICON) inline, na cor do texto (currentColor),
 * para acompanhar o tema. Mesma geometria dos arquivos em /public/logo.
 */
export default function LogoSvg({ className = "", animarEstrela = false }: Props) {
  return (
    <svg
      viewBox="0 0 300 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      role="img"
      aria-label="Glow Icon"
      className={`${className} overflow-visible`}
    >
      {animarEstrela && (
        <g className="logo-brilho" aria-hidden="true" stroke="none">
          {PARTICULAS.map((p, i) => (
            <circle
              key={i}
              cx="12"
              cy="15"
              r={p.r}
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--d": `${p.atraso}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      )}
      <g transform="translate(0 3)">
        <path
          className={animarEstrela ? "logo-estrela" : undefined}
          d="M12 0C12.96 7.2 16.8 11.04 24 12 16.8 12.96 12.96 16.8 12 24 11.04 16.8 7.2 12.96 0 12 7.2 11.04 11.04 7.2 12 0Z"
          fill="var(--dourado)"
          stroke="none"
        />
      </g>
      <g transform="translate(36 1)">
        <path d="M25 7.5C22 3 18 1 14 1 6.5 1 1.5 6.5 1.5 14 1.5 21.5 6.5 27 14 27 19 27 24 24 25 19V14.5H14.5" />
        <path transform="translate(35 0)" d="M2 1V27H20" />
        <ellipse transform="translate(64 0)" cx="13" cy="14" rx="12" ry="13" />
        <path transform="translate(98 0)" d="M1 1 8 27 15 6 22 27 29 1" />
        <path transform="translate(156 0)" d="M2 1V27" />
        <path
          transform="translate(168 0)"
          d="M25 7.5C22 3 18 1 14 1 6.5 1 1.5 6.5 1.5 14 1.5 21.5 6.5 27 14 27 18 27 22 25 25 20.5"
        />
        <ellipse transform="translate(203 0)" cx="13" cy="14" rx="12" ry="13" />
        <path transform="translate(237 0)" d="M2 27V1L24 27V1" />
      </g>
    </svg>
  );
}

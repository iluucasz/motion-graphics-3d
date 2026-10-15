import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Ícone de raios finos que gira devagar. Troque por um SVG da sua marca se quiser.
export const Simbolo: React.FC<{
  cor: string;
  tamanho: number;
  atraso?: number;
  brilho?: boolean;
}> = ({ cor, tamanho, atraso = 0, brilho = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 12 } });
  const raios = 12;

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="-50 -50 100 100"
      style={{
        transform: `rotate(${frame * 0.6}deg) scale(${p})`,
        filter: brilho ? `drop-shadow(0 0 ${tamanho / 6}px ${cor})` : undefined,
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      {Array.from({ length: raios }).map((_, i) => {
        const tam = i % 2 === 0 ? 46 : 34;
        const fim = interpolate(p, [0, 1], [6, tam]);
        return (
          <line
            key={i}
            x1={0}
            y1={-6}
            x2={0}
            y2={-fim}
            stroke={cor}
            strokeWidth={4.5}
            strokeLinecap="round"
            transform={`rotate(${(360 / raios) * i})`}
          />
        );
      })}
    </svg>
  );
};

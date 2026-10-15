import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TextoCinetico: React.FC<{
  texto: string;
  cor: string;
  duracao: number;
}> = ({ texto, cor, duracao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palavras = texto.split(" ");
  const saida = interpolate(frame, [duracao - 8, duracao], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 380,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 18,
          maxWidth: 900,
          opacity: saida,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1,
          textTransform: "uppercase",
          color: "#fff",
          textShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        {palavras.map((palavra, i) => {
          const p = spring({
            frame: frame - i * 4,
            fps,
            config: { damping: 12, mass: 0.6 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + p * 0.4})`,
                opacity: p,
                color: i === palavras.length - 1 ? cor : undefined,
              }}
            >
              {palavra}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

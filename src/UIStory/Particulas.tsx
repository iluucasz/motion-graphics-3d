import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { comAlpha } from "./estilo";

// Poeira luminosa subindo devagar + rastros de luz cruzando a tela.
// Tudo calculado a partir do frame e de random(seed), então o render é
// determinístico (nada de Math.random()).
export const Particulas: React.FC<{ cor: string; quantidade?: number }> = ({
  cor,
  quantidade = 45,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: quantidade }).map((_, i) => {
        const x = random(`x-${i}`) * width;
        const velocidade = 0.4 + random(`v-${i}`) * 1.2;
        const y =
          height -
          ((random(`y-${i}`) * height + frame * velocidade) % (height * 0.75));
        const tamanho = 2 + random(`t-${i}`) * 5;
        const pisca =
          0.35 +
          0.65 * Math.abs(Math.sin(frame / (12 + random(`p-${i}`) * 30) + i));
        // Mais fortes perto do brilho do rodapé.
        const perto = interpolate(y, [height * 0.25, height], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 40 + i) * 12,
              top: y,
              width: tamanho,
              height: tamanho,
              borderRadius: "50%",
              background: cor,
              opacity: pisca * perto * 0.9,
              boxShadow: `0 0 ${tamanho * 4}px ${cor}`,
            }}
          />
        );
      })}

      {[0, 1].map((i) => {
        // Cada rastro atravessa a tela uma vez por ciclo, em momentos diferentes.
        const ciclo = 90 + i * 40;
        const inicio = Math.round(random(`r-${i}`) * 40);
        const local = (frame + ciclo - inicio) % ciclo;
        const progresso = local / 35;
        if (progresso > 1) return null;
        const comprimento = Math.max(width, height) * 0.5;
        return (
          <div
            key={`rastro-${i}`}
            style={{
              position: "absolute",
              left: interpolate(
                progresso,
                [0, 1],
                [-comprimento, width + comprimento],
              ),
              top: height * (0.62 + i * 0.18),
              width: comprimento,
              height: 3,
              transform: `rotate(${-14 + i * 6}deg)`,
              background: `linear-gradient(90deg, transparent, ${comAlpha(cor, 90)}, #fff)`,
              filter: "blur(1px)",
              boxShadow: `0 0 18px ${cor}`,
              opacity: Math.sin(progresso * Math.PI) * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

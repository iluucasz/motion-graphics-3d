import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { entrada, fontes } from "../estilo";

export const Logo: React.FC<{ marca: string; cor: string }> = ({
  marca,
  cor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const espaco = interpolate(frame, [10, 60], [30, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 60 }}
    >
      <Simbolo cor={cor} tamanho={180} brilho />
      <div
        style={{
          fontFamily: fontes.sans,
          fontSize: 64,
          letterSpacing: espaco,
          textTransform: "uppercase",
          ...entrada(frame, fps, 14),
        }}
      >
        {marca}
      </div>
    </AbsoluteFill>
  );
};

import { CameraMotionBlur } from "@remotion/motion-blur";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { comAlpha, fontes } from "../estilo";

// Texto gigante que vem "da câmera": escala grande + desfoque -> assenta.
// O CameraMotionBlur renderiza subframes e mistura, como o motion blur do AE.
const TextoGigante: React.FC<{ texto: string; cor: string }> = ({
  texto,
  cor,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const respiro = interpolate(frame, [18, 90], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: fontes.serif,
          fontWeight: 500,
          fontSize: Math.min(width * 0.14, 300),
          maxWidth: width - 120,
          lineHeight: 1,
          textAlign: "center",
          color: cor,
          opacity: p,
          transform: `scale(${interpolate(p, [0, 1], [3.2, 1]) * respiro})`,
          filter: `blur(${interpolate(p, [0, 1], [18, 0])}px)`,
          textShadow: `0 0 60px ${comAlpha(cor, 55)}`,
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

export const Impacto: React.FC<{ texto: string; cor: string }> = ({
  texto,
  cor,
}) => (
  <CameraMotionBlur shutterAngle={180} samples={8}>
    <TextoGigante texto={texto} cor={cor} />
  </CameraMotionBlur>
);

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { entrada, fontes } from "../estilo";

export const Titulo: React.FC<{
  texto: string;
  destaque: string;
  cor: string;
}> = ({ texto, destaque, cor }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const zoom = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
    durationInFrames: 26,
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: fontes.serif,
          maxWidth: width - 160,
        }}
      >
        <div style={{ fontSize: 84, lineHeight: 1.1, ...entrada(frame, fps) }}>
          {texto}
        </div>
        {destaque ? (
          <div
            style={{
              fontSize: 190,
              lineHeight: 1,
              marginTop: 16,
              fontWeight: 500,
              color: cor,
              textShadow: `0 0 50px color-mix(in srgb, ${cor} 45%, transparent)`,
              ...entrada(frame, fps, 12),
              transform: `scale(${interpolate(zoom, [0, 1], [1.5, 1])})`,
            }}
          >
            {destaque}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

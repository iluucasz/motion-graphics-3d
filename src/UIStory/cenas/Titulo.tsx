import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, fontes } from "../estilo";

export const Titulo: React.FC<{
  texto: string;
  destaque: string;
  cor: string;
}> = ({ texto, destaque, cor }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

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
              ...entrada(frame, fps, 12),
            }}
          >
            {destaque}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

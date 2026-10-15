import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, fontes, paleta, type Tema } from "../estilo";

export const Selos: React.FC<{ itens: string[]; cor: string; tema: Tema }> = ({
  itens,
  cor,
  tema,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = paleta(tema);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {itens.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "22px 40px 22px 24px",
              borderRadius: 999,
              background: p.painel,
              border: `2px solid ${p.borda}`,
              fontFamily: fontes.sans,
              fontWeight: 500,
              fontSize: 56,
              ...entrada(frame, fps, i * 10),
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: cor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
              }}
            >
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

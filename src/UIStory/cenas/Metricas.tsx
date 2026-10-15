import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { entrada, fontes, formatarNumero, type Tema } from "../estilo";

const contar = (frame: number, alvo: number, atraso: number) =>
  interpolate(frame, [atraso, atraso + 45], [0, alvo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// Celular com um post genérico + contadores de alcance.
export const Metricas: React.FC<{
  usuario: string;
  visualizacoes: number;
  curtidas: number;
  comentarios: number;
  cor: string;
  tema: Tema;
}> = ({ usuario, visualizacoes, curtidas, comentarios, cor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;

  const celular = (
    <div
      style={{
        transform: vertical ? "scale(0.8)" : undefined,
        margin: vertical ? -90 : 0,
      }}
    >
      <div
        style={{
          width: 460,
          height: 900,
          borderRadius: 56,
          background: "#f3f3f3",
          border: "10px solid #1a1a1a",
          overflow: "hidden",
          fontFamily: fontes.sans,
          color: "#111",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
          ...entrada(frame, fps),
        }}
      >
        <div
          style={{
            padding: "34px 28px 16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: cor,
            }}
          />
          <div style={{ fontSize: 24, fontWeight: 600 }}>{usuario}</div>
        </div>
        <div
          style={{
            flex: 1,
            margin: "0 0 16px",
            background: `linear-gradient(160deg, #1b1a18, ${cor})`,
          }}
        />
        <div
          style={{
            padding: "0 28px 34px",
            fontSize: 24,
            display: "flex",
            gap: 26,
          }}
        >
          <span>♥ {formatarNumero(contar(frame, curtidas, 10))}</span>
          <span>💬 {formatarNumero(contar(frame, comentarios, 10))}</span>
        </div>
      </div>
    </div>
  );

  const numeros = (
    <div
      style={{
        fontFamily: fontes.serif,
        textAlign: vertical ? "center" : "left",
      }}
    >
      <div style={{ ...entrada(frame, fps, 8) }}>
        <div style={{ fontSize: 150, color: cor, lineHeight: 1 }}>
          {formatarNumero(contar(frame, visualizacoes, 8))}
        </div>
        <div style={{ fontFamily: fontes.sans, fontSize: 34, opacity: 0.7 }}>
          visualizações
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 40,
          justifyContent: vertical ? "center" : "flex-start",
          ...entrada(frame, fps, 16),
        }}
      >
        <div>
          <div style={{ fontSize: 84 }}>
            {formatarNumero(contar(frame, curtidas, 16))}
          </div>
          <div style={{ fontFamily: fontes.sans, fontSize: 30, opacity: 0.7 }}>
            curtidas
          </div>
        </div>
        <div>
          <div style={{ fontSize: 84 }}>
            {formatarNumero(contar(frame, comentarios, 16))}
          </div>
          <div style={{ fontFamily: fontes.sans, fontSize: 30, opacity: 0.7 }}>
            comentários
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: vertical ? "column" : "row",
        gap: vertical ? 40 : 120,
      }}
    >
      {celular}
      {numeros}
    </AbsoluteFill>
  );
};

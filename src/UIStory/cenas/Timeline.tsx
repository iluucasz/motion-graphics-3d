import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { entrada, fontes, paleta, type Tema } from "../estilo";

// Imitação de um editor de vídeo: prévia em cima, faixas entrando em cascata
// e o cursor de reprodução andando.
export const Timeline: React.FC<{
  faixas: string[];
  cor: string;
  tema: Tema;
}> = ({ faixas, cor, tema }) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();
  const p = paleta(tema);
  const larguraPainel = Math.min(width - 100, 1500);
  const larguraRotulo = 260;
  const larguraTrilha = larguraPainel - larguraRotulo - 80;
  const cursor = interpolate(frame, [10, durationInFrames], [0.05, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const segundos = cursor * 10;
  const tempo = [Math.floor(segundos), Math.floor((segundos % 1) * 100)]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: larguraPainel,
          borderRadius: 28,
          background: p.painel,
          border: `2px solid ${p.borda}`,
          overflow: "hidden",
          fontFamily: fontes.mono,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          ...entrada(frame, fps),
        }}
      >
        <div
          style={{
            height: 380,
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Simbolo cor={cor} tamanho={110} brilho />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            color: p.suave,
            fontSize: 26,
          }}
        >
          <span>00:{tempo}</span>
          <span style={{ color: p.texto, fontSize: 32, letterSpacing: 18 }}>
            ⏮▶⏭
          </span>
          <span
            style={{
              border: `2px solid ${p.borda}`,
              borderRadius: 10,
              padding: "6px 16px",
            }}
          >
            Render
          </span>
        </div>
        <div style={{ position: "relative", padding: "8px 32px 36px" }}>
          {faixas.map((faixa, i) => {
            const cresce = spring({
              frame: frame - 12 - i * 7,
              fps,
              config: { damping: 200 },
            });
            const inicio = Math.min(i * 0.13, 0.7);
            const fim =
              i === faixas.length - 1 ? 1 : Math.min(inicio + 0.35, 1);
            return (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", height: 58 }}
              >
                <span
                  style={{ width: larguraRotulo, fontSize: 26, color: p.suave }}
                >{`<${faixa}>`}</span>
                <div
                  style={{
                    position: "relative",
                    width: larguraTrilha,
                    height: 36,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: inicio * larguraTrilha,
                      width: (fim - inicio) * larguraTrilha * cresce,
                      height: "100%",
                      borderRadius: 6,
                      background: "#2f6fe4",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 20,
              left: 32 + larguraRotulo + cursor * larguraTrilha,
              width: 3,
              background: cor,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

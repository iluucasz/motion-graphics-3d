import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import {
  cursorVisivel,
  entrada,
  fontes,
  paleta,
  textoDigitado,
  type Tema,
} from "../estilo";

export const Chat: React.FC<{
  saudacao: string;
  mensagem: string;
  marca: string;
  cor: string;
  tema: Tema;
}> = ({ saudacao, mensagem, marca, cor, tema }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = paleta(tema);
  const inicioDigitacao = 20;
  const digitado = textoDigitado(mensagem, frame, inicioDigitacao);
  const fimDigitacao = inicioDigitacao + mensagem.length * 1.6;
  const envio = spring({
    frame: frame - fimDigitacao - 6,
    fps,
    config: { damping: 10 },
  });
  const caixa = Math.min(width - 120, 1000);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 48 }}
    >
      {saudacao ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontFamily: fontes.serif,
            fontSize: 64,
            ...entrada(frame, fps),
          }}
        >
          <Simbolo cor={cor} tamanho={64} />
          {saudacao}
        </div>
      ) : null}
      <div
        style={{
          width: caixa,
          minHeight: 260,
          borderRadius: 36,
          background: p.painel,
          border: `2px solid ${p.borda}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          padding: "36px 40px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: fontes.sans,
          ...entrada(frame, fps, 6),
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1.35, minHeight: 120 }}>
          {digitado || (
            <span style={{ color: p.suave }}>Como posso ajudar você hoje?</span>
          )}
          {cursorVisivel(frame) ? (
            <span style={{ color: cor, marginLeft: 2 }}>|</span>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 52, color: p.suave }}>+</span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 30, color: p.suave }}>{marca}</span>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: cor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                transform: `scale(${interpolate(envio, [0, 0.5, 1], [1, 0.85, 1])})`,
              }}
            >
              ↑
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

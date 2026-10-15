import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { comAlpha, entrada, fontes, paleta, type Tema } from "../estilo";

// Cartão "arquivo pronto": barra de progresso e selo de concluído.
export const Arquivo: React.FC<{
  titulo: string;
  textoNoVideo: string;
  nomeArquivo: string;
  cor: string;
  tema: Tema;
}> = ({ titulo, textoNoVideo, nomeArquivo, cor, tema }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = paleta(tema);
  const progresso = interpolate(frame, [18, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pronto = progresso >= 1;
  const largura = Math.min(width - 120, 900);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 48 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontFamily: fontes.serif,
          fontSize: 64,
          maxWidth: largura,
          ...entrada(frame, fps),
        }}
      >
        <Simbolo cor={cor} tamanho={58} />
        {titulo}
      </div>
      <div
        style={{
          width: largura,
          borderRadius: 30,
          background: p.painel,
          border: `2px solid ${p.borda}`,
          padding: 20,
          boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
          ...entrada(frame, fps, 8),
        }}
      >
        <div
          style={{
            height: largura * 0.56,
            borderRadius: 18,
            background: `radial-gradient(ellipse 90% 50% at 50% 110%, ${comAlpha(cor, 35)}, #0d0c0b 70%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            color: "#f4efe8",
          }}
        >
          <Simbolo cor={cor} tamanho={70} atraso={10} />
          <div
            style={{ fontFamily: fontes.serif, fontSize: 78, fontWeight: 500 }}
          >
            {textoNoVideo}
          </div>
          <div
            style={{
              width: 240,
              height: 5,
              borderRadius: 4,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                width: `${progresso * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: cor,
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 12px 6px",
            fontFamily: fontes.sans,
            fontSize: 32,
          }}
        >
          <span>{nomeArquivo}</span>
          <span style={{ color: pronto ? cor : p.suave, fontWeight: 500 }}>
            {pronto ? "✓ Arquivo pronto" : "Gerando…"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

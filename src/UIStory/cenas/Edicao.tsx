import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { entrada, fontes, paleta, type Tema } from "../estilo";
import { CartaoVideo } from "./CartaoVideo";

const INTERVALO = 26;

// Pedidos em português ("Troca o nome", "Muda a cor"...) e o vídeo se
// atualizando ao vivo: texto e cor mudam, status passa por "Atualizando…".
export const Edicao: React.FC<{
  titulo: string;
  pedidos: string[];
  textoAntes: string;
  textoDepois: string;
  corDepois: string;
  nomeArquivo: string;
  cor: string;
  tema: Tema;
}> = ({
  titulo,
  pedidos,
  textoAntes,
  textoDepois,
  corDepois,
  nomeArquivo,
  cor,
  tema,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const p = paleta(tema);
  const vertical = height > width;

  const inicioPedidos = 16;
  const fimPedidos = inicioPedidos + pedidos.length * INTERVALO;
  const fimAtualizacao = fimPedidos + 30;
  const atualizando = frame >= fimPedidos && frame < fimAtualizacao;
  const troca = spring({
    frame: frame - fimAtualizacao,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const corAtual = troca > 0.5 ? corDepois : cor;
  const progresso = interpolate(frame, [fimPedidos, fimAtualizacao], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const largura = vertical
    ? Math.min(width - 120, 860)
    : Math.min(width * 0.42, 820);

  const conversa = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 20,
        width: vertical ? largura : 560,
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          fontFamily: fontes.serif,
          fontSize: 60,
          lineHeight: 1.15,
          marginBottom: 12,
          ...entrada(frame, fps),
        }}
      >
        {titulo}
      </div>
      {pedidos.map((pedido, i) => {
        const surge = spring({
          frame: frame - inicioPedidos - i * INTERVALO,
          fps,
          config: { damping: 14 },
        });
        return (
          <div
            key={i}
            style={{
              padding: "18px 30px",
              borderRadius: 26,
              background: p.painel,
              border: `2px solid ${p.borda}`,
              fontFamily: fontes.sans,
              fontSize: 38,
              opacity: surge,
              transform: `translateY(${(1 - surge) * 24}px) scale(${0.9 + surge * 0.1})`,
              transformOrigin: "right center",
            }}
          >
            {pedido}
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: vertical ? "column-reverse" : "row",
        gap: vertical ? 70 : 100,
      }}
    >
      {conversa}
      <div style={{ position: "relative", ...entrada(frame, fps, 6) }}>
        <CartaoVideo
          largura={largura}
          texto={troca > 0.5 ? textoDepois : textoAntes}
          cor={corAtual}
          progresso={atualizando ? progresso : 1}
          nomeArquivo={nomeArquivo}
          status={atualizando ? "Atualizando…" : "✓ Arquivo pronto"}
          statusDestacado={!atualizando}
          tema={tema}
          style={{
            filter: `blur(${interpolate(Math.abs(troca - 0.5), [0, 0.5], [8, 0])}px)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

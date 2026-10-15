import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { entrada, fontes, type Tema } from "../estilo";
import { CartaoVideo } from "./CartaoVideo";

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
      <CartaoVideo
        largura={largura}
        texto={textoNoVideo}
        cor={cor}
        progresso={progresso}
        nomeArquivo={nomeArquivo}
        status={pronto ? "✓ Arquivo pronto" : "Gerando…"}
        statusDestacado={pronto}
        tema={tema}
        style={entrada(frame, fps, 8)}
      />
    </AbsoluteFill>
  );
};

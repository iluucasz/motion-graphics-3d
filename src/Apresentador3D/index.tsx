import { Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Globo3D } from "./Globo3D";
import type { Apresentador3DProps } from "./schema";
import { TextoCinetico } from "./TextoCinetico";

// Camadas, de trás para frente: vídeo do apresentador -> objetos 3D -> textos.
// Para o 3D passar "atrás" da pessoa, adicione depois uma camada com o
// apresentador recortado (vídeo com alpha, ex. .webm VP9) acima do Globo3D.
export const Apresentador3D: React.FC<Apresentador3DProps> = ({
  videoApresentador,
  corDestaque,
  falas,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      {videoApresentador ? (
        <Video src={staticFile(videoApresentador)} objectFit="cover" />
      ) : (
        <AbsoluteFill
          style={{ background: "radial-gradient(circle at 50% 40%, #1d2b5a 0%, #0b1020 70%)" }}
        />
      )}

      <Globo3D cor={corDestaque} />

      {falas.map((fala, i) => {
        const duracao = Math.round(fala.duracaoEmSegundos * fps);
        return (
          <Sequence
            key={i}
            from={Math.round(fala.inicioEmSegundos * fps)}
            durationInFrames={duracao}
            premountFor={fps}
          >
            <TextoCinetico texto={fala.texto} cor={corDestaque} duracao={duracao} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import { Composition, type CalculateMetadataFunction } from "remotion";
import { Apresentador3D } from "./Apresentador3D";
import {
  apresentador3DSchema,
  type Apresentador3DProps,
} from "./Apresentador3D/schema";
import { dimensoesDoFormato } from "./compartilhado/formato";
import { calcularMetadataUIStory, FPS, UIStory } from "./UIStory";
import { uiStorySchema } from "./UIStory/schema";

const metadataApresentador: CalculateMetadataFunction<Apresentador3DProps> = ({
  props,
}) => dimensoesDoFormato(props.formato);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UIStory"
        component={UIStory}
        schema={uiStorySchema}
        calculateMetadata={calcularMetadataUIStory}
        fps={FPS}
        // Valores provisórios: calculateMetadata define formato e duração pelos props.
        width={1080}
        height={1920}
        durationInFrames={1}
        defaultProps={{
          formato: "9:16",
          marca: "Seu Estúdio",
          corDestaque: "#ff7a45",
          cenas: [
            {
              tipo: "chat",
              tema: "escuro",
              duracaoEmSegundos: 4,
              saudacao: "Boa noite, criador",
              mensagem: "Eu nunca abri o After Effects e não sei animar",
            },
            {
              tipo: "titulo",
              tema: "escuro",
              duracaoEmSegundos: 3,
              texto: "Foi tudo feito pelo",
              destaque: "Remotion",
            },
            {
              tipo: "selos",
              tema: "escuro",
              duracaoEmSegundos: 3,
              itens: ["Gratuito", "Código aberto", "No GitHub"],
            },
            {
              tipo: "timeline",
              tema: "escuro",
              duracaoEmSegundos: 4,
              faixas: ["Riscos", "Simbolo", "Saudacao", "Caixa", "Brilho"],
            },
            {
              tipo: "codigo",
              tema: "escuro",
              duracaoEmSegundos: 4.5,
              arquivo: "Motion.tsx",
              linhas: [
                '<Riscos entram="bordas" />',
                '<Simbolo nasce="centro" />',
                '<Saudacao texto="Boa noite" />',
              ],
            },
            {
              tipo: "metricas",
              tema: "escuro",
              duracaoEmSegundos: 4,
              usuario: "seu.estudio",
              visualizacoes: 81000,
              curtidas: 4500,
              comentarios: 65,
            },
            {
              tipo: "arquivo",
              tema: "claro",
              duracaoEmSegundos: 4,
              titulo: "Pronto. Aqui está o seu vídeo.",
              textoNoVideo: "Meu vídeo",
              nomeArquivo: "video.mp4",
            },
            { tipo: "logo", tema: "escuro", duracaoEmSegundos: 3 },
          ],
        }}
      />
      <Composition
        id="Apresentador3D"
        component={Apresentador3D}
        schema={apresentador3DSchema}
        calculateMetadata={metadataApresentador}
        durationInFrames={30 * 10}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          formato: "9:16",
          videoApresentador: "",
          corDestaque: "#ffb800",
          falas: [
            {
              texto: "Motion graphics em 3D",
              inicioEmSegundos: 0.5,
              duracaoEmSegundos: 2.5,
            },
            {
              texto: "Feito com código",
              inicioEmSegundos: 3.5,
              duracaoEmSegundos: 2.5,
            },
            {
              texto: "Direto do Remotion",
              inicioEmSegundos: 6.5,
              duracaoEmSegundos: 3,
            },
          ],
        }}
      />
    </>
  );
};

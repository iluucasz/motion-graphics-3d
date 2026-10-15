import { Composition, type CalculateMetadataFunction } from "remotion";
import { Apresentador3D } from "./Apresentador3D";
import {
  apresentador3DSchema,
  type Apresentador3DProps,
} from "./Apresentador3D/schema";
import { dimensoesDoFormato } from "./compartilhado/formato";
import { calcularMetadataUIStory, FPS, UIStory } from "./UIStory";
import { roteiroExemplo } from "./UIStory/roteiroExemplo";
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
        defaultProps={{ formato: "9:16", ...roteiroExemplo }}
      />
      <Composition
        id="UIStory-16x9"
        component={UIStory}
        schema={uiStorySchema}
        calculateMetadata={calcularMetadataUIStory}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={1}
        defaultProps={{ formato: "16:9", ...roteiroExemplo }}
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

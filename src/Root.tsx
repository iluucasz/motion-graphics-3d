import { Composition } from "remotion";
import { Apresentador3D } from "./Apresentador3D";
import { apresentador3DSchema } from "./Apresentador3D/schema";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Apresentador3D"
      component={Apresentador3D}
      schema={apresentador3DSchema}
      durationInFrames={30 * 10}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        videoApresentador: "",
        corDestaque: "#ffb800",
        falas: [
          { texto: "Motion graphics em 3D", inicioEmSegundos: 0.5, duracaoEmSegundos: 2.5 },
          { texto: "Feito com código", inicioEmSegundos: 3.5, duracaoEmSegundos: 2.5 },
          { texto: "Direto do Remotion", inicioEmSegundos: 6.5, duracaoEmSegundos: 3 },
        ],
      }}
    />
  );
};

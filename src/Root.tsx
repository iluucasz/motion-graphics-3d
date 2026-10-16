import { NewComposition } from "./NewComposition";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { Apresentador3D } from "./Apresentador3D";
import {
  apresentador3DSchema,
  type Apresentador3DProps,
} from "./Apresentador3D/schema";
import { dimensoesDoFormato } from "./compartilhado/formato";
import { calcularMetadataUIStory, FPS, UIStory } from "./UIStory";
import { uiStorySchema } from "./UIStory/schema";
import { duracaoEmFrames, FPS as FPS_GARIMPO, Garimpo } from "./Garimpo";

const metadataApresentador: CalculateMetadataFunction<Apresentador3DProps> = ({
  props,
}) => dimensoesDoFormato(props.formato);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GarimpoD80"
        component={Garimpo}
        fps={FPS_GARIMPO}
        width={1920}
        height={1080}
        durationInFrames={duracaoEmFrames("80")}
        defaultProps={{ variante: "80" as const, formato: "desktop" as const }}
      />
      <Composition
        id="GarimpoD60"
        component={Garimpo}
        fps={FPS_GARIMPO}
        width={1920}
        height={1080}
        durationInFrames={duracaoEmFrames("60")}
        defaultProps={{ variante: "60" as const, formato: "desktop" as const }}
      />
      <Composition
        id="GarimpoM80"
        component={Garimpo}
        fps={FPS_GARIMPO}
        width={1080}
        height={1920}
        durationInFrames={duracaoEmFrames("80")}
        defaultProps={{ variante: "80" as const, formato: "mobile" as const }}
      />
      <Composition
        id="GarimpoM60"
        component={Garimpo}
        fps={FPS_GARIMPO}
        width={1080}
        height={1920}
        durationInFrames={duracaoEmFrames("60")}
        defaultProps={{ variante: "60" as const, formato: "mobile" as const }}
      />
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
        // Props escritos aqui (e não importados) para o Studio conseguir salvar edições.
        defaultProps={{
          formato: "9:16" as const,
          marca: "Seu Estúdio",
          corDestaque: "#ff5e1e",
          transicao: "desfoque-zoom" as const,
          particulas: true,
          cenas: [{
            tipo: "chat" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 6,
            saudacao: "Boa noite, criador",
            mensagem: "Eu nunca abri o After Effects e não sei animar",
          }, {
            tipo: "titulo" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 3.5,
            texto: "Foi tudo feito pelo",
            destaque: "Remotion",
          }, {
            tipo: "selos" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 3,
            itens: ["Gratuito", "Código aberto", "No GitHub"],
          }, {
            tipo: "timeline" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 4.5,
            faixas: ["Riscos", "Simbolo", "Saudacao", "Caixa", "Brilho"],
          }, {
            tipo: "codigo" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 5,
            arquivo: "Motion.tsx",
            linhas: [
              "<Riscos entram=\"bordas\" />",
              "<Simbolo nasce=\"centro\" />",
              "<Saudacao texto=\"Boa noite\" />",
            ],
          }, {
            tipo: "metricas" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 4.5,
            usuario: "seu.estudio",
            visualizacoes: 81000,
            curtidas: 4500,
            comentarios: 65,
          }, {
            tipo: "impacto" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 3,
            texto: "Como faz?",
          }, {
            tipo: "prompt" as const,
            tema: "claro" as const,
            duracaoEmSegundos: 5,
            titulo: "Cole o prompt",
            teclas: ["⌘", "V"],
            texto: "Quero que você crie um vídeo de motion graphics com o Remotion, do zero. Instale o que precisar, monte cada cena, confira o resultado e me entregue o arquivo pronto em MP4.",
          }, {
            tipo: "arquivo" as const,
            tema: "claro" as const,
            duracaoEmSegundos: 4,
            titulo: "Pronto. Aqui está o seu vídeo.",
            textoNoVideo: "Meu vídeo",
            nomeArquivo: "video.mp4",
          }, {
            tipo: "edicao" as const,
            tema: "claro" as const,
            duracaoEmSegundos: 7.5,
            titulo: "Quer mudar? Pede em português",
            pedidos: ["Troca o nome", "Muda a cor", "Deixa mais lento"],
            textoAntes: "Meu vídeo",
            textoDepois: "Supernova",
            corDepois: "#4d7cff",
            nomeArquivo: "video.mp4",
          }, {
            tipo: "comentarios" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 7,
            perfil: "seu.estudio",
            comentarios: [{
              autor: "você",
              texto: "PROMPT",
              doAutor: false,
            }, {
              autor: "",
              texto: "@você te mandei o PROMPT que fez esse vídeo",
              doAutor: true,
            }, {
              autor: "maria",
              texto: "Como faço?",
              doAutor: false,
            }],
            chamada: "Comenta",
            palavraChave: "PROMPT",
          }, {
            tipo: "logo" as const,
            tema: "escuro" as const,
            duracaoEmSegundos: 4.5,
          }],
        }}
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
        // Props escritos aqui (e não importados) para o Studio conseguir salvar edições.
        defaultProps={{
          formato: "16:9",
          marca: "Seu Estúdio",
          corDestaque: "#ff7a45",
          transicao: "desfoque-zoom",
          particulas: true,
          cenas: [
            {
              tipo: "chat",
              tema: "escuro",
              duracaoEmSegundos: 6,
              saudacao: "Boa noite, criador",
              mensagem: "Eu nunca abri o After Effects e não sei animar",
            },
            {
              tipo: "titulo",
              tema: "escuro",
              duracaoEmSegundos: 3.5,
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
              duracaoEmSegundos: 4.5,
              faixas: ["Riscos", "Simbolo", "Saudacao", "Caixa", "Brilho"],
            },
            {
              tipo: "codigo",
              tema: "escuro",
              duracaoEmSegundos: 5,
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
              duracaoEmSegundos: 4.5,
              usuario: "seu.estudio",
              visualizacoes: 81000,
              curtidas: 4500,
              comentarios: 65,
            },
            {
              tipo: "impacto",
              tema: "escuro",
              duracaoEmSegundos: 3,
              texto: "Como faz?",
            },
            {
              tipo: "prompt",
              tema: "claro",
              duracaoEmSegundos: 5,
              titulo: "Cole o prompt",
              teclas: ["⌘", "V"],
              texto:
                "Quero que você crie um vídeo de motion graphics com o Remotion, do zero. Instale o que precisar, monte cada cena, confira o resultado e me entregue o arquivo pronto em MP4.",
            },
            {
              tipo: "arquivo",
              tema: "claro",
              duracaoEmSegundos: 4,
              titulo: "Pronto. Aqui está o seu vídeo.",
              textoNoVideo: "Meu vídeo",
              nomeArquivo: "video.mp4",
            },
            {
              tipo: "edicao",
              tema: "claro",
              duracaoEmSegundos: 7.5,
              titulo: "Quer mudar? Pede em português",
              pedidos: ["Troca o nome", "Muda a cor", "Deixa mais lento"],
              textoAntes: "Meu vídeo",
              textoDepois: "Supernova",
              corDepois: "#4d7cff",
              nomeArquivo: "video.mp4",
            },
            {
              tipo: "comentarios",
              tema: "escuro",
              duracaoEmSegundos: 7,
              perfil: "seu.estudio",
              comentarios: [
                { autor: "você", texto: "PROMPT", doAutor: false },
                {
                  autor: "",
                  texto: "@você te mandei o PROMPT que fez esse vídeo",
                  doAutor: true,
                },
                { autor: "maria", texto: "Como faço?", doAutor: false },
              ],
              chamada: "Comenta",
              palavraChave: "PROMPT",
            },
            { tipo: "logo", tema: "escuro", duracaoEmSegundos: 4.5 },
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

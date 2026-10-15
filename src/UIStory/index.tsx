import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import type { CalculateMetadataFunction } from "remotion";
import { useVideoConfig } from "remotion";
import { dimensoesDoFormato } from "../compartilhado/formato";
import { Arquivo } from "./cenas/Arquivo";
import { Chat } from "./cenas/Chat";
import { Codigo } from "./cenas/Codigo";
import { Logo } from "./cenas/Logo";
import { Metricas } from "./cenas/Metricas";
import { Selos } from "./cenas/Selos";
import { Timeline } from "./cenas/Timeline";
import { Titulo } from "./cenas/Titulo";
import { Fundo } from "./Fundo";
import type { Cena, UIStoryProps } from "./schema";

export const FPS = 30;
const FRAMES_TRANSICAO = 12;

const framesDaCena = (cena: Cena) => Math.round(cena.duracaoEmSegundos * FPS);

// Formato (9:16 ou 16:9) e duração total saem dos props.
export const calcularMetadataUIStory: CalculateMetadataFunction<
  UIStoryProps
> = ({ props }) => {
  const total = props.cenas.reduce(
    (soma, cena) => soma + framesDaCena(cena),
    0,
  );
  const transicoes = Math.max(0, props.cenas.length - 1) * FRAMES_TRANSICAO;
  return {
    ...dimensoesDoFormato(props.formato),
    durationInFrames: Math.max(1, total - transicoes),
  };
};

const ConteudoDaCena: React.FC<{ cena: Cena; marca: string; cor: string }> = ({
  cena,
  marca,
  cor,
}) => {
  switch (cena.tipo) {
    case "titulo":
      return <Titulo texto={cena.texto} destaque={cena.destaque} cor={cor} />;
    case "chat":
      return (
        <Chat
          saudacao={cena.saudacao}
          mensagem={cena.mensagem}
          marca={marca}
          cor={cor}
          tema={cena.tema}
        />
      );
    case "selos":
      return <Selos itens={cena.itens} cor={cor} tema={cena.tema} />;
    case "timeline":
      return <Timeline faixas={cena.faixas} cor={cor} tema={cena.tema} />;
    case "codigo":
      return (
        <Codigo
          arquivo={cena.arquivo}
          linhas={cena.linhas}
          cor={cor}
          tema={cena.tema}
        />
      );
    case "metricas":
      return (
        <Metricas
          usuario={cena.usuario}
          visualizacoes={cena.visualizacoes}
          curtidas={cena.curtidas}
          comentarios={cena.comentarios}
          cor={cor}
          tema={cena.tema}
        />
      );
    case "arquivo":
      return (
        <Arquivo
          titulo={cena.titulo}
          textoNoVideo={cena.textoNoVideo}
          nomeArquivo={cena.nomeArquivo}
          cor={cor}
          tema={cena.tema}
        />
      );
    case "logo":
      return <Logo marca={marca} cor={cor} />;
  }
};

export const UIStory: React.FC<UIStoryProps> = ({
  marca,
  corDestaque,
  cenas,
}) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      {cenas.map((cena, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: FRAMES_TRANSICAO })}
            />
          ) : null}
          <TransitionSeries.Sequence
            durationInFrames={framesDaCena(cena)}
            premountFor={fps}
            name={`${i + 1}. ${cena.tipo}`}
          >
            <Fundo tema={cena.tema} cor={corDestaque}>
              <ConteudoDaCena cena={cena} marca={marca} cor={corDestaque} />
            </Fundo>
          </TransitionSeries.Sequence>
        </Fragment>
      ))}
    </TransitionSeries>
  );
};

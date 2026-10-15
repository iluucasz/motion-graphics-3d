import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, interpolate } from "remotion";

type SemProps = Record<string, never>;

// A cena que sai afasta e desfoca; a que entra vem de perto, desfocada,
// e assenta. Dá a sensação de "câmera" passando entre as telas.
const DesfoqueZoom: React.FC<
  TransitionPresentationComponentProps<SemProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const entrando = presentationDirection === "entering";
  const p = presentationProgress;
  const escala = entrando
    ? interpolate(p, [0, 1], [1.12, 1])
    : interpolate(p, [0, 1], [1, 0.9]);
  const desfoque = entrando
    ? interpolate(p, [0, 1], [24, 0])
    : interpolate(p, [0, 1], [0, 24]);
  const opacidade = entrando
    ? interpolate(p, [0, 0.6], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${escala})`,
        filter: `blur(${desfoque}px)`,
        opacity: opacidade,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const desfoqueZoom = (): TransitionPresentation<SemProps> => ({
  component: DesfoqueZoom,
  props: {},
});

export type TipoTransicao = "desfoque-zoom" | "fade" | "deslizar";

// As apresentações têm tipos de props diferentes; o TransitionSeries só
// precisa de uma delas, então unificamos o tipo aqui.
type Apresentacao = TransitionPresentation<Record<string, unknown>>;

export const apresentacao = (tipo: TipoTransicao): Apresentacao =>
  (tipo === "fade"
    ? fade()
    : tipo === "deslizar"
      ? slide({ direction: "from-right" })
      : desfoqueZoom()) as unknown as Apresentacao;

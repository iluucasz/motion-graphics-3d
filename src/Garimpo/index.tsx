import { Audio, Sequence } from "remotion";
import { Camada, Legendas } from "./componentes";
import { S1, S2, S3, S4, S5 } from "./cenasA";
import { S6, S7 } from "./cenasB";
import { S10, S11, S8, S9 } from "./cenasC";
import audioManifest from "./audioManifest.json";
import { asset, cor, FPS } from "./tema";
import { DURACAO, legendasDaVariante, TEMPOS, type Formato, type Variante } from "./tempos";

export { FPS };

export type GarimpoProps = {
  variante: Variante;
  formato: Formato;
  comAudio?: boolean;
  /** Legendas queimadas (seção 10 do prompt). Desligadas por pedido do usuário. */
  legendas?: boolean;
};

const cenasDe = {
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
} as const;

const ORDEM = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11"] as const;

export const duracaoEmFrames = (v: Variante) => Math.round(DURACAO[v] * FPS);

export const Garimpo: React.FC<GarimpoProps> = ({ variante, formato, comAudio = true, legendas: comLegendas = false }) => {
  const tempos = TEMPOS[variante];
  const legendas = legendasDaVariante(variante);

  return (
    <Camada style={{ background: cor.navy }}>
      {ORDEM.map((id) => {
        const T = tempos[id];
        if (!T) return null;
        const Cena = cenasDe[id] as React.FC<{ f: Formato; v: Variante; T: typeof T }>;
        const de = Math.round(T.ini * FPS);
        const dur = Math.round(T.fim * FPS) - de;
        return (
          <Sequence key={id} from={de} durationInFrames={dur} name={id} layout="none">
            <Cena f={formato} v={variante} T={T} />
          </Sequence>
        );
      })}
      {comLegendas && <Legendas lista={legendas} formato={formato} />}
      {comAudio && <Audio src={asset((audioManifest as Record<string, string>)[variante])} />}
    </Camada>
  );
};

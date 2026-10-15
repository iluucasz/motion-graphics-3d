import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { cursorVisivel, entrada, fontes, paleta, type Tema } from "../estilo";

const Tecla: React.FC<{ rotulo: string; aperto: number; tema: Tema }> = ({
  rotulo,
  aperto,
  tema,
}) => {
  const p = paleta(tema);
  return (
    <div
      style={{
        minWidth: 84,
        height: 84,
        padding: "0 18px",
        borderRadius: 18,
        background: p.painel,
        border: `2px solid ${p.borda}`,
        boxShadow: `0 ${8 - aperto * 6}px 0 ${p.borda}`,
        transform: `translateY(${aperto * 6}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fontes.sans,
        fontSize: 40,
        fontWeight: 500,
      }}
    >
      {rotulo}
    </div>
  );
};

// "Cole o prompt ⌘V": as teclas afundam e o texto aparece de uma vez na caixa.
export const Prompt: React.FC<{
  titulo: string;
  teclas: string[];
  texto: string;
  cor: string;
  tema: Tema;
}> = ({ titulo, teclas, texto, cor, tema }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = paleta(tema);
  const momentoColar = 28;
  const aperto = interpolate(
    frame,
    [momentoColar - 4, momentoColar, momentoColar + 6],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const colado = frame >= momentoColar;
  const flash = spring({
    frame: frame - momentoColar,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const largura = Math.min(width - 120, 1100);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 56 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontFamily: fontes.serif,
            fontSize: 68,
            ...entrada(frame, fps),
          }}
        >
          <Simbolo cor={cor} tamanho={58} />
          {titulo}
        </div>
        <div style={{ display: "flex", gap: 14, ...entrada(frame, fps, 8) }}>
          {teclas.map((tecla, i) => (
            <Tecla key={i} rotulo={tecla} aperto={aperto} tema={tema} />
          ))}
        </div>
      </div>
      <div
        style={{
          width: largura,
          minHeight: 300,
          borderRadius: 32,
          background: p.painel,
          border: `2px solid ${colado ? cor : p.borda}`,
          boxShadow: colado
            ? `0 0 0 ${interpolate(flash, [0, 1], [14, 0])}px color-mix(in srgb, ${cor} 25%, transparent), 0 30px 70px rgba(0,0,0,0.15)`
            : "0 30px 70px rgba(0,0,0,0.15)",
          padding: "34px 40px",
          fontFamily: fontes.sans,
          fontSize: 36,
          lineHeight: 1.45,
          ...entrada(frame, fps, 4),
        }}
      >
        {colado ? (
          <span style={{ opacity: interpolate(flash, [0, 1], [0.3, 1]) }}>
            {texto}
          </span>
        ) : (
          <span style={{ color: p.suave }}>
            {cursorVisivel(frame) ? <span style={{ color: cor }}>|</span> : " "}
            Como posso ajudar você hoje?
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

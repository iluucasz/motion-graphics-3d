import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  cursorVisivel,
  entrada,
  fontes,
  paleta,
  textoDigitado,
  type Tema,
} from "../estilo";

// Realce simples: tags em azul, strings na cor de destaque.
const Realce: React.FC<{ linha: string; cor: string; texto: string }> = ({
  linha,
  cor,
  texto,
}) => (
  <>
    {linha.split(/("[^"]*"?|<\/?[A-Za-z]+|\/?>)/).map((parte, i) => {
      const estilo = parte.startsWith('"')
        ? { color: cor }
        : parte.startsWith("<") || parte.endsWith(">")
          ? { color: "#6ea0ff" }
          : { color: texto };
      return (
        <span key={i} style={estilo}>
          {parte}
        </span>
      );
    })}
  </>
);

export const Codigo: React.FC<{
  arquivo: string;
  linhas: string[];
  cor: string;
  tema: Tema;
}> = ({ arquivo, linhas, cor, tema }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = paleta(tema);
  const velocidade = 1.1;
  let inicio = 12;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: Math.min(width - 100, 1500),
          borderRadius: 28,
          background: p.painel,
          border: `2px solid ${p.borda}`,
          padding: "28px 40px 44px",
          fontFamily: fontes.mono,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          ...entrada(frame, fps),
        }}
      >
        <div style={{ color: p.suave, fontSize: 26, marginBottom: 24 }}>
          {arquivo}
        </div>
        {linhas.map((linha, i) => {
          const comeco = inicio;
          inicio += linha.length * velocidade + 4;
          const visivel = textoDigitado(linha, frame, comeco, velocidade);
          const ativa = frame >= comeco && visivel.length < linha.length;
          const ultima =
            i === linhas.length - 1 && visivel.length === linha.length;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: 34,
                lineHeight: 1.6,
                whiteSpace: "pre",
              }}
            >
              <span style={{ width: 60, color: p.suave }}>{i + 1}</span>
              <Realce linha={visivel} cor={cor} texto={p.texto} />
              {(ativa || ultima) && cursorVisivel(frame) ? (
                <span style={{ color: cor }}>|</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

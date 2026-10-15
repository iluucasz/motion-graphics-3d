import { loadFont } from "@remotion/fonts";
import { interpolate, spring, staticFile } from "remotion";

// Fontes ficam em public/fonts (arquivos variáveis, subset latino), então o
// render não depende de internet. loadFont segura o render até carregarem.
const fonte = (family: string, arquivo: string) => {
  loadFont({ family, url: staticFile(`fonts/${arquivo}`), weight: "100 900" });
  return `"${family}"`;
};

export const fontes = {
  serif: `${fonte("Newsreader", "Newsreader.woff2")}, Georgia, serif`,
  sans: `${fonte("Inter", "Inter.woff2")}, system-ui, sans-serif`,
  mono: `${fonte("JetBrains Mono", "JetBrainsMono.woff2")}, ui-monospace, monospace`,
};

export type Tema = "escuro" | "claro";

export const paleta = (tema: Tema) =>
  tema === "escuro"
    ? {
        fundo: "#0d0c0b",
        texto: "#f4efe8",
        suave: "#8d8780",
        painel: "#1b1a18",
        borda: "#2c2a27",
      }
    : {
        fundo: "#f6f4ef",
        texto: "#1d1b18",
        suave: "#8a857d",
        painel: "#ffffff",
        borda: "#e3dfd6",
      };

// Mistura a cor de destaque com transparência sem precisar converter hex.
export const comAlpha = (cor: string, porcento: number) =>
  `color-mix(in srgb, ${cor} ${porcento}%, transparent)`;

// Entrada padrão do estilo: sobe, desfoca -> nítido e aparece.
export const entrada = (frame: number, fps: number, atraso = 0) => {
  const p = spring({
    frame: frame - atraso,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
    filter: `blur(${interpolate(p, [0, 1], [12, 0])}px)`,
  } as const;
};

export const textoDigitado = (
  texto: string,
  frame: number,
  inicio: number,
  framesPorLetra = 1.6,
) => {
  const letras = Math.floor(
    interpolate(
      frame,
      [inicio, inicio + texto.length * framesPorLetra],
      [0, texto.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );
  return texto.slice(0, letras);
};

export const cursorVisivel = (frame: number) =>
  Math.floor(frame / 15) % 2 === 0;

export const formatarNumero = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1).replace(".", ",")} mi`
    : n >= 1000
      ? `${(n / 1000).toFixed(1).replace(".", ",")} mil`
      : `${Math.round(n)}`;

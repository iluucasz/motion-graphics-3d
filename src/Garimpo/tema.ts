import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const FPS = 30;

// Identidade (PROMPT-MONTAGEM, seção 1).
export const cor = {
  amarelo: "#FFC72C",
  navy: "#1C2434",
  laranja: "#C3441D",
  verde: "#1C6B4A",
  claro: "#FBFAF7",
  branco: "#FFFFFF",
} as const;

// Fontes embutidas em public/fonts (variáveis, subset latino) — render sem internet.
loadFont({ family: "Manrope", url: staticFile("fonts/Manrope.woff2"), weight: "200 800" });
loadFont({ family: "DM Sans", url: staticFile("fonts/DMSans.woff2"), weight: "100 1000" });

export const fonte = {
  titulo: `"Manrope", "DM Sans", system-ui, sans-serif`,
  corpo: `"DM Sans", system-ui, sans-serif`,
};

// entrada com overshoot (estilo "pop" elástico)
export const BACK = Easing.out(Easing.back(2.2));

export const sombra = "0 24px 60px rgba(28,36,52,.22)";

// cubic-bezier(.22, 1, .36, 1)
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const f = (seg: number) => seg * FPS;

/** Progresso 0→1 (com a curva padrão) entre `ini` e `ini+dur`, em segundos. */
export const prog = (frame: number, ini: number, dur: number) =>
  interpolate(frame, [f(ini), f(ini + dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Progresso 0→1→(passa de 1 e volta): entrada com overshoot. */
export const popBack = (frame: number, ini: number, dur: number) =>
  interpolate(frame, [f(ini), f(ini + dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: BACK,
  });

/** Progresso linear 0→1. */
export const lin = (frame: number, ini: number, dur: number) =>
  interpolate(frame, [f(ini), f(ini + dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Peso do punch-in: sobe em 0,25 s, segura 0,6 s, volta em 0,25 s. */
export const pesoPunch = (frame: number, ini: number, sobe = 0.25, segura = 0.6, desce = 0.25) =>
  prog(frame, ini, sobe) - prog(frame, ini + sobe + segura, desce);

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Câmera: ponto (cx,cy) do conteúdo no centro da tela, com zoom s. transformOrigin deve ser "0 0". */
export const camera = (s: number, cx: number, cy: number, W: number, H: number) =>
  `translate(${W / 2 - s * cx}px, ${H / 2 - s * cy}px) scale(${s})`;

/** Centro da câmera para um zoom s com o ponto-âncora (ax,ay) fixo na tela (como transform-origin). */
export const centroPorAncora = (s: number, ax: number, ay: number, W: number, H: number) => ({
  cx: ax + (W / 2 - ax) / s,
  cy: ay + (H / 2 - ay) / s,
});

export const asset = (nome: string) => staticFile(`garimpo/${nome}`);

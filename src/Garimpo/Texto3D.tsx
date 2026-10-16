// Tipografia gigante "protagonista": texto num plano 3D (perspectiva), com extrusão, entrada voando de profundidade,
// versão só-contorno que se preenche e deriva lenta de câmera. Fica atrás dos elementos da cena para "assentar" no cenário.
import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BACK, cor, FPS, fonte, lin, prog } from "./tema";

export type Parte = { t: string; c?: string; ini?: number };

export const Texto3D: React.FC<{
  partes: Parte[];
  ini: number; // s locais da cena
  x: number; // centro do plano (px)
  y: number;
  tam: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  cor?: string;
  /** Só contorno (e preenche em `preenche`, se informado). */
  contorno?: boolean;
  preenche?: number;
  /** Opacidade do preenchimento final quando `contorno` (0–1). */
  opacidadePreenche?: number;
  profundidade?: number;
  corProfundidade?: string;
  persp?: number;
  /** Deriva horizontal (px) ao longo de `durCena`. */
  deriva?: number;
  durCena?: number;
  opacidade?: number;
  style?: CSSProperties;
}> = ({
  partes,
  ini,
  x,
  y,
  tam,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  cor: corBase = cor.navy,
  contorno = false,
  preenche,
  opacidadePreenche = 1,
  profundidade = 0,
  corProfundidade = "rgba(0,0,0,.35)",
  persp = 1400,
  deriva = 0,
  durCena = 8,
  opacidade = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const letra = 0.032;
  let cursor = ini;
  const itens = partes.map((p) => {
    if (p.ini !== undefined) cursor = p.ini;
    const inicio = cursor;
    const chars = Array.from(p.t);
    cursor += chars.length * letra + 0.08;
    return { p, inicio, chars };
  });
  const sombra = Array.from({ length: profundidade }, (_, k) => `${(k + 1) * 0.55}px ${(k + 1)}px 0 ${corProfundidade}`).join(",");
  const fill = preenche === undefined ? (contorno ? 0 : 1) : prog(frame, preenche, 0.45) * opacidadePreenche;
  const dx = lin(frame, 0, durCena) * deriva;
  const traco = Math.max(2, tam * 0.016);

  return (
    <div style={{ position: "absolute", inset: 0, perspective: persp, perspectiveOrigin: "50% 50%", pointerEvents: "none", ...style }}>
      <div
        style={{
          position: "absolute",
          left: x + dx,
          top: y,
          transform: `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          transformStyle: "preserve-3d",
          whiteSpace: "nowrap",
          fontFamily: fonte.titulo,
          fontWeight: 800,
          fontSize: tam,
          lineHeight: 1,
          letterSpacing: -0.01 * tam,
          opacity: opacidade,
        }}
      >
        {itens.map(({ p, inicio, chars }, i) => (
          <span key={`${p.t}-${i}`} style={{ display: "inline-block", transformStyle: "preserve-3d", marginRight: i < itens.length - 1 ? tam * 0.28 : 0 }}>
            {chars.map((ch, j) => {
              const st = inicio + j * letra;
              const a = prog(frame, st, 0.55);
              const b = interpolate(frame, [st * FPS, (st + 0.55) * FPS], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: BACK,
              });
              const cc = p.c ?? corBase;
              const txt = ch === " " ? " " : ch;
              return (
                <span
                  key={j}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    opacity: Math.min(1, a * 1.7),
                    transform: `translateZ(${(1 - b) * -900}px) rotateX(${(1 - b) * 55}deg)`,
                    transformOrigin: "50% 100%",
                    filter: a < 0.999 ? `blur(${(1 - a) * 8}px)` : undefined,
                  }}
                >
                  {contorno && (
                    <span style={{ WebkitTextStroke: `${traco}px ${cc}`, color: "transparent" }}>{txt}</span>
                  )}
                  <span
                    style={{
                      position: contorno ? "absolute" : "relative",
                      left: 0,
                      top: 0,
                      color: cc,
                      opacity: fill,
                      textShadow: sombra || undefined,
                    }}
                  >
                    {txt}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
};

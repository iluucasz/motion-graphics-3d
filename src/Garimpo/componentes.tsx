import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { asset, BACK, cor, FPS, fonte, lin, popBack, prog, sombra } from "./tema";
import type { Formato, Legenda } from "./tempos";

export const dimensoes = (f: Formato) => (f === "desktop" ? { W: 1920, H: 1080 } : { W: 1080, H: 1920 });

// ---------- Texto animado (letra a letra, overshoot, blur → nítido, separação RGB, sublinhado nas palavras de destaque) ----------
export type Palavra = { t: string; c?: string; ini?: number; forte?: boolean };

export const Palavras: React.FC<{
  palavras: Palavra[];
  ini: number; // segundos locais da cena
  tam: number;
  cor?: string;
  align?: CSSProperties["textAlign"];
  maxW?: number;
  passo?: number; // mantido por compatibilidade (o ritmo agora é por letra)
  style?: CSSProperties;
}> = ({ palavras, ini, tam, cor: corTexto = cor.navy, align = "left", maxW, style }) => {
  const frame = useCurrentFrame();
  const letra = 0.026; // s entre letras
  let cursor = ini;
  const itens = palavras.map((p) => {
    if (p.ini !== undefined) cursor = p.ini;
    const inicio = cursor;
    const chars = Array.from(p.t);
    cursor += chars.length * letra + 0.07;
    return { p, inicio, chars };
  });
  return (
    <div
      style={{
        fontFamily: fonte.titulo,
        fontWeight: 800,
        fontSize: tam,
        lineHeight: 1.1,
        letterSpacing: -0.02 * tam,
        color: corTexto,
        textAlign: align,
        maxWidth: maxW,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: tam * 0.26,
        ...style,
      }}
    >
      {itens.map(({ p, inicio, chars }, i) => {
        const fimLetras = inicio + chars.length * letra + 0.3;
        const destaque = p.c !== undefined;
        const pop = destaque ? 1 + 0.1 * Math.sin(Math.PI * lin(frame, fimLetras, 0.35)) : 1;
        const sub = destaque ? prog(frame, fimLetras, 0.4) : 0;
        const s0 = p.forte ? 1.9 : 0.55;
        return (
          <span
            key={`${p.t}-${i}`}
            style={{
              position: "relative",
              display: "inline-block",
              whiteSpace: "nowrap",
              transform: `scale(${pop})`,
              transformOrigin: "50% 80%",
            }}
          >
            {chars.map((ch, j) => {
              const st = inicio + j * letra;
              const a = prog(frame, st, 0.45);
              const b = interpolate(frame, [st * FPS, (st + 0.45) * FPS], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: BACK,
              });
              const d = (1 - a) * (1 - a) * 0.13 * tam * (p.forte ? 1.6 : 1);
              return (
                <span
                  key={j}
                  style={{
                    display: "inline-block",
                    color: p.c ?? corTexto,
                    opacity: Math.min(1, a * 1.8),
                    transform: `translateY(${p.forte ? 0 : (1 - b) * tam * 0.22}px) scale(${s0 + (1 - s0) * b})`,
                    transformOrigin: "50% 80%",
                    filter: a < 0.999 ? `blur(${(1 - a) * 10}px)` : undefined,
                    textShadow: d > 0.4 ? `${-d}px 0 rgba(255,45,95,.9), ${d}px 0 rgba(0,210,255,.9)` : undefined,
                  }}
                >
                  {ch === " " ? " " : ch}
                </span>
              );
            })}
            {destaque && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -tam * 0.04,
                  height: Math.max(4, tam * 0.07),
                  width: `${sub * 100}%`,
                  borderRadius: 999,
                  background: p.c,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Ícones (SVG: o subset da fonte não tem ★ nem →) ----------
export const IconeCheck: React.FC<{ tam?: number; cor?: string }> = ({ tam = 30, cor: c = cor.verde }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={c} />
    <path d="M7 12.5l3.2 3.2L17 8.8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Estrela: React.FC<{ tam?: number; cor?: string }> = ({ tam = 34, cor: c = cor.amarelo }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M12 2.2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.8l1.4-6.8L2.2 9.3l6.9-.8z" fill={c} />
  </svg>
);

export const Seta: React.FC<{ tam?: number; cor?: string }> = ({ tam = 40, cor: c = "#fff" }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M4 12h15M13 6l6 6-6 6" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- Chip / selo (pop 0,9→1,0 em 0,18 s; pílula branca 92%) ----------
export const Chip: React.FC<{
  texto: string;
  ini: number;
  tam?: number;
  altura?: number;
  destaque?: boolean;
  largura?: number;
  style?: CSSProperties;
}> = ({ texto, ini, tam = 28, altura = 64, destaque = false, largura, style }) => {
  const frame = useCurrentFrame();
  const a = prog(frame, ini, 0.18);
  const b = popBack(frame, ini, 0.3);
  if (frame < ini * FPS) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        height: altura,
        width: largura,
        padding: `0 ${altura * 0.36}px 0 ${altura * 0.22}px`,
        borderRadius: 16,
        background: destaque ? cor.amarelo : "rgba(255,255,255,.92)",
        color: cor.navy,
        fontFamily: fonte.corpo,
        fontWeight: destaque ? 800 : 600,
        fontSize: tam,
        boxShadow: "0 10px 30px rgba(28,36,52,.16)",
        opacity: a,
        transform: `translateX(${(1 - b) * -26}px) scale(${0.6 + 0.4 * b})`,
        transformOrigin: "left center",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <IconeCheck tam={destaque ? altura * 0.54 : altura * 0.44} />
      {texto}
    </div>
  );
};

// ---------- Janela de tela (cantos 24 px, sombra suave) ----------
export const Janela: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  raio?: number;
  children: ReactNode;
  style?: CSSProperties;
  semSombra?: boolean;
}> = ({ x, y, w, h, raio = 24, children, style, semSombra }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: raio,
      overflow: "hidden",
      boxShadow: semSombra ? undefined : sombra,
      background: cor.claro,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Camada: React.FC<{ children?: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>
);

export const Imagem: React.FC<{ arq: string; style?: CSSProperties }> = ({ arq, style }) => (
  <Img src={asset(arq)} style={{ display: "block", ...style }} />
);

// ---------- Legendas queimadas ----------
export const Legendas: React.FC<{ lista: Legenda[]; formato: Formato }> = ({ lista, formato }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ativa = lista.find((l) => t >= l.ini && t < l.fim);
  if (!ativa) return null;
  const desktop = formato === "desktop";
  const a = prog(frame, ativa.ini, 0.12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: desktop ? 900 : 1500,
        height: desktop ? 100 : 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: desktop ? 1180 : 860,
          padding: desktop ? "10px 30px" : "10px 26px",
          borderRadius: 18,
          background: "rgba(28,36,52,.78)",
          color: "#fff",
          fontFamily: fonte.corpo,
          fontWeight: 600,
          fontSize: desktop ? 46 : 52,
          lineHeight: 1.16,
          textAlign: "center",
          textWrap: "balance",
          opacity: a,
        }}
      >
        {ativa.texto}
      </div>
    </div>
  );
};

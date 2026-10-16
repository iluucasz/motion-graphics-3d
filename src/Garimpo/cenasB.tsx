// S6 Preço · S7 Comparar
import { OffthreadVideo, useCurrentFrame } from "remotion";
import { Camada, Imagem, Janela, Palavras } from "./componentes";
import { asset, camera, centroPorAncora, cor, fonte, lin, mix, pesoPunch, prog } from "./tema";
import type { Formato, Tempos80, Variante } from "./tempos";

type P<K extends keyof Tempos80> = { f: Formato; v: Variante; T: NonNullable<Tempos80[K]> };

// Fusões de 6 frames dentro da S6 (relativas ao início da cena).
const F1 = 2.1;
const F2 = 5.3;
const XF = 0.2;

// Posição (clip 430×932) do círculo "84" do Índice na S6 mobile. A fase do Índice é um quadro congelado (src 6,3),
// então a posição é fixa — medida no próprio clipe.
const INDICE_MOBILE = { x: 56, y: 622 };
const posIndiceMobile = (_rel: number) => INDICE_MOBILE;

// ============================ S6 · Preço ============================
export const S6: React.FC<P<"S6">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const e = T.ev;
  const rel = frame / 30;
  const punch = e.punch - T.ini;
  const titulo = e.titulo - T.ini;
  const barras = e.barras.map((t) => t - T.ini);
  const destaque = e.destaque - T.ini;
  const c0 = e.contagem[0] - T.ini;
  const c1 = e.contagem[1] - T.ini;

  const opTopo = rel < F2 ? 1 - lin(frame, F1, XF) : lin(frame, F2, XF);
  const opHist = lin(frame, F1, XF) - lin(frame, F2, XF);
  const tituloOp = 1 - lin(frame, F2 - 0.2, XF);
  const valor = Math.round(84 * lin(frame, c0, c1 - c0));
  const batida = 1 + 0.18 * Math.sin(Math.PI * lin(frame, c1, 0.3));

  if (desktop) {
    const W = 1920;
    const H = 1080;
    const k = 1920 / 2880;
    const oy = (H - 1500 * k) / 2; // 40
    const X = (x: number) => x * k;
    const Y = (y: number) => oy + y * k;

    let s: number;
    let cx: number;
    let cy: number;
    if (rel < F2) {
      const sPush = mix(1, 1.35, prog(frame, 0, F1));
      const c = centroPorAncora(sPush, X(2080), Y(810), W, H);
      const w = pesoPunch(frame, punch);
      s = mix(sPush, 1.8, w);
      cx = mix(c.cx, X(2010), w);
      cy = mix(c.cy, Y(640), w);
    } else {
      const a = prog(frame, F2 + XF, 0.5);
      s = mix(1, 2.0, a);
      cx = mix(W / 2, X(2080), a);
      cy = mix(H / 2, Y(1380), a);
    }

    const barraX: [number, number][] = [
      [274, 370],
      [859, 955],
      [1444, 1540],
      [2029, 2125],
    ];
    const hw = 1500;
    const hk = hw / 2400;
    const hx = (W - hw) / 2;
    const hy = 330;

    return (
      <Camada style={{ background: cor.claro, overflow: "hidden" }}>
        <Camada style={{ opacity: opTopo }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: camera(s, cx, cy, W, H) }}>
            <Imagem arq="produto-liquidificador-topo.png" style={{ position: "absolute", left: 0, top: oy, width: W }} />
            {rel >= F2 && frame >= c0 * 30 && (
              <div
                style={{
                  position: "absolute",
                  left: X(1605) - 35,
                  top: Y(1380) - 35,
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  background: cor.navy,
                  color: "#fff",
                  transform: `scale(${batida})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonte.titulo,
                  fontWeight: 800,
                  fontSize: 32,
                }}
              >
                {valor}
              </div>
            )}
          </div>
        </Camada>
        <Camada style={{ opacity: opHist }}>
          <Imagem
            arq="produto-liquidificador-historico-preco.png"
            style={{ position: "absolute", left: hx, top: hy, width: hw }}
          />
          {barraX.map(([x0, x1], i) => {
            const a = prog(frame, barras[i], 0.25);
            const altura = 216 * hk;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: hx + x0 * hk - 3,
                  top: hy + 396 * hk - 2,
                  width: (x1 - x0) * hk + 6,
                  height: altura * (1 - a) + 2,
                  background: "#fff",
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: hx - 10,
              top: hy + 188 * hk - 8,
              width: 1144 * hk + 20,
              height: 40 * hk + 16,
              borderRadius: 10,
              border: `4px solid ${cor.verde}`,
              opacity: prog(frame, destaque, 0.4),
            }}
          />
        </Camada>
        <div style={{ position: "absolute", left: 96, top: 90, opacity: tituloOp }}>
          <Palavras
            palavras={[{ t: "Preço" }, { t: "acompanhado", c: cor.laranja }, { t: "todo" }, { t: "dia." }]}
            ini={titulo}
            tam={84}
          />
        </div>
      </Camada>
    );
  }

  // ---- mobile ----
  const win = { x: 280, y: 450, w: 520, h: 1126 };
  const esc = win.w / 430; // clip 430×932 → janela 520×1126
  let s = 1;
  let cx = 215;
  let cy = 466;
  if (rel < F1 + XF) {
    const w = pesoPunch(frame, punch);
    const yPreco = 840 - 55 * Math.min(1, rel / F1);
    s = mix(1, 1.8, w);
    cx = mix(215, 150, w);
    cy = mix(466, yPreco - 10, w);
  } else if (rel >= F2) {
    const a = prog(frame, F2 + XF, 0.5);
    const ind = posIndiceMobile(rel);
    s = mix(1, 1.6, a);
    cx = mix(215, 160, a);
    cy = mix(466, ind.y, a);
  }
  // mantém a câmera dentro do clipe (sem mostrar área vazia ao redor)
  cx = Math.min(430 - 430 / (2 * s), Math.max(430 / (2 * s), cx));
  cy = Math.min(932 - 932 / (2 * s), Math.max(932 / (2 * s), cy));
  const ind = posIndiceMobile(rel);
  return (
    <Camada style={{ background: cor.claro, overflow: "hidden" }}>
      <Janela {...win} raio={40}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 430 * esc, height: 932 * esc, overflow: "hidden" }}>
          <div
            style={{
              width: 430,
              height: 932,
              transformOrigin: "0 0",
              transform: `scale(${esc}) ${camera(s, cx, cy, 430, 932)}`,
              position: "relative",
            }}
          >
            <OffthreadVideo src={asset("prep/s6-mobile-v2.mp4")} muted style={{ width: 430, height: 932, display: "block" }} />
            {rel >= F2 && frame >= c0 * 30 && (
              <div
                style={{
                  position: "absolute",
                  left: ind.x - 22,
                  top: ind.y - 22,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: cor.navy,
                  color: "#fff",
                  transform: `scale(${batida})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonte.titulo,
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                {valor}
              </div>
            )}
          </div>
        </div>
      </Janela>
      <div style={{ position: "absolute", left: 60, right: 60, top: 190 }}>
        <Palavras
          palavras={[{ t: "Preço" }, { t: "acompanhado", c: cor.laranja }, { t: "todo" }, { t: "dia." }]}
          ini={titulo}
          tam={84}
          maxW={960}
        />
      </div>
    </Camada>
  );
};

// ============================ S7 · Comparar ============================
// A gravação rola só até ≈ rel 3,3 s e depois fica em quadro parado: o selo e a linha dos Índices ficam em posição
// fixa, então o punch-in e o realce não "perseguem" a rolagem (isso causava o bug visual).
const SELO = { x: 975, y: 584 }; // selo "Menor preço da seleção" no clipe 1920×1080 parado (quadro parado do clipe)
const LINHA_INDICES_Y = 738; // texto "90 / 100" no mesmo quadro (medido no clipe)

export const S7: React.FC<P<"S7">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const e = T.ev;
  const texto = e.texto - T.ini;
  const punch = e.punch - T.ini;
  const indices = e.indices - T.ini;
  // faixa branca e texto entram juntos (a faixa não aparece vazia)
  const entrada = prog(frame, texto, 0.3);

  if (desktop) {
    // clipe prep/s7-desktop-v2.mp4 = rolagem real (src 8,4 → 11,6) + quadro parado
    const w = pesoPunch(frame, punch);
    const s = mix(1, 1.8, w);
    const cx = mix(960, SELO.x, w);
    const cy = mix(540, SELO.y, w);
    const win = { x: 110, y: 62, w: 1700, h: 956 };
    const esc = win.w / 1920;
    return (
      <Camada style={{ background: cor.claro, overflow: "hidden" }}>
        <Janela {...win}>
          <div style={{ width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${esc})` }}>
            <div
              style={{
                width: 1920,
                height: 1080,
                transformOrigin: "0 0",
                transform: camera(s, cx, cy, 1920, 1080),
                position: "relative",
              }}
            >
              <OffthreadVideo src={asset("prep/s7-desktop-v2.mp4")} muted style={{ width: 1920, height: 1080, display: "block" }} />
              <div
                style={{
                  position: "absolute",
                  left: 520,
                  top: LINHA_INDICES_Y - 26,
                  width: 1040,
                  height: 52,
                  borderRadius: 12,
                  border: `5px solid ${cor.amarelo}`,
                  background: "rgba(255,199,44,.22)",
                  opacity: prog(frame, indices, 0.3),
                }}
              />
            </div>
          </div>
        </Janela>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 770,
            padding: "14px 30px",
            borderRadius: 16,
            background: "rgba(255,255,255,.94)",
            boxShadow: "0 10px 30px rgba(28,36,52,.18)",
            opacity: entrada,
            transform: `translateY(${(1 - entrada) * 12}px)`,
          }}
        >
          <Palavras
            palavras={[{ t: "Até" }, { t: "4" }, { t: "produtos" }, { t: "lado" }, { t: "a" }, { t: "lado." }]}
            ini={texto}
            passo={0.05}
            tam={64}
          />
        </div>
      </Camada>
    );
  }

  // ---- mobile: IMG-COMP, recorte x 240–2640; rola y0 1000 → 1350 e para ----
  const k = 1000 / 2400;
  const y0 = mix(1000, 1350, prog(frame, 0.2, 2.8));
  const win = { x: 40, y: 520, w: 1000, h: 800 };
  const pos = (x: number, y: number) => ({ x: (x - 240) * k, y: (y - 1350) * k });
  const selo = pos(1467, 2039);
  const linha = pos(1436, 2348);
  const w1 = pesoPunch(frame, punch);
  const w2 = pesoPunch(frame, indices);
  const tot = Math.min(1, w1 + w2);
  const soma = w1 + w2 || 1;
  // zoom leve e câmera presa ao centro horizontal: a tabela inteira (3 produtos) continua visível
  const s = 1 + 0.14 * tot;
  const cx = 500;
  const cy = mix(400, (selo.y * w1 + linha.y * w2) / soma, tot);
  const yLinha = (2348 - y0) * k;
  return (
    <Camada style={{ background: cor.claro, overflow: "hidden" }}>
      <Janela {...win} raio={40}>
        <div
          style={{
            width: 1000,
            height: 800,
            transformOrigin: "0 0",
            transform: camera(s, cx, cy, 1000, 800),
            position: "relative",
          }}
        >
          <Imagem
            arq="comparar-resultado.png"
            style={{ position: "absolute", left: -240 * k, top: -y0 * k, width: 2880 * k, height: 3868 * k }}
          />
          <div
            style={{
              position: "absolute",
              left: (1291 - 240) * k - 10,
              top: (2009 - y0) * k - 8,
              width: (1644 - 1291) * k + 20,
              height: (2069 - 2009) * k + 16,
              borderRadius: 12,
              border: `5px solid ${cor.amarelo}`,
              background: "rgba(255,199,44,.18)",
              opacity: prog(frame, punch, 0.25) - prog(frame, indices - 0.2, 0.25),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: yLinha - 28,
              width: 2394 * k + 4,
              height: 122 * k + 6,
              borderRadius: 10,
              border: `5px solid ${cor.amarelo}`,
              background: "rgba(255,199,44,.22)",
              opacity: prog(frame, indices, 0.3),
            }}
          />
        </div>
      </Janela>
      <div style={{ position: "absolute", left: 60, right: 60, top: 190, opacity: entrada }}>
        <Palavras
          palavras={[{ t: "Até" }, { t: "4" }, { t: "produtos" }, { t: "lado" }, { t: "a" }, { t: "lado." }]}
          ini={texto}
          passo={0.05}
          tam={96}
          maxW={860}
        />
      </div>
    </Camada>
  );
};

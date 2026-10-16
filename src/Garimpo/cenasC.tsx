// S8 Engine · S9 Transparência · S10 Posts · S11 Fecho
import { useCurrentFrame } from "remotion";
import { Camada, Chip, IconeCheck, Imagem, Janela, Palavras, Seta } from "./componentes";
import { Texto3D } from "./Texto3D";
import { cor, fonte, lin, mix, popBack, prog } from "./tema";
import type { Formato, Tempos80, Variante } from "./tempos";

type P<K extends keyof Tempos80> = { f: Formato; v: Variante; T: NonNullable<Tempos80[K]> };

// ============================ S8 · Engine ============================
const PASSOS_FUNIL = [
  "Milhares de ofertas analisadas",
  "Nota alta",
  "Vendas comprovadas",
  "Nenhuma loja domina",
  "Faixas de preço",
  "Só os melhores",
];

// Grade abstrata de "ofertas" que vai sendo filtrada a cada passo do funil (sem prints do painel da Engine).
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const PASTEIS = ["#F3C9B6", "#BFD8E8", "#D8E6C3", "#E9D5F0", "#F6E3A8"];

const GradeOfertas: React.FC<{
  x: number;
  y: number;
  cols: number;
  rows: number;
  tw: number;
  th: number;
  gap: number;
  varre: number; // início da varredura ("pente-fino")
  passos: [number, number, number, number, number]; // nota, vendas, loja, faixas, final (s locais)
  sobreviventes: number;
}> = ({ x, y, cols, rows, tw, th, gap, varre, passos, sobreviventes }) => {
  const frame = useCurrentFrame();
  const n = cols * rows;
  const ordem = Array.from({ length: n }, (_, i) => i).sort((p, q) => rnd(p) - rnd(q));
  const rank: number[] = [];
  ordem.forEach((idx, r) => (rank[idx] = r));
  const gw = cols * (tw + gap) - gap;
  const gh = rows * (th + gap) - gap;
  const scanP = lin(frame, varre, 3.2);
  const scanX = x + scanP * gw;
  const scanOn = frame >= varre * 30 && frame <= (varre + 3.2) * 30 + 6;

  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const rk = rank[i];
        // quando sai: 35% na nota, 25% nas vendas, 18% na loja, resto nas faixas; os últimos sobrevivem
        let sai: number | null;
        if (rk >= n - sobreviventes) sai = null;
        else if (rk < n * 0.35) sai = passos[0];
        else if (rk < n * 0.6) sai = passos[1];
        else if (rk < n * 0.78) sai = passos[2];
        else sai = passos[3];
        const entra = prog(frame, 0.7 + (c + r * 0.7) * 0.035, 0.4);
        const some = sai === null ? 0 : prog(frame, sai, 0.35);
        const cx = x + c * (tw + gap) + tw / 2;
        const pulso = scanOn ? Math.max(0, 1 - Math.abs(cx - scanX) / 70) : 0;
        const final = sai === null ? prog(frame, passos[4], 0.3) : 0;
        const esc = (0.7 + 0.3 * entra) * (1 - 0.3 * some) * (1 + 0.1 * pulso) * (1 + 0.14 * final);
        const pastel = PASTEIS[Math.floor(rnd(i + 99) * PASTEIS.length)];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + c * (tw + gap),
              top: y + r * (th + gap),
              width: tw,
              height: th,
              borderRadius: 10,
              background: final > 0.01 ? cor.amarelo : "rgba(255,255,255,.92)",
              opacity: entra * (1 - some),
              transform: `scale(${esc})`,
              padding: tw * 0.1,
              display: "flex",
              flexDirection: "column",
              gap: th * 0.06,
              boxShadow: final > 0.01 ? "0 12px 30px rgba(0,0,0,.35)" : undefined,
            }}
          >
            <div style={{ flex: "0 0 52%", borderRadius: 6, background: pastel }} />
            <div style={{ height: th * 0.06, width: "90%", borderRadius: 4, background: "#C9CDD6" }} />
            <div style={{ height: th * 0.06, width: "60%", borderRadius: 4, background: "#C9CDD6" }} />
            <div style={{ height: th * 0.08, width: "45%", borderRadius: 4, background: cor.laranja, marginTop: "auto" }} />
            {sai === null && (
              <div style={{ position: "absolute", right: -6, top: -6, opacity: final }}>
                <IconeCheck tam={Math.round(tw * 0.38)} />
              </div>
            )}
          </div>
        );
      })}
      {scanOn && (
        <div
          style={{
            position: "absolute",
            left: scanX - 3,
            top: y - 14,
            width: 6,
            height: gh + 28,
            borderRadius: 3,
            background: cor.amarelo,
            opacity: 0.95,
          }}
        />
      )}
    </>
  );
};

export const S8: React.FC<P<"S8">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const e = T.ev;
  const loc = (t: number) => t - T.ini;

  const larguras = desktop ? [640, 580, 520, 460, 400, 340] : [984, 920, 860, 800, 700, 580];
  const altura = desktop ? 72 : 66;
  const gap = desktop ? 16 : 12;
  const funilX = desktop ? 1196 : 48;
  const funilW = desktop ? 640 : 984;
  const funilY = desktop ? 285 : 1040;
  const passos: [number, number, number, number, number] = [
    loc(e.funil[1]),
    loc(e.funil[2]),
    loc(e.funil[3]),
    loc(e.funil[4]),
    loc(e.funil[5]),
  ];

  return (
    <Camada style={{ background: cor.navy, overflow: "hidden" }}>
      <Texto3D
        partes={[{ t: "ENGINE" }]}
        ini={0.3}
        x={desktop ? 960 : 540}
        y={desktop ? 640 : 735}
        tam={desktop ? 380 : 215}
        rotX={desktop ? 28 : 24}
        cor={cor.amarelo}
        contorno
        opacidade={0.4}
        preenche={passos[4]}
        opacidadePreenche={0.35}
        durCena={T.fim - T.ini}
        deriva={desktop ? -80 : -40}
      />
      <div style={{ position: "absolute", left: desktop ? 96 : 60, right: desktop ? 96 : 60, top: desktop ? 56 : 180 }}>
        <Palavras
          palavras={[
            { t: "Uma" },
            { t: "Engine", c: cor.amarelo },
            { t: "filtra" },
            { t: "cada" },
            { t: "produto," },
            { t: "nos" },
            { t: "detalhes." },
          ]}
          ini={loc(e.titulo)}
          tam={desktop ? 84 : 80}
          cor="#fff"
          maxW={desktop ? 1728 : 960}
        />
      </div>
      {desktop ? (
        <GradeOfertas x={84} y={290} cols={12} rows={5} tw={78} th={108} gap={12} varre={loc(e.funil[0])} passos={passos} sobreviventes={7} />
      ) : (
        <GradeOfertas x={68} y={470} cols={6} rows={4} tw={144} th={120} gap={16} varre={loc(e.funil[0])} passos={passos} sobreviventes={4} />
      )}
      {PASSOS_FUNIL.map((txt, i) => {
        const t0 = loc(e.funil[i]);
        const a = prog(frame, t0, 0.18);
        const pb = popBack(frame, t0, 0.3);
        if (frame < t0 * 30) return null;
        const ultimo = i === 5;
        return (
          <div
            key={txt}
            style={{
              position: "absolute",
              left: funilX + (funilW - larguras[i]) / 2,
              top: funilY + i * (altura + gap),
              width: larguras[i],
              height: altura,
              borderRadius: 16,
              background: ultimo ? cor.amarelo : "rgba(255,255,255,.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              color: cor.navy,
              fontFamily: fonte.corpo,
              fontWeight: ultimo ? 800 : 600,
              fontSize: desktop ? 30 : 34,
              opacity: a,
              transform: `translateX(${(1 - pb) * 40}px) scale(${0.6 + 0.4 * pb})`,
              whiteSpace: "nowrap",
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            }}
          >
            <IconeCheck tam={ultimo ? 44 : 34} />
            {txt}
          </div>
        );
      })}
      {frame >= loc(e.sub) * 30 && (
        <div
          style={{
            position: "absolute",
            left: funilX,
            top: funilY + 6 * (altura + gap) + (desktop ? 8 : 6),
            width: funilW,
          }}
        >
          <Palavras
            palavras={[{ t: "Atualiza" }, { t: "todo" }, { t: "dia." }]}
            ini={loc(e.sub)}
            tam={desktop ? 52 : 56}
            cor="#fff"
            align="center"
          />
        </div>
      )}
    </Camada>
  );
};

// ============================ S9 · Transparência ============================
export const S9: React.FC<P<"S9">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const push = mix(1, 1.3, lin(frame, 0, dur));
  const selos = ["Sem cadastro para navegar", "Você finaliza a compra na Shopee", "Link de afiliado sempre avisado"];

  return (
    <Camada style={{ background: cor.claro, overflow: "hidden" }}>
      {desktop ? (
        <Janela x={210} y={176} w={1500} h={844}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Imagem
              arq="10-como-funciona.png"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1500,
                height: 844,
                transformOrigin: `${960 * 0.78125}px ${780 * 0.78125}px`,
                transform: `scale(${push})`,
              }}
            />
          </div>
        </Janela>
      ) : (
        <Janela x={40} y={450} w={1000} h={520} raio={28}>
          <Imagem
            arq="10-como-funciona.png"
            style={{
              position: "absolute",
              left: -590 * 1.351,
              top: -690 * 1.351,
              width: 1920 * 1.351,
              height: 1080 * 1.351,
              transformOrigin: `${(960 - 590) * 1.351}px ${(780 - 690) * 1.351}px`,
              transform: `scale(${mix(1, 1.15, lin(frame, 0, dur))})`,
            }}
          />
        </Janela>
      )}
      <div
        style={{
          position: "absolute",
          left: desktop ? 96 : 60,
          top: desktop ? 330 : 1010,
          display: "flex",
          flexDirection: "column",
          gap: desktop ? 18 : 20,
        }}
      >
        {selos.map((t, i) => (
          <div key={t} style={{ display: "flex" }}>
            <Chip texto={t} ini={e.selos[i] - T.ini} tam={desktop ? 30 : 38} altura={desktop ? 72 : 92} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: desktop ? 96 : 60, right: 60, top: desktop ? 40 : 180 }}>
        <Palavras
          palavras={[{ t: "Transparência" }, { t: "sem" }, { t: "letra" }, { t: "miúda.", c: cor.laranja }]}
          ini={e.titulo - T.ini}
          tam={desktop ? 84 : 100}
          maxW={desktop ? 1700 : 960}
        />
      </div>
    </Camada>
  );
};

// ============================ S10 · Posts ============================
export const S10: React.FC<P<"S10">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const p = lin(frame, 0, dur);
  const z = mix(1, 1.15, p);

  return (
    <Camada style={{ background: cor.navy, overflow: "hidden" }}>
      {desktop ? (
        <Janela x={410} y={300} w={1100} h={620}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Imagem
              arq="04-instagram-tiktok.png"
              style={{
                position: "absolute",
                left: -300,
                top: -mix(700, 880, p),
                width: 1920,
                height: 1647,
                transformOrigin: "700px 1100px",
                transform: `scale(${z})`,
              }}
            />
          </div>
        </Janela>
      ) : (
        <Janela x={40} y={470} w={1000} h={516} raio={24}>
          <Imagem
            arq="04-instagram-tiktok.png"
            style={{
              position: "absolute",
              left: -340 * 0.78125,
              top: -mix(900, 1040, p) * 0.78125,
              width: 1920 * 0.78125,
              height: 1647 * 0.78125,
              transformOrigin: `${(700 - 340) * 0.78125}px ${(1100 - 900) * 0.78125}px`,
              transform: `scale(${z})`,
            }}
          />
        </Janela>
      )}
      <div style={{ position: "absolute", left: desktop ? 96 : 60, right: desktop ? 96 : 60, top: desktop ? 70 : 180 }}>
        <Palavras
          palavras={[{ t: "A" }, { t: "Engine", c: cor.amarelo }, { t: "também" }, { t: "prepara" }, { t: "os" }, { t: "posts." }]}
          ini={e.texto - T.ini}
          tam={desktop ? 84 : 76}
          cor="#fff"
          maxW={desktop ? 1728 : 780}
        />
      </div>
    </Camada>
  );
};

// ============================ S11 · Fecho ============================
export const S11: React.FC<P<"S11">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const push = mix(1, 1.04, prog(frame, 0, dur - 0.8));
  const garimpou = e.garimpou - T.ini;
  const certo = e.certo - T.ini;
  const botao = e.botao - T.ini;
  const pulso = 1 + 0.05 * Math.sin(Math.PI * lin(frame, botao, 0.4));
  const aBotao = prog(frame, garimpou + 0.2, 0.3);
  const logoW = desktop ? 533 : 820;

  return (
    <Camada style={{ background: cor.amarelo, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: desktop ? 60 : 470,
          width: logoW,
          transform: `translateX(-50%) scale(${push})`,
        }}
      >
        <Imagem arq="logo-garimpou-certo-transparente.png" style={{ width: "100%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: desktop ? 390 : 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingInline: 60,
        }}
      >
        <Palavras
          palavras={[{ t: "Vem" }, { t: "garimpar" }, { t: "com" }, { t: "a" }, { t: "gente." }]}
          ini={e.texto - T.ini}
          tam={desktop ? 64 : 96}
          align="center"
          maxW={desktop ? 1500 : 860}
        />
      </div>
      {desktop ? (
        <Texto3D
          partes={[
            { t: "GARIMPOU.", ini: garimpou },
            { t: "CERTO.", c: cor.laranja, ini: certo - 0.1 },
          ]}
          ini={garimpou}
          x={960}
          y={545}
          tam={140}
          rotX={8}
          cor={cor.navy}
          profundidade={14}
          corProfundidade="rgba(28,36,52,.28)"
          durCena={dur}
        />
      ) : (
        <>
          <Texto3D
            partes={[{ t: "GARIMPOU.", ini: garimpou }]}
            ini={garimpou}
            x={540}
            y={1040}
            tam={170}
            rotX={8}
            cor={cor.navy}
            profundidade={12}
            corProfundidade="rgba(28,36,52,.28)"
            durCena={dur}
          />
          <Texto3D
            partes={[{ t: "CERTO.", c: cor.laranja, ini: certo - 0.1 }]}
            ini={certo - 0.1}
            x={540}
            y={1235}
            tam={210}
            rotX={8}
            cor={cor.navy}
            profundidade={14}
            corProfundidade="rgba(28,36,52,.28)"
            durCena={dur}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: desktop ? 660 : 1360,
          width: desktop ? 440 : 860,
          height: desktop ? 96 : 130,
          marginLeft: desktop ? -220 : -430,
          borderRadius: 16,
          background: cor.laranja,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: fonte.corpo,
          fontWeight: 700,
          fontSize: desktop ? 44 : 52,
          opacity: aBotao,
          transform: `scale(${(0.92 + 0.08 * aBotao) * pulso})`,
          boxShadow: "0 16px 40px rgba(28,36,52,.25)",
        }}
      >
        Ver ofertas
        <Seta tam={44} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: desktop ? 790 : 1520,
          textAlign: "center",
          color: cor.navy,
          fontFamily: fonte.corpo,
          fontWeight: 600,
          fontSize: desktop ? 36 : 44,
          opacity: prog(frame, garimpou + 0.5, 0.4),
        }}
      >
        Link disponível na descrição
      </div>
    </Camada>
  );
};

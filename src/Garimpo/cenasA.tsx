// S1 Gancho · S2 Problema · S3 Marca · S4 Vitrine · S5 Escolha
import { OffthreadVideo, useCurrentFrame } from "remotion";
import { Camada, Chip, Estrela, Imagem, Janela, Palavras } from "./componentes";
import { Texto3D } from "./Texto3D";
import { asset, cor, fonte, FPS, lin, mix, prog, sombra } from "./tema";
import type { Formato, Tempos80, Variante } from "./tempos";

type P<K extends keyof Tempos80> = { f: Formato; v: Variante; T: NonNullable<Tempos80[K]> };

const deslocamento = (frame: number, durSeg: number, ini = 0) => lin(frame, ini, durSeg - ini);

// ============================ S1 · Gancho ============================
export const S1: React.FC<P<"S1">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const drift = deslocamento(frame, dur, 0.3); // movimento só depois de 0,3 s: primeiro quadro estático
  const troca = e.troca - T.ini;
  const garimpo = e.garimpo - T.ini;
  const texto = e.texto - T.ini;
  const linha1 = 1 - prog(frame, troca, 0.2);

  const escala = desktop ? 0.6 : 0.62;
  const cw = 570 * escala;
  const ch = 1152 * escala;
  const rot = [-3, 0, 3];
  const cartoes = desktop
    ? [0, 1, 2].map((i) => ({ x: 960 + (i - 1) * 390 - cw / 2, y: 500 }))
    : [0, 1, 2].map((i) => ({ x: 540 - cw / 2 + (i - 1) * 290, y: 790 }));
  const arqs = ["card-produto.png", "card-produto-2.png", "card-produto-3.png"];

  return (
    <Camada style={{ background: cor.navy, overflow: "hidden" }}>
      <Camada style={{ opacity: 0.55, transform: `translateY(${-40 * drift}px) scale(1.08)` }}>
        <Imagem
          arq="home-achados-para-conhecer.png"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            minWidth: desktop ? 1920 : undefined,
            height: desktop ? undefined : 1920,
            transform: "translateX(-50%)",
            filter: "brightness(0.42) blur(18px)",
          }}
        />
      </Camada>
      <Texto3D
        partes={[{ t: "GARIMPO" }]}
        ini={0.9}
        x={desktop ? 960 : 540}
        y={desktop ? 600 : 620}
        tam={desktop ? 380 : 205}
        rotX={desktop ? 52 : 42}
        rotZ={-4}
        cor={cor.amarelo}
        contorno
        opacidade={0.9}
        preenche={garimpo}
        opacidadePreenche={0.95}
        profundidade={desktop ? 18 : 10}
        corProfundidade="rgba(0,0,0,.4)"
        durCena={dur}
        deriva={desktop ? -60 : -30}
      />
      {cartoes.map((c, i) => {
        const a = prog(frame, e.cartoes[i] - T.ini, 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y + (1 - a) * 60 - 50 * drift,
              width: cw,
              height: ch,
              opacity: a,
              transform: `rotate(${rot[i]}deg)`,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,.35)",
            }}
          >
            <Imagem arq={arqs[i]} style={{ width: "100%", height: "100%" }} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: desktop ? 220 : 190,
          display: "flex",
          justifyContent: "center",
          paddingInline: desktop ? 96 : 60,
        }}
      >
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", minHeight: 220 }}>
          <div style={{ position: "absolute", opacity: linha1 }}>
            <Palavras
              palavras={[{ t: "Achar" }, { t: "produto" }, { t: "bom" }, { t: "na" }, { t: "Shopee…" }]}
              ini={texto}
              tam={desktop ? 96 : 100}
              cor="#fff"
              align="center"
              maxW={desktop ? 1500 : 960}
            />
          </div>
          {frame >= troca * FPS && (
            <div style={{ position: "absolute" }}>
              <Palavras
                palavras={[
                  { t: "…é", ini: troca + 0.1 },
                  { t: "garimpo.", c: cor.amarelo, ini: garimpo, forte: true },
                ]}
                ini={troca + 0.1}
                tam={desktop ? 96 : 100}
                cor="#fff"
                align="center"
                maxW={desktop ? 1500 : 960}
              />
            </div>
          )}
        </div>
      </div>
    </Camada>
  );
};

// ============================ S2 · Problema ============================
export const S2: React.FC<P<"S2">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const blur = mix(12, 18, lin(frame, 0, 4.2));
  const sobe = lin(frame, 0, dur);
  const t1 = e.t1 - T.ini;
  const t2 = e.t2 - T.ini;

  const valores = ["4,1", "4,9", "3,8"];
  const pw = desktop ? 270 : 300;
  const gap = desktop ? 36 : 30;
  const baseX = (i: number) => (desktop ? 960 : 540) + (i - 1) * (pw + gap) - pw / 2;
  const y = desktop ? 640 : 1010;
  // 3 trocas: posições (0,1,2) → [1,0,2] → [1,2,0] → [0,2,1]
  const estados = [
    [0, 1, 2],
    [1, 0, 2],
    [1, 2, 0],
    [0, 2, 1],
  ];
  const marcos = e.pilulas.map((t) => t - T.ini);
  const posicaoFinal = (pilula: number) => {
    let p = estados[0].indexOf(pilula);
    for (let k = 0; k < 3; k++) {
      const prox = estados[k + 1].indexOf(pilula);
      const a = prog(frame, marcos[k], 0.3);
      if (a > 0) p = mix(estados[k].indexOf(pilula), prox, a);
    }
    return p;
  };

  return (
    <Camada style={{ background: cor.navy, overflow: "hidden" }}>
      <Camada style={{ opacity: 0.55, transform: `translateY(${-60 * sobe}px) scale(1.1)` }}>
        <Imagem
          arq="home-viralizou-na-shopee.png"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            minWidth: desktop ? 1920 : undefined,
            height: desktop ? undefined : 1920,
            transform: "translateX(-50%)",
            filter: `brightness(0.42) blur(${blur}px)`,
          }}
        />
      </Camada>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: desktop ? 190 : 190,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          paddingInline: 60,
        }}
      >
        <div>
          <Palavras
            palavras={[{ t: "Milhares" }, { t: "de" }, { t: "opções." }]}
            ini={t1}
            tam={desktop ? 96 : 100}
            cor="#fff"
            align="center"
          />
        </div>
        {(desktop || frame >= t2 * FPS) && (
          <div>
            <Palavras
              palavras={[{ t: "Pouca" }, { t: "certeza.", c: cor.amarelo }]}
              ini={t2}
              tam={desktop ? 96 : 100}
              cor="#fff"
              align="center"
            />
          </div>
        )}
      </div>
      {valores.map((v, i) => {
        const a = prog(frame, 0.4 + i * 0.15, 0.5);
        const p = posicaoFinal(i);
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: baseX(p),
              top: y - 56 * sobe + (1 - a) * 40,
              width: pw,
              height: desktop ? 112 : 128,
              borderRadius: 16,
              background: "rgba(255,255,255,.92)",
              boxShadow: sombra,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: a,
              fontFamily: fonte.titulo,
              fontWeight: 800,
              fontSize: desktop ? 56 : 64,
              color: cor.navy,
            }}
          >
            {v}
            <Estrela tam={52} />
          </div>
        );
      })}
    </Camada>
  );
};

// ============================ S3 · Marca ============================
export const S3: React.FC<P<"S3">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const reveal = e.reveal - T.ini;
  const subir = e.subir - T.ini;
  const bons = e.bons - T.ini;
  const precos = e.precos - T.ini;

  const wipeAmarelo = prog(frame, reveal, 0.23);
  const wipeClaro = prog(frame, reveal + 0.12, 0.23);
  const logoP = prog(frame, reveal, 0.5);
  const rise = prog(frame, subir, 0.6);
  const drift = lin(frame, reveal, dur - reveal);

  const logoW = desktop ? 640 : 900;
  const escalaFinal = desktop ? 0.7 : 0.6;
  const escala = mix(0.92, 1, logoP) * mix(1, escalaFinal, rise);
  const logoCy = desktop ? mix(540, 270, rise) : mix(960, 430, rise);

  return (
    <Camada style={{ background: cor.navy, overflow: "hidden" }}>
      <Camada style={{ background: cor.amarelo, clipPath: `inset(0 ${(1 - wipeAmarelo) * 100}% 0 0)` }} />
      <Camada style={{ background: cor.claro, clipPath: `inset(0 ${(1 - wipeClaro) * 100}% 0 0)`, overflow: "hidden" }}>
        <Camada style={{ opacity: 0.25, transform: `translateY(${-24 * drift}px)` }}>
          <Imagem
            arq="home-hero.png"
            style={{
              position: "absolute",
              left: "50%",
              top: desktop ? 0 : 200,
              width: desktop ? 1920 : undefined,
              height: desktop ? undefined : 1500,
              transform: "translateX(-50%)",
              filter: "blur(16px)",
            }}
          />
        </Camada>
      </Camada>
      <div
        style={{
          position: "absolute",
          left: (desktop ? 960 : 540) - logoW / 2,
          top: logoCy - (logoW * 941) / 1672 / 2,
          width: logoW,
          opacity: prog(frame, reveal, 0.2),
          transform: `scale(${escala})`,
          filter: `blur(${(1 - logoP) * 20}px)`,
        }}
      >
        <Imagem arq="logo-garimpou-certo-transparente.png" style={{ width: "100%" }} />
      </div>
      {desktop ? (
        <>
          <Texto3D
            partes={[{ t: "BONS" }, { t: "PRODUTOS." }]}
            ini={bons}
            x={960}
            y={585}
            tam={135}
            rotX={16}
            rotY={-6}
            cor={cor.navy}
            profundidade={16}
            corProfundidade={cor.amarelo}
            durCena={dur}
            deriva={40}
          />
          <Texto3D
            partes={[{ t: "PREÇOS" }, { t: "QUE" }, { t: "VALEM.", c: cor.laranja }]}
            ini={precos}
            x={960}
            y={765}
            tam={120}
            rotX={16}
            rotY={6}
            cor={cor.navy}
            profundidade={14}
            corProfundidade={cor.amarelo}
            durCena={dur}
            deriva={-40}
          />
        </>
      ) : (
        <>
          <Texto3D partes={[{ t: "BONS" }]} ini={bons} x={540} y={800} tam={190} rotX={12} cor={cor.navy} profundidade={14} corProfundidade={cor.amarelo} durCena={dur} />
          <Texto3D partes={[{ t: "PRODUTOS." }]} ini={bons + 0.2} x={540} y={975} tam={150} rotX={12} cor={cor.navy} profundidade={12} corProfundidade={cor.amarelo} durCena={dur} />
          <Texto3D partes={[{ t: "PREÇOS" }]} ini={precos} x={540} y={1170} tam={190} rotX={12} cor={cor.navy} profundidade={14} corProfundidade={cor.amarelo} durCena={dur} />
          <Texto3D
            partes={[{ t: "QUE" }, { t: "VALEM.", c: cor.laranja }]}
            ini={precos + 0.2}
            x={540}
            y={1345}
            tam={130}
            rotX={12}
            cor={cor.navy}
            profundidade={12}
            corProfundidade={cor.amarelo}
            durCena={dur}
          />
        </>
      )}
    </Camada>
  );
};

// ============================ S4 · Vitrine ============================
export const S4: React.FC<P<"S4">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const push = mix(1, 1.06, lin(frame, 0, dur));
  const drift = lin(frame, 0, dur);
  const rotulos = ["Centenas de achados", "Várias categorias", "Nota alta e vendas comprovadas"];
  const clipe = desktop ? "prep/s4-desktop-v2.mp4" : "prep/s4-mobile-v2.mp4";
  const win = desktop ? { x: 160, y: 90, w: 1600, h: 900, r: 24 } : { x: 280, y: 450, w: 520, h: 1126, r: 48 };

  return (
    <Camada style={{ background: cor.claro, overflow: "hidden" }}>
      <Camada style={{ opacity: 0.35, transform: `translateY(${-30 * drift}px) scale(1.1)` }}>
        <Imagem
          arq="home-queridinhos.png"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            minWidth: desktop ? 1920 : undefined,
            height: desktop ? undefined : 1920,
            transform: "translateX(-50%)",
            filter: "blur(20px)",
          }}
        />
      </Camada>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "50% 50%" }}>
        <Janela {...win} raio={win.r}>
          <OffthreadVideo
            src={asset(clipe)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Janela>
      </div>
      <div
        style={{
          position: "absolute",
          left: desktop ? 96 : 40,
          bottom: desktop ? 1080 - 880 : 1920 - 1560,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {rotulos.map((t, i) => (
          <div key={t} style={{ height: desktop ? 64 : 88, display: "flex" }}>
            <Chip texto={t} ini={e.chips[i] - T.ini} tam={desktop ? 28 : 38} altura={desktop ? 64 : 88} />
          </div>
        ))}
      </div>
    </Camada>
  );
};

// ============================ S5 · Escolha ============================
export const S5: React.FC<P<"S5">> = ({ f, T }) => {
  const frame = useCurrentFrame();
  const desktop = f === "desktop";
  const dur = T.fim - T.ini;
  const e = T.ev;
  const p = lin(frame, 0, dur);
  const rotulos = ["Em alta", "Maior desconto", "Melhor avaliados", "Até R$ 50"];

  // `mascara`: cobre (com a cor da página) o canto esquerdo abaixo de mascaraY — esconde um balão do site que aparece no recorte.
  const painel = (
    arq: string,
    srcW: number,
    srcH: number,
    cropY: number,
    cropH: number,
    esc: number,
    x: number,
    y: number,
    vel: number,
    dir: number,
    mascara?: { mascaraX: number; mascaraY: number },
  ) => {
    const w = srcW * esc;
    const h = cropH * esc;
    const dx = (p - 0.5) * 400 * vel * dir;
    return (
      <div
        key={arq}
        style={{
          position: "absolute",
          left: x + dx,
          top: y,
          width: w,
          height: h,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: sombra,
          background: cor.claro,
        }}
      >
        <Imagem arq={arq} style={{ position: "absolute", left: 0, top: -cropY * esc, width: srcW * esc, height: srcH * esc }} />
        {mascara && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: (mascara.mascaraY - cropY) * esc,
              width: mascara.mascaraX * esc,
              height: h,
              background: cor.claro,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Camada style={{ background: cor.claro, overflow: "hidden" }}>
      {desktop ? (
        <>
          {painel("home-por-onde-comecamos.png", 2400, 254, 0, 254, 0.65, 180, 262, 0.8, 1)}
          {painel("home-achados-para-conhecer.png", 2400, 3146, 90, 380, 0.65, 180, 444, 1.0, -1)}
          {painel("home-achadinhos-ate-30.png", 2400, 2544, 0, 370, 0.65, 180, 706, 1.2, 1, { mascaraX: 160, mascaraY: 188 })}
        </>
      ) : (
        <>
          <Janela x={40} y={450} w={480} h={1000} raio={28} style={{ background: "#fff" }}>
            <div style={{ position: "absolute", left: 0, top: -40 * p, width: 480, height: 1039 }}>
              <Imagem arq="m-04-colecoes.png" style={{ width: 480, height: 1039 }} />
            </div>
          </Janela>
          <Janela x={560} y={450} w={480} h={1000} raio={28} style={{ background: "#fff" }}>
            <div style={{ position: "absolute", left: 0, top: -40 + 40 * p, width: 480, height: 1039 }}>
              <Imagem arq="m-03-buscar.png" style={{ width: 480, height: 1039 }} />
            </div>
          </Janela>
        </>
      )}
      <div style={{ position: "absolute", left: desktop ? 96 : 60, top: desktop ? 48 : 180, right: 60 }}>
        <Palavras
          palavras={[{ t: "Escolha" }, { t: "pelo" }, { t: "que" }, { t: "importa.", c: cor.laranja }]}
          ini={e.titulo - T.ini}
          tam={desktop ? 84 : 100}
          maxW={desktop ? undefined : 960}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: desktop ? 96 : 40,
          top: desktop ? 160 : 1330,
          width: desktop ? 1500 : 1000,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {rotulos.map((t, i) => (
          <Chip key={t} texto={t} ini={e.chips[i] - T.ini} tam={desktop ? 28 : 38} altura={desktop ? 64 : 88} />
        ))}
      </div>
    </Camada>
  );
};

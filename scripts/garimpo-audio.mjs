// Mixagem de áudio dos vídeos Garimpou Certo (PROMPT-MONTAGEM-4-VIDEOS.md, seções 3, 6 e 7).
// Uso: node scripts/garimpo-audio.mjs 80|60 [--com-pitch]
// Gera public/garimpo/audio-80.wav ou audio-60.wav (48 kHz estéreo, ≈ -14 LUFS, TP ≤ -1 dBTP).
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..");
const SOM = process.env.GARIMPO_SOM ?? "C:/Users/iluuc/Documents/garimpo-video-marketing/08-som";
const versao = process.argv[2];
// Tonalidade da música não é conclusiva (A menor ≈ D maior): por padrão +0 st em tudo (fallback da seção 3.2). --com-pitch aplica os degraus.
const semPitch = !process.argv.includes("--com-pitch");
if (!["80", "60"].includes(versao)) throw new Error("Use: node scripts/garimpo-audio.mjs 80|60");

const SR = 48000;
const DURACAO = versao === "80" ? 75.5 : 60; // versão longa sem a cena de posts (termina em 75,5 s)
const voz = JSON.parse(readFileSync(join(raiz, "src/Garimpo/voz.json"), "utf8"));
const linhaVoz = versao === "80" ? voz.linha80 : voz.linha60;
const tmp = join(tmpdir(), `garimpo-audio-${versao}`);
mkdirSync(tmp, { recursive: true });

const MONO = new Set(["bloco_a.mp3", "bloco_b.mp3", "bloco_c.mp3", "bolha_2.mp3"]);
const dB = (x) => 10 ** (x / 20);

// ---------- ffmpeg helpers ----------
const ff = (args, opts = {}) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-nostdin", ...args], { maxBuffer: 1 << 30, ...opts });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${r.stderr?.toString()}\n${args.join(" ")}`);
  return r.stdout;
};
// Decodifica para Float32 estéreo intercalado a 48 kHz.
const decodificar = (arquivo, { ss, t, filtros = [] } = {}) => {
  const args = [];
  if (ss !== undefined) args.push("-ss", String(ss));
  if (t !== undefined) args.push("-t", String(t));
  args.push("-i", join(SOM, arquivo));
  const cadeia = [];
  if (MONO.has(arquivo)) cadeia.push("pan=stereo|c0=c0|c1=c0");
  cadeia.push(...filtros);
  if (cadeia.length) args.push("-af", cadeia.join(","));
  args.push("-f", "f32le", "-ar", String(SR), "-ac", "2", "-");
  const buf = ff(args);
  return new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const processarBruto = (dados, filtros) => {
  const arq = join(tmp, `bruto-${Math.random().toString(36).slice(2)}.raw`);
  writeFileSync(arq, Buffer.from(dados.buffer, dados.byteOffset, dados.byteLength));
  const buf = ff(["-f", "f32le", "-ar", String(SR), "-ac", "2", "-i", arq, "-af", filtros, "-f", "f32le", "-ar", String(SR), "-ac", "2", "-"]);
  return new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

const N = Math.round(DURACAO * SR);
const novoBus = () => new Float32Array(N * 2);
const somar = (bus, amostras, tSeg, ganho = 1) => {
  const ini = Math.round(tSeg * SR);
  const n = amostras.length / 2;
  for (let i = 0; i < n; i++) {
    const j = ini + i;
    if (j < 0 || j >= N) continue;
    bus[j * 2] += amostras[i * 2] * ganho;
    bus[j * 2 + 1] += amostras[i * 2 + 1] * ganho;
  }
};

// ---------- 1) VOZ ----------
const busVoz = novoBus();
const faixasVoz = []; // [início, fim] em segundos
for (const [id, tIni, taxa = 1] of linhaVoz) {
  const tr = voz.trechos[id];
  const dur = (tr.out - tr.in) / taxa; // duração já com a aceleração leve (atempo preserva o tom)
  const dados = decodificar(tr.arquivo, {
    filtros: [
      `atrim=start=${tr.in}:end=${tr.out}`,
      "asetpts=N/SR/TB",
      "highpass=f=80",
      ...(taxa !== 1 ? [`atempo=${taxa}`] : []),
      `afade=t=in:st=0:d=0.03`,
      `afade=t=out:st=${(dur - 0.03).toFixed(3)}:d=0.03`,
    ],
  });
  somar(busVoz, dados, tIni);
  faixasVoz.push([tIni, tIni + dur, id]);
}
faixasVoz.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < faixasVoz.length; i++) {
  if (faixasVoz[i][0] < faixasVoz[i - 1][1]) throw new Error(`Voz sobreposta: ${faixasVoz[i - 1][2]} / ${faixasVoz[i][2]}`);
}
// compressor leve 3:1, limiar ≈ -20 dB (acompressor usa limiar linear)
let vozComp = processarBruto(busVoz, "acompressor=threshold=0.1:ratio=3:attack=8:release=120:makeup=1");
// ganho para média ≈ -18 dBFS RMS (medida só onde há fala)
{
  let soma = 0, cont = 0;
  for (const [a, b] of faixasVoz) {
    for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) {
      soma += vozComp[i * 2] ** 2 + vozComp[i * 2 + 1] ** 2;
      cont += 2;
    }
  }
  const rms = 10 * Math.log10(soma / cont);
  const g = -18 - rms;
  console.log(`voz: RMS ${rms.toFixed(2)} dBFS → ganho ${g.toFixed(2)} dB`);
  const gl = dB(g);
  for (let i = 0; i < vozComp.length; i++) vozComp[i] *= gl;
  vozComp = processarBruto(vozComp, "alimiter=limit=0.891:attack=3:release=50:level=disabled");
}

// ---------- 2) MÚSICA ----------
const srcIni = versao === "80" ? 0 : 5;
const musica = decodificar("musica_animada_background.mp3", { ss: srcIni, t: DURACAO });
const musicaLp = processarBruto(musica, "lowpass=f=1200:poles=2");
const dipLp = versao === "80" ? [49.2, 49.8] : [38.0, 38.6]; // passa-baixa na entrada da Engine

// Envelope de ganho (dB): -17 com voz; -11 nos vãos > 0,8 s. Ataque 150 ms, soltura 400 ms.
const alvoMusica = new Float32Array(N).fill(-17);
for (let k = 0; k <= faixasVoz.length; k++) {
  const ini = k === 0 ? 0 : faixasVoz[k - 1][1];
  const fim = k === faixasVoz.length ? DURACAO : faixasVoz[k][0];
  if (fim - ini > 0.8) for (let i = Math.round(ini * SR); i < Math.round(fim * SR); i++) alvoMusica[i] = -11;
}
const envDb = new Float32Array(N);
{
  let y = alvoMusica[0];
  const ca = 1 - Math.exp(-1 / (0.15 * SR)); // ataque (descendo)
  const cr = 1 - Math.exp(-1 / (0.4 * SR)); // soltura (subindo)
  for (let i = 0; i < N; i++) {
    const alvo = alvoMusica[i];
    y += (alvo - y) * (alvo < y ? ca : cr);
    envDb[i] = y;
  }
}
const busMusica = novoBus();
{
  const fadeIni = DURACAO - 2.5;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    // peso do passa-baixa: sobe em 0,1 s, mantém, volta em 0,5 s
    let w = 0;
    if (t >= dipLp[0] && t < dipLp[0] + 0.1) w = (t - dipLp[0]) / 0.1;
    else if (t >= dipLp[0] + 0.1 && t < dipLp[1]) w = 1;
    else if (t >= dipLp[1] && t < dipLp[1] + 0.5) w = 1 - (t - dipLp[1]) / 0.5;
    const fade = t > fadeIni ? Math.max(0, 1 - (t - fadeIni) / 2.5) : 1;
    const g = dB(envDb[i]) * fade;
    for (let c = 0; c < 2; c++) {
      const idx = i * 2 + c;
      busMusica[idx] = (musica[idx] * (1 - w) + musicaLp[idx] * w) * g;
    }
  }
}

// ---------- 3) EFEITOS ----------
// [T do arquivo, tipo, opções]. T = onde iniciar o arquivo (tabelas 6.2 e 7.3).
const W = (t, suave = false) => [t, "whoosh", { ganho: suave ? -10 : -8 }];
const B1 = (t) => [t, "bolha_1", { ganho: -6 }];
const B2 = (t, st = 0) => [t, "bolha_2", { ganho: 2, st }];
const RISER = (t, st = 0) => [t, "riser", { ganho: 4, st }];
const HIT = (t, len, fade, ganho) => [t, "hit", { ganho, len, fade }];

const sfx80 = [
  B2(3.55), W(4.65, true), B2(5.9, 0), B2(6.25, -2), B2(6.6, -4),
  RISER(9.09), HIT(10.19, 1.8, 0.5, -9), B1(10.7), B2(12.1), B2(14.8, 3),
  W(17.65), B1(19.2), B1(21.0), B1(22.4), W(26.85),
  B2(27.4, 0), B2(28.6, 2), B2(30.0, 4), B2(31.5, 6),
  W(34.05), B1(35.2), B2(36.5, 0), B2(36.8, 1), B2(37.1, 2), B2(37.4, 3),
  B2(40.6), B1(41.4), W(42.85), B2(45.6), B1(46.5), W(49.35),
  B2(52.5, 0), B2(56.55, 2), B2(57.6, 4), B2(58.9, 5), B2(61.1, 7),
  RISER(61.0, -3), HIT(62.1, 1.2, 0.4, -11), W(63.85),
  B1(64.2), B1(65.4), B1(67.5), B1(68.9), W(70.05, true),
  HIT(72.5, 2.6, 0.9, -6), // impacto em 73,0: "Certo."
];
const sfx60 = [
  B2(3.05), W(3.65, true), B2(4.7, 0), B2(5.0, -2), B2(5.3, -4),
  RISER(6.55), HIT(7.65, 1.8, 0.5, -9), B1(8.15), B2(9.24, 0), B2(11.71, 3),
  W(13.95), B1(15.5), B1(17.3), B1(18.7), W(23.15), B1(24.3),
  B2(25.6, 0), B2(25.9, 1), B2(26.2, 2), B2(26.5, 3), B2(29.7), B1(30.5),
  W(31.95), B2(34.7), B1(35.6), W(38.15),
  B2(41.25, 0), B2(45.3, 2), B2(46.3, 4), B2(47.6, 5), B2(49.9, 7),
  RISER(49.8, -3), HIT(50.9, 1.2, 0.4, -11), W(52.35),
  B1(52.7), B1(53.0), B1(54.1), B1(55.0), W(55.65),
  HIT(58.25, 1.7, 0.9, -6), // impacto em 58,75: "Certo."
];
const sfx = versao === "80" ? sfx80 : sfx60;

const cacheSfx = new Map();
const gerarSfx = (tipo, o) => {
  const chave = JSON.stringify([tipo, o.st ?? 0, o.len ?? 0, o.fade ?? 0]);
  if (cacheSfx.has(chave)) return cacheSfx.get(chave);
  const st = semPitch ? 0 : o.st ?? 0;
  const razao = 2 ** (st / 12);
  let dados;
  if (tipo === "whoosh") dados = decodificar("whoosh.mp3");
  else if (tipo === "bolha_1") dados = decodificar("bolha_1.mp3", { filtros: ["atrim=end=0.40", "asetpts=N/SR/TB", "afade=t=out:st=0.35:d=0.05"] });
  else if (tipo === "bolha_2") {
    const f = st === 0 ? [] : [`asetrate=${Math.round(SR * razao)}`, `aresample=${SR}`];
    dados = decodificar("bolha_2.mp3", { filtros: f });
  } else if (tipo === "hit") {
    dados = decodificar("hit.mp3", {
      filtros: [`atrim=end=${o.len}`, "asetpts=N/SR/TB", `afade=t=out:st=${(o.len - o.fade).toFixed(3)}:d=${o.fade}`],
    });
  } else if (tipo === "riser") {
    const f = ["atrim=end=2.0", "asetpts=N/SR/TB"];
    if (st !== 0) f.push(`rubberband=pitch=${razao.toFixed(5)}:transients=crisp`);
    f.push("afade=t=out:st=1.85:d=0.15");
    dados = decodificar("riser.mp3", { filtros: f });
  }
  cacheSfx.set(chave, dados);
  return dados;
};
const busSfx = novoBus();
for (const [t, tipo, o] of sfx) somar(busSfx, gerarSfx(tipo, o), t, dB(o.ganho));

// ---------- 4) SOMA + MASTER ----------
const mix = novoBus();
for (let i = 0; i < mix.length; i++) mix[i] = vozComp[i] + busMusica[i] + busSfx[i];

// estatísticas auxiliares (nível médio sob a voz)
const rmsDe = (bus, faixas) => {
  let s = 0, c = 0;
  for (const [a, b] of faixas) for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { s += bus[i * 2] ** 2 + bus[i * 2 + 1] ** 2; c += 2; }
  return 10 * Math.log10(s / c);
};
console.log(`música sob a voz: RMS ${rmsDe(busMusica, faixasVoz).toFixed(2)} dBFS | voz: ${rmsDe(vozComp, faixasVoz).toFixed(2)} dBFS`);

const medir = (arquivo) => {
  const r = spawnSync("ffmpeg", ["-nostdin", "-hide_banner", "-i", arquivo, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 });
  const s = r.stderr;
  const resumo = s.slice(s.lastIndexOf("Summary:"));
  const I = parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(resumo)[1]);
  const TP = parseFloat(/Peak:\s+(-?[\d.]+) dBFS/.exec(resumo)[1]);
  return { I, TP };
};
const bruto = join(tmp, "mix.raw");
writeFileSync(bruto, Buffer.from(mix.buffer));
const saida = join(raiz, `public/garimpo/audio-${versao}.wav`);
mkdirSync(dirname(saida), { recursive: true });
let ganhoDb = 0;
const medirMix = () => {
  const r = spawnSync("ffmpeg", ["-nostdin", "-hide_banner", "-f", "f32le", "-ar", String(SR), "-ac", "2", "-i", bruto, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 });
  const s = r.stderr;
  const resumo = s.slice(s.lastIndexOf("Summary:"));
  return parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(resumo)[1]);
};
ganhoDb = -14 - medirMix();
for (let it = 0; it < 4; it++) {
  ff(["-f", "f32le", "-ar", String(SR), "-ac", "2", "-i", bruto, "-af", `volume=${ganhoDb.toFixed(3)}dB,alimiter=limit=0.84:attack=4:release=60:level=disabled`, "-c:a", "pcm_s24le", "-y", saida]);
  const m = medir(saida);
  console.log(`master it${it}: I=${m.I} LUFS  TP=${m.TP} dBTP  (ganho ${ganhoDb.toFixed(2)} dB)`);
  if (Math.abs(m.I + 14) <= 0.3 && m.TP <= -1.0) break;
  ganhoDb += -14 - m.I;
}
// Cópia com nome versionado: o Studio/navegador faz cache por URL, então um nome fixo tocava áudio antigo contra o visual novo.
import { copyFileSync, readdirSync, unlinkSync } from "node:fs";
const versaoNome = `audio-${versao}-${Date.now().toString(36)}.wav`;
copyFileSync(saida, join(dirname(saida), versaoNome));
for (const f of readdirSync(dirname(saida))) {
  if (new RegExp(`^audio-${versao}-[a-z0-9]+\.wav$`).test(f) && f !== versaoNome) unlinkSync(join(dirname(saida), f));
}
const manifestoPath = join(raiz, "src/Garimpo/audioManifest.json");
const manifesto = existsSync(manifestoPath) ? JSON.parse(readFileSync(manifestoPath, "utf8")) : {};
manifesto[versao] = versaoNome;
writeFileSync(manifestoPath, JSON.stringify(manifesto, null, 2) + "\n");
console.log("ok →", saida, "| studio:", versaoNome);

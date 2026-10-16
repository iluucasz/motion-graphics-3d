// Checklist de validação (seção 12 do PROMPT-MONTAGEM) sobre os 4 arquivos de saída + miniaturas.
// Uso: node scripts/garimpo-validar.mjs
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SAIDA = process.env.GARIMPO_SAIDA ?? "C:/Users/iluuc/Documents/garimpo-video-marketing/09-saida";
const ALVOS = [
  { arq: "garimpo-desktop-1m15.mp4", w: 1920, h: 1080, dur: 75.5, minMbps: 12 },
  { arq: "garimpo-desktop-1m00.mp4", w: 1920, h: 1080, dur: 60, minMbps: 12 },
  { arq: "garimpo-mobile-1m15.mp4", w: 1080, h: 1920, dur: 75.5, minMbps: 10 },
  { arq: "garimpo-mobile-1m00.mp4", w: 1080, h: 1920, dur: 60, minMbps: 10 },
];

const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 28, ...opts });
const probe = (f) => JSON.parse(run("ffprobe", ["-v", "error", "-show_format", "-show_streams", "-of", "json", f]).stdout);
const frameRgb = (f, t, w, h) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-ss", String(t), "-i", f, "-frames:v", "1", "-vf", `scale=${w / 4}:${h / 4}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 26 });
  return r.stdout;
};
const diff = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
};

let falhas = 0;
const ok = (c, msg) => {
  if (!c) falhas++;
  console.log(`  ${c ? "OK   " : "FALHA"} ${msg}`);
};

for (const a of ALVOS) {
  const f = join(SAIDA, a.arq);
  console.log(`\n${a.arq}`);
  if (!existsSync(f)) {
    ok(false, "arquivo não existe");
    continue;
  }
  const p = probe(f);
  const v = p.streams.find((s) => s.codec_type === "video");
  const au = p.streams.find((s) => s.codec_type === "audio");
  const dur = parseFloat(p.format.duration);
  const mbps = parseInt(p.format.bit_rate, 10) / 1e6;
  ok(Math.abs(dur - a.dur) < 0.005, `duração do arquivo ${dur.toFixed(3)} s (alvo ${a.dur},000)`);
  ok(Math.abs(parseFloat(v.duration) - a.dur) < 0.04, `duração do vídeo ${parseFloat(v.duration).toFixed(3)} s`);
  ok(Math.abs(parseFloat(au.duration) - a.dur) < 0.05, `duração do áudio ${parseFloat(au.duration).toFixed(3)} s`);
  ok(v.width === a.w && v.height === a.h, `resolução ${v.width}×${v.height}`);
  ok(v.r_frame_rate === "30/1", `fps ${v.r_frame_rate}`);
  ok(v.codec_name === "h264" && /high/i.test(v.profile), `codec ${v.codec_name} ${v.profile}, ${v.pix_fmt}`);
  ok(mbps >= a.minMbps, `bitrate total ${mbps.toFixed(1)} Mbps (mín. ${a.minMbps})`);
  ok(au.codec_name === "aac" && au.sample_rate === "48000" && au.channels === 2, `áudio ${au.codec_name} ${au.sample_rate} Hz ${au.channels} ch, ${(parseInt(au.bit_rate, 10) / 1000).toFixed(0)} kbps`);

  const e = run("ffmpeg", ["-nostdin", "-hide_banner", "-i", f, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]).stderr;
  const resumo = e.slice(e.lastIndexOf("Summary:"));
  const I = parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(resumo)[1]);
  const TP = parseFloat(/Peak:\s+(-?[\d.]+) dBFS/.exec(resumo)[1]);
  ok(Math.abs(I + 14) <= 0.6, `loudness integrado ${I} LUFS (alvo −14)`);
  ok(TP <= -1.0, `true peak ${TP} dBTP (máx. −1)`);

  const bd = run("ffmpeg", ["-nostdin", "-hide_banner", "-i", f, "-vf", "blackdetect=d=0.05:pix_th=0.05", "-an", "-f", "null", "-"]).stderr;
  const pretos = (bd.match(/black_start/g) ?? []).length;
  ok(pretos === 0, `quadros pretos detectados: ${pretos}`);

  // primeiro e último quadros estáticos por ≥ 0,3 s
  const ini0 = frameRgb(f, 0, a.w, a.h);
  const ini1 = frameRgb(f, 0.3, a.w, a.h);
  const fim0 = frameRgb(f, a.dur - 0.34, a.w, a.h);
  const fim1 = frameRgb(f, a.dur - 0.05, a.w, a.h);
  ok(diff(ini0, ini1) < 0.5, `primeiro quadro estático por 0,3 s (Δ ${diff(ini0, ini1).toFixed(3)})`);
  ok(diff(fim0, fim1) < 0.5, `último quadro estático por 0,3 s (Δ ${diff(fim0, fim1).toFixed(3)})`);
}

// miniaturas (frame S3, T 11,8 da versão de 1m20)
const miniaturas = [
  { de: "garimpo-desktop-1m15.mp4", para: "miniatura-desktop-1280x720.png", vf: "scale=1280:720" },
  { de: "garimpo-mobile-1m15.mp4", para: "miniatura-mobile-1080x1350.png", vf: "crop=1080:1350:0:285" },
];
console.log("\nminiaturas");
for (const m of miniaturas) {
  const r = run("ffmpeg", ["-v", "error", "-y", "-ss", "11.8", "-i", join(SAIDA, m.de), "-frames:v", "1", "-vf", m.vf, join(SAIDA, m.para)]);
  ok(r.status === 0 && existsSync(join(SAIDA, m.para)), m.para);
}

console.log(falhas === 0 ? "\nTudo OK." : `\n${falhas} verificação(ões) com falha.`);
process.exitCode = falhas === 0 ? 0 : 1;

// Gera os clipes em câmera lenta usados pelas cenas S4, S6 (mobile) e S7. Só muda a velocidade; o conteúdo é o da gravação.
// Sem interpolação de quadros: testamos minterpolate e ele "duplica" o texto em rolagem (fantasmas).
// Uso: node scripts/garimpo-prep.mjs
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(raiz, "public/garimpo");
const saida = join(pub, "prep");
mkdirSync(saida, { recursive: true });

const FPS_OUT = 30;
const XF = 0.2; // fusão de 6 frames a 30 fps

// trecho = [arquivo, srcIni, srcFim, duracaoNoClip]
const clip = (nome, trechos, tamanho) => {
  const entradas = [];
  const filtros = [];
  trechos.forEach(([arq, ini, fim, dur], i) => {
    entradas.push("-i", join(pub, arq));
    if (fim === null) {
      // quadro congelado em `ini` (a rolagem real a 0,1× viraria "stop-motion")
      filtros.push(`[${i}:v]trim=start=${ini}:end=${ini + 0.05},setpts=PTS-STARTPTS,fps=${FPS_OUT},tpad=stop_mode=clone:stop_duration=${dur.toFixed(3)},trim=duration=${dur.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS_OUT},setsar=1[p${i}]`);
      return;
    }
    const f = dur / (fim - ini);
    // tpad+trim garante a duração nominal do trecho
    filtros.push(`[${i}:v]trim=start=${ini}:end=${fim},setpts=(PTS-STARTPTS)*${f.toFixed(5)},fps=${FPS_OUT},tpad=stop_mode=clone:stop_duration=1,trim=duration=${dur.toFixed(3)},setpts=PTS-STARTPTS,fps=${FPS_OUT},setsar=1[p${i}]`);
  });
  let ult = "p0";
  let acumulado = trechos[0][3];
  for (let i = 1; i < trechos.length; i++) {
    const offset = (acumulado - XF).toFixed(3);
    filtros.push(`[${ult}][p${i}]xfade=transition=fade:duration=${XF}:offset=${offset}[x${i}]`);
    ult = `x${i}`;
    acumulado += trechos[i][3] - XF;
  }
  filtros.push(`[${ult}]tpad=stop_mode=clone:stop_duration=0.6[saida]`);
  const args = ["-v", "error", "-y", ...entradas, "-filter_complex", filtros.join(";"), "-map", "[saida]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", String(FPS_OUT), join(saida, `${nome}-v2.mp4`)];
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${nome}: ${r.stderr}`);
  console.log(`${nome}-v2.mp4  ≈ ${acumulado.toFixed(2)} s`);
  return acumulado;
};

const only = process.argv[2];
const jobs = {
  // S4 desktop: 2 partes limpas (sem hero com "440…" e sem o botão "Ver os 440 produtos…"), a 0,52×
  "s4-desktop": () => clip("s4-desktop", [
    ["home-rolagem-desktop.webm", 9.2, 11.4, 2.2 / 0.52],
    ["home-rolagem-desktop.webm", 13.0, 15.7, 2.7 / 0.52],
  ]),
  // S4 mobile: 5,0 → 8,8 (antes de aparecer o botão do catálogo), esticado a 9,2 s
  "s4-mobile": () => clip("s4-mobile", [["home-rolagem-mobile.webm", 5.0, 8.8, 9.25]]),
  // S7 desktop: rolagem real (src 8,4 → 11,6) e depois quadro parado em 11,6 (selo e Índices em posição fixa)
  "s7-desktop": () => clip("s7-desktop", [
    ["comparador-desktop.webm", 8.4, 11.6, 3.3 + XF],
    ["comparador-desktop.webm", 11.6, null, 3.6],
  ]),
  // S6 mobile: preço (4,2→5,0 em movimento) · gráfico real (quadro em 7,2) · Índice 84 (quadro em 6,3)
  "s6-mobile": () => clip("s6-mobile", [
    ["produto-rolagem-mobile.webm", 4.2, 5.0, 2.1 + XF],
    ["produto-rolagem-mobile.webm", 7.2, null, 3.2 + XF],
    ["produto-rolagem-mobile.webm", 6.3, null, 3.5],
  ]),
};
for (const [nome, job] of Object.entries(jobs)) if (!only || only === nome) job();

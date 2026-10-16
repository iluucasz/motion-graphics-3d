// Renderiza os vídeos Garimpou Certo (Remotion, sem áudio) e faz o mux com a mixagem (ffmpeg).
// Uso: node scripts/garimpo-render.mjs [GarimpoD80|GarimpoD60|GarimpoM80|GarimpoM60 ...]
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = process.env.GARIMPO_SAIDA ?? "C:/Users/iluuc/Documents/garimpo-video-marketing/09-saida";
const tmp = join(raiz, "out/garimpo");
mkdirSync(tmp, { recursive: true });
mkdirSync(SAIDA, { recursive: true });

const ALVOS = {
  GarimpoD80: { arquivo: "garimpo-desktop-1m15.mp4", audio: "audio-80.wav", dur: 75.5, bitrate: "16M" },
  GarimpoD60: { arquivo: "garimpo-desktop-1m00.mp4", audio: "audio-60.wav", dur: 60, bitrate: "16M" },
  GarimpoM80: { arquivo: "garimpo-mobile-1m15.mp4", audio: "audio-80.wav", dur: 75.5, bitrate: "12M" },
  GarimpoM60: { arquivo: "garimpo-mobile-1m00.mp4", audio: "audio-60.wav", dur: 60, bitrate: "12M" },
};

const pedidos = process.argv.slice(2);
const lista = pedidos.length ? pedidos : Object.keys(ALVOS);

for (const id of lista) {
  const a = ALVOS[id];
  if (!a) throw new Error(`Composição desconhecida: ${id}`);
  const video = join(tmp, `${id}.mp4`);
  console.log(`\n=== ${id}: render ===`);
  let r = spawnSync(
    "npx",
    ["remotion", "render", id, video, "--muted", "--codec=h264", `--video-bitrate=${a.bitrate}`, "--jpeg-quality=95", "--pixel-format=yuv420p"],
    { cwd: raiz, stdio: "inherit", shell: true },
  );
  if (r.status !== 0) throw new Error(`render falhou: ${id}`);

  const saida = join(SAIDA, a.arquivo);
  console.log(`=== ${id}: mux → ${saida} ===`);
  r = spawnSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      "-i", video,
      "-i", join(raiz, "public/garimpo", a.audio),
      "-map", "0:v:0", "-map", "1:a:0",
      "-c:v", "copy",
      "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-ac", "2",
      "-t", String(a.dur),
      "-movflags", "+faststart",
      saida,
    ],
    { stdio: "inherit" },
  );
  if (r.status !== 0 || !existsSync(saida)) throw new Error(`mux falhou: ${id}`);
}
console.log("\nfeito.");

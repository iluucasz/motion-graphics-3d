import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { formatoSchema } from "../compartilhado/formato";

const tema = z.enum(["escuro", "claro"]);
const duracao = z.number().min(0.5);

// Cada cena é um bloco independente: dá para reordenar, duplicar ou
// remover pelo painel do Remotion Studio.
export const cenaSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("titulo"),
    tema,
    duracaoEmSegundos: duracao,
    texto: z.string(),
    destaque: z.string(), // trecho final em fonte grande na cor de destaque
  }),
  z.object({
    tipo: z.literal("chat"),
    tema,
    duracaoEmSegundos: duracao,
    saudacao: z.string(),
    mensagem: z.string(),
  }),
  z.object({
    tipo: z.literal("selos"),
    tema,
    duracaoEmSegundos: duracao,
    itens: z.array(z.string()),
  }),
  z.object({
    tipo: z.literal("timeline"),
    tema,
    duracaoEmSegundos: duracao,
    faixas: z.array(z.string()),
  }),
  z.object({
    tipo: z.literal("codigo"),
    tema,
    duracaoEmSegundos: duracao,
    arquivo: z.string(),
    linhas: z.array(z.string()),
  }),
  z.object({
    tipo: z.literal("metricas"),
    tema,
    duracaoEmSegundos: duracao,
    usuario: z.string(),
    visualizacoes: z.number().min(0),
    curtidas: z.number().min(0),
    comentarios: z.number().min(0),
  }),
  z.object({
    tipo: z.literal("arquivo"),
    tema,
    duracaoEmSegundos: duracao,
    titulo: z.string(),
    textoNoVideo: z.string(),
    nomeArquivo: z.string(),
  }),
  z.object({
    tipo: z.literal("logo"),
    tema,
    duracaoEmSegundos: duracao,
  }),
]);

export const uiStorySchema = z.object({
  formato: formatoSchema,
  marca: z.string(),
  corDestaque: zColor(),
  cenas: z.array(cenaSchema),
});

export type Cena = z.infer<typeof cenaSchema>;
export type UIStoryProps = z.infer<typeof uiStorySchema>;

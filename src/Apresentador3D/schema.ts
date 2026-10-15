import { z } from "zod";

export const apresentador3DSchema = z.object({
  // Arquivo em public/ (ex.: "apresentador.mp4"). Vazio = fundo de placeholder.
  videoApresentador: z.string(),
  corDestaque: z.string(),
  // Textos cinéticos que entram no segundo em que o apresentador fala o conceito.
  falas: z.array(
    z.object({
      texto: z.string(),
      inicioEmSegundos: z.number().min(0),
      duracaoEmSegundos: z.number().min(0.2),
    }),
  ),
});

export type Apresentador3DProps = z.infer<typeof apresentador3DSchema>;

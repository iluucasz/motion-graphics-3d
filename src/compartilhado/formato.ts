import { z } from "zod";

export const formatoSchema = z.enum(["9:16", "16:9"]);
export type Formato = z.infer<typeof formatoSchema>;

export const dimensoesDoFormato = (formato: Formato) =>
  formato === "16:9"
    ? { width: 1920, height: 1080 }
    : { width: 1080, height: 1920 };

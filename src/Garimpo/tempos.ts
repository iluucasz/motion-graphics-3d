// Linha do tempo das duas versões (PROMPT-MONTAGEM, seções 6 e 7). Todos os tempos em segundos, absolutos.
import voz from "./voz.json";

export type Variante = "80" | "60";
export type Formato = "desktop" | "mobile";

// "80" = versão longa (sem a cena de posts, por pedido: termina em 75,5 s); "60" = versão de 1 minuto.
export const DURACAO: Record<Variante, number> = { "80": 75.5, "60": 60 };

export type Cena<E> = { ini: number; fim: number; ev: E };

export type Tempos80 = {
  S1: Cena<{ cartoes: [number, number, number]; texto: number; troca: number; garimpo: number }>;
  S2?: Cena<{ pilulas: [number, number, number]; t1: number; t2: number }>;
  S3: Cena<{ reveal: number; subir: number; bons: number; precos: number }>;
  S4: Cena<{ chips: [number, number, number] }>;
  S5?: Cena<{ titulo: number; chips: [number, number, number, number] }>;
  S6: Cena<{
    punch: number;
    titulo: number;
    barras: [number, number, number, number];
    destaque: number;
    contagem: [number, number];
  }>;
  S7: Cena<{ texto: number; punch: number; indices: number }>;
  S8: Cena<{
    titulo: number;
    funil: [number, number, number, number, number, number];
    insercao: [number, number];
    rolagem: number;
    sub: number;
  }>;
  S9: Cena<{ selos: [number, number, number]; titulo: number }>;
  S10?: Cena<{ texto: number }>;
  S11: Cena<{ texto: number; garimpou: number; certo: number; botao: number }>;
};

const t80: Tempos80 = {
  S1: { ini: 0, fim: 4.8, ev: { cartoes: [0.3, 0.5, 0.8], texto: 0.7, troca: 3.3, garimpo: 3.55 } },
  S2: { ini: 4.8, fim: 10.6, ev: { pilulas: [5.9, 6.25, 6.6], t1: 5.0, t2: 7.4 } },
  // logo assenta na palavra "Garimpou" (10,7 s), não no começo da frase
  S3: { ini: 10.6, fim: 17.8, ev: { reveal: 10.7, subir: 12.0, bons: 12.1, precos: 14.8 } },
  S4: { ini: 17.8, fim: 27.0, ev: { chips: [19.2, 21.0, 22.4] } },
  S5: { ini: 27.0, fim: 34.2, ev: { titulo: 27.3, chips: [27.4, 28.6, 30.0, 31.5] } },
  S6: {
    ini: 34.2,
    fim: 43.0,
    ev: { punch: 35.2, titulo: 36.4, barras: [36.5, 36.8, 37.1, 37.4], destaque: 38.0, contagem: [40.6, 41.4] },
  },
  S7: { ini: 43.0, fim: 49.5, ev: { texto: 45.6, punch: 46.5, indices: 47.5 } },
  S8: {
    ini: 49.5,
    fim: 64.0,
    ev: { titulo: 49.9, funil: [52.5, 56.55, 57.6, 58.9, 61.1, 62.6], insercao: [52.0, 55.5], rolagem: 55.8, sub: 62.6 },
  },
  S9: { ini: 64.0, fim: 70.2, ev: { selos: [64.2, 65.4, 67.5], titulo: 68.9 } },
  // S10 (posts) removida a pedido: do S9 vai direto ao fecho.
  S11: { ini: 70.2, fim: 75.5, ev: { texto: 70.4, garimpou: 72.2, certo: 73.0, botao: 73.0 } },
};

// Versão de 1 minuto: S2 ("Milhares de opções") reintroduzida; S9 cortada após "Você compra direto na Shopee." (≈51,8 s
// da versão anterior) e vai direto ao "Vem garimpar".
const t60: Tempos80 = {
  // bloco A da locução inteiro (5 falas) a 1,14×: abertura 0–3,8 · problema 3,8–7,2 · marca 7,2–14,1
  S1: { ini: 0, fim: 3.8, ev: { cartoes: [0.3, 0.5, 0.8], texto: 0.5, troca: 2.75, garimpo: 3.05 } },
  S2: { ini: 3.8, fim: 8.05, ev: { pilulas: [4.7, 5.0, 5.3], t1: 4.0, t2: 6.1 } },
  // logo assenta na palavra "Garimpou" de "Pra isso existe o Garimpou Certo." (8,15 s); "Bons produtos." em 9,24; "Preços que valem." em 11,71
  S3: { ini: 8.05, fim: 14.1, ev: { reveal: 8.15, subir: 9.0, bons: 9.24, precos: 11.71 } },
  S4: { ini: 14.1, fim: 23.3, ev: { chips: [15.5, 17.3, 18.7] } },
  S6: {
    ini: 23.3,
    fim: 32.1,
    ev: { punch: 24.3, titulo: 25.5, barras: [25.6, 25.9, 26.2, 26.5], destaque: 27.1, contagem: [29.7, 30.5] },
  },
  S7: { ini: 32.1, fim: 38.3, ev: { texto: 34.7, punch: 35.6, indices: 36.6 } },
  S8: {
    ini: 38.3,
    fim: 52.5,
    ev: { titulo: 38.7, funil: [41.25, 45.3, 46.3, 47.6, 49.9, 51.4], insercao: [40.8, 44.3], rolagem: 44.6, sub: 51.4 },
  },
  S9: { ini: 52.5, fim: 55.8, ev: { selos: [53.0, 54.1, 55.0], titulo: 52.7 } },
  S11: { ini: 55.8, fim: 60.0, ev: { texto: 56.1, garimpou: 57.9, certo: 58.75, botao: 58.75 } },
};

export const TEMPOS: Record<Variante, Tempos80> = { "80": t80, "60": t60 };

// Legendas queimadas (seção 10): T = T início do trecho + (1º som − in) + offset; some 0,10 s depois.
export type Legenda = { ini: number; fim: number; texto: string };

type TrechoVoz = { in: number; primeiroSom: number; legendas: [number, number, string][] };

export const legendasDaVariante = (v: Variante): Legenda[] => {
  const linha = (v === "80" ? voz.linha80 : voz.linha60) as unknown as [string, number, number?][];
  const trechos = voz.trechos as unknown as Record<string, TrechoVoz>;
  return linha.flatMap(([id, t, taxa = 1]) => {
    const tr = trechos[id];
    const base = t + (tr.primeiroSom - tr.in) / taxa;
    return tr.legendas.map(([a, b, texto]) => ({ ini: base + a / taxa, fim: base + b / taxa + 0.1, texto }));
  });
};

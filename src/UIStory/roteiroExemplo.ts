import type { UIStoryProps } from "./schema";

// Roteiro de demonstração (~54 s) na mesma ordem do vídeo de referência.
export const roteiroExemplo: Omit<UIStoryProps, "formato"> = {
  marca: "Seu Estúdio",
  corDestaque: "#ff7a45",
  transicao: "desfoque-zoom",
  particulas: true,
  cenas: [
    {
      tipo: "chat",
      tema: "escuro",
      duracaoEmSegundos: 6,
      saudacao: "Boa noite, criador",
      mensagem: "Eu nunca abri o After Effects e não sei animar",
    },
    {
      tipo: "titulo",
      tema: "escuro",
      duracaoEmSegundos: 3.5,
      texto: "Foi tudo feito pelo",
      destaque: "Remotion",
    },
    {
      tipo: "selos",
      tema: "escuro",
      duracaoEmSegundos: 3,
      itens: ["Gratuito", "Código aberto", "No GitHub"],
    },
    {
      tipo: "timeline",
      tema: "escuro",
      duracaoEmSegundos: 4.5,
      faixas: ["Riscos", "Simbolo", "Saudacao", "Caixa", "Brilho"],
    },
    {
      tipo: "codigo",
      tema: "escuro",
      duracaoEmSegundos: 5,
      arquivo: "Motion.tsx",
      linhas: [
        '<Riscos entram="bordas" />',
        '<Simbolo nasce="centro" />',
        '<Saudacao texto="Boa noite" />',
      ],
    },
    {
      tipo: "metricas",
      tema: "escuro",
      duracaoEmSegundos: 4.5,
      usuario: "seu.estudio",
      visualizacoes: 81000,
      curtidas: 4500,
      comentarios: 65,
    },
    {
      tipo: "impacto",
      tema: "escuro",
      duracaoEmSegundos: 3,
      texto: "Como faz?",
    },
    {
      tipo: "prompt",
      tema: "claro",
      duracaoEmSegundos: 5,
      titulo: "Cole o prompt",
      teclas: ["⌘", "V"],
      texto:
        "Quero que você crie um vídeo de motion graphics com o Remotion, do zero. Instale o que precisar, monte cada cena, confira o resultado e me entregue o arquivo pronto em MP4.",
    },
    {
      tipo: "arquivo",
      tema: "claro",
      duracaoEmSegundos: 4,
      titulo: "Pronto. Aqui está o seu vídeo.",
      textoNoVideo: "Meu vídeo",
      nomeArquivo: "video.mp4",
    },
    {
      tipo: "edicao",
      tema: "claro",
      duracaoEmSegundos: 7.5,
      titulo: "Quer mudar? Pede em português",
      pedidos: ["Troca o nome", "Muda a cor", "Deixa mais lento"],
      textoAntes: "Meu vídeo",
      textoDepois: "Supernova",
      corDepois: "#4d7cff",
      nomeArquivo: "video.mp4",
    },
    {
      tipo: "comentarios",
      tema: "escuro",
      duracaoEmSegundos: 7,
      perfil: "seu.estudio",
      comentarios: [
        { autor: "você", texto: "PROMPT", doAutor: false },
        {
          autor: "",
          texto: "@você te mandei o PROMPT que fez esse vídeo",
          doAutor: true,
        },
        { autor: "maria", texto: "Como faço?", doAutor: false },
      ],
      chamada: "Comenta",
      palavraChave: "PROMPT",
    },
    { tipo: "logo", tema: "escuro", duracaoEmSegundos: 4.5 },
  ],
};

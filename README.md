# Motion Graphics 3D (Remotion)

Projeto independente de vídeos com motion graphics e objetos 3D, feito para ser editado com o Claude Code.

Stack: Remotion 4 + `@remotion/three` (Three.js / React Three Fiber) + `@remotion/media` + `@remotion/transitions`.

São duas composições, e as duas têm o campo **`formato`**, que aceita `9:16` (Reels, 1080×1920, o padrão) ou `16:9` (1920×1080):

- **`UIStory`** (9:16) e **`UIStory-16x9`** (16:9): estilo "interface animada", com o mesmo roteiro de exemplo de ~53 s. Têm chat digitando, títulos serifados, linha do tempo, código, métricas de post, texto gigante com motion blur, "cole o prompt", edição ao vivo, comentários com chamada para ação e logo.
- **`Apresentador3D`**: vídeo de uma pessoa com objetos 3D e textos por cima.

## Comandos

```bash
cd motion-graphics-3d
npm i
npm run dev        # Remotion Studio: preview e edição dos props pela barra lateral
npm run lint       # eslint + tsc
npx remotion render UIStory out/reels.mp4
npx remotion render UIStory-16x9 out/horizontal.mp4
npx remotion render Apresentador3D out/apresentador.mp4
npx remotion still Apresentador3D out/frame.png --frame=120   # conferir um frame
```

## Usando com o Claude Code

As skills oficiais do Remotion já estão instaladas (`npx remotion skills add`) em `.agents/skills/`, com links em `.claude/skills/`. Para que o Claude as carregue, **abra o Claude Code na raiz deste repositório** (`cd motion-graphics-3d && claude`). Para atualizar: `npx remotion skills update`.

Principais: `remotion-best-practices` (roteador), `remotion-create`, `remotion-markup` (animação, 3D, transições, vídeo, áudio), `remotion-captions`, `remotion-render`, `remotion-studio`.

## Composição `UIStory`

Tudo é editado pelo painel da direita do Studio:

- `formato`: `9:16` ou `16:9`. O layout se adapta; na cena de métricas, por exemplo, o celular fica acima dos números no vertical e ao lado no horizontal.
- `marca` e `corDestaque` (com seletor de cor): aparecem no chat, nos selos, no brilho do fundo e no encerramento.
- `transicao`: `desfoque-zoom` (padrão; a cena que sai afasta e desfoca, a que entra vem de perto e assenta), `fade` ou `deslizar`.
- `particulas`: liga ou desliga a poeira luminosa e os rastros de luz nas cenas de tema escuro.
- `cenas`: lista de blocos que você pode **reordenar, duplicar ou remover**. Cada um tem `tipo`, `tema` (`escuro` ou `claro`) e `duracaoEmSegundos`. A duração total do vídeo é calculada sozinha.

| `tipo` | O que mostra | Campos |
|---|---|---|
| `chat` | Saudação + caixa de mensagem digitando | `saudacao`, `mensagem` |
| `titulo` | Frase serifada + palavra grande em destaque | `texto`, `destaque` |
| `selos` | Lista de selos com ✓ entrando em cascata | `itens` |
| `timeline` | Editor de vídeo com faixas e cursor andando | `faixas` |
| `codigo` | Código sendo digitado com realce | `arquivo`, `linhas` |
| `metricas` | Celular com post + contadores animados | `usuario`, `visualizacoes`, `curtidas`, `comentarios` |
| `arquivo` | Cartão "video.mp4 · Arquivo pronto" | `titulo`, `textoNoVideo`, `nomeArquivo` |
| `impacto` | Texto gigante vindo "da câmera", com zoom, brilho e motion blur | `texto` |
| `prompt` | "Cole o prompt ⌘ V": teclas afundam e o texto é colado na caixa | `titulo`, `teclas`, `texto` |
| `edicao` | Pedidos em balões e o vídeo se atualizando ao vivo (texto e cor mudam) | `titulo`, `pedidos`, `textoAntes`, `textoDepois`, `corDepois`, `nomeArquivo` |
| `comentarios` | Feed de comentários com a resposta do perfil e a chamada "Comenta PROMPT" | `perfil`, `comentarios`, `chamada`, `palavraChave` |
| `logo` | Encerramento com símbolo e nome da marca | — |

Código em `src/UIStory/`: uma cena por arquivo em `cenas/`, os estilos compartilhados (fontes, paleta, animação de entrada, digitação) em `estilo.ts`, a transição em `transicoes.tsx`, as partículas em `Particulas.tsx` (o roteiro de exemplo fica em `src/Root.tsx`, escrito direto nos `defaultProps` para o Studio conseguir salvar o que você editar).

O motion blur usa `<CameraMotionBlur>` (`@remotion/motion-blur`), que funciona em qualquer Chrome. O `<HtmlInCanvasMotionBlur>`, mais novo, exige Chrome 149+ com uma flag experimental. Para criar um tipo de cena novo, adicione-o ao `schema.ts` e ao `switch` do `index.tsx`, ou peça ao Claude.

As fontes (Newsreader, Inter e JetBrains Mono, licença OFL) ficam em `public/fonts/`, então o render não depende de internet.

## Composição `Apresentador3D` (30 fps, 10 s)

Camadas, de trás para frente:

1. **Vídeo do apresentador**: coloque o arquivo em `public/` e informe o nome em `videoApresentador`. Vazio mostra um fundo de placeholder.
2. **Globo 3D** (`src/Apresentador3D/Globo3D.tsx`): toda animação vem de `useCurrentFrame()`. Não use `useFrame()` do R3F, porque ele faz o render piscar.
3. **Textos cinéticos**: cada item de `falas` entra no segundo em que a pessoa diz o conceito.

### Pessoa real interagindo com o 3D

Para o objeto passar *atrás* da pessoa ou parecer estar na mão dela:

- **Recorte (máscara)**: exporte o apresentador sem fundo como vídeo com alpha (`.webm` VP9 ou ProRes 4444), usando CapCut, DaVinci Resolve, Runway ou After Effects Roto Brush, e adicione-o como camada **acima** do `Globo3D`, com o vídeo original embaixo.
- **Tracking**: rastreie a mão ou o rosto fora do Remotion (MediaPipe, After Effects, Blender), exporte as posições por frame em JSON e use esse JSON para posicionar o `<group>` 3D em cada frame.
- **Legendas sincronizadas**: veja a skill `remotion-captions` (transcrição com Whisper e `@remotion/captions`).

## Licença

O Remotion é gratuito para equipes de até 3 pessoas. Acima disso, é preciso uma licença de empresa: https://www.remotion.pro/license

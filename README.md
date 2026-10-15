# Motion Graphics 3D (Remotion)

Projeto independente de vídeos com motion graphics e objetos 3D, feito para ser editado com o Claude Code.

Stack: Remotion 4 + `@remotion/three` (Three.js / React Three Fiber) + `@remotion/media`.

## Comandos

```bash
cd motion-graphics-3d
npm i
npm run dev        # Remotion Studio: preview e edição dos props pela barra lateral
npm run lint       # eslint + tsc
npx remotion render Apresentador3D out/apresentador.mp4
npx remotion still Apresentador3D out/frame.png --frame=120   # conferir um frame
```

## Usando com o Claude Code

As skills oficiais do Remotion já estão instaladas (`npx remotion skills add`) em `.agents/skills/`, com links em `.claude/skills/`. Para que o Claude as carregue, **abra o Claude Code na raiz deste repositório** (`cd motion-graphics-3d && claude`). Para atualizar: `npx remotion skills update`.

Principais: `remotion-best-practices` (roteador), `remotion-create`, `remotion-markup` (animação, 3D, transições, vídeo, áudio), `remotion-captions`, `remotion-render`, `remotion-studio`.

## Composição `Apresentador3D` (9:16, 1080×1920, 30 fps, 10 s)

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

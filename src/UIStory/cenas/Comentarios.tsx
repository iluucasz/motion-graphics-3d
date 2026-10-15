import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Simbolo } from "../Simbolo";
import { entrada, fontes } from "../estilo";

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Comentario = { autor: string; texto: string; doAutor: boolean };

// Feed de comentários (com a resposta do perfil) + chamada para ação.
export const Comentarios: React.FC<{
  perfil: string;
  comentarios: Comentario[];
  chamada: string;
  palavraChave: string;
  cor: string;
}> = ({ perfil, comentarios, chamada, palavraChave, cor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const curtida = spring({ frame: frame - 30, fps, config: { damping: 8 } });

  const lista = (
    <div
      style={{
        width: vertical ? Math.min(width - 120, 880) : 760,
        borderRadius: 40,
        background: "#ffffff",
        color: "#111",
        padding: "36px 40px",
        fontFamily: fontes.sans,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        gap: 30,
        ...entrada(frame, fps),
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 600, color: "#666" }}>
        Comentários
      </div>
      {comentarios.map((c, i) => {
        const surge = spring({
          frame: frame - 8 - i * 14,
          fps,
          config: { damping: 200 },
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              marginLeft: c.doAutor ? 70 : 0,
              opacity: surge,
              transform: `translateY(${(1 - surge) * 20}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                flexShrink: 0,
                background: c.doAutor ? "#111" : "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c.doAutor ? <Simbolo cor="#fff" tamanho={30} /> : null}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, color: "#777" }}>
                <b style={{ color: "#111" }}>{c.doAutor ? perfil : c.autor}</b>{" "}
                · agora
                {c.doAutor ? " · Autor" : ""}
              </div>
              <div style={{ fontSize: 32, marginTop: 4 }}>
                {(palavraChave
                  ? c.texto.split(new RegExp(`(${escapar(palavraChave)})`, "g"))
                  : [c.texto]
                ).map((parte, j) =>
                  parte === palavraChave && c.doAutor ? (
                    <span key={j} style={{ color: cor, fontWeight: 600 }}>
                      {parte}
                    </span>
                  ) : (
                    <span key={j}>{parte}</span>
                  ),
                )}
              </div>
            </div>
            {i === 0 ? (
              <div
                style={{
                  fontSize: 36,
                  color: "#e0245e",
                  transform: `scale(${curtida})`,
                }}
              >
                ♥
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  const cta = (
    <div
      style={{
        fontFamily: fontes.serif,
        textAlign: vertical ? "center" : "left",
        ...entrada(frame, fps, 20),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontSize: 76,
          justifyContent: vertical ? "center" : "flex-start",
        }}
      >
        <Simbolo cor={cor} tamanho={64} />
        {chamada}
      </div>
      <div
        style={{ fontSize: 120, fontWeight: 500, color: cor, letterSpacing: 4 }}
      >
        {palavraChave}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: vertical ? "column" : "row",
        gap: vertical ? 70 : 120,
      }}
    >
      {lista}
      {cta}
    </AbsoluteFill>
  );
};

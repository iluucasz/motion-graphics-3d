import { Simbolo } from "../Simbolo";
import { comAlpha, fontes, paleta, type Tema } from "../estilo";

// Miniatura do vídeo gerado + rodapé com nome do arquivo e status.
export const CartaoVideo: React.FC<{
  largura: number;
  texto: string;
  cor: string;
  progresso: number;
  nomeArquivo: string;
  status: string;
  statusDestacado: boolean;
  tema: Tema;
  style?: React.CSSProperties;
}> = ({
  largura,
  texto,
  cor,
  progresso,
  nomeArquivo,
  status,
  statusDestacado,
  tema,
  style,
}) => {
  const p = paleta(tema);
  return (
    <div
      style={{
        width: largura,
        borderRadius: 30,
        background: p.painel,
        border: `2px solid ${p.borda}`,
        padding: 20,
        boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      <div
        style={{
          height: largura * 0.56,
          borderRadius: 18,
          background: `radial-gradient(ellipse 90% 50% at 50% 110%, ${comAlpha(cor, 40)}, #0d0c0b 70%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          color: "#f4efe8",
        }}
      >
        <Simbolo cor={cor} tamanho={largura * 0.08} atraso={10} />
        <div
          style={{
            fontFamily: fontes.serif,
            fontSize: largura * 0.087,
            fontWeight: 500,
          }}
        >
          {texto}
        </div>
        <div
          style={{
            width: largura * 0.27,
            height: 5,
            borderRadius: 4,
            background: "rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              width: `${progresso * 100}%`,
              height: "100%",
              borderRadius: 4,
              background: cor,
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 12px 6px",
          fontFamily: fontes.sans,
          fontSize: 32,
        }}
      >
        <span>{nomeArquivo}</span>
        <span
          style={{ color: statusDestacado ? cor : p.suave, fontWeight: 500 }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

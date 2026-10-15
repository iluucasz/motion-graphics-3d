import { AbsoluteFill } from "remotion";
import { comAlpha, paleta, type Tema } from "./estilo";

export const Fundo: React.FC<{
  tema: Tema;
  cor: string;
  children: React.ReactNode;
}> = ({ tema, cor, children }) => {
  const p = paleta(tema);
  return (
    <AbsoluteFill
      style={{ backgroundColor: p.fundo, color: p.texto, overflow: "hidden" }}
    >
      {tema === "escuro" ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 90% 45% at 50% 105%, ${comAlpha(cor, 45)} 0%, ${comAlpha(cor, 12)} 45%, transparent 75%)`,
          }}
        />
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

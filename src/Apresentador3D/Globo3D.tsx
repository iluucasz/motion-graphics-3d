import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Toda animação vem de useCurrentFrame() — nunca useFrame() do R3F,
// senão o render pisca entre frames.
export const Globo3D: React.FC<{ cor: string }> = ({ cor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const entrada = spring({ frame, fps, config: { damping: 14 } });
  const flutuacao = Math.sin(frame / 20) * 0.15;
  const orbita = frame / 30;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 8], fov: 40 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color={cor} />

      <group position={[0, 1.3 + flutuacao, 0]} scale={entrada * 0.8}>
        <mesh rotation={[0.3, frame * 0.02, 0]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color={cor}
            metalness={0.3}
            roughness={0.35}
            wireframe
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, orbita]}>
          <torusGeometry args={[1.6, 0.02, 16, 120]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={cor}
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Satélite orbitando o globo */}
        <mesh
          position={[
            Math.cos(orbita) * 1.6,
            Math.sin(orbita) * 0.6,
            Math.sin(orbita) * 1.4,
          ]}
          rotation={[
            0,
            -orbita,
            interpolate(Math.sin(orbita), [-1, 1], [-0.3, 0.3]),
          ]}
        >
          <coneGeometry args={[0.08, 0.3, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Gavhar3D() {
  const toothGroupRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (toothGroupRef.current) {
      toothGroupRef.current.rotation.y = t * 0.5;
      toothGroupRef.current.rotation.x = Math.sin(t * 0.4) * 0.12;
    }
    if (gemRef.current) {
      gemRef.current.rotation.y = -t * 0.9;
      gemRef.current.position.y = 2.4 + Math.sin(t * 2) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 20, 15]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[0, 2, 0]} intensity={4.5} color="#0ea5e9" distance={6} />
      <pointLight position={[0, -2, 0]} intensity={3} color="#06b6d4" distance={5} />

      <Float speed={2.0} rotationIntensity={0.6} floatIntensity={1.2}>
        <group ref={toothGroupRef} position={[0, -0.3, 0]} scale={1.15}>
          
          {/* TOOTH CROWN (Smooth Anatomical Porcelain Tooth Body) */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[1.35, 0.85, 1.5, 64]} />
            <MeshTransmissionMaterial 
              backside
              samples={6}
              thickness={1.5}
              chromaticAberration={0.08}
              anisotropy={0.2}
              distortion={0.15}
              distortionScale={0.4}
              temporalDistortion={0.1}
              color="#f0f9ff"
              transmission={0.8}
              opacity={1}
              roughness={0.08}
              ior={1.5}
              clearcoat={1.0}
            />
          </mesh>

          {/* 4 ANATOMICAL TOOTH CUSPS (Top Bumps with Enamel Gloss) */}
          {[
            [0.55, 1.45, 0.55],
            [-0.55, 1.45, 0.55],
            [0.55, 1.45, -0.55],
            [-0.55, 1.45, -0.55]
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.48, 32, 32]} />
              <MeshTransmissionMaterial 
                color="#ffffff"
                roughness={0.05}
                transmission={0.85}
                thickness={1.2}
                clearcoat={1.0}
                ior={1.52}
              />
            </mesh>
          ))}

          {/* TOOTH ROOT 1 (Left Curved Root) */}
          <mesh position={[-0.45, -0.65, 0]} rotation={[0, 0, 0.18]}>
            <coneGeometry args={[0.48, 1.5, 32]} />
            <meshPhysicalMaterial 
              color="#e0f2fe" 
              roughness={0.15} 
              metalness={0.1}
              clearcoat={0.8}
              transmission={0.4}
            />
          </mesh>

          {/* TOOTH ROOT 2 (Right Curved Root) */}
          <mesh position={[0.45, -0.65, 0]} rotation={[0, 0, -0.18]}>
            <coneGeometry args={[0.48, 1.5, 32]} />
            <meshPhysicalMaterial 
              color="#e0f2fe" 
              roughness={0.15} 
              metalness={0.1}
              clearcoat={0.8}
              transmission={0.4}
            />
          </mesh>

          {/* GAVHAR DIAMOND CRYSTAL (Floating above Tooth Crown) */}
          <mesh ref={gemRef} position={[0, 2.4, 0]}>
            <octahedronGeometry args={[0.55, 2]} />
            <MeshTransmissionMaterial 
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
              transmission={0.95}
              thickness={2.5}
              roughness={0.0}
              ior={2.4}
              chromaticAberration={0.15}
            />
          </mesh>

          {/* Orbiting Laser Protection Ring */}
          <mesh ref={ringRef} position={[0, 0.7, 0]}>
            <torusGeometry args={[2.0, 0.035, 16, 120]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
          </mesh>

        </group>

        {/* Floating Dental Sparkles */}
        <Sparkles count={80} scale={7.5} size={5} speed={0.8} color="#06b6d4" />
      </Float>
    </>
  );
}

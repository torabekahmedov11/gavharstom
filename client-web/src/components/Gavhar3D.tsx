import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function Gavhar3D() {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.y = -state.clock.elapsedTime * 0.8;
      crystalRef.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  // Dental Tooth Enamel Material (Shiny White/Pearl with Cyan Glow)
  const enamelMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.1,
    metalness: 0.05,
    transmission: 0.35,
    thickness: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
    ior: 1.5,
    emissive: new THREE.Color('#e0f2fe'),
    emissiveIntensity: 0.3,
  });

  const rootMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#f0f9ff'),
    roughness: 0.25,
    metalness: 0.0,
    transmission: 0.2,
    clearcoat: 0.5,
  });

  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#38bdf8'),
    roughness: 0.0,
    metalness: 0.1,
    transmission: 0.9,
    thickness: 2.0,
    clearcoat: 1.0,
    emissive: new THREE.Color('#0284c7'),
    emissiveIntensity: 0.6,
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 15, 10]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#38bdf8" />
      <pointLight position={[0, 2, 0]} intensity={3} color="#0ea5e9" distance={5} />

      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <group ref={groupRef} position={[0, -0.2, 0]} scale={1.1}>
          
          {/* TOOTH CROWN (Main Body) */}
          <mesh position={[0, 0.6, 0]} material={enamelMaterial}>
            <cylinderGeometry args={[1.3, 0.9, 1.4, 32]} />
          </mesh>

          {/* CROWN TOP CUSPS (4 rounded anatomical bumps for Tooth) */}
          <mesh position={[0.5, 1.35, 0.5]} material={enamelMaterial}>
            <sphereGeometry args={[0.45, 16, 16]} />
          </mesh>
          <mesh position={[-0.5, 1.35, 0.5]} material={enamelMaterial}>
            <sphereGeometry args={[0.45, 16, 16]} />
          </mesh>
          <mesh position={[0.5, 1.35, -0.5]} material={enamelMaterial}>
            <sphereGeometry args={[0.45, 16, 16]} />
          </mesh>
          <mesh position={[-0.5, 1.35, -0.5]} material={enamelMaterial}>
            <sphereGeometry args={[0.45, 16, 16]} />
          </mesh>

          {/* TOOTH ROOT 1 (Left Tapered Root) */}
          <mesh position={[-0.45, -0.6, 0]} rotation={[0, 0, 0.15]} material={rootMaterial}>
            <coneGeometry args={[0.45, 1.4, 16]} />
          </mesh>

          {/* TOOTH ROOT 2 (Right Tapered Root) */}
          <mesh position={[0.45, -0.6, 0]} rotation={[0, 0, -0.15]} material={rootMaterial}>
            <coneGeometry args={[0.45, 1.4, 16]} />
          </mesh>

          {/* GAVHAR DIAMOND GEM (Floating above Tooth Crown) */}
          <mesh ref={crystalRef} position={[0, 2.2, 0]} material={gemMaterial}>
            <octahedronGeometry args={[0.5, 0]} />
          </mesh>

          {/* Glowing Aura Ring around Tooth */}
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.03, 16, 100]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>

        </group>

        {/* Floating Sparkles */}
        <Sparkles count={70} scale={7} size={5} speed={0.6} color="#0ea5e9" />
      </Float>
    </>
  );
}

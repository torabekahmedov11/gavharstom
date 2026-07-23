import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function Gavhar3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#0ea5e9" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* Diamond / Pearl Shape representing "Gavhar" */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <octahedronGeometry args={[2.5, 2]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#e0f2fe"
            transmission={0.9}
            opacity={1}
            roughness={0.1}
          />
        </mesh>
        <Sparkles count={50} scale={6} size={4} speed={0.4} color="#38bdf8" />
      </Float>
    </>
  );
}

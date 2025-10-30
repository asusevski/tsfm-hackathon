'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface LossLandscapeProps {
  scrollProgress: number;
}

function LossSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Generate fixed rugged loss landscape geometry
  const geometry = useMemo(() => {
    const width = 60;
    const height = 60;
    const widthSegments = 150;
    const heightSegments = 150;
    
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    
    // Modify vertices to create a complex, rugged loss landscape
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Create a complex, rugged landscape with multiple peaks, valleys, and ridges
      let z = 0;
      
      // Primary mountain ranges
      z += Math.sin(x * 0.3) * Math.cos(y * 0.3) * 8;
      z += Math.sin(x * 0.6) * Math.cos(y * 0.6) * 4;
      z += Math.sin(x * 1.2) * Math.cos(y * 1.2) * 2;
      
      // Add noise and complexity
      z += Math.sin(x * 0.8) * Math.cos(y * 0.4) * 3;
      z += Math.sin(x * 0.4) * Math.cos(y * 0.8) * 3;
      
      // Sharp ridges and valleys
      z += Math.sin(x * 1.5) * Math.cos(y * 1.5) * 1.5;
      z += Math.sin(x * 2.0) * Math.cos(y * 2.0) * 1;
      
      // Fine detail noise
      z += Math.sin(x * 3.0) * Math.cos(y * 3.0) * 0.5;
      z += Math.sin(x * 4.0) * Math.cos(y * 4.0) * 0.3;
      
      // Add some randomness for more ruggedness
      z += (Math.random() - 0.5) * 0.8;
      
      positions[i + 2] = z;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation for visual interest
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#ffffff"
        wireframe={true}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

function LossLandscape3D({ scrollProgress }: LossLandscapeProps) {
  // Calculate camera position based on scroll progress for different perspectives
  const cameraPosition = useMemo(() => {
    const baseDistance = 40;
    const angle = scrollProgress * Math.PI * 2; // Full rotation as we scroll
    
    return [
      Math.cos(angle) * baseDistance,
      Math.sin(angle) * baseDistance * 0.3, // Less vertical movement
      baseDistance + scrollProgress * 20 // Move closer as we scroll
    ] as [number, number, number];
  }, [scrollProgress]);
  
  return (
    <Canvas
      camera={{ 
        position: cameraPosition, 
        fov: 45 + scrollProgress * 15 // FOV changes with scroll
      }}
      style={{ width: '100%', height: '100vh' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 0, 20]} intensity={0.3} color="#ffffff" />
      
      <LossSurface />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

export default LossLandscape3D;

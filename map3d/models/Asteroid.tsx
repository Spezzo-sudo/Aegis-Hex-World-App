import * as THREE from 'three';

// FIX: Replaced the GLTF-based model with a simple THREE geometry to eliminate
// potential parsing errors from the large embedded data string. This now exports
// the geometry directly for use in the InstancedMesh.
export const AsteroidGeometry = new THREE.IcosahedronGeometry(1, 0);

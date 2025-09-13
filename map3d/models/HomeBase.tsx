
import React from 'react';
import { useGLTF } from '@react-three/drei';
// FIX: Import `ThreeElements` for correct prop typing in a React Three Fiber component.
import type { ThreeElements } from '@react-three/fiber';

const hexRoomGltf = `data:application/json;base64,${btoa(`{"asset": {"version": "2.0", "generator": "chatgpt-gltf-writer"}, "buffers": [{"uri": "data:application/octet-stream;base64,AAAAAAAAAD4AAAAAgQWFPwAAAD6amRk/PG6pJAAAAD6amZk/gQWFvwAAAD6amRk/gQWFvwAAAD6amRm/WSV+pQAAAD6amZm/gQWFPwAAAD6amRm/AAAAAAAAAL4AAAAAgQWFPwAAAL6amRk/PG6pJAAAAL6amZk/gQWFvwAAAL6amRk/gQWFvwAAAL6amRm/WSV+pQAAAL6amZm/gQWFPwAAAL6amRm/gQWFPwAAAD6amRk/gQWFPwAAAL6amRk/PG6pJAAAAL6amZk/PG6pJAAAAD6amZk/PG6pJAAAAD6amZk/PG6pJAAAAL6amZk/gQWFvwAAAL6amRk/gQWFvwAAAD6amRk/gQWFvwAAAD6amRk/gQWFvwAAAL6amRk/gQWFvwAAAL6amRm/gQWFvwAAAD6amRm/gQWFvwAAAD6amRm/gQWFvwAAAL6amRm/WSV+pQAAAL6amZm/WSV+pQAAAD6amZm/WSV+pQAAAD6amZm/WSV+pQAAAL6amZm/gQWFPwAAAL6amRm/gQWFPwAAAD6amRm/gQWFPwAAAD6amRm/gQWFPwAAAL6amRm/gQWFPwAAAL6amRk/gQWFPwAAAD6amRk/AAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAvwAAAADXs12/AAAAvwAAAADXs12/AAAAvwAAAADXs12/AAAAvwAAAADXs12/AAAAPwAAAADXs12/AAAAPwAAAADXs12/AAAAPwAAAADXs12/AAAAPwAAAADXs12/AACAPwAAAABVVVUlAACAPwAAAABVVVUlAACAPwAAAABVVVUlAACAPwAAAABVVVUlAAAAPwAAAADXs10/AAAAPwAAAADXs10/AAAAPwAAAADXs10/AAAAPwAAAADXs10/AAAAvwAAAADXs10/AAAAvwAAAADXs10/AAAAvwAAAADXs10/AAAAvwAAAADXs10/AACAvwAAAABVVdUlAACAvwAAAABVVdUlAACAvwAAAABVVdUlAACAvwAAAABVVdUlAAAAPwAAAD/s2W4/AABAPwAAAD8AAIA/ozCJPQAAQD+jMIk9AACAPgAAAD8AAAAA7NluPwAAgD4AAAA/AAAAP+zZbj8AAEA/AAAAPwAAgD+jMIk9AABAP6MwiT0AAIA+AAAAPwAAAADs2W4/AACAPgAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAgD8AAIA/AAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAACAPwAAgD8AAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAIA/AACAPwAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAgD8AAIA/AAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAACAPwAAgD8AAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAIA/AACAPwAAAQACAAAAAgADAAAAAwAEAAAABAAFAAAABQAGAAAABgABAAcACQAIAAcACgAJAAcACwAKAAcADAALAAcADQAMAAcACAANAA4ADwAQAA4AEAARABIAEwAUABIAFAAVABYAFwAYABYAGAAZABoAGwAcABoAHAAdAB4AHwAgAB4AIAAhACIAIwAkACIAJAAlAA==", "byteLength": 1360}], "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": 456, "target": 34962}, {"buffer": 0, "byteOffset": 456, "byteLength": 456, "target": 34962}, {"buffer": 0, "byteOffset": 912, "byteLength": 304, "target": 34962}, {"buffer": 0, "byteOffset": 1216, "byteLength": 144, "target": 34963}], "accessors": [{"bufferView": 0, "componentType": 5126, "count": 38, "type": "VEC3", "min": [-1.0392304845413265, -0.125, -1.2], "max": [1.0392304845413265, 0.125, 1.2]}, {"bufferView": 1, "componentType": 5126, "count": 38, "type": "VEC3"}, {"bufferView": 2, "componentType": 5126, "count": 38, "type": "VEC2"}, {"bufferView": 3, "componentType": 5123, "count": 72, "type": "SCALAR"}], "materials": [{"pbrMetallicRoughness": {"baseColorFactor": [0.06, 0.08, 0.12, 1.0], "metallicFactor": 0.1, "roughnessFactor": 0.9}, "doubleSided": true}], "meshes": [{"primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, "indices": 3, "material": 0}]}], "nodes": [{"mesh": 0, "name": "HexRoom"}], "scenes": [{"nodes": [0]}], "scene": 0}`)}`
useGLTF.preload(hexRoomGltf);

export function HomeBaseModel(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF(hexRoomGltf) as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.HexRoom.geometry}
        material={materials.Material}
      />
    </group>
  )
}

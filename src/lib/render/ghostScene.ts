// Stage 3: Three.js overlay.
// Renders the translucent reference "Ghost" mesh and highlights error joints
// in red on the live canvas.

import * as THREE from "three";
import type { PoseFrame } from "@/types/pose";

export interface GhostScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Updates the ghost mesh pose and re-renders one frame. */
  update(referenceFrame: PoseFrame, errorJoints: Set<string>): void;
  dispose(): void;
}

/** Sets up the translucent ghost overlay scene on top of the video canvas. */
export function createGhostScene(canvas: HTMLCanvasElement): GhostScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100);
  camera.position.set(0, 1, 3);

  // TODO: build the 33-joint skeleton mesh (spheres + connecting bones) with
  // a translucent "Hunter Green" material, and a red highlight material for
  // joints flagged by src/lib/motion/compareToGhost.ts.

  return {
    renderer,
    scene,
    camera,
    update(_referenceFrame, _errorJoints) {
      renderer.render(scene, camera);
    },
    dispose() {
      renderer.dispose();
    },
  };
}

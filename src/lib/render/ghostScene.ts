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

/** Standard MediaPipe Pose Landmarker joint names, indexed 0-32. */
const JOINT_NAMES = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
] as const;

/** Standard MediaPipe POSE_CONNECTIONS bone topology, by joint index. */
const BONE_CONNECTIONS: [number, number][] = [
  // face
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
  // torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // left arm + hand
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  // right arm + hand
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // left leg + foot
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  // right leg + foot
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];

const HUNTER_GREEN = 0x3e5f44;
const ERROR_RED = 0xdc2626;

const JOINT_RADIUS = 0.025;
const BONE_RADIUS = 0.012;
const WORLD_SCALE = 2;

/** Converts a normalized MediaPipe landmark into Three.js world space. */
function toWorld(landmark: PoseFrame["landmarks"][number]): THREE.Vector3 {
  return new THREE.Vector3(
    (landmark.x - 0.5) * WORLD_SCALE,
    -(landmark.y - 0.5) * WORLD_SCALE,
    -landmark.z * WORLD_SCALE
  );
}

/** Sets up the translucent ghost overlay scene on top of the video canvas. */
export function createGhostScene(canvas: HTMLCanvasElement): GhostScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const width = canvas.clientWidth || canvas.width || 1;
  const height = canvas.clientHeight || canvas.height || 1;
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 1, 3);

  const ghostMaterial = new THREE.MeshBasicMaterial({
    color: HUNTER_GREEN,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const errorMaterial = new THREE.MeshBasicMaterial({
    color: ERROR_RED,
  });

  const jointGeometry = new THREE.SphereGeometry(JOINT_RADIUS, 12, 12);
  const boneGeometry = new THREE.CylinderGeometry(BONE_RADIUS, BONE_RADIUS, 1, 8);

  const jointMeshes = JOINT_NAMES.map(() => {
    const mesh = new THREE.Mesh(jointGeometry, ghostMaterial);
    scene.add(mesh);
    return mesh;
  });

  const boneMeshes = BONE_CONNECTIONS.map(() => {
    const mesh = new THREE.Mesh(boneGeometry, ghostMaterial);
    scene.add(mesh);
    return mesh;
  });

  return {
    renderer,
    scene,
    camera,
    update(referenceFrame, errorJoints) {
      const { landmarks } = referenceFrame;

      JOINT_NAMES.forEach((name, i) => {
        const landmark = landmarks[i];
        const mesh = jointMeshes[i];
        if (!landmark) {
          mesh.visible = false;
          return;
        }
        mesh.visible = true;
        mesh.position.copy(toWorld(landmark));
        mesh.material = errorJoints.has(name) ? errorMaterial : ghostMaterial;
      });

      BONE_CONNECTIONS.forEach(([aIdx, bIdx], i) => {
        const a = landmarks[aIdx];
        const b = landmarks[bIdx];
        const mesh = boneMeshes[i];
        if (!a || !b) {
          mesh.visible = false;
          return;
        }
        mesh.visible = true;

        const start = toWorld(a);
        const end = toWorld(b);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const direction = end.clone().sub(start);
        const length = direction.length();

        mesh.position.copy(mid);
        mesh.scale.set(1, length, 1);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize()
        );

        const isError = errorJoints.has(JOINT_NAMES[aIdx]) || errorJoints.has(JOINT_NAMES[bIdx]);
        mesh.material = isError ? errorMaterial : ghostMaterial;
      });

      renderer.render(scene, camera);
    },
    dispose() {
      jointGeometry.dispose();
      boneGeometry.dispose();
      ghostMaterial.dispose();
      errorMaterial.dispose();
      renderer.dispose();
    },
  };
}

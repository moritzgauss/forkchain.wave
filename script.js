import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Load Model
const loader = new GLTFLoader();
let model;
loader.load('./models/frkchain-3.glb', (gltf) => {
  model = gltf.scene;
  model.castShadow = true;
  model.receiveShadow = true;
  scene.add(model);
}, undefined, (err) => console.error('Error loading model:', err));

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.01; // Rotate model for feedback
  renderer.render(scene, camera);
}
animate();

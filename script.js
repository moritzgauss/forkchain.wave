import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let model;

loader.load(
    './models/frkchain-3.glb', // Make sure the GLB file path is correct
    function (gltf) {
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

camera.position.z = 5;

// Mouse interaction logic
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (model) {
        model.position.x = mouse.x * 2;
        model.position.y = mouse.y * 2;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01; // Rotate the model for some animation
    renderer.render(scene, camera);
}
animate();

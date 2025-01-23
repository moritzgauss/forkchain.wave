import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/RGBELoader.js';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Position the camera

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows for this light
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Soft ambient light
scene.add(ambientLight);

// Load the environment map (HDR texture)
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
    'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/hdri/venice_sunset_1k.hdr', // Example HDRI
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture; // Set as environment map
        scene.background = texture; // Set as the background
    }
);

// Load the GLB model
const loader = new GLTFLoader();
let model;

loader.load(
    './models/frkchain-3.glb', // Make sure the GLB file is in this path
    function (gltf) {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true; // Enable shadow casting
                child.receiveShadow = true; // Enable shadow receiving
            }
        });
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

// Mouse interaction
const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (model) {
        model.position.x = mouse.x * 2;
        model.position.y = mouse.y * 2;
    }
});

// Add a ground plane to show shadows
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01; // Rotate the model for animation
    renderer.render(scene, camera);
}

animate();

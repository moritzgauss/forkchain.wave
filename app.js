import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { RGBELoader } from './libs/RGBELoader.js'; // Importiere RGBELoader

// Szene, Kamera und Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht hinzufügen
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Lade HDR-Umgebungsmappe
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./assets/environment.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping; // Wende HDR-Map auf die Szene an
    scene.background = texture; // Setze HDR-Map als Hintergrund
    scene.environment = texture; // Setze HDR-Map als Environment
}, undefined, function (error) {
    console.error('Error loading HDR texture:', error);
});

// GLTF-Modell laden
const loader = new GLTFLoader();
let model; // Modell wird hier gespeichert
loader.load(
    './assets/model.glb', // Pfad zu deinem Modell
    function (gltf) {
        console.log('Model loaded successfully');
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Kamera-Position
camera.position.z = 5;

// Mausposition erfassen
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Mausposition relativ zur Fensterbreite
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Mausposition relativ zur Fensterhöhe
});

// Render-Funktion ohne Animation
function render() {
    // Wenn das Modell geladen ist, passe die Position des Modells an
    if (model) {
        // Bewegungsbereich der Maus in 3D-Koordinaten
        model.position.x = mouseX * 3; // Skaliere den Bewegungsbereich
        model.position.y = mouseY * 3; // Skaliere den Bewegungsbereich
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render); // Dies sorgt für kontinuierliches Rendering
}

// Fenstergröße dynamisch anpassen
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

render(); // Starte das Rendering

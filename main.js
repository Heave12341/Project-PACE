import * as THREE from 'three';
import gsap from 'gsap';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('img/textureNight.jpg'); // Replace with the path to the Earth texture image

// Earth Sphere
const geometry = new THREE.SphereGeometry(4, 64, 64);
const material = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 100,
});

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0,1,0)
scene.add(mesh);

const spaceTexture = textureLoader.load('img/space.jpg');
scene.background = spaceTexture;  

// Atmospheric Glow
const atmosphereGeometry = new THREE.SphereGeometry(4.5, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x99ccff,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.03,
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Main Light Source
const mainLight = new THREE.PointLight(0xffffff, 2, 100, 1.7); // Changed intensity to 2
mainLight.position.set(0, 10, 10);
mainLight.intensity = 100;
scene.add(mainLight);

// Additional Light Sources
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const sideLight = new THREE.PointLight(0xffffff, 1.5, 100, 1.7); // Side light with different intensity
sideLight.position.set(10, 0, 0); // Position it to illuminate a specific side of the Earth
scene.add(sideLight);

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 5000;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100; // Random spread around the globe
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0x00ff00, // Green particles to represent phytoplankton
  size: 0.1,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Event listener for resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline animations with GSAP
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0.1, x: 0.1, y: 0.1 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

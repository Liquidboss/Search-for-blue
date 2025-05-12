import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const particleCount = 5000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const blueDotIndices = [];

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 20;
  positions[i3 + 1] = (Math.random() - 0.5) * 20;
  positions[i3 + 2] = (Math.random() - 0.5) * 20;

  if (i < 10) {
    colors[i3 + 0] = 0.0;
    colors[i3 + 1] = 0.4;
    colors[i3 + 2] = 1.0;
    sizes[i] = 5.0;
    blueDotIndices.push(i);
  } else {
    colors[i3 + 0] = 1.0;
    colors[i3 + 1] = 1.0;
    colors[i3 + 2] = 1.0;
    sizes[i] = 2.0;
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

let isDragging = false;
let previousX, previousY;

function onPointerDown(e) {
  isDragging = true;
  previousX = e.touches ? e.touches[0].clientX : e.clientX;
  previousY = e.touches ? e.touches[0].clientY : e.clientY;
}

function onPointerMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = x - previousX;
  const deltaY = y - previousY;

  particles.rotation.y += deltaX * 0.005;
  particles.rotation.x += deltaY * 0.005;

  previousX = x;
  previousY = y;
}

function onPointerUp() {
  isDragging = false;
}

document.addEventListener('mousedown', onPointerDown);
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('mouseup', onPointerUp);
document.addEventListener('touchstart', onPointerDown);
document.addEventListener('touchmove', onPointerMove);
document.addEventListener('touchend', onPointerUp);

document.body.addEventListener('click', () => {
  const music = document.getElementById('bg-music');
  if (music.paused) music.play();
});

const modal = document.getElementById('dream-modal');
const dreamText = document.getElementById('dream-text');
const dreams = [
  "To walk across Iceland alone.",
  "To design a watch that lasts 200 years.",
  "To share my grandfather’s recipe with the world.",
  "To open a jazz bar by the sea.",
  "To build a floating library."
];

document.addEventListener('click', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((x - rect.left) / rect.width) * 2 - 1,
    -((y - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(particles);
  if (intersects.length > 0 && blueDotIndices.includes(intersects[0].index)) {
    const randomDream = dreams[Math.floor(Math.random() * dreams.length)];
    dreamText.innerText = randomDream;
    modal.classList.remove("hidden");
  }
});

window.nextExperience = function () {
  alert("You reached the next experience. Transition logic goes here.");
  modal.classList.add("hidden");
};

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;
  renderer.render(scene, camera);
}
animate();

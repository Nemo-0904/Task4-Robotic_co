import * as THREE from 'three';
import URDFLoader from 'urdf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f8ff); // Light background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.2, 1.2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 0.5;
controls.maxDistance = 10;

window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// Plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// 💡 Updated Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.8); // base brightness
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 10, 5);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-3, 5, -2);
fillLight.castShadow = false;
scene.add(fillLight);

// URDF Loader with STL mesh support
const loader = new URDFLoader();
loader.loadMeshCb = (path, manager, done) => {
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = `${window.location.origin}/${cleanedPath}`;
  const stlLoader = new STLLoader(manager);
  stlLoader.load(
    url,
    geometry => {
      const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      done(mesh);
    },
    undefined,
    err => console.error(` Failed to load mesh: ${url}`, err)
  );
};

let loadedRobot = null;

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Load URDF
loader.load(
  '/crab_model.urdf',
  (robot) => {
    loadedRobot = robot;
    window.loadedRobot = robot;

    robot.rotation.x = -Math.PI / 2;
    robot.position.y = 0.2;
    robot.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(robot);
    createSliders(robot);
  },
  undefined,
  err => console.error("Failed to load URDF:", err)
);

// Joint Sliders
function createSliders(robot) {
  const container = document.getElementById('sliders-container');
  container.innerHTML = '';

  Object.entries(robot.joints).forEach(([name, joint]) => {
    if (joint.jointType === 'fixed') return;

    const wrapper = document.createElement('div');
    wrapper.className = 'joint-slider';

    const label = document.createElement('label');
    label.textContent = name;

    const valueSpan = document.createElement('span');
    valueSpan.textContent = '0.00';
    label.appendChild(valueSpan);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = joint.limit?.lower ?? -1.57;
    slider.max = joint.limit?.upper ?? 1.57;
    slider.step = 0.01;
    slider.value = joint.jointValue ?? 0;

    slider.oninput = () => {
      const val = parseFloat(slider.value);
      joint.setJointValue(val);
      valueSpan.textContent = val.toFixed(2);
    };

    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    container.appendChild(wrapper);
  });
}

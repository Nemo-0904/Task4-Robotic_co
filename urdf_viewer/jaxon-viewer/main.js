import * as THREE from 'three';
import URDFLoader from 'urdf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f8ff); // AliceBlue (light pastel)


const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(1.5, 1.5, 2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  

// Directional light (main sunlight)
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 10, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.8); // brighter base light
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 10, 5);
scene.add(keyLight);

// Additional fill light (to soften shadows)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-3, 5, -2);
scene.add(fillLight);

// Ambient light (global light)
scene.add(new THREE.AmbientLight(0xffffff, 0.6));  // brighter ambient


const loader = new URDFLoader();
loader.packages = '';  // Set this if paths in URDF use 'package://'

loader.loadMeshCb = (path, manager, done) => {
    const cleanedPath = path.replace(/^\/+/, '');
    const url = `${window.location.origin}/meshes/${cleanedPath.split('/').pop()}`; // assumes path is 'package://jaxon_description/meshes/XYZ.dae'
  
    const colladaLoader = new ColladaLoader(manager);
    colladaLoader.load(
      url,
      (collada) => {
        done(collada.scene);
      },
      undefined,
      (err) => console.error('DAE Load Error:', url, err)
    );
  };
  
  loader.load(
    '/jaxon_jvrc.urdf',  // directly accessible from public/
    (robot) => {
      robot.rotation.x = -Math.PI / 2;
      robot.position.y = 0.1;
        scene.add(robot);
        createSliders(robot); // NEW

      animate();
    },
    undefined,
    (err) => console.error('Failed to load URDF:', err)
  );
  

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
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
      valueSpan.style.float = 'right';
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
  
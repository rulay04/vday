import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Create light source
camera.position.z = 10;
const amLight = new THREE.AmbientLight(0x400f17, 20);
scene.add(amLight);
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(1.5, 1.5, 1.5);
scene.add(pointLight);
/*const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);*/

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

const models = ['Full', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
let currentModelIndex = 0;
let heart;

function loadNextModel() {
  mtlLoader.load(`./models/${models[currentModelIndex]} heart.mtl`, (materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load(`./models/${models[currentModelIndex]} heart.obj`, (object) => {
      if (heart) {
        scene.remove(heart);
      }

      heart = object;
      heart.scale.set(0.01, 0.01, 0.01);

      const box = new THREE.Box3().setFromObject(heart);
      const heartWidth = box.max.x - box.min.x;
      const heartHeight = box.max.y - box.min.y;
      heart.position.x = -heartWidth / 2;
      heart.position.y = -heartHeight / 2;

      scene.add(heart);
      const distance = 10; // Adjust the distance as needed
      //camera.position.set(0, 0, distance);
      controls.target.set(heart.position.x, heart.position.y, heart.position.z);
      controls.update();
    });
  });
}

let currentPhrase = 1;
let nVal = 0;
let yVal = 0;
function showNextModel(answer) {

  if (answer === 'no') {
    currentModelIndex = (currentModelIndex + 1);
    if (currentModelIndex >= models.length) {
      document.getElementById('noButton').style.padding = `50px`;
      document.getElementById('yesButton').style.padding = `50px`;
      document.getElementById('noButton').innerText = 'yes';
    }
    else {
      loadNextModel();
    }

    // Replace "No" text with the next phrase
    const phrases = ['yes', 'what ?', 'haha funny', 'ok not funny...', 'try again', "that's not nice", 'wrong answer', "you're making me upset", "don't play with my heart", 'is something wrong with me ?', 'am i not good enough ?', 'love me'];
    currentPhrase = (currentPhrase + 1);
    document.getElementById('noButton').innerText = phrases[currentPhrase];
    if (currentPhrase >= phrases.length) {
      document.getElementById('noButton').innerText = 'yes';
      showNextModel('yes');
    }

    nVal += 5;
    yVal -= 3;
    // Adjust button sizes
    document.getElementById('noButton').style.padding = `${50 + nVal}px`;
    document.getElementById('yesButton').style.padding = `${50 + yVal}px`;


  } else if (answer === 'yes') {
    document.getElementById('ask').innerText = 'yay ! see you soon :]';
    document.getElementById('ask').style.fontSize = '2em';
    document.getElementById('noButton').style.padding = `50px`;
    document.getElementById('yesButton').style.padding = `50px`;
    if (document.getElementById('noButton').innerText === 'yes') {
      document.getElementById('noButton').innerText = 'yes';
    }
    else if (document.getElementById('noButton').innerText !== 'no') {
      document.getElementById('noButton').innerText = 'no';
    }
    if (heart) {
      scene.remove(heart);
    }
    mtlLoader.load('./models/white heart.mtl', (materials) => {
      console.log('MTL loaded successfully');
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('./models/white heart.obj', (object) => {
        heart = object;
        heart.scale.set(0.01, 0.01, 0.01);
        console.log('OBJ loaded successfully');

        // Center the heart
        const box = new THREE.Box3().setFromObject(heart);
        const heartWidth = box.max.x - box.min.x;
        const heartHeight = box.max.y - box.min.y;
        heart.position.x = -heartWidth / 2;
        heart.position.y = -heartHeight / 2;
        heart.position.z = 0;
        console.log('Heart position:', heart.position);
        scene.add(heart);

        const distance = 10;
        camera.position.set(0, 0, distance);
        controls.target.set(heart.position.x, heart.position.y, heart.position.z);
        controls.update();

        const amLight = new THREE.AmbientLight(0xffffff, 20);
        scene.add(amLight);
      });
    });
  }
}

// Initialize with the first model
loadNextModel();

document.getElementById('noButton').addEventListener('click', () => {
  showNextModel('no');
});

document.getElementById('yesButton').addEventListener('click', () => {
  showNextModel('yes');
});

const animate = function () {
  requestAnimationFrame(animate);
  controls.update();

  // Rotate the heart around the y-axis
  if (heart) {
    heart.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
};

animate();

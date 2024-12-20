import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ProductViewer3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Contenedor no encontrado: ${containerId}`);
            return;
        }
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
    }

    loadModel(modelPath) {
        console.log('Intentando cargar modelo:', modelPath);
        const loader = new OBJLoader();

        loader.load(
            modelPath,
            (object) => {
                console.log('Modelo cargado exitosamente');
                
                // Limpiar escena anterior
                this.scene.remove.apply(this.scene, this.scene.children.filter(child => child.type === 'Mesh'));

                // Centrar modelo
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);

                // Escalar modelo
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                object.scale.set(scale, scale, scale);

                // Aplicar material
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xffffff,
                            metalness: 0.3,
                            roughness: 0.6
                        });
                    }
                });

                this.scene.add(object);
                this.animate();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            (error) => {
                console.error('Error cargando modelo:', error);
                
                // Crear cubo de prueba
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const cube = new THREE.Mesh(geometry, material);
                this.scene.add(cube);
                this.animate();
            }
        );
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Inicialización simplificada
function initProductViewers() {
    const productModels = {
        'iphone': 'models/Iphone.obj',
        'samsung': 'models/Iphone.obj',
        'motorola': 'models/Iphone.obj'
    };

    Object.keys(productModels).forEach(category => {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            const container = document.createElement('div');
            container.id = `3d-model-${category}`;
            container.style.width = '300px';
            container.style.height = '300px';
            container.style.position = 'absolute';
            container.style.zIndex = '1000';
            container.style.display = 'none';

            button.appendChild(container);

            button.addEventListener('mouseover', () => {
                container.style.display = 'block';
                const viewer = new ProductViewer3D(`3d-model-${category}`);
                viewer.loadModel(productModels[category]);
            });

            button.addEventListener('mouseout', () => {
                container.style.display = 'none';
            });
        }
    });
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductViewers);
} else {
    initProductViewers();
}

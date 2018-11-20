declare var THREE: any;

export class Knot {

    public state: any;
    private container: any;
    private width: number;
    private height: number;
    private knot: any;
    private camera: any;
    private renderer: any;
    private scene: any;

    constructor(container: any, width: number, height: number) {
        this.container = container;
        this.width = width;
        this.height = height;
        this.knot = null;

        this.state = {
            brightness: 1,
            heightScale: 4,
            p: 5,
            q: 4,
            radialSegments: 600,
            radius: 40,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            size: 3,
            tube: 28.2,
            tubularSegments: 12
        }

        this.init();
    }

    public resize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    public init(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();

        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 50;

        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color(0x000000, 1.0));
        this.renderer.shadowMapEnabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    public draw() {
        if (this.knot) { this.scene.remove(this.knot); }
        const geometry = new THREE.TorusKnotGeometry(
            this.state.radius,
            this.state.tube,
            Math.max(0, Math.round(this.state.radialSegments)),
            Math.round(this.state.tubularSegments),
            this.state.p,
            this.state.q,
            this.state.heightScale
        );
        this.knot = this.createPointCloud(geometry);
        this.scene.add(this.knot);
    }

    public createPointCloud(geometry: any) {
        const material = new THREE.PointCloudMaterial({
            blending: THREE.AdditiveBlending,
            color: 0xffffff,
            map: this.generateSprite(),
            size: this.state.size,
            transparent: true
        });
        const cloud = new THREE.PointCloud(geometry, material);
        cloud.sortParticles = true;
        return cloud;
    }

    public generateSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (!ctx) { return; }
        const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    public changes() {
        if (this.knot) {
            this.knot.rotation.x = this.state.rotationX + mouse.rateY / 5;
            this.knot.rotation.y = this.state.rotationY + mouse.rateX / 10;
            this.knot.rotation.z = this.state.rotationZ;
            this.knot.position.x = this.state.positionX;
            this.knot.position.y = this.state.positionY;
            this.knot.position.z = this.state.positionZ;
        }
    }

    public render() {
        this.changes();
        this.renderer.render(this.scene, this.camera);
    }

}

const mouse = {
    rateX: 0,
    rateY: 0,
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.rateX = (mouse.x / w) - 0.5;
    mouse.rateY = (mouse.y / h) - 0.5;
})
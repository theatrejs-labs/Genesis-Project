import {
    Sound
} from './tools/Sound';

import { cameraProps, containerProps, particlesProps } from './theatre-props';
import { Knot } from './tools/Knot';

declare var AudioContext: any;
declare var webkitAudioContext: any;
declare var Theatre: any;
declare var THREE: any;

AudioContext = AudioContext || webkitAudioContext;

export class Animation {

    public theatre: {
        project?: any,
        timeline?: any
    };

    private container: HTMLDivElement | null;
    private knot: any;
    private sound: any;
    private state: any;

    constructor(container: HTMLDivElement | null, width: number, height: number, state?: any) {
        this.container = container;
        this.state = state || null;
        this.knot = new Knot(container, width, height);
        this.initializeTheatre();
        window.addEventListener('load', this.initializeAudio.bind(this));
    }

    // Public Methods

    public resize(width: number, height: number): Animation {
        this.knot.resize(width, height);
        return this;
    }

    public play(): Animation {
        this.theatre.timeline.play();
        return this;
    }

    public pause(): Animation {
        this.theatre.timeline.pause();
        return this;
    }

    public ready(): any {
        return this.theatre.project.ready;
    }

    public render() {
        this.knot.render();
        this.syncAudio();
        requestAnimationFrame(this.render.bind(this));
    }

    // Private Methods

    private initializeTheatre(): void {
        this.theatre = {};
        const theatreProps = this.state ? {
            state: this.state
        }: {};
        this.theatre.project = new Theatre.Project('Max Cooper - Waves', theatreProps);
        this.theatre.timeline = this.theatre.project.getTimeline('Timeline');
        this.initializeTheatreForParticles();
        this.initializeTheatreForCamera();
        this.initializeTheatreForContainer();
    }

    private initializeTheatreForParticles() {
        const object = this.theatre.timeline.createObject('Particles', this.knot.state, particlesProps);
        object.onValuesChange((values: any) => {
            for (const key in values) {
                if (!values.hasOwnProperty(key)) { continue };
                this.knot.state[key] = values[key];
            }
            this.knot.renderer.domElement.style.filter = `hue-rotate(${values.hue}deg) brightness(${values.brightness})`;
            this.knot.draw();
        });
    }

    private initializeTheatreForCamera() {
        const object = this.theatre.timeline.createObject('Camera', this.knot.camera, cameraProps);
        object.onValuesChange((values: any) => {
            this.knot.camera.position.x = values.positionX;
            this.knot.camera.position.y = values.positionY;
            this.knot.camera.position.z = values.positionZ;
            this.knot.camera.lookAt(new THREE.Vector3(10, 0, 0));
        })
    }

    private initializeTheatreForContainer() {
        const object = this.theatre.timeline.createObject('Canvas', this.container, containerProps);
        object.onValuesChange((values: any) => {
            if (!this.container) { return; }
            this.container.style.transform = `scale(${values.scale}) translate3d(0px, ${values.top}px, 1px)`;
        })
    }

    private initializeAudio() {
        this.sound = new Sound('./audio/waves-maxcooper-lq.mp3');
        this.sound.ready().then(() => this.render());
    }

    private syncAudio() {
        if (this.theatre.timeline.playing && !this.sound.playing) {
            this.sound.currentTime = this.theatre.timeline.time;
            this.sound.play();
        } else if (!this.theatre.timeline.playing && this.sound.playing) {
            this.sound.pause();
        }
    }

}
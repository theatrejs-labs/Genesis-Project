import { BufferLoader } from './BufferLoader';

export class Sound {

    private context: any;
    private isReady: boolean;
    private onReadyListeners: any;
    private sourceNode: any;
    private startedAt: number;
    private pausedAt: number;
    private playing: boolean;
    private buffer: any;

    constructor(url: any) {
        this.context = new AudioContext();
        this.isReady = false;
        this.onReadyListeners = [];
        this.sourceNode = null;
        this.startedAt = 0;
        this.pausedAt = 0;
        this.playing = false;
        const bufferLoader = new BufferLoader(this.context, [url], (bufferList: any) => {
            this.buffer = bufferList[0];
            this.prepareReady();
        });
        bufferLoader.load();
    }

    public ready() {
        return new Promise((resolve) => {
            this.onReadyListeners.push(resolve)
        });
    }

    public play() {
        const offset = this.pausedAt;

        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.connect(this.context.destination);
        this.sourceNode.buffer = this.buffer;
        this.sourceNode.start(0, offset);

        this.startedAt = this.context.currentTime - offset;
        this.pausedAt = 0;
        this.playing = true;
    };

    public pause() {
        this.stop();
        this.pausedAt = this.context.currentTime - this.startedAt;
    };

    public stop() {
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode.stop(0);
            this.sourceNode = null;
        }
        this.pausedAt = 0;
        this.startedAt = 0;
        this.playing = false;
    };

    private prepareReady() {
        this.isReady = true;
        for (const listener of this.onReadyListeners) {
            if (!listener) { continue; }
            listener.call();
        }
    }

    set currentTime(time) {
        this.pausedAt = time;
        if (this.playing) {
            this.stop();
            this.play();
        }
    }

    get currentTime() {
        if (this.pausedAt) { return this.pausedAt; }
        if (this.startedAt) { return this.context.currentTime - this.startedAt; }
        return 0;
    };

    get duration() {
        return this.buffer.duration;
    };

}
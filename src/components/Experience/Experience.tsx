import * as React from 'react';
import AnimationState from '../../data/theatre/theatre-export.json';
import { Animation } from './Animation'

import { onBlow } from './tools/BreathDetection';

import './Experience.css'

interface IProps {

}

interface IState {
    isFront: boolean
}

export class Experience extends React.Component<IProps, IState> {

    private animation: Animation;
    private blowingMode: boolean;
    private container: HTMLDivElement | null;
    private messageBox: HTMLHeadingElement | null;
    private blowSpeed: number;

    constructor(props: IProps) {
        super(props);
        this.blowSpeed = 0;
        this.blowingMode = false;
        this.state = {
            isFront: true
        }
        window.onkeypress = (e: any) => {
            if (e.key === 'f') {
                this.setState({ isFront: !this.state.isFront });
            }
        };
    }

    public startBlowingMode(timeout = 10) {
        setTimeout(() => {
            this.blowingMode = true;
            this.showMessage('Start Blowing');
            onBlow((volume: number) => { if (this.blowingMode) { this.onBlow(volume) } });
        }, timeout);
    }

    public stopBlowingMode() {
        this.blowingMode = false;
    }

    public componentDidMount() {
        this.animation = new Animation(this.container, window.innerWidth, window.innerHeight, AnimationState);
        window.addEventListener('resize', this.handleResize.bind(this));
        this.startBlowingMode(1000);
        this.changes();
    }

    public showMessage(message: string): void {
        if (!this.messageBox) { return };
        this.messageBox.innerHTML = message;
        this.messageBox.classList.add('show');
        setTimeout(() => {
            if (this.messageBox) { this.messageBox.classList.remove('show'); }
        }, 1000);
    }

    public render() {
        return (<>
            <h2 className="message-box" ref={ref => this.messageBox = ref}>Message</h2>
            <div
                className="experience"
                style={{
                    zIndex: this.state.isFront ? 999999999 : 1
                }}
                ref={ref => this.container = ref} />
        </>)
    }

    private onBlow(volume: number): void {
        this.blowSpeed += 0.0016;
    }

    private handleResize() {
        this.animation.resize(window.innerWidth, window.innerHeight);
    }

    private goFullscreen() {
        if (!this.container) { return; }
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        };
    }

    private changes() {
        requestAnimationFrame(() => this.changes());
        const timeline = this.animation.theatre.timeline;
        if (this.blowingMode) {
            if (timeline.time + this.blowSpeed >= 0) { timeline.time += this.blowSpeed; }
            this.blowSpeed = this.blowSpeed > -0.003 ? this.blowSpeed - 0.001 : -0.003;
            if (timeline.time > 4.9) {
                this.stopBlowingMode();
                timeline.play();
            }
        }
    }

}
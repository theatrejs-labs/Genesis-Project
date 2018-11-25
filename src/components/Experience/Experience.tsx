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
    private blowedUp: boolean;

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
            this.showMessage('Blow the world out', Infinity, 'blow.svg');
            onBlow((volume: number) => { if (this.blowingMode) { this.onBlow(volume) } });
        }, timeout);
    }

    public stopBlowingMode() {
        this.blowingMode = false;
    }

    public componentDidMount() {
        this.animation = new Animation(this.container, window.innerWidth, window.innerHeight, AnimationState);
        window.addEventListener('resize', this.handleResize.bind(this));
        this.startBlowingMode(2 * 1000);
        this.changes();
    }

    public showMessage(message: string, timeout: number, image?: string): void {
        if (!this.messageBox) { return };
        this.messageBox.innerHTML = '';
        if (image) {
            this.messageBox.innerHTML += `<img src="./images/${image}" />`
        }
        this.messageBox.innerHTML += message;
        this.messageBox.classList.add('show');
        if (isFinite(timeout)) {
            setTimeout(() => {
                if (this.messageBox) { this.closeMessageBox() }
            }, timeout);
        }
    }
    
    public closeMessageBox () {
        if (!this.messageBox) { return };
        this.messageBox.classList.remove('show');
    }

    public render() {
        return (<>
            <h2 className="message-box" ref={ref => this.messageBox = ref} />
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
        if (this.blowSpeed > 0.028) { this.blowSpeed = 0.028; }
    }

    private handleResize() {
        this.animation.resize(window.innerWidth, window.innerHeight);
    }

    private changes() {
        requestAnimationFrame(() => this.changes());
        const timeline = this.animation.theatre.timeline;
        if (this.blowingMode) {
            if (timeline.time + this.blowSpeed >= 0) { timeline.time += this.blowSpeed; }
            this.blowSpeed = this.blowSpeed > -0.003 ? this.blowSpeed - 0.001 : -0.003;
            if (this.blowSpeed > 0.01) {
                this.blowedUp = true;
                this.closeMessageBox();
            }
            if (this.blowedUp && this.blowSpeed < 0) {
                this.showMessage('Blow again! harder this time', 2000, 'blow.svg ');
                this.blowedUp = false;
            }
            if (timeline.time > 4.9) {
                this.stopBlowingMode();
                timeline.play();
            }
        }
    }

}
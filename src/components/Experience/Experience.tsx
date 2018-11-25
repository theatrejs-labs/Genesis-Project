import * as React from 'react';
import AnimationState from '../../data/theatre/theatre-export.json';
import { Animation } from './Animation'

import { breathingAlgorithm as blow } from './tools/BreathDetection';

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
    private blowSpeed: number;

    constructor (props: IProps) {
        super(props);
        this.blowSpeed = 0;
        this.blowingMode = false;
        this.state = {
            isFront: false
        }
        window.onkeypress = (e: any) => {
            if (e.key === 'f') {
                this.setState({ isFront: !this.state.isFront });
            }
        };
        blow.events.onRunning = () => {
            this.blowSpeed += 0.002;
            if (this.blowSpeed > 0.035) {
                this.blowSpeed = 0.035;
            }
        };
        this.startBlowingMode();
    }

    public startBlowingMode () {
        this.blowingMode = true;
        blow.run();
    }

    public stopBlowingMode () {
        this.blowingMode = false;
    }

    public componentDidMount () {
        this.animation = new Animation(this.container, window.innerWidth, window.innerHeight, AnimationState);
        window.addEventListener('resize', this.handleResize.bind(this));
        this.changes();
    }

    public render () {
        return (<div
            className="experience"
            style={{
                zIndex: this.state.isFront ? 999999999 : 1
            }}
            ref={ref => this.container = ref} />)
    }

    private handleResize() {
        this.animation.resize(window.innerWidth, window.innerHeight);
    }

    private goFullscreen () {
        if (!this.container) { return; }
        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        };
    }

    private changes () {
        requestAnimationFrame(() => this.changes());
        const timeline = this.animation.theatre.timeline;
        if (this.blowingMode) {
            timeline.time += this.blowSpeed;
            this.blowSpeed = this.blowSpeed > -0.003 ? this.blowSpeed - 0.001 : -0.003;
            if (timeline.time > 4.9) {
                this.stopBlowingMode();
                timeline.play();
            }
        }
    }

}
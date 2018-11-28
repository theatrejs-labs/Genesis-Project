import * as React from 'react';
import AnimationState from '../../data/theatre/theatre-export.json';
import { Animation } from './Animation'

import { microphoneEvents, onBlow } from './tools/BreathDetection';

import './Experience.css'

declare var theatreUIRoot: any;

interface IProps {

}

interface IState {
    editMode: boolean,
    microphoneGranted: boolean
}

export class Experience extends React.Component<IProps, IState> {

    private animation: Animation;
    private blowingMode: boolean;
    private container: HTMLDivElement | null;
    private messageBox: HTMLHeadingElement | null;
    private blowSpeed: number;
    private blowedUp: boolean;
    private editSuggestionShownUp: boolean;

    constructor(props: IProps) {
        super(props);
        this.blowSpeed = 0;
        this.blowingMode = false;
        this.editSuggestionShownUp = false;
        this.state = {
            editMode: false,
            microphoneGranted: false
        }
        window.onkeypress = (e: any) => {
            if (e.key === 'e') {
                this.closeMessageBox();
                this.setState({ editMode: !this.state.editMode });
            }
        };
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.setState({ editMode: this.state.editMode });
            }, 100);
        });
        microphoneEvents.onGranted = () => {
            this.setState({ microphoneGranted: true });
        }
    }

    public startBlowingMode() {
        if (this.state.microphoneGranted) {
            this.blowingMode = true;
            this.showMessage('Blow the world out', Infinity, 'blow.svg');
            onBlow((volume: number) => { if (this.blowingMode) { this.onBlow(volume) } });
        } else {
            this.showMessage(`No microphone detected`, 5000, 'no-mic.svg');
            setTimeout(() => this.animation.theatre.timeline.play(), 8000);
        }
    }

    public stopBlowingMode() {
        this.blowingMode = false;
        this.closeMessageBox();
    }

    public componentDidMount() {
        this.animation = new Animation(this.container, window.innerWidth, window.innerHeight, AnimationState);
        window.addEventListener('resize', this.handleResize.bind(this));
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
        const margin = 40;

        const timeline = document.querySelector('.theatrejs-ui-root > div > div > div') as HTMLDivElement;
        const timelineHeight = timeline ? timeline.offsetHeight : 0;
        const size = window.innerHeight - timelineHeight - margin * 2;

        const scaleOnEditMode: number = size / window.innerHeight;
        const transformYOnEditMode: number = -((window.innerHeight / 2) - (size / 2 + margin - 5));

        return (<>
            <h2 className="message-box" ref={ref => this.messageBox = ref} />
            <div
                className={"experience" + (this.state.editMode ? ' edit-mode' : '')}
                style={{
                    transform: !this.state.editMode ? `` : `translateY(${ transformYOnEditMode }px) scale(${ scaleOnEditMode })`
                }}
                ref={ref => this.container = ref} />
        </>)
    }

    private onBlow(volume: number): void {
        this.blowSpeed += 0.0014;
        if (this.blowSpeed > 0.018) { this.blowSpeed = 0.018; }
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
                this.showMessage('Blow again! harder this time', 2000, 'blow.svg');
                this.blowedUp = false;
            }
            if (timeline.time > 1.7) {
                this.stopBlowingMode();
                timeline.play({ iteration: 1 });
            }
        }
        if (timeline.time > 55 && !this.editSuggestionShownUp) {
            if (!this.state.editMode) {
                this.showMessage('To edit this animation press "E"', Infinity, 'animation.svg');
            }
            this.editSuggestionShownUp = true;
        }
    }

}
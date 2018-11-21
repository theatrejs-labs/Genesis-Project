import * as React from 'react';
import AnimationState from '../../data/theatre/theatre-export.json';
import { Animation } from './Animation'

interface IProps {
    fullscreen: boolean
};

export class Experience extends React.Component<IProps, {}> {

    private animation: Animation;
    private container: HTMLDivElement | null;

    public componentDidMount () {
        this.animation = new Animation(this.container, window.innerWidth, window.innerHeight, AnimationState);
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    public render () {
        return (<div ref={ref => this.container = ref} />)
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

}
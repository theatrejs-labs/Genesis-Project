import * as React from 'react';

import './Intro.css';

interface IState {

}

interface IProps {
    goToExperience: () => void
}

export class Intro extends React.Component<IProps, IState> {

    private container: HTMLDivElement | null;

    public render () {
        return (
            <div className="intro" ref={ref => this.container = ref}>
                <div className="container">
                    {/* <img className="logo" src="./images/genesis.svg" /> */}
                    <h1>Genesis</h1>
                    <h2>Alpha moments of everything</h2>
                    <button onClick={() => this.goThroughExperience()}>Go through experience</button>
                </div>
                <p className="used-technologies">a <a href="https://theatrejs.com" target="_blank">Theatre.js</a> + <a href="https://threejs.org" target="_blank">Three.js</a> experience</p>
            </div>
        )
    }

    private goThroughExperience () {
        if (!this.container) { return; }
        this.container.classList.add('hide');
        setTimeout(() => this.props.goToExperience(), 3000);
    }

}
import * as React from 'react';
import { Experience } from '../Experience/Experience';
import { Intro } from '../Intro/Intro';

import './App.css';

interface IState {

}

interface IProps {

}

class App extends React.Component<IProps, IState> {

  public experience: Experience | null; 

  public goToExperience () {
    if (!this.experience) { return; };
    this.experience.startBlowingMode();
  }

  public render() {
    return (
      <div className="App">
        <Intro goToExperience={() => this.goToExperience()} />
        <Experience ref={ref => this.experience = ref} />
      </div>
    );
  }
}

export default App;

import * as React from 'react';
import { Experience } from '../Experience/Experience';

import './App.css';

class App extends React.Component<{
  title: string
}> {
  public render() {
    return (
      <div className="App">
        <Experience />
      </div>
    );
  }
}

export default App;

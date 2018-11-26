import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { preload } from './tools/imagePreloader';
import './tools/TheatreUIConfigurations';

// Preloading Images
preload([
  "./images/animation.svg",
  "./images/blow.svg",
  "./images/genesis.svg"
])

// Rendering Application
ReactDOM.render(
  <App title="Genesis" />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

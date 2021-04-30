import React from 'react';
import './App.css';
import Navigation from './components/molecules/Navigation';


const App: React.FC = () => {

  return (
    <div className='app'>
      <aside className='aside'>
        <Navigation/>
      </aside>
      <div id='canvas-container'>
        <canvas id='canvas' data-paper-resize='true'/>
      </div>
    </div>
  );
};

export default App;

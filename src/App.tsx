import React, { useEffect } from 'react';
import './App.css';

import DxfParser from './dxf-parser/src/index';
import { init } from './canvas/render';

const App: React.FC = () => {

  useEffect(() => {
    fetch('http://127.0.0.1:4300/getData')
      .then((res) => res.json())
      .then(({ data }) => {
        const parser = new DxfParser();
        const dxf: any = parser.parseSync(data);

        dxf.entities.forEach((e: any) => {
          if (e.type === 'INSERT') {
            dxf.blocks[e.name].id = e.id;
            dxf.blocks[e.name].parentId = e.parentId;
          }
        });

        init(dxf);
      });
  }, []);

  return (
    <div className='app'>
      <canvas id='canvas' data-paper-resize='true'/>
    </div>
  );
};

export default App;

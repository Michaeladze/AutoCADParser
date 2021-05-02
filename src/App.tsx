import React, { useEffect } from 'react';
import './App.scss';
import { useLocation } from 'react-router-dom';
import { init } from './canvas/render';
import DxfParser from './dxf-parser/src';
import CanvasActions from './components/molecules/CanvasActions';
import AsideContainer from './components/organisms/AsideContainer';
import CanvasLegend from './components/molecules/CanvasLegend';

const App: React.FC = () => {
  const { pathname } = useLocation();

  const renderCanvas = (data: string) => {
    const parser = new DxfParser();
    const dxf: any = parser.parseSync(data);

    dxf.entities.forEach((e: any) => {
      if (e.type === 'INSERT') {
        dxf.blocks[e.name].id = e.id;
        dxf.blocks[e.name].parentId = e.parentId;
      }
    });
    init(dxf);
  };

  const getData = (id: string) => {
    fetch(`http://127.0.0.1:4300/getData/${id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        renderCanvas(data);
      });
  };

  useEffect(() => {
    const a = pathname.split('/');
    const id = a[a.length - 1];

    if (id) {
      getData(id);
    }
  }, [pathname]);

  return (
    <div className='app'>
      <div id='canvas-container'>
        <canvas id='canvas' data-paper-resize='true'/>
      </div>
      <AsideContainer/>
      <CanvasActions/>
      <CanvasLegend/>
    </div>
  );
};

export default App;

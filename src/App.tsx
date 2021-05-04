import React, { useEffect, useState } from 'react';
import './App.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { init } from './canvas/render';
import DxfParser from './dxf-parser/src';
import CanvasActions from './components/molecules/CanvasActions';
import AsideContainer from './components/organisms/AsideContainer';
import CanvasLegend from './components/molecules/CanvasLegend';
import { IAttributeMap, ISchema } from './types/types';

const App: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const [schema, setSchema] = useState<ISchema | undefined>(undefined);

  const renderCanvas = (data: string) => {
    const parser = new DxfParser();
    const dxf: any = parser.parseSync(data);

    dxf.entities.forEach((e: any) => {
      if (e.type === 'INSERT') {
        dxf.blocks[e.name].id = e.id;
        dxf.blocks[e.name].parentId = e.parentId;
      }
    });

    const onWorkplaceClick = (attributes: IAttributeMap) => {
      console.log(attributes);
      const roomArray = attributes['помещение'].text.split(' ');
      const room = roomArray.length > 0 ? roomArray[0] : '';
      const number = `${room}.${attributes['номер'].text}`;
      history.push(`${pathname}?table=${attributes['ключ'].text}&number=${number}`);
    };

    const schema = init(dxf, onWorkplaceClick);

    if (schema) {
      setSchema(schema);
    }
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
    } else {
      history.push('/schema/1');
    }
  }, [pathname]);

  return (
    <div className='app'>
      <div id='canvas-container'>
        <canvas id='canvas' data-paper-resize='true'/>
      </div>
      <AsideContainer/>
      { schema && (
        <>
          <CanvasActions schema={ schema }/>
          <CanvasLegend/>
        </>
      ) }
    </div>
  );
};

export default App;

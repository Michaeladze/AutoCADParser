import React, { useEffect } from 'react';
import './Navigation.scss';
import DxfParser from '../../../dxf-parser/src';
import { init } from '../../../canvas/render';
import { IOption } from 'root-front/dist/types';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
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

  const navigation: IOption[] = [
    {
      label: 'Схема 1',
      value: '1'
    },
    {
      label: 'Схема 2',
      value: '2'
    },
    {
      label: 'Схема 3',
      value: '3'
    },
    {
      label: 'Схема 4',
      value: '4'
    },
    {
      label: 'Схема 5',
      value: '5'
    }
  ];

  const navigationJSX = navigation.map((n: IOption) =>
    <NavLink activeClassName='nav-link--active' className='nav-link' to={`/schema/${n.value}`} key={n.value}>{n.label}</NavLink>);

  return (
    <div className='nav'>
      { navigationJSX }
    </div>
  );
};

export default Navigation;

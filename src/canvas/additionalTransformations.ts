// функция ищет пуфы и стулья и заменяет их на кружки

import {
  IArcEntity, IEntity, IHatchEntity, ITextEntity, IVertex
} from '../types/types';
import { drawEntity } from './draw';
import { RandomColor } from '../dxf-parser/src/colors';
// =========================================================================================================================================
/** если сидячее место, то заменяем его на кружок*/
export const replaceWorkPlaces = (entity: IEntity, scale:any) => {
  const puf = entity.name && ~entity.name.toLowerCase().indexOf('пуф');
  const armchair = entity.name && ~entity.name.toLowerCase().indexOf('кресло');
  const chair = entity.name && ~entity.name.toLowerCase().indexOf('стул');

  if (armchair || chair || puf) {
    const en = entity as IArcEntity;
    en.type = 'CIRCLE';
    en.color = 'lightgray';
    en.radius = 200;
    en.center = {
      x: 0,
      y: chair ? -200 : 0,
      z: 0
    };
    drawEntity(en, scale, true);
    return true;
  }

  return false;
};
// =========================================================================================================================================
/** рисует цифры на рабочих местах*/
export const drawNumbers = (entity: IEntity, scale:any, number:{point:IVertex, text:string, fontSize:number}) => {
  const en = { ...entity } as ITextEntity;
  en.text = number.text;
  en.position = number.point;
  en.type = 'MTEXT';
  // немного увеличиваем шрифт
  en.height = number.fontSize + 20;
  drawEntity(en, scale, false);
};
// =========================================================================================================================================
/** превращает полилайн в hatch*/
export const changePolyline = (entity:IHatchEntity) => {

  entity.boundaries = [[]];

  let start:IVertex|undefined;
  let end:IVertex|undefined;


  for (let i = 0; i < entity.vertices.length; i++) {
    if (!start) {
      start = entity.vertices[i];
      continue;
    }

    if (!end) {
      end = entity.vertices[i];
      entity.boundaries[0].push([start, end]);
      start = entity.vertices[i];
      end = undefined;
    }

  }

  entity.boundaries[0].push([start as IVertex, entity.vertices[0]]);
  entity.color = new RandomColor('#f1d407', 'rgb(6,91,236)').getColor() + '2d';

  return entity;
};

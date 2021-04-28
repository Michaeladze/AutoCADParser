// функция ищет пуфы и стулья и заменяет их на кружки

import {
  IArcEntity, IEntity, ITextEntity, IVertex
} from '../types/types';
import { drawEntity } from './draw';
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

  if (number.fontSize < 1) {
    return;
  }

  const en = { ...entity } as ITextEntity;
  en.text = number.text;
  en.position = number.point;
  en.type = 'MTEXT';
  en.height = number.fontSize + 20;


  drawEntity(en, scale, false);

};

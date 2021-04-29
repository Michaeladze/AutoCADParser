// функция ищет пуфы и стулья и заменяет их на кружки

import {
  IArcEntity, IEntity, IHatchEntity, ITextEntity, IVertex
} from '../types/types';
import { drawEntity } from './draw';
import { RandomColor } from '../dxf-parser/src/colors';

import paper from 'paper';
// =========================================================================================================================================
/** если сидячее место, то заменяем его на кружок*/
export const replaceWorkPlaces = (entity: IEntity, scale:any, layers: Record<string, paper.Layer>) => {

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
    drawEntity(en, scale, layers, true);
    return true;
  }

  return false;
};
// =========================================================================================================================================
/** рисует цифры на рабочих местах*/
export const drawNumbers = (
  entity: IEntity, scale:any,
  number:{point:IVertex, text:string, fontSize:number},
  layers: Record<string, paper.Layer>
) => {
  const en = { ...entity } as ITextEntity;
  en.text = number.text;
  en.position = number.point;
  en.type = 'MTEXT';
  // немного увеличиваем шрифт
  en.height = number.fontSize + 20;
  drawEntity(en, scale, layers, false);
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

// =========================================================================================================================================
/** функция уменьшает количество линий на карте*/

/** округляем до 4 символа точку*/
const round = (points:IVertex[]):IVertex[] => points.map(p => ({
  x: +p.x.toFixed(4),
  y: +p.y.toFixed(4),
  z: p.z
}));
/** передается 2 линии смотрим совпадают ли концы с погрешностью 2 пикселя*/
const condition = (pStart:IVertex, pEnd:IVertex, lStart:IVertex, lEnd:IVertex) => {
  const delta = 2;
  const result = false;
  const comp = (a:number, b:number, a1:number, b1:number) => ((a + delta > a1 && a - delta < a1) && (b + delta > b1 && b - delta < b1));

  const t1 = comp(pStart.x, pStart.y, lStart.x, lStart.y);
  // const t2 = comp(pStart.x, pStart.y, lEnd.x, lEnd.y);
  const t3 = comp(pEnd.x, pEnd.y, lStart.x, lStart.y);
  const t4 = comp(pEnd.x, pEnd.y, lEnd.x, lEnd.y);
  return result || t1 || t3 || t4;
};

/** основная функция*/
export const simplifyBlock = (en:IEntity[]):IEntity[] => {


  const path:IEntity[] = [];

  const map:any = {};


  const lines = en.filter(en => {
    /** фильтруем одинаковые линии*/
    let result = false;

    if (en.type === 'LINE' && !map[JSON.stringify(round(en.vertices))]) {
      result = true;
      map[JSON.stringify(round(en.vertices))] = true;
      map[JSON.stringify(round([en.vertices[1], en.vertices[0]]))] = true;
    }

    return result;
  });

  // ////////////////////////////////////////////////////
  let p1 = lines.shift();

  /** рекурсивная функция поиска в глубину
   * ищет линию которая является продолжением переданной
   * если линий несколько то ставит тег find_there для повторного прохождения
   * если линия уже включена в путь то ставит id=-1
   * */
  function find(p:IEntity) {
    let success = false;

    for (let i = 0; i < lines.length; i++) {

      if (lines[i].id !== '-1') {
        if ( condition(p.vertices[0], p.vertices[1], lines[i].vertices[0], lines[i].vertices[1])) {
          if (!success) {
            lines[i].id = '-1';
            p1 && (p1.vertices = p1.vertices.concat(lines[i].vertices));
            find(lines[i]);
            success = true;
          } else {
            lines[i].name = 'find_there';
          }
        }
      }
    }
  }

  /** основной цикл по всем линиям*/
  while (lines.length) {
    if (p1 && p1.id !== '-1') {
      find(p1);
      path.push(p1 as IEntity);
    }

    /** для нового поиска пересортируем вершины с учетом того начало в find_there */
    lines.sort((a:IEntity, b:IEntity) => ((a.name || '') < (b.name || '') ? 1 : -1));

    p1 = lines.shift();

  }
  // добавляем последнюю точку
  (p1 && p1.id !== '-1') && path.push(p1 as IEntity);

  return en.filter(en => en.type !== 'LINE').concat(path.map((i) => ({
    ...i,
    type: 'PATH'
  })));
};

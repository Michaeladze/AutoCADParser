// функция ищет пуфы и стулья и заменяет их на кружки

import {
  IAttribute,
  IBlock, IEntity, IHatchEntity, ITextEntity, IVertex
} from '../types/types';
import { drawEntity } from './draw';
import { RandomColor } from '../dxf-parser/src/colors';

import paper from 'paper';
import { calculatePoints, findCenter } from './helpers';
import { IScale } from '../types/helper.types';
import { mainDraw } from './render';


export const checkSeats = (entity: IEntity): boolean => {
  const puf = (entity.name && entity.name.toLowerCase().indexOf('пуф') >= 0) || false;
  const armchair = (entity.name && entity.name.toLowerCase().indexOf('кресло') >= 0) || false;
  const chair = (entity.name && entity.name.toLowerCase().indexOf('стул') >= 0) || false;

  return armchair || chair || puf;
};
// =========================================================================================================================================
export const replaceWorkPlaces = (entity: IEntity, block: IBlock, scale: IScale, layers: Record<string, paper.Layer>) => {


  if (entity.name && entity.name.toLowerCase().indexOf('кресло') >= 0) {
    return;
  }

  const vertices: IVertex[] = block.entities.reduce((acc: IVertex[], e: IEntity) => {
    if (e.vertices) {
      acc = [...acc, ...e.vertices];
    }

    return acc;
  }, []);

  const points: IVertex[] = calculatePoints(vertices, entity.position, entity.rotation);
  const center: IVertex = findCenter(points, scale);

  new paper.Path.Circle({
    center: [center.x, center.y],
    radius: scale.scale(150),
    strokeColor: 'lightgray'
  });
};
// =========================================================================================================================================
/** рисует цифры на рабочих местах*/
export const drawNumbers = (
  entity: IEntity, scale: IScale,
  number:IAttribute,
  layers: Record<string, paper.Layer>
) => {
  const en = { ...entity } as ITextEntity;
  en.text = number.text;
  en.position = number.point ? number.point : {
    x: 0,
    y: 0,
    z: 0
  };
  en.type = 'MTEXT';
  // немного увеличиваем шрифт
  en.height = number.fontSize + 20;
  drawEntity({ entity: en, });
};
// =========================================================================================================================================

/** превращает полилайн в hatch*/
export const changePolyline = (en: IEntity):IHatchEntity => {


  const entity = en as IHatchEntity;
  entity.boundaries = [[]];

  let start: IVertex | undefined;
  let end: IVertex | undefined;


  for (let i = 0; i < entity.vertices.length; i++) {
    if (!start) {
      start = entity.vertices[i];
      continue;
    }

    if (!end) {
      end = entity.vertices[i];
      entity.boundaries[0].push(start, end);
      start = entity.vertices[i];
      end = undefined;
    }

  }

  entity.boundaries[0].push(start as IVertex, entity.vertices[0]);


  const path = new paper.Path();
  entity.vertices.forEach(it => {

    path.add(new paper.Point(it.x, it.y));
  });
  path.closePath();

  // console.log(path.bounds);
  // debugger;

  mainDraw.selection.places.forEach((pl) => {
    let test = false;
    test = !test ? path.contains(new paper.Point( (pl.position?.x || 0), (pl.position?.y || 0) )) : true;
    test = !test ? path.contains(new paper.Point(pl.position?.x || 0, (pl.position?.y || 0) - 1)) : true;
    test = !test ? path.contains(new paper.Point(pl.position?.x || 0, (pl.position?.y || 0) + 1)) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) + 1, pl.position?.y || 0)) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) + 1, (pl.position?.y || 0) + 1)) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) + 1, (pl.position?.y || 0) - 1)) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) - 1, (pl.position?.y || 0) )) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) - 1, (pl.position?.y || 0) + 1)) : true;
    test = !test ? path.contains(new paper.Point((pl.position?.x || 0) - 1, (pl.position?.y || 0) - 1)) : true;


    if (test) {
      entity.handle = 'place';
      !entity.attr && (entity.attr = {});
      pl.attr && pl.attr['помещение'] && ( entity.attr['помещение'] = pl.attr['помещение'] );
    }
  });

  // добавляем марки помещений
  if (entity.handle === 'place' ) {
    mainDraw.selection.markers.forEach(mark => {
      if ( path.contains(new paper.Point(mark.position?.x || 0, mark.position?.y || 0)) &&
        entity.attr && ~entity.attr['помещение'].text.indexOf(mark.attr ? mark.attr['номер'].text : '')
      ) {
        !entity.marks && (entity.marks = []);
        entity.marks.push(mark);
      }

    });
  }


  entity.handle === 'place' && (entity.centralPoint = {
    x: path.bounds.center.x,
    y: path.bounds.center.y,
    z: 0
  });

  // new paper.Path.Circle({
  //   center: [scale.x(path.bounds.center.x), scale.y(path.bounds.center.y)],
  //   radius: 2,
  //   strokeColor: 'red'
  // });
  path.remove();


  entity.color = entity.handle === 'place' ? new RandomColor('#f1d407', 'rgb(6,91,236)').getColor() + '2d' : '#ffffff00';
  entity.type = 'HATCH';
  return entity as IHatchEntity;
};

// =========================================================================================================================================
/** функция уменьшает количество линий на карте*/

/** округляем до 4 символа точку*/
const round = (points: IVertex[]): IVertex[] => points.map(p => ({
  x: +p.x.toFixed(4),
  y: +p.y.toFixed(4),
  z: p.z
}));

/** передается 2 линии смотрим совпадают ли концы с погрешностью 2 пикселя*/
const condition = (pStart: IVertex, pEnd: IVertex, lStart: IVertex, lEnd: IVertex) => {
  const delta = 2;
  const result = false;
  const comp = (a: number, b: number, a1: number, b1: number) => ((a + delta > a1 && a - delta < a1) && (b + delta > b1 && b - delta < b1));

  const t1 = comp(pStart.x, pStart.y, lStart.x, lStart.y);
  // const t2 = comp(pStart.x, pStart.y, lEnd.x, lEnd.y);
  const t3 = comp(pEnd.x, pEnd.y, lStart.x, lStart.y);
  const t4 = comp(pEnd.x, pEnd.y, lEnd.x, lEnd.y);
  return result || t1 || t3 || t4;
};

/** основная функция*/
export const simplifyBlock = (en: IEntity[]): IEntity[] => {


  const path: IEntity[] = [];

  const map: any = {};


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
  function find(p: IEntity) {
    let success = false;

    for (let i = 0; i < lines.length; i++) {

      if (lines[i].id !== '-1') {
        if (condition(p.vertices[0], p.vertices[1], lines[i].vertices[0], lines[i].vertices[1])) {
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
    lines.sort((a: IEntity, b: IEntity) => ((a.name || '') < (b.name || '') ? 1 : -1));

    p1 = lines.shift();

  }
  // добавляем последнюю точку
  (p1 && p1.id !== '-1') && path.push(p1 as IEntity);

  return en.filter(en => en.type !== 'LINE').concat(path.map((i) => ({
    ...i,
    type: 'PATH'
  })));
};

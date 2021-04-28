import {
  IArcEntity, IEntity, IHatchEntity, ITextEntity, IVertex
} from '../types/types';
import { calculatePoints, findRanges } from './helpers';
import * as paper from 'paper';
import { RandomColor } from '../dxf-parser/src/colors';
import { IRanges } from '../types/helper.types';

const changePolyline = (entity:IHatchEntity) => {

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


export function drawEntity(entity: IEntity, scale: any, insert?: boolean) {

  // ==========================================Отрисовка Примитивов=========================================================================
  switch (entity.type) {
  case 'LINE':

    drawLine(entity, scale);
    break;
  case 'LWPOLYLINE':

    drawHatch( changePolyline(entity as IHatchEntity), scale, !!insert);


    break;
  case 'CIRCLE':
    const en = entity as IArcEntity;
    en.startAngle = 0;
    en.endAngle = 1.9999 * Math.PI;
    drawArc(en, scale, !!insert);
    break;
  case 'ARC':
    drawArc(entity as IArcEntity, scale, !!insert);
    break;
  case 'ELLIPSE':

    // drawEllipse(entity as IEllipseEntity, scale);
    break;
  case 'HATCH':

    drawHatch(entity as IHatchEntity, scale, !!insert);
    break;
  case 'MTEXT':

    drawText(entity as ITextEntity, scale, !!insert);
    break;
  default:
    // console.log(entity)
    break;
  }
}

// ==================================== Отрисовка линии ====================================================================================
export function drawLine(entity: IEntity, scale: any) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({ strokeColor: 'black' });

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}
// ==================================== Отрисовка арки======================================================================================
function calcArc(angle:number, entity:IArcEntity, insert: boolean) {
  const firstX = Math.cos(angle) * entity.radius + entity.center.x;
  const firstY = Math.sin(angle) * entity.radius + entity.center.y;
  return !insert ?
    calculatePoints([
      {
        x: firstX,
        y: firstY,
        z: 0
      }
    ])[0] :
    calculatePoints([
      {
        x: firstX,
        y: firstY,
        z: 0
      }
    ], entity.position, entity.rotation)[0];
}


export function drawArc(entity: IArcEntity, scale: any, insert: boolean) {


  let mid = (entity.endAngle - entity.startAngle) / 2 + entity.startAngle;

  if (entity.endAngle < entity.startAngle) {
    mid = mid * -3 * Math.PI;
  }

  const start = calcArc(entity.startAngle, entity, insert);
  const end = calcArc(entity.endAngle, entity, insert);
  const middle = calcArc(mid, entity, insert);

  // var path = new paper.Path.Circle({
  //   center: [scale.x(start.x), scale.y(start.y)],
  //   radius: 2,
  //   strokeColor: 'blue'
  // });
  // var path = new paper.Path.Circle({
  //   center: [scale.x(end.x), scale.y(end.y)],
  //   radius: 2,
  //   strokeColor: 'red'
  // });
  // var path = new paper.Path.Circle({
  //   center: [scale.x(middle.x), scale.y(middle.y)],
  //   radius: 2,
  //   strokeColor: 'darkgray'
  // });
  new paper.Path.Arc({
    from: [scale.x(start.x), scale.y(start.y)],
    through: [scale.x(middle.x), scale.y(middle.y)],
    to: [scale.x(end.x), scale.y(end.y)],
    strokeColor: 'black',
    fillColor: entity.color

  });


}


let activeEntity: any = undefined;
let hoverEntity: any = undefined;

export function drawHatch(entity: IHatchEntity, scale: any, insert: boolean) {
  if (entity.name && ~entity.name.toLowerCase().indexOf('место')) {
    drawRect(entity, scale);
    return;
  }

  entity.boundaries.forEach((boundary: IVertex[][]) => {
    const path = new paper.Path({
      fillColor: entity.color ? entity.color : 'rgb(147, 149, 152)',
      strokeColor: 'rgb(147, 149, 152)'
    });

    const flat: IVertex[] = boundary.reduce((acc: IVertex[], v: IVertex[]) => {
      acc = [...acc, ...v];
      return acc;
    }, []);

    const points: IVertex[] = insert ?
      calculatePoints(flat, entity.position, entity.rotation) :
      calculatePoints(flat);

    points.forEach((point: IVertex) => {
      path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
    });

    if (entity.layer === '0') {
      // @ts-ignore
      path.fillColor = '#efefef';
      path.sendToBack();
    }

    if (insert) {
      // @ts-ignore
      path.fillColor = 'white';
      path.onClick = () => {
        if (activeEntity) {
          activeEntity.fillColor = 'white';
        }

        activeEntity = path;
        activeEntity.fillColor = 'crimson';
        console.log(entity);
      };

      path.onMouseEnter = () => {
        hoverEntity = path;
        hoverEntity.fillColor = 'teal';
      };

      path.onMouseLeave = () => {
        if (hoverEntity && path !== activeEntity) {
          hoverEntity.fillColor = 'white';
        }
      };
    }
  });
}
// @ts-ignore
// let t1 = 0;


export function drawText(entity: ITextEntity, scale: any, insert = false) {


  let text = entity.text;
  try {
    text = decodeURIComponent(JSON.parse('"' + entity.text.split('U+')
      .join('u')
      .replace(/\"/g, '\\"') + '"'));
  } catch (e) {

  }
  // console.log(text);

  // if ([1, 8, 13].includes(t1)) {


  new paper.PointText({
    point: [scale.x(entity.position.x), scale.y(entity.position.y)],
    content: text,
    fillColor: 'black',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: scale.scale(entity.height)
  });


  // t1 += 1;
}

export function drawRect(entity: IHatchEntity, scale: any) {
  const vertices: IVertex[] = [];
  entity.boundaries.forEach((boundary: IVertex[][]) => {
    boundary.forEach((points: IVertex[]) => {
      points.forEach((p: IVertex) => {
        vertices.push(p);
      });
    });
  });

  const points: IVertex[] = calculatePoints(vertices, entity.position, entity.rotation);
  // @ts-ignore
  const { xDomain, yDomain }: IRanges = findRanges([{ vertices: points }]);

  const x = scale.x(xDomain[0]);
  const y = scale.y(yDomain[0]);
  const w = scale.x(xDomain[1]) - scale.x(xDomain[0]);
  const h = scale.y(yDomain[1]) - scale.y(yDomain[0]);

  const rect = new paper.Rectangle(x, y, w, h);
  const path = new paper.Path.Rectangle(rect);
  // @ts-ignore
  path.strokeColor = 'rgb(147, 149, 152)';
}

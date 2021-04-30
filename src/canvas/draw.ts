import {
  IArcEntity, IEntity, IHatchEntity, ITextEntity, IVertex
} from '../types/types';
import {
  calculatePoints, findCenter, findRangesFromPoints
} from './helpers';
import * as paper from 'paper';
import { IScale } from '../types/helper.types';
import { changePolyline } from './additionalTransformations';
import { statistics, statisticsFull } from './render';

export function drawEntity(entity: IEntity, scale: IScale, layers: Record<string, paper.Layer>, insert?: boolean, entities?:IEntity[]) {

  statistics[entity.type] ? (statistics[entity.type] += 1) : (statistics[entity.type] = 1);
  statisticsFull[entity.layer + '/' + entity.type] ? (statisticsFull[entity.layer + '/' + entity.type] += 1) : (statisticsFull[entity.layer + '/' + entity.type] = 1);
  statisticsFull['count'] ? statisticsFull['count'] += 1 : statisticsFull['count'] = 1;

  // ==========================================Отрисовка Примитивов=========================================================================

  switch (entity.type) {
  case 'LINE':
    drawLine(entity, scale);
    break;
  case 'LWPOLYLINE':
    drawHatch(changePolyline(entity as IHatchEntity, entities), scale, !!insert, layers);
    break;
  case 'CIRCLE':
    const en = entity as IArcEntity;
    en.startAngle = 0;
    en.endAngle = 1.9999 * Math.PI;
    drawArc(en, scale, !!insert, layers);
    break;
  case 'ARC':
    drawArc(entity as IArcEntity, scale, !!insert, layers);
    break;
  case 'ELLIPSE':
    // drawEllipse(entity as IEllipseEntity, scale);
    break;
  case 'HATCH':
    drawHatch(entity as IHatchEntity, scale, !!insert, layers);
    break;
  case 'MTEXT':
    drawText(entity as ITextEntity, scale, !!insert, layers);
    break;
  case 'PATH':
    drawPath(entity as ITextEntity, scale, !!insert);
    break;
  default:
    break;
  }
}

// =========================================================================================================================================
// ==================================== Отрисовка линии ====================================================================================

export function drawLine(entity: IEntity, scale: IScale) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({ strokeColor: 'black' });

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}

// ==================================== Отрисовка арки======================================================================================

function calcArc(angle: number, entity: IArcEntity, insert: boolean) {
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


export function drawArc(entity: IArcEntity, scale: IScale, insert: boolean, layers: Record<string, paper.Layer>) {
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
  const arc = new paper.Path.Arc({
    from: [scale.x(start.x), scale.y(start.y)],
    through: [scale.x(middle.x), scale.y(middle.y)],
    to: [scale.x(end.x), scale.y(end.y)],
    strokeColor: 'rgb(147, 149, 152)',
    fillColor: entity.color
  });

  layers.items.addChild(arc);
}

// =========================================================================================================================================

export function drawPath(entity: IEntity, scale: IScale, insert: boolean) {
  const path = new paper.Path({ strokeColor: 'rgb(147, 149, 152)' });

  const points: IVertex[] = insert ?
    calculatePoints(entity.vertices, entity.position, entity.rotation) :
    calculatePoints(entity.vertices);

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });

}

// =========================================================================================================================================

let activeEntity: any = undefined;
let hoverEntity: any = undefined;

export function drawHatch(entity: IHatchEntity, scale: IScale, insert: boolean, layers: Record<string, paper.Layer>) {
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
      return;
    }

    if (entity.name && ~entity.name.toLowerCase().indexOf('место')) {
      // @ts-ignore
      path.strokeColor = 'rgb(147, 149, 152)';
      // @ts-ignore
      path.fillColor = 'white';

      path.onClick = () => {
        if (activeEntity) {
          activeEntity.fillColor = 'white';
        }

        activeEntity = path;
        activeEntity.fillColor = '#00b894';
        console.log(entity);
      };

      path.onMouseEnter = () => {
        hoverEntity = path;
        hoverEntity.fillColor = '#fab1a0';
      };

      path.onMouseLeave = () => {
        if (hoverEntity && path !== activeEntity) {
          hoverEntity.fillColor = 'white';
        }
      };

      layers.tables.addChild(path);

      return;
    }

    if (entity.handle === 'place') {
      layers.rooms.addChild(path);

      path.onClick = () => {
        // @ts-ignore
        if (window.isDragging) {
          return;
        }

        const container = document.getElementById('canvas-container');

        if (!container) {
          return;
        }

        const { width, height } = container.getBoundingClientRect();

        const center: IVertex = findCenter(entity.vertices, scale);
        const { xDomain, yDomain } = findRangesFromPoints(entity.vertices);

        const roomWidth = xDomain[1] - xDomain[0];
        const roomHeight = yDomain[1] - yDomain[0];

        const rx = width / scale.scale(roomWidth);
        const ry = height / scale.scale(roomHeight);

        paper.view.center = new paper.Point(center);
        paper.view.zoom = Math.min(rx, ry);
      };
      return;
    }

    layers.items.addChild(path);

  });
}

// =========================================================================================================================================

export function drawText(entity: ITextEntity, scale: IScale, insert = false, layers: Record<string, paper.Layer>) {
  let text = entity.text;
  try {
    text = decodeURIComponent(JSON.parse('"' + entity.text.split('U+')
      .join('u')
      .replace(/\"/g, '\\"') + '"'));
  } catch (e) {

  }

  const point = new paper.PointText({
    point: [scale.x(entity.position.x), scale.y(entity.position.y)],
    content: text,
    fillColor: 'black',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: `${scale.scale(entity.height)}px`
  });


  layers.text.addChild(point);
}

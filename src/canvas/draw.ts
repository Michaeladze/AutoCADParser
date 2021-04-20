import { IArcEntity, IEllipseEntity, IEntity, IHatchEntity, IVertex } from '../types/types';
import { calculatePoints } from './helpers';
import * as paper from 'paper';

export function drawEntity(entity: IEntity, scale: any) {
  switch (entity.type) {
    case 'LINE':
    case 'LWPOLYLINE':
      // drawLine(entity, scale);
      break;
    case 'CIRCLE':
      // console.log(entity)
      break;
    case 'ARC':
      // drawArc(entity as IArcEntity, scale);
      break;
    case 'ELLIPSE':
      // drawEllipse(entity as IEllipseEntity, scale);
      break;
    case 'HATCH':
      drawHatch(entity as IHatchEntity, scale)
      break;
    default:
      // console.log(entity)
      break;
  }
}

/** Отрисовка линии */
export function drawLine(entity: IEntity, scale: any) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({
    strokeColor: 'black'
  });
  
  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}

export function drawArc(entity: IArcEntity, scale: any) {
  // const path = new paper.Path.Arc({
  //   from: [20, 20],
  //   through: [60, 20],
  //   to: [80, 80],
  //   strokeColor: 'black'
  // });
}

export function drawEllipse(entity: IEllipseEntity, scale: any) {
  // const x = scale.x(entity.position.x + entity.center.x);
  // const y = scale.y(entity.position.y + entity.center.y);
  // const angle = entity.rotation ? -entity.rotation * Math.PI / 180 : 0;
  //
  // const path = new paper.Path.Ellipse({
  //   point: [x, y],
  //   size: [180, 60],
  //   fillColor: 'black'
  // });
}

export function drawHatch(entity: IHatchEntity, scale: any) {
  entity.boundaries.forEach((boundary: IVertex[][]) => {
    const path = new paper.Path({
      strokeColor: 'black'
    });
    
    const flat: IVertex[] = boundary.reduce((acc: IVertex[], v: IVertex[]) => {
      acc = [...acc, ...v]
      return acc;
    }, []);
    const points: IVertex[] = calculatePoints(flat);
    
    points.forEach((point: IVertex) => {
      path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
    });
  })
}

import { ICircleEntity, IEllipseEntity, IEntity, IVertex } from '../types/types';
import { calculatePoints, findRanges } from './helpers';
import { IRanges } from '../types/helper.types';
import * as paper from 'paper';

export function drawEntity(entity: IEntity, scale: any) {
  switch (entity.type) {
    case 'LINE':
    case 'LWPOLYLINE':
      drawLine(entity, scale);
      break;
    case 'CIRCLE':
      // console.log(entity)
      break;
    case 'ARC':
      // console.log(entity)
      break;
    case 'ELLIPSE':
      // console.log(entity)
      break;
    case 'HATCH':
      // console.log(entity)
      break;
    default:
      // console.log(entity)
      break;
  }
}

/** Отрисовка линии */
export function drawLine(entity: IEntity, scale: any) {
  const points: IVertex[] = calculatePoints(entity);
  const path = new paper.Path();
  // @ts-ignore
  path.strokeColor = 'black';
  
  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}

export function drawCircle(entity: ICircleEntity, ctx: CanvasRenderingContext2D, scale: any) {
  const dx = entity.position?.x || 0;
  const dy = entity.position?.y || 0;
  
  const cx = scale.x(dx + entity.center.x);
  const cy = scale.y(dy + entity.center.y);
  
  console.log(entity, cx, cy)
  
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, 2 * Math.PI, false);
  ctx.stroke();
}

export function drawEllipse(entity: IEllipseEntity, ctx: CanvasRenderingContext2D, scale: any) {
  console.log(entity);
  if (!entity.radius) {
    return;
  }
  const x = scale.x(entity.position.x + entity.center.x);
  const y = scale.y(entity.position.y + entity.center.y);
  const angle = entity.rotation ? -entity.rotation * Math.PI / 180 : 0;
  
  ctx.ellipse(x, y, entity.radius, entity.radius, angle, entity.startAngle, entity.endAngle);
  ctx.strokeStyle = 'crimson';
  ctx.stroke();
  ctx.strokeStyle = 'black';
}

export function createPolygon(entity: IEntity, ctx: CanvasRenderingContext2D, scale: any) {
  const points: IVertex[] = calculatePoints(entity);
  // @ts-ignore
  const { xDomain, yDomain }: IRanges = findRanges([{ vertices: points }]);
  
  const x = xDomain[0];
  const y = yDomain[0];
  const w = xDomain[1] - xDomain[0];
  const h = yDomain[1] - yDomain[0];
  
  ctx.rect(x, y, w, h);
  ctx.stroke();
  
  return { x, y, w, h, entity }
}

import { ICircleEntity, IEllipseEntity, IEntity, IVertex } from '../types/types';
import { calculatePoints, findRanges } from './helpers';
import { IRanges } from '../types/helper.types';

export function drawAll(entity: IEntity, ctx: CanvasRenderingContext2D, scale: any) {
  switch (entity.type) {
    case 'LINE':
    case 'LWPOLYLINE':
      drawLine(entity, ctx, scale);
      break;
    case 'CIRCLE':
      // console.log(blockEntity)
      break;
    case 'ARC':
      // console.log(blockEntity)
      break;
    case 'ELLIPSE':
      // console.log(blockEntity)
      break;
    default:
      // console.log(blockEntity)
      break;
  }
}

/** Отрисовка линии */
export function drawLine(entity: IEntity, ctx: CanvasRenderingContext2D, scale: any, isArm?: boolean) {
  const points: IVertex[] = calculatePoints(entity, scale);
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.strokeStyle = 'black';
  ctx.stroke();
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
  const points: IVertex[] = calculatePoints(entity, scale);
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

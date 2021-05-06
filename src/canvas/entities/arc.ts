
// ==================================== Отрисовка арки======================================================================================

import { IArcEntity, IVertex } from '../../types/types';
import { calculatePoints } from '../helpers';
import paper from 'paper';
import { mainDraw } from '../render';


/** вычисляет координаты точек на окружности*/
export const calcArc = (angle: number, entity: IArcEntity, insert: boolean) => calculatePoints([
  {
    x: Math.cos(angle) * entity.radius + entity.center.x,
    y: Math.sin(angle) * entity.radius + entity.center.y,
    z: 0
  }
], insert ? entity.position : undefined, insert ? entity.rotation : undefined)[0];


export function drawArc(entity: IArcEntity, insert: boolean) {
  let mid = (entity.endAngle - entity.startAngle) / 2 + entity.startAngle;

  if (entity.endAngle < entity.startAngle) {
    mid = mid * -3 * Math.PI;
  }

  const start:IVertex = mainDraw.scale.scalePoint(calcArc(entity.startAngle, entity, insert));
  const end:IVertex = mainDraw.scale.scalePoint(calcArc(entity.endAngle, entity, insert));
  const middle:IVertex = mainDraw.scale.scalePoint(calcArc(mid, entity, insert));

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
    from: [ start.x, start.y],
    through: [ middle.x, middle.y],
    to: [ end.x, end.y],
    strokeColor: 'rgb(147, 149, 152)',
    fillColor: entity.color
  });

  mainDraw.layers.items.addChild(arc);
}

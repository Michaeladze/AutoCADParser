
// ==================================== Отрисовка арки======================================================================================

import { IArcEntity } from '../../types/types';
import { calculatePoints } from '../helpers';
import { IScale } from '../../types/helper.types';
import paper from 'paper';


/** вычисляет координаты точек на окружности*/
const calcArc = (angle: number, entity: IArcEntity, insert: boolean) => calculatePoints([
  {
    x: Math.cos(angle) * entity.radius + entity.center.x,
    y: Math.sin(angle) * entity.radius + entity.center.y,
    z: 0
  }
], insert ? entity.position : undefined, insert ? entity.rotation : undefined)[0];


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

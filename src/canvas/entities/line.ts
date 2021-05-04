// =========================================================================================================================================
// ==================================== Отрисовка линии ====================================================================================

import { IEntity, IVertex } from '../../types/types';
import { IScale } from '../../types/helper.types';
import { calculatePoints } from '../helpers';
import paper from 'paper';

export function drawLine(entity: IEntity, scale: IScale) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({ strokeColor: 'black' });

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}

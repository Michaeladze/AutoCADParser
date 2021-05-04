// =========================================================================================================================================

import { IEntity, IVertex } from '../../types/types';
import { IScale } from '../../types/helper.types';
import paper from 'paper';
import { calculatePoints } from '../helpers';

export function drawPath(entity: IEntity, scale: IScale, insert: boolean) {
  const path = new paper.Path({ strokeColor: 'rgb(147, 149, 152)' });

  const points: IVertex[] = insert ?
    calculatePoints(entity.vertices, entity.position, entity.rotation) :
    calculatePoints(entity.vertices);

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });

}

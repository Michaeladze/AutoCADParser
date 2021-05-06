// =========================================================================================================================================

import { IEntity, IVertex } from '../../types/types';
import paper from 'paper';
import { calculatePoints } from '../helpers';
import { mainDraw } from '../render';

export function drawPath(entity: IEntity, insert: boolean) {
  const path = new paper.Path({ strokeColor: 'rgb(147, 149, 152)' });

  const points: IVertex[] = insert ?
    calculatePoints(entity.vertices, entity.position, entity.rotation) :
    calculatePoints(entity.vertices);

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(mainDraw.scale.scalePoint(point)));
  });

}

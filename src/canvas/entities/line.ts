// =========================================================================================================================================
// ==================================== Отрисовка линии ====================================================================================

import { IEntity, IVertex } from '../../types/types';
import { calculatePoints } from '../helpers';
import paper from 'paper';
import { mainDraw } from '../render';

export function drawLine(entity: IEntity) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({ strokeColor: 'black' });

  points.forEach((point: IVertex) => {
    path.add(new paper.Point(mainDraw.scale.scalePoint(point)));
  });
}

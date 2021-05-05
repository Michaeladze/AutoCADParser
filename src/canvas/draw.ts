import {
  IArcEntity, IAttributeMap, IBlock, IEntity, IHatchEntity, ITextEntity
} from '../types/types';

import * as paper from 'paper';
import { IScale } from '../types/helper.types';
import { changePolyline } from './additionalTransformations';
import {
  IFiltredEntities, statistics, statisticsFull
} from './render';
import { drawLine } from './entities/line';
import { drawArc } from './entities/arc';
import { drawPath } from './entities/path';
import { drawHatch } from './entities/hatch';
import { drawText } from './entities/text';


export function drawEntity(entity: IEntity, scale: IScale, layers: Record<string, paper.Layer>, block?: IBlock, entities?: IFiltredEntities, onWorkplaceClick?: (attribute: IAttributeMap) => void) {


  statistics[entity.type] ? (statistics[entity.type] += 1) : (statistics[entity.type] = 1);
  statisticsFull[entity.layer + '/' + entity.type] ? (statisticsFull[entity.layer + '/' + entity.type] += 1) : (statisticsFull[entity.layer + '/' + entity.type] = 1);
  statisticsFull['count'] ? statisticsFull['count'] += 1 : statisticsFull['count'] = 1;

  // ==========================================Отрисовка Примитивов=========================================================================
  // if (entity.layer === 'Марки помещений') {
  //   debugger;
  // }

  switch (entity.type) {
  case 'LINE':
    drawLine(entity, scale);
    break;
  case 'LWPOLYLINE':
    drawHatch(changePolyline(entity as IHatchEntity, entities), scale, !!block, layers);
    break;
  case 'CIRCLE':
    const en = entity as IArcEntity;
    en.startAngle = 0;
    en.endAngle = 1.9999 * Math.PI;
    drawArc(en, scale, !!block, layers);
    break;
  case 'ARC':
    drawArc(entity as IArcEntity, scale, !!block, layers);
    break;
  case 'ELLIPSE':
    // drawEllipse(entity as IEllipseEntity, scale);
    break;
  case 'HATCH':
    drawHatch(entity as IHatchEntity, scale, !!block, layers, onWorkplaceClick);
    break;
  case 'MTEXT':
    drawText(entity as ITextEntity, scale, !!block, layers);
    break;
  case 'PATH':
    drawPath(entity as ITextEntity, scale, !!block);
    break;
  default:
    break;
  }
}


// =========================================================================================================================================

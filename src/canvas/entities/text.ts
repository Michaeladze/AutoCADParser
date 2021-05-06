import { ITextEntity } from '../../types/types';
import paper from 'paper';
import { mainDraw } from '../render';

export function drawText(entity: ITextEntity, insert = false, ) {
  if (entity.layer === 'АР_Офисная мебель') {
    return;
  }

  let text = entity.text;
  try {
    text = decodeURIComponent(JSON.parse('"' + entity.text.split('U+')
      .join('u')
      .replace(/\"/g, '\\"') + '"'));
  } catch (e) {

  }

  if ([
    '*',
    'Сбор',
    'данных',
    'не',
    'проводился',
    '.'
  ].includes(text)) {
    return;
  }

  const point = new paper.PointText({
    point: [ mainDraw.scale.x(entity.position.x), mainDraw.scale.y(entity.position.y)],
    content: text,
    fillColor: 'black',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: `${mainDraw.scale.scale(entity.height)}px`
  });

  mainDraw.layers.text.addChild(point);
}

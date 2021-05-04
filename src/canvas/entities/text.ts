import { ITextEntity } from '../../types/types';
import { IScale } from '../../types/helper.types';
import paper from 'paper';

export function drawText(entity: ITextEntity, scale: IScale, insert = false, layers: Record<string, paper.Layer>) {
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
    point: [scale.x(entity.position.x), scale.y(entity.position.y)],
    content: text,
    fillColor: 'black',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: `${scale.scale(entity.height)}px`
  });

  layers.text.addChild(point);
}

import {
  IBlock, IDxf, IEntity, ISchema
} from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import {
  findRanges, getScales_my, renderLayer
} from './helpers';
import { IRanges, IScale } from '../types/helper.types';
import {
  checkSeats, drawNumbers, replaceWorkPlaces, simplifyBlock
} from './additionalTransformations';
import { globalZoom, zoom } from './zoom/zoom';

export const statistics: any = {};
export const statisticsFull: any = {};

export const init = (dxf: IDxf): ISchema => {
  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return {} as ISchema;
  }

  paper.setup(canvas);
  globalZoom();

  // ===================================================================================================================

  /** Создаем слои */
  const layers: Record<string, paper.Layer> = {
    tables: new paper.Layer(),
    rooms: new paper.Layer(),
    text: new paper.Layer(),
    items: new paper.Layer()
  };

  // ===================================================================================================================

  const container = document.getElementById('canvas-container');

  if (!container) {
    return {} as ISchema;
  }

  const { height } = container.getBoundingClientRect();

  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale: IScale = getScales_my(ranges, height * ratio, height, 368, 0);

  const actEntities = simplifyBlock(dxf.entities.filter((en) => renderLayer(en)));
  // const actEntities = simplifyBlock(dxf.entities.filter((en) => !validLayer(en)));

  /** Добавить текст в рабочие места */
  actEntities.forEach((entity: IEntity) => {
    if (entity.type === 'INSERT' && entity.name) {
      const block: IBlock = dxf.blocks[entity.name];

      if (block && entity.attr && entity.attr['номер'] && entity.layer === 'АР_Офисная мебель') {
        block.text = entity.attr['номер'].text;
      }
    }
  });

  console.log(actEntities);
  const places = actEntities.filter((en) => en.name && ~en.name.toLowerCase().indexOf('место'));

  actEntities.forEach((entity: IEntity) => {
    if (!renderLayer(entity)) {
      return;
    }

    if (entity.type === 'INSERT' && entity.name) {
      const block = dxf.blocks[entity.name];

      if (entity.attr && entity.attr['номер'] && entity.attr['номер'].fontSize > 3) {
        drawNumbers(entity, scale, entity.attr['номер'], layers);
      }

      if (block && block.entities) {
        block.entities = simplifyBlock(block.entities.filter(i => !!i));

        /** Сидячие места обрабатываются отдельно */
        if (checkSeats(entity)) {
          replaceWorkPlaces(entity, block, scale, layers);
          return;
        }

        block.entities.forEach((be: IEntity) => {
          const blockEntity: IEntity = {
            ...be,
            name: entity.name,
            id: entity.id,
            parentId: entity.parentId,
            position: entity.position,
            rotation: entity.rotation
          };

          // если встретили рабочее место то отрисовываем только hatch чтобы не рисовать компьютер на столе
          if (entity.name && ~entity.name.toLowerCase().indexOf('место')) {
            if (block.text) {
              blockEntity.text = block.text;
            }

            ['HATCH'].includes(blockEntity.type) && drawEntity(blockEntity, scale, layers, block);
          } else {
            drawEntity(blockEntity, scale, layers, block);
          }
        });

      }
    } else {
      if (entity.type === 'MTEXT') {
        entity.position?.y ? entity.position.y = entity.position.y - (entity.height || 0) : entity.position?.y;
      }

      drawEntity(entity, scale, layers, undefined, places);
    }
  });

  layers.rooms.bringToFront();
  layers.tables.bringToFront();
  layers.text.bringToFront();

  console.warn('================================STATISTICS==================================');
  console.log(statistics);
  console.log(statisticsFull);
  console.warn('============================================================================');

  return { zoom };
};

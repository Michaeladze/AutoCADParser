import {
  IArcEntity, IDxf, IEntity
} from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { findRanges, getScales } from './helpers';
import { IRanges } from '../types/helper.types';

export const init = (dxf: IDxf) => {
  console.log(dxf);
  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  paper.setup(canvas);

  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale = getScales(ranges, window.innerHeight * ratio, window.innerHeight);

  dxf.entities.forEach((entity: IEntity) => {
    if ((entity.name && ~entity.name.toLowerCase().indexOf('кресло')) ||
   (entity.name && ~entity.name.toLowerCase().indexOf('пуф'))

    ) {
      entity.type = 'CIRCLE';

      const en = entity as IArcEntity;
      en.color = ~entity.name.toLowerCase().indexOf('пуф') ? 'lightgray' : 'green';
      en.radius = 200;
      en.center = {
        x: 0,
        y: 0,
        z: 0
      };
      drawEntity(en, scale, true);
    } else
    if (entity.type === 'INSERT' && entity.name) {

      const block = dxf.blocks[entity.name];

      if (block && block.entities) {
        block.entities.forEach((be: IEntity) => {
          const blockEntity: IEntity = {
            ...be,
            name: entity.name,
            id: entity.id,
            parentId: entity.parentId,
            position: entity.position,
            rotation: entity.rotation
          };


          if (entity.name && ~entity.name.toLowerCase().indexOf('место')) {

            blockEntity.type === 'HATCH' && drawEntity(blockEntity, scale, true);
          } else {
            drawEntity(blockEntity, scale, true);
          }


        });
      }
    } else {
      drawEntity(entity, scale);
    }
  });
};

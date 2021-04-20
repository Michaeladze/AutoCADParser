import { IDxf, IEntity } from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { findRanges, getScales } from './helpers';
import { IRanges } from '../types/helper.types';

export const init = (dxf: IDxf) => {
  console.log(dxf);
  
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
            
            drawEntity(blockEntity, scale, true);
          })
        }
      } else {
        drawEntity(entity, scale);
      }
    }
  )
}

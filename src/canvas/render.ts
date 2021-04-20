import { IDxf, IEntity } from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { getScales } from './helpers';

export const init = (dxf: IDxf) => {
  console.log(dxf);
  
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  
  paper.setup(canvas);
  const scale = getScales(dxf, window.innerWidth, window.innerHeight);

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

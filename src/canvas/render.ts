import { IDxf, IEntity } from '../types/types';
import paper from 'paper';
import { drawEntity, drawLine } from './draw';
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


// const SCALE = 1;
// const PADDING = 0;
// const WIDTH = window.innerWidth - 2 * PADDING;
// const HEIGHT = window.innerHeight - 2 * PADDING;
// const pixelRatio = window.devicePixelRatio || 1;
//
// canvas.width = SCALE * WIDTH * pixelRatio;
// canvas.height = SCALE * HEIGHT * pixelRatio;
//
// canvas.style.width = `${ SCALE * WIDTH }px`;
// canvas.style.height = `${ SCALE * HEIGHT }px`;
//
// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
// ctx.scale(pixelRatio, pixelRatio);
// ctx.imageSmoothingEnabled = false;

// const scale = getScales(dxf, WIDTH, HEIGHT);

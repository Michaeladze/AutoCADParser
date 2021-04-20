import { IDxf, IEntity } from '../types/types';
import { collides, getScales } from './helpers';
import { drawAll, createPolygon } from './draw';

const rectangles: any = [];

export const init = (dxf: IDxf) => {
  console.log(dxf);
  
  const SCALE = 1;
  const PADDING = 30;
  const WIDTH = window.innerWidth - 2 * PADDING;
  const HEIGHT = window.innerHeight - 2 * PADDING;
  const pixelRatio = window.devicePixelRatio || 1;
  
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  
  canvas.width = SCALE * WIDTH * pixelRatio;
  canvas.height = SCALE * HEIGHT * pixelRatio;
  
  canvas.style.width = `${ SCALE * WIDTH }px`;
  canvas.style.height = `${ SCALE * HEIGHT }px`;
  
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingEnabled = false;
  
  const scale = getScales(dxf, WIDTH, HEIGHT);
  
  dxf.entities.forEach((e: IEntity) => {
      if (e.type === 'INSERT' && e.name) {
      
        const block = dxf.blocks[e.name];
        if (block && block.entities) {
          const isArm = e.name?.includes('Стол_Рабочее');
        
          if (isArm) {
            const blockEntity: IEntity = block.entities.reduce((acc: IEntity, entity: IEntity, i: number) => {
              if (!acc.vertices) {
                acc.vertices = [];
              }
              if (i > 0 && entity.vertices) {
                acc.vertices = [...acc.vertices, ...entity.vertices]
              }
              return acc;
            }, { ...e });
          
            const rect = createPolygon(blockEntity, ctx, scale);
            rectangles.push(rect);
          }
        
          block.entities.forEach((be: IEntity) => {
            const blockEntity: IEntity = {
              ...be,
              name: e.name,
              position: e.position,
              rotation: e.rotation
            };
          
            drawAll(blockEntity, ctx, scale);
          })
        }
      } else {
        drawAll(e, ctx, scale);
      }
    }
  )
  
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = collides(rectangles, e.offsetX, e.offsetY);
      if (rect) {
        console.log('Название:', rect.entity.name)
        console.log('ID:', rect.entity.id)
        console.log('Комната: ', rect.entity.parentId);
      }
    }, false);
  }
}

import * as d3 from 'd3';
import { IDxf, IEntity, IVertex } from './types/types';
import { IRanges } from './types/helper.types';

export const init = (dxf: IDxf) => {
  console.log(dxf);
  
  const SCALE = 1;
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
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
          block.entities.forEach((be: IEntity) => {
            const blockEntity: IEntity = {
              ...be,
              position: e.position,
              rotation: e.rotation
            };
            
            switch (be.type) {
              case 'LINE':
              case 'LWPOLYLINE':
                drawLine(blockEntity, ctx, scale);
                break;
              case 'CIRCLE':
                break;
              case 'ARC':
                break;
            }
            
          })
        }
      } else if (e.type === 'LINE' || e.type === 'LWPOLYLINE') {
        if (e.layer !== 'Основные надписи') {
          drawLine(e, ctx, scale);
        }
      } else if (e.type === 'ARC') {
      }
    }
  )
}

// ---------------------------------------------------------------------------------------------------------------------

/** Отрисовка линии */
function drawLine(entity: IEntity, ctx: CanvasRenderingContext2D, scale: any) {
  if (!entity?.vertices) {
    return;
  }
  
  let points: IVertex[] = [];
  const dx = entity.position?.x || 0;
  const dy = entity.position?.y || 0;
  
  entity.vertices.forEach((v: IVertex) => {
    const x = v.x + dx;
    const y = v.y + dy;
    
    points.push({ x: scale.x(x), y: scale.y(y), z: 0 });
  });
  
  const angle = entity.rotation ? -entity.rotation * Math.PI / 180 : 0;
  points = points.map((p: IVertex) => rotatePoint({x: scale.x(dx), y: scale.y(dy), z: 0}, angle, p))
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

// function drawCircle(entity: ICircleEntity, ctx: CanvasRenderingContext2D, scale: any) {
//   const dx = entity.position?.x || 0;
//   const dy = entity.position?.y || 0;
//
//   const cx = scale.x(dx + entity.center.x);
//   const cy = scale.y(dy + entity.center.y);
//
//   console.log(entity,cx, cy)
//
//   ctx.beginPath();
//   ctx.arc(cx, cy, 5, 0, 2 * Math.PI, false);
//   ctx.strokeStyle = 'crimson';
//   ctx.stroke();
//   ctx.strokeStyle = 'black';
// }


// ---------------------------------------------------------------------------------------------------------------------
// HELPERS


/** Используем функции из D3, чтобы привести координаты X и Y к значениям в пределах width и height */
function getScales(data: IDxf, width: number, height: number) {
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  
  const { xDomain, yDomain }: IRanges = findRanges(data);
  x.domain(xDomain);
  y.domain(yDomain);
  
  return { x, y }
}

/** Поиск диапазонов по осям X и Y */
function findRanges(dxf: IDxf): IRanges {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = -Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = -Number.MAX_SAFE_INTEGER;
  
  dxf.entities.forEach((e: IEntity) => {
    if (e.vertices && e.layer !== 'Основные надписи') {
      e.vertices.forEach((v: IVertex) => {
        if (v.x > maxX) {
          maxX = v.x;
        }
        
        if (v.x < minX) {
          minX = v.x;
        }
        
        if (v.y > maxY) {
          maxY = v.y;
        }
        
        if (v.y < minY) {
          minY = v.y;
        }
      })
    }
  });
  
  return {
    xDomain: [minX, maxX],
    yDomain: [minY, maxY]
  }
}

function rotatePoint(pivot: IVertex, angle: number, point: IVertex): IVertex {
  const p = {...point};
  const sin: number = Math.sin(angle);
  const cos: number = Math.cos(angle);
  
  p.x -= pivot.x;
  p.y -= pivot.y;
  
  const x = p.x * cos - p.y * sin;
  const y = p.x * sin + p.y * cos;
  
  p.x = x + pivot.x;
  p.y = y + pivot.y;
  
  return p;
}

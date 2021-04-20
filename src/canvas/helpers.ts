import { IDxf, IEntity, IVertex } from '../types/types';
import * as d3 from 'd3';
import { IRanges } from '../types/helper.types';

export function calculatePoints(entity: IEntity, scale: any): IVertex[] {
  if (!entity?.vertices) {
    return [];
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
  points = points.map((p: IVertex) => rotatePoint({ x: scale.x(dx), y: scale.y(dy), z: 0 }, angle, p));
  
  return points;
}

/** Используем функции из D3, чтобы привести координаты X и Y к значениям в пределах width и height */
export function getScales(data: IDxf, width: number, height: number) {
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  
  const { xDomain, yDomain }: IRanges = findRanges(data.entities);
  x.domain(xDomain);
  y.domain(yDomain);
  
  return { x, y }
}

/** Поиск диапазонов по осям X и Y */
export function findRanges(entities: IEntity[]): IRanges {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = -Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = -Number.MAX_SAFE_INTEGER;
  
  entities.forEach((e: IEntity) => {
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

export function rotatePoint(pivot: IVertex, angle: number, point: IVertex): IVertex {
  const p = { ...point };
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

export function collides(rects: any, x: number, y: number): any {
  let isCollision = false;
  for (let i = 0, len = rects.length; i < len; i++) {
    let left = rects[i].x, right = rects[i].x + rects[i].w;
    let top = rects[i].y, bottom = rects[i].y + rects[i].h;
    if (right >= x
      && left <= x
      && bottom >= y
      && top <= y) {
      isCollision = rects[i];
    }
  }
  return isCollision;
}

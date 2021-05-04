import { IEntity, IVertex } from '../types/types';
import { IRanges, IScale } from '../types/helper.types';
import { showLayers } from './config';

// ---------------------------------------------------------------------------------------------------------------------

export function calculatePoints(vertices: IVertex[], position?: IVertex, rotation?: number): IVertex[] {

  if (!vertices) {
    return [];
  }

  let points: IVertex[] = [];
  const dx = position?.x || 0;
  const dy = position?.y || 0;

  vertices.forEach((v: IVertex) => {
    const x = v.x + dx;
    const y = v.y + dy;

    points.push({
      x,
      y,
      z: 0
    });
  });

  const angle = rotation ? rotation * Math.PI / 180 : 0;

  if (angle) {
    points = points.map((p: IVertex) => rotatePoint({
      x: dx,
      y: dy,
      z: 0
    }, angle, p));
  }

  return points;
}

// ---------------------------------------------------------------------------------------------------------------------

export const getScales_my = (ranges: IRanges, width: number, height: number, offsetX: number, offsetY: number): IScale => ({
  x: (c:number ) => offsetX + (c - ranges.xDomain[0]) * width / Math.abs(ranges.xDomain[1] - ranges.xDomain[0]),
  y: (c:number ) => offsetY + height - ( (c - ranges.yDomain[0]) * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0])),
  scale: (c:number) => {

    const ratio = height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0]);

    return c * ratio * 1.35;
  }
});

// ---------------------------------------------------------------------------------------------------------------------

/** Поиск диапазонов по осям X и Y */
export function findRanges(entities: IEntity[]): IRanges {
  const points: IVertex[] = entities.reduce((acc: IVertex[], e: IEntity) => {
    if (e.vertices && e.layer !== 'Основные надписи') {
      acc = [...acc, ...e.vertices];
    }

    return acc;
  }, []);

  return findRangesFromPoints(points);
}

export function findRangesFromPoints(points: IVertex[]): IRanges {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = -Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = -Number.MAX_SAFE_INTEGER;

  points.forEach((v: IVertex) => {
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
  });

  return {
    xDomain: [minX, maxX],
    yDomain: [minY, maxY]
  };
}

// =========================================================================================================================================

export function findCenter(points: IVertex[], scale: IScale): IVertex {
  const center: IVertex = {
    x: 0,
    y: 0,
    z: 0
  };

  const { xDomain, yDomain } = findRangesFromPoints(points);
  center.x = scale.x((xDomain[0] + (xDomain[1] - xDomain[0]) / 2));
  center.y = scale.y(yDomain[0] + (yDomain[1] - yDomain[0]) / 2);

  return center;
}

// =========================================================================================================================================

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

// =========================================================================================================================================

export const renderLayer = (entity: IEntity): boolean => {
  return showLayers[entity.layer];
};

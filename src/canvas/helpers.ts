import { IEntity, IVertex } from '../types/types';
import { IRanges } from '../types/helper.types';

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

export const getScales_my = (ranges: IRanges, width: number, height: number) => ({
  x: (c:number ) => (c - ranges.xDomain[0]) * width / Math.abs(ranges.xDomain[1] - ranges.xDomain[0]),
  y: (c:number ) => height - ( (c - ranges.yDomain[0]) * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0])),
  scale: (c:number) => {
    const ratio = width / Math.abs(ranges.xDomain[1] - ranges.xDomain[0]);
    return width * ratio / 4.5;
  }
});

// /** Используем функции из D3, чтобы привести координаты X и Y к значениям в пределах width и height */
// export function getScales(ranges: IRanges, width: number, height: number) {
//   const x = d3.scaleLinear().range([0, width]);
//   const y = d3.scaleLinear().range([height, 0]);
//
//
//   x.domain(ranges.xDomain);
//   y.domain(ranges.yDomain);
//
//
//   return {
//     x,
//     y
//   };
// }

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
      });
    }
  });

  return {
    xDomain: [minX, maxX],
    yDomain: [minY, maxY]
  };
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

export const colors: Record<string, string> = {
  '0': '',
  'АР_Двери': '',
  'АР_Ниши ПК': '',
  'АР_Окна': '',
  'АР_Офисная мебель': '',
  'АР_Офисная мебель_Заливка РМ': '',
  'АР_Перекрытия': '',
  'АР_Полилинии': '',
  'АР_Стены': '',
  'АР_Стены_Заливка': '',
  'ИС_Воздухораспределители': '',
  'ИС_Оборудование': '',
  'ИС_Отопление': '',
  'ИС_Сантехника': '',
  'Марки помещений': '',
  'Невидимые линии': '',
  'Основные надписи': ''
};

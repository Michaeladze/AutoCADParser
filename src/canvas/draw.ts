import { IArcEntity, IEllipseEntity, IEntity, IHatchEntity, IVertex } from '../types/types';
import { calculatePoints } from './helpers';
import * as paper from 'paper';


export function drawEntity(entity: IEntity, scale: any, insert?: boolean) {
  if (entity.layer === 'Основные надписи') {
    return;
  }
  
  switch (entity.type) {
    case 'LINE':
    case 'LWPOLYLINE':
      drawLine(entity, scale);
      break;
    case 'CIRCLE':
      // console.log(entity)
      break;
    case 'ARC':
      // drawArc(entity as IArcEntity, scale);
      break;
    case 'ELLIPSE':
      // drawEllipse(entity as IEllipseEntity, scale);
      break;
    case 'HATCH':
      drawHatch(entity as IHatchEntity, scale, !!insert)
      break;
    case 'MTEXT':
      break;
    default:
      // console.log(entity)
      break;
  }
}

/** Отрисовка линии */
export function drawLine(entity: IEntity, scale: any) {
  const points: IVertex[] = calculatePoints(entity.vertices, entity.position, entity.rotation);
  const path = new paper.Path({
    strokeColor: 'black'
  });
  
  points.forEach((point: IVertex) => {
    path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
  });
}

export function drawArc(entity: IArcEntity, scale: any) {
  // const path = new paper.Path.Arc({
  //   from: [20, 20],
  //   through: [60, 20],
  //   to: [80, 80],
  //   strokeColor: 'black'
  // });
}

export function drawEllipse(entity: IEllipseEntity, scale: any) {
  // const x = scale.x(entity.position.x + entity.center.x);
  // const y = scale.y(entity.position.y + entity.center.y);
  // const angle = entity.rotation ? -entity.rotation * Math.PI / 180 : 0;
  //
  // const path = new paper.Path.Ellipse({
  //   point: [x, y],
  //   size: [180, 60],
  //   fillColor: 'black'
  // });
}

let activeEntity: any = undefined;
let hoverEntity: any = undefined;

export function drawHatch(entity: IHatchEntity, scale: any, insert: boolean) {
  entity.boundaries.forEach((boundary: IVertex[][]) => {
    const path = new paper.Path({
      fillColor: 'rgb(147, 149, 152)',
      strokeColor: 'rgb(147, 149, 152)'
    });
    
    const flat: IVertex[] = boundary.reduce((acc: IVertex[], v: IVertex[]) => {
      acc = [...acc, ...v]
      return acc;
    }, []);
    
    const points: IVertex[] = insert ?
      calculatePoints(flat, entity.position, entity.rotation) :
      calculatePoints(flat);
    
    points.forEach((point: IVertex) => {
      path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
    });
    
    if (entity.layer === '0') {
      // @ts-ignore
      path.fillColor = '#efefef'
      path.sendToBack();
    }
    
    if (insert) {
      // @ts-ignore
      path.fillColor = 'white';
      path.onClick = () => {
        if (activeEntity) {
          activeEntity.fillColor = 'white';
        }
        activeEntity = path;
        activeEntity.fillColor = 'crimson';
        console.log(entity)
      }
      
      path.onMouseEnter = () => {
        hoverEntity = path;
        hoverEntity.fillColor = 'teal';
      }
      
      path.onMouseLeave = () => {
        if (hoverEntity && path !== activeEntity) {
          hoverEntity.fillColor = 'white';
        }
      }
    }
  })
}

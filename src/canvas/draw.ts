import { IArcEntity, IEllipseEntity, IEntity, IHatchEntity, ITextEntity, IVertex } from '../types/types';
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
       drawArc(entity as IArcEntity, scale, !!insert);
      break;
    case 'ELLIPSE':
      // drawEllipse(entity as IEllipseEntity, scale);
      break;
    case 'HATCH':
      drawHatch(entity as IHatchEntity, scale, !!insert)
      break;
    case 'MTEXT':
      drawText(entity as ITextEntity, scale);
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

function calcArc(angle:number,entity:IArcEntity,insert: boolean){
  const firstX=Math.cos(angle)*entity.radius+entity.center.x;
  const firstY=Math.sin(angle)*entity.radius+entity.center.y;
  return !insert?
    calculatePoints([{x:firstX,y:firstY,z:0}])[0]:
    calculatePoints([{x:firstX,y:firstY,z:0}],entity.position, entity.rotation)[0]
}


export function drawArc(entity: IArcEntity, scale: any, insert: boolean) {

  let mid=(entity.endAngle-entity.startAngle)/2 +entity.startAngle;

  if(entity.endAngle < entity.startAngle){
    mid= mid*-3*Math.PI
  }

  const start=calcArc(entity.startAngle,entity,insert)
  const end=calcArc(entity.endAngle,entity,insert)
  const middle=calcArc(mid,entity,insert)

    // var path = new paper.Path.Circle({
    //   center: [scale.x(start.x), scale.y(start.y)],
    //   radius: 2,
    //   strokeColor: 'blue'
    // });
    // var path = new paper.Path.Circle({
    //   center: [scale.x(end.x), scale.y(end.y)],
    //   radius: 2,
    //   strokeColor: 'red'
    // });
    // var path = new paper.Path.Circle({
    //   center: [scale.x(middle.x), scale.y(middle.y)],
    //   radius: 2,
    //   strokeColor: 'darkgray'
    // });
    new paper.Path.Arc({
      from: [scale.x(start.x), scale.y(start.y)],
      through: [scale.x(middle.x), scale.y(middle.y)],
      to: [scale.x(end.x), scale.y(end.y)],
      strokeColor: 'black'
    });



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

export function drawText(entity: ITextEntity, scale: any) {
  // const text = new paper.PointText({
  //   point: [scale.x(entity.position.x), scale.y(entity.position.y)],
  //   content: 'test',
  //   fillColor: 'black',
  // });
}

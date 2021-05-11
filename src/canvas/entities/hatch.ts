// =========================================================================================================================================

import {
  IAttribute,
  IAttributeMap, IHatchEntity, IVertex
} from '../../types/types';
import paper from 'paper';
import { calculatePoints, findCenter } from '../helpers';
import { mainDraw } from '../render';


let activeEntity: paper.Group|undefined = undefined;


type TPlacesTypes ='locked'|'free'|'dFree'|'dHalf'|'person'
const map:TPlacesTypes[] =
  [
    'locked',
    'free',
    'person',
    'dHalf',
    'dFree'
  ];

// =========================================================================================================================================
export function drawHatch(
  entity: IHatchEntity,
  insert: boolean,
  onWorkplaceClick?: (attribute: IAttributeMap) => void
) {


  entity.boundaries.forEach((boundary: IVertex[]) => {
    // поправка на insert
    const points = insert ? calculatePoints(boundary, entity.position, entity.rotation) : [...boundary];

    // в случае если рабочее место то отдельная функция трисовки
    if (entity.layer === 'АР_Офисная мебель_Заливка РМ' ) {
      drawWorkPlaces(entity, points, onWorkplaceClick);
      return;
    }


    const path = new paper.Path({
      fillColor: entity.color ? entity.color : 'rgb(147, 149, 152)',
      strokeColor: 'rgb(147, 149, 152)'
    });


    if (entity.centralPoint) {

      const group = new paper.Group();

      const k = (mainDraw.scale.scale(1) as number) * 100;
      const h = 17 * k;
      const w = 80 * k;
      const radius = 300;

      group.addChild(new paper.Path.Rectangle({
        point: new paper.Point( mainDraw.scale.x(entity.centralPoint.x ) - w / 2, mainDraw.scale.y(entity.centralPoint.y ) - h / 2),
        size: new paper.Size( w, h ),
        radius: 12,
        fillColor: 'white',
        shadowBlur: 10,
        shadowColor: new paper.Color(0, 0, 0, 0.1)
      }));
      // makeTableMarker({
      //   group,
      //   center: mainDraw.scale.scalePoint({ ...entity.centralPoint }),
      //   typePlace: 'dHalf',
      //   radius: 2
      // });


      // group.addChild(new paper.PointText({
      //   point: [ mainDraw.scale.x(entity.centralPoint.x ), mainDraw.scale.y(entity.centralPoint.y )],
      //   content: 'Свободно - 21 мест',
      //   fillColor: 'black',
      //   fontFamily: 'Roboto',
      //   fontWeight: 'normal',
      //   fontSize: `${mainDraw.scale.scale(10 * k)}px`
      // }));
      // group.addChild(new paper.PointText({
      //   point: [ mainDraw.scale.x(entity.centralPoint.x ), mainDraw.scale.y(entity.centralPoint.y )],
      //   content: 'Свободно - 21 мест',
      //   fillColor: 'black',
      //   fontFamily: 'Roboto',
      //   fontWeight: 'normal',
      //   fontSize: `${mainDraw.scale.scale(10 * k)}px`
      // }));
      const center = mainDraw.scale.scalePoint(entity.centralPoint);
      group.addChild( drawText({
        color: 'black',
        center: {
          ...center,
          y: center.y - 3 * k,
          x: center.x - 10 * k
        },
        fontWeight: '600',
        textAttr: {
          text: 'Свободно - 21 мест',
          fontSize: 200
        },
        justification: 'left'
      }));
      group.addChild( drawText({
        color: 'black',
        center: {
          ...center,
          y: center.y + 2 * k,
          x: center.x - 10 * k
        },

        textAttr: {
          text: entity.attr ? entity.attr['помещение'].text : '',
          fontSize: 200
        },
        justification: 'left'
      }));
      // group.addChild( drawText({
      //   color: 'black',
      //   center: {
      //     ...center,
      //     y: center.y + (-h / 2) + mainDraw.scale.scale(80 * k * 4),
      //     x: center.x + (-w / 2) + 8 * mainDraw.scale.scale(radius)
      //   },
      //   textAttr: {
      //     text: entity.attr ? entity.attr['помещение'].text : '',
      //     fontSize: 80 * k
      //   },
      //   justification: 'left'
      // }));

      makeTableMarker({
        group,
        center: {
          ...center,
          x: center.x + (-w / 2) + 6 * mainDraw.scale.scale(radius)
        },
        typePlace: 'dHalf',
        radius,
        strokeCircleVisible: true
      });
      makeTableMarker({
        group,
        center: {
          ...center,
          x: center.x + (-w / 2) + 4 * mainDraw.scale.scale(radius)
        },
        typePlace: 'dFree',
        radius,
        strokeCircleVisible: true
      });
      makeTableMarker({
        group,
        center: {
          ...center,
          x: center.x + (-w / 2) + 2 * mainDraw.scale.scale(radius)
        },
        typePlace: 'free',
        radius,
        strokeCircleVisible: true
      });


      // group.addChild(new paper.PointText({
      //   point: [ mainDraw.scale.x(entity.centralPoint.x ), mainDraw.scale.y(entity.centralPoint.y - 20 * k)],
      //   content: entity.attr && entity.attr['помещение'].text,
      //   fillColor: 'black',
      //   fontFamily: 'Roboto',
      //   fontWeight: 'normal',
      //   fontSize: `${mainDraw.scale.scale(10 * k)}px`
      // }));
      mainDraw.layers.informationBlocks.addChild(group);
    }

    points.forEach((point: IVertex) => {
      path.add(new paper.Point(mainDraw.scale.x(point.x), mainDraw.scale.y(point.y)));
    });


    /** todo при нажатии на область надо нормально смасштабировать*/
    if (entity.handle === 'place') {
      mainDraw.layers.rooms.addChild(path);

      // path.onClick = () => {
      //
      //
      //   // @ts-ignore
      //   if (window.isDragging) {
      //     return;
      //   }
      //
      //   const container = document.getElementById('canvas-container');
      //
      //   if (!container) {
      //     return;
      //   }
      //
      //   const OFFSET_LEFT = 368;
      //   const OFFSET_TOP = 24;
      //   const OFFSET_BOTTOM = 24;
      //
      //   const { width, height } = container.getBoundingClientRect();
      //   const viewportWidth = width - OFFSET_LEFT;
      //   const viewportHeight = height - OFFSET_TOP - OFFSET_BOTTOM;
      //
      //   const center: IVertex = findCenter(entity.vertices, mainDraw.scale);
      //   center.x -= mainDraw.scale.x(OFFSET_LEFT);
      //   const { xDomain, yDomain } = findRangesFromPoints(entity.vertices);
      //
      //   const roomWidth = xDomain[1] - xDomain[0];
      //   const roomHeight = yDomain[1] - yDomain[0];
      //
      //   const rx = viewportWidth / mainDraw.scale.scale(roomWidth);
      //   const ry = viewportHeight / mainDraw.scale.scale(roomHeight);
      //
      //   paper.view.center = new paper.Point(center);
      //   paper.view.zoom = Math.min(2, Math.min(rx, ry));
      //
      //   // if (paper.view.zoom < 1.3) {
      //   //   paper.projects[0].layers[3].visible = false;
      //   //   paper.projects[0].layers[4].visible = true;
      //   //
      //   // } else {
      //   //   paper.projects[0].layers[3].visible = true;
      //   //   paper.projects[0].layers[4].visible = false;
      //   // }
      //
      //   // console.log(entity);
      // };
      return;
    }

    mainDraw.layers.items.addChild(path);

  });
}
// =========================================================================================================================================
function drawWorkPlaces(entity:IHatchEntity, points:IVertex[], onWorkplaceClick?: (attribute: IAttributeMap) => void) {
  let center: IVertex = findCenter(points, mainDraw.scale);
  const x1 = mainDraw.scale.x(entity.position.x);
  const y1 = mainDraw.scale.y(entity.position.y);
  // кооординату рабочего места смещаем на половину радиуса
  const deltaX = (x1 - center.x) / 1.2;
  const deltaY = (y1 - center.y) / 1.2;
  center = {
    x: center.x - deltaX,
    y: center.y - deltaY,
    z: 0
  };
  const myStream = !!(entity.attr && entity.attr['помещение'].text === '31.27 Открытое пространство');
  const workplaceType:number = !myStream ? 0 : +( entity.attr && entity.attr['номер'].text || 0) % 5;
  // создаем группу с обрезанием по кругу
  const group = makeBaseGroup(center, 460, entity.attr, onWorkplaceClick);
  // докидываем объекты
  makeTableMarker({
    group,
    center,
    typePlace: map[workplaceType],
    entity
  });
  // помещаем на слой
  mainDraw.layers.workPlaces.addChild(group);
}
// =========================================================================================================================================
function makeBaseGroup(center:IVertex, radius = 460, attr?:IAttributeMap, onWorkplaceClick?:(attribute: IAttributeMap) => void) {
  const group = new paper.Group();
  const clippedCircle = new paper.Path.Circle({
    center: [center.x, center.y],
    radius: mainDraw.scale.scale(radius),
  });

  group.insertChild(0, clippedCircle);
  group.clipped = true;
  group.position = new paper.Point(center);
  group.onClick = () => {
    if (activeEntity && activeEntity.id === group.id) {
      activeEntity.scale(0.718);
      activeEntity.children.slice(-1)[0].visible = false;
      activeEntity = undefined;
      return;
    }


    activeEntity && activeEntity.scale(0.718);
    activeEntity && (activeEntity.children.slice(-1)[0].visible = false);
    group.scale(1.4);
    group.children.slice(-1)[0].visible = true;
    activeEntity = group;
    onWorkplaceClick && attr && onWorkplaceClick(attr);
  };

  return group;
}
// =========================================================================================================================================
interface IMakeTableMarker{
  group:paper.Group,
  center:IVertex,
  typePlace:TPlacesTypes,
  entity?:IHatchEntity,
  radius?:number,
  strokeCircleVisible?:boolean
}
function makeTableMarker({ group, center, typePlace, entity, radius = 400, strokeCircleVisible = false }:IMakeTableMarker) {
  const colors = {
    'locked': '#B1B5BB',
    'free': '#3A85FF',
    'dFree': '#00B7A9',
    'dHalf': ['#00B7A9', '#A56EFF'],
    'text': '#ffffff',
    'person': '#B1B5BB',
  };
  const textAttr = entity && entity.attr ? entity.attr['номер'] : {
    fontSize: 85,
    text: ''
  } as IAttribute;

  switch (typePlace) {
  case 'locked':
  case 'free':
  case 'dFree':
    group.addChild(drawCircle({
      fillColor: colors[typePlace],
      center,
      radius
    }));

    group.addChild(drawText({
      color: colors['text'],
      center,
      textAttr
    }));
    break;
  case 'person':
    group.addChild(drawRaster(center, 'https://www.uokpl.rs/fpng/d/237-2377642_businessperson-png-download.png') );
    group.addChild(drawCircle({
      strokeColor: colors[typePlace],
      strokeWidth: 2,
      center,
      radius: 430
    }));
    break;
  case 'dHalf':
    group.addChild(drawArc(center, colors[typePlace][1], radius));
    group.addChild(drawArc(center, colors[typePlace][0], -radius));
    group.addChild(drawText({
      color: colors['text'],
      center,
      textAttr
    }));
    break;
  default:
    break;
  }
  const strokeCircle = drawCircle({
    strokeColor: 'white',
    strokeWidth: 2,
    center,
    radius: radius + 30
  });
  strokeCircle.visible = strokeCircleVisible;
  group.addChild(strokeCircle);
}
// =========================================================================================================================================
interface IDrawCircle{
  fillColor?:string,
  strokeColor?:string
  center:IVertex,
  radius?:number,
  strokeWidth?: number
}
function drawCircle({ fillColor, center, radius = 400, strokeColor, strokeWidth }:IDrawCircle):paper.Item {
  const circle = new paper.Path.Circle({
    center: [center.x, center.y],
    radius: mainDraw.scale.scale(radius),
  });
  strokeColor && (circle.strokeColor = new paper.Color(strokeColor));
  strokeWidth && (circle.strokeWidth = strokeWidth);
  fillColor && (circle.fillColor = new paper.Color(fillColor));
  return circle;
}
// =========================================================================================================================================
interface IDrawText{
  color:string,
  center:IVertex,
  textAttr:IAttribute,
  offset?:number
  justification?:string,
  fontWeight?:string
}


function drawText({ color, center, textAttr, justification = 'center', fontWeight = 'normal' }:IDrawText):paper.Item {
  return new paper.PointText({
    // 85 - случайное число
    point: [center.x, center.y + mainDraw.scale.scale( textAttr.fontSize / 2 ) ],
    content: textAttr.text,
    fillColor: color,

    fontFamily: 'Roboto',
    fontWeight,
    fontSize: `${mainDraw.scale.scale(textAttr.fontSize + 100 )}px`,
    justification
  });
}


// =========================================================================================================================================
function drawRaster( center:IVertex, link:string, scale = 1.5):paper.Item {
  const raster = new paper.Raster({
    source: link,
    position: new paper.Point(center),

  });
  raster.scale( mainDraw.scale.scale(scale));
  return raster;
}
// =========================================================================================================================================
function drawArc( center:IVertex, fillColor:string, size = 400):paper.Item {
  const delta = mainDraw.scale.scale(size);
  return new paper.Path.Arc({
    from: [center.x, center.y + delta ],
    through: [center.x - delta, center.y ],
    to: [center.x, center.y - delta],
    fillColor
  });


}

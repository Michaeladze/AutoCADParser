// =========================================================================================================================================

import {
  IAttributeMap, IHatchEntity, IVertex
} from '../../types/types';
import { IScale } from '../../types/helper.types';
import paper from 'paper';
import {
  calculatePoints, findCenter, findRangesFromPoints
} from '../helpers';

let activeEntity: paper.Group|undefined = undefined;
const hoverEntity: any = undefined;

const places = {};


function drawWorkPlaces(entity:IHatchEntity, points:IVertex[], scale:IScale, layers:Record<string, paper.Layer>, onWorkplaceClick?: (attribute: IAttributeMap) => void) {

  let center: IVertex = findCenter(points, scale);
  const x1 = scale.x(entity.position.x);
  const y1 = scale.y(entity.position.y);
  // кооординату рабочего места смещаем на половину радиуса
  const deltaX = (x1 - center.x) / 1.2;
  const deltaY = (y1 - center.y) / 1.2;
  center = {
    x: center.x - deltaX,
    y: center.y - deltaY,
    z: 0
  };


  const myStream = !!(entity.attr && entity.attr['помещение'].text === '31.27 Открытое пространство');
  const workplaceType = +( entity.attr ? entity.attr['номер'].text : '' || 0)! % 5;

  // =============GROUP==================
  const group = new paper.Group();
  const clippedCircle = new paper.Path.Circle({
    center: [center.x, center.y],
    radius: scale.scale(460),
  });

  group.insertChild(0, clippedCircle);
  group.clipped = true;
  group.position = new paper.Point(center);
  group.onClick = () => {
    activeEntity && activeEntity.scale(0.8);
    group.scale(1.2);
    activeEntity = group;
    // activeEntity.fillColor = '#00b894';
    onWorkplaceClick && entity.attr && onWorkplaceClick(entity.attr);
  };
  layers.text.addChild(group);

  // =============PRIMITIVES==================
  if ( [0, 1, 4].includes(workplaceType) || !myStream) {
    group.insertChild(1, new paper.Path.Circle({
      center: [center.x, center.y],
      radius: scale.scale(400),
      fillColor: myStream && workplaceType ? (workplaceType === 4) ? '#00B7A9' : '#3A85FF' : '#B1B5BB'
    }));
    group.insertChild(
      2,
      new paper.PointText({
      // 85 - случайное число
        point: [center.x, center.y + scale.scale(entity.attr ? entity.attr['номер'].fontSize / 2 : 85)],
        content: entity.attr ? entity.attr['номер'].text : '',
        fillColor: 'white',
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontSize: `${scale.scale(entity.attr ? entity.attr['номер'].fontSize + 100 : 300 )}px`,
        justification: 'center'
      })
    );
  } else if ([2].includes(workplaceType)) {
    const raster = new paper.Raster();
    raster.source = 'https://www.uokpl.rs/fpng/d/237-2377642_businessperson-png-download.png';
    raster.position = new paper.Point(center);
    raster.scale(scale.scale(1.5));

    group.insertChild(1, raster );
    group.insertChild(2, new paper.Path.Circle({
      center: [center.x, center.y],
      radius: scale.scale(500),
      strokeColor: '#C4C4C4',

      strokeWidth: 6
    }) );
  } else if ([3].includes(workplaceType)) {
    group.insertChild(1, new paper.Path.Circle({
      center: [center.x, center.y],
      radius: scale.scale(500),
      fillColor: 'white'
    }) );

    group.insertChild(2, new paper.Path.Arc({
      from: [center.x, center.y + scale.scale(400) ],
      through: [center.x + scale.scale(400), center.y ],
      to: [center.x, center.y - scale.scale(400)],
      fillColor: '#00B7A9'
    }) );

    group.insertChild(3, new paper.Path.Arc({
      from: [center.x, center.y + scale.scale(400) ],
      through: [center.x - scale.scale(400), center.y ],
      to: [center.x, center.y - scale.scale(400)],
      fillColor: '#A56EFF'
    }) );
    group.insertChild(
      4,
      new paper.PointText({
        // 85 - случайное число
        point: [center.x, center.y + scale.scale(entity.attr ? entity.attr['номер'].fontSize / 2 : 85)],
        content: entity.attr ? entity.attr['номер'].text : '',
        fillColor: 'white',
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontSize: `${scale.scale(entity.attr ? entity.attr['номер'].fontSize + 100 : 300 )}px`,
        justification: 'center'
      })
    );
  }

}


export function drawHatch(entity: IHatchEntity, scale: IScale, insert: boolean, layers: Record<string, paper.Layer>, onWorkplaceClick?: (attribute: IAttributeMap) => void) {

  const isWorkplaceFill = entity.layer === 'АР_Офисная мебель_Заливка РМ';


  entity.boundaries.forEach((boundary: IVertex[]) => {
    // поправка на insert
    const points = insert ? calculatePoints(boundary, entity.position, entity.rotation) : [...boundary];
    // ===============================
    const path = new paper.Path({
      fillColor: entity.color ? entity.color : 'rgb(147, 149, 152)',
      strokeColor: 'rgb(147, 149, 152)'
    });

    if (isWorkplaceFill ) {
      drawWorkPlaces(entity, points, scale, layers, onWorkplaceClick);
      return;
    }


    points.forEach((point: IVertex) => {
      path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
    });

    /** todo при нажатии на область надо нормально смасштабировать*/
    if (entity.handle === 'place') {
      layers.rooms.addChild(path);

      path.onClick = () => {


        // @ts-ignore
        if (window.isDragging) {
          return;
        }

        const container = document.getElementById('canvas-container');

        if (!container) {
          return;
        }

        const OFFSET_LEFT = 368;
        const OFFSET_TOP = 24;
        const OFFSET_BOTTOM = 24;

        const { width, height } = container.getBoundingClientRect();
        const viewportWidth = width - OFFSET_LEFT;
        const viewportHeight = height - OFFSET_TOP - OFFSET_BOTTOM;

        const center: IVertex = findCenter(entity.vertices, scale);
        center.x -= scale.x(OFFSET_LEFT);
        const { xDomain, yDomain } = findRangesFromPoints(entity.vertices);

        const roomWidth = xDomain[1] - xDomain[0];
        const roomHeight = yDomain[1] - yDomain[0];

        const rx = viewportWidth / scale.scale(roomWidth);
        const ry = viewportHeight / scale.scale(roomHeight);

        paper.view.center = new paper.Point(center);
        paper.view.zoom = Math.min(2, Math.min(rx, ry));

        console.log(entity);
      };
      return;
    }

    layers.items.addChild(path);

  });
}

// =========================================================================================================================================

import { IHatchEntity, IVertex } from '../../types/types';
import { IScale } from '../../types/helper.types';
import paper from 'paper';
import {
  calculatePoints, findCenter, findRangesFromPoints
} from '../helpers';

const activeEntity: any = undefined;
const hoverEntity: any = undefined;

const places = {};


function drawWorkPlaces(entity:IHatchEntity, points:IVertex[], scale:IScale, layers:Record<string, paper.Layer>) {

  let center: IVertex = findCenter(points, scale);
  const x1 = scale.x(entity.position.x);
  const y1 = scale.y(entity.position.y);
  // кооординату рабочего места смещаем на половину радиуса
  const deltaX = (x1 - center.x) / 2;
  const deltaY = (y1 - center.y) / 2;
  center = {
    x: center.x - deltaX,
    y: center.y - deltaY,
    z: 0
  };

  const p = new paper.Path.Circle({
    center: [center.x, center.y],
    radius: scale.scale(440),
    fillColor: '#3A85FF'
  });
  layers.tables.addChild(p);

  if (+( entity.attr ? entity.attr['номер'].text : '' || 0)! % 2) {
    const raster = new paper.Raster();


    raster.source = 'https://www.uokpl.rs/fpng/d/237-2377642_businessperson-png-download.png';
    raster.position = new paper.Point(center);
    // raster.size = new paper.Size( 20, 20);
    raster.scale(scale.scale(1.5));

    const group = new paper.Group();
    group.addChild(raster);
    group.insertChild(0, p);
    group.clipped = true;
    group.position = new paper.Point(center);

    layers.text.addChild(group);
  } else {
    const text = new paper.PointText({
      // 85 - случайное число
      point: [center.x, center.y + scale.scale(85)],
      content: entity.attr ? entity.attr['номер'].text : '',
      fillColor: 'white',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      fontSize: `${scale.scale(350)}px`,
      justification: 'center'
    });


    layers.text.addChild(text);
  }
}


export function drawHatch(entity: IHatchEntity, scale: IScale, insert: boolean, layers: Record<string, paper.Layer>) {

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
      drawWorkPlaces(entity, points, scale, layers);
      return;
    }


    points.forEach((point: IVertex) => {
      path.add(new paper.Point(scale.x(point.x), scale.y(point.y)));
    });


    // if (entity.layer === '0') {
    //   // @ts-ignore
    //   path.fillColor = '#efefef';
    //   path.sendToBack();
    //   return;
    // }

    // if (isWorkplaceFill) {
    //   // @ts-ignore
    //   path.strokeColor = 'rgb(147, 149, 152)';
    //   // @ts-ignore
    //   path.fillColor = 'white';
    //
    //   path.onClick = () => {
    //     if (activeEntity) {
    //       activeEntity.fillColor = 'white';
    //     }
    //
    //     activeEntity = path;
    //     activeEntity.fillColor = '#00b894';
    //     console.log(entity);
    //   };
    //
    //   path.onMouseEnter = () => {
    //     hoverEntity = path;
    //     hoverEntity.fillColor = '#fab1a0';
    //   };
    //
    //   path.onMouseLeave = () => {
    //     if (hoverEntity && path !== activeEntity) {
    //       hoverEntity.fillColor = 'white';
    //     }
    //   };
    //
    //   layers.tables.addChild(path);
    //
    //   return;
    // }
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

        const { width, height } = container.getBoundingClientRect();

        const center: IVertex = findCenter(entity.vertices, scale);
        const { xDomain, yDomain } = findRangesFromPoints(entity.vertices);

        const roomWidth = xDomain[1] - xDomain[0];
        const roomHeight = yDomain[1] - yDomain[0];

        const rx = width / scale.scale(roomWidth);
        const ry = height / scale.scale(roomHeight);

        paper.view.center = new paper.Point(center);
        paper.view.zoom = Math.min(rx, ry);
      };
      return;
    }

    layers.items.addChild(path);

  });
}

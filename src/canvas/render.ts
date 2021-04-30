import { IDxf, IEntity } from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { findRanges, getScales_my } from './helpers';
import { IRanges } from '../types/helper.types';
import {
  checkSeats, drawNumbers, replaceWorkPlaces, simplifyBlock
} from './additionalTransformations';

export const statistics: any = {};
export const statisticsFull: any = {};
const validLayer = (entity: IEntity) => !(
  // ~entity.layer.toLowerCase().indexOf('стены') ||
  // ~entity.layer.toLowerCase().indexOf('окна') ||
  ~entity.layer.toLowerCase().indexOf('стены_заливка') ||
  ~entity.layer.toLowerCase().indexOf('офисная мебель') ||
  ~entity.layer.toLowerCase().indexOf('двери') ||
  ~entity.layer.toLowerCase().indexOf('помещений') ||
  ~entity.layer.toLowerCase().indexOf('перекрытия') ||
  // ~entity.layer.toLowerCase().indexOf('сант') ||

  ~entity.layer.toLowerCase().indexOf('полилинии')
);


export const init = (dxf: IDxf) => {
  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  paper.setup(canvas);

  /** Масштабирование */
  paper.PaperScript.execute(`
      function onMouseUp() {
        window.isDragging = false;
      }
      function onMouseDrag(event) {
        window.isDragging = true;
        // ...update view center.
        paper.view.center = event.downPoint.subtract(event.point).add(paper.view.center);
      };
    const ZOOM_FACTOR = 1.14;
    canvas.addEventListener('wheel', (event) => {
    const oldZoom = paper.view.zoom;
    const oldCenter = paper.view.center;
    // Get mouse position.
    // It needs to be converted into project coordinates system.
    const mousePosition = paper.view.viewToProject(new paper.Point(event.offsetX, event.offsetY));
    // Update view zoom.
    const newZoom = event.deltaY > 0 ?
      oldZoom / ZOOM_FACTOR :
      oldZoom * ZOOM_FACTOR;
    paper.view.zoom = newZoom;

    // Update view position.
    paper.view.center += (mousePosition - oldCenter) * (1 - (oldZoom / newZoom));
  });
  `, paper);

  // ===================================================================================================================

  /** Создаем слои */
  const layers: Record<string, paper.Layer> = {
    tables: new paper.Layer(),
    rooms: new paper.Layer(),
    text: new paper.Layer(),
    items: new paper.Layer()
  };

  // ===================================================================================================================

  const container = document.getElementById('canvas-container');

  if (!container) {
    return;
  }

  const { height } = container.getBoundingClientRect();

  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale = getScales_my(ranges, height * ratio, height);


  const actEntities = simplifyBlock(dxf.entities.filter((en) => !validLayer(en)));
  // const actEntities = simplifyBlock(dxf.entities.filter((en) => !validLayer(en)));

  console.log(actEntities);
  const places = actEntities.filter((en) => en.name && ~en.name.toLowerCase().indexOf('место'));

  actEntities.forEach((entity: IEntity) => {
    if (validLayer(entity)) {
      return;
    }

    if (entity.type === 'INSERT' && entity.name) {
      const block = dxf.blocks[entity.name];

      if (entity.attr && entity.attr['номер'] && entity.attr['номер'].fontSize > 3) {
        drawNumbers(entity, scale, entity.attr['номер'], layers);
      }

      if (block && block.entities) {
        block.entities = simplifyBlock(block.entities.filter(i => !!i));

        /** Сидячие места обрабатываются отдельно */
        if (checkSeats(entity)) {
          replaceWorkPlaces(entity, block, scale, layers);
          return;
        }

        block.entities.forEach((be: IEntity) => {
          const blockEntity: IEntity = {
            ...be,
            name: entity.name,
            id: entity.id,
            parentId: entity.parentId,
            position: entity.position,
            rotation: entity.rotation
          };

          // если встретили рабочее место то отрисовываем только hatch чтобы не рисовать компьютер на столе
          if (entity.name && ~entity.name.toLowerCase().indexOf('место')) {
            ['HATCH'].includes(blockEntity.type) && drawEntity(blockEntity, scale, layers, true);
          } else {
            drawEntity(blockEntity, scale, layers, true);
          }
        });

      }
    } else {
      if (entity.type === 'MTEXT') {
        entity.position?.y ? entity.position.y = entity.position.y - (entity.height || 0) : entity.position?.y;
      }

      drawEntity(entity, scale, layers, false, places);
    }
  });

  layers.rooms.bringToFront();
  layers.tables.bringToFront();
  layers.text.bringToFront();

  console.warn('================================STATISTICS==================================');
  console.log(statistics);
  console.log(statisticsFull);
  console.warn('============================================================================');
};

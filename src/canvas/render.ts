import { IDxf, IEntity } from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { findRanges, getScales_my } from './helpers';
import { IRanges } from '../types/helper.types';
import { drawNumbers, replaceWorkPlaces } from './additionalTransformations';


const layers = (entity:IEntity) => !(
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
  // console.log(dxf);
  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  paper.setup(canvas);
  const t = paper.PaperScript.execute(`
      function onMouseDrag(event) {
        // ...update view center.
        paper.view.center = event.downPoint.subtract(event.point).add(paper.view.center);
      };
    const ZOOM_FACTOR = 1.1;
    canvas.addEventListener('wheel', (event) => {
    const oldZoom = paper.view.zoom;
    const oldCenter = paper.view.center;
    // Get mouse position.
    // It needs to be converted into project coordinates system.
    const mousePosition = paper.view.viewToProject(new paper.Point(event.offsetX, event.offsetY));
    // Update view zoom.
    const newZoom = event.deltaY > 0 ?
      oldZoom * ZOOM_FACTOR :
      oldZoom / ZOOM_FACTOR;
    paper.view.zoom = newZoom;

    // Update view position.
    paper.view.center += (mousePosition - oldCenter) * (1 - (oldZoom / newZoom));
  });
  `, paper);


  // ===================================================================================================================
  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale = getScales_my(ranges, window.innerHeight * ratio, window.innerHeight);

  const actEntities = dxf.entities.filter((en) => !layers(en));
  console.log(actEntities);
  actEntities.forEach((entity: IEntity) => {
    if (layers(entity)) {
      return;
    }

    // если рабочее место, то заменяем его на кружок
    // иначе обрабатываем entity
    if (!replaceWorkPlaces(entity, scale)) {

      if ( entity.type === 'INSERT' && entity.name) {
        const block = dxf.blocks[entity.name];


        if (entity.attr && entity.attr['номер'] ) {
          drawNumbers(entity, scale, entity.attr['номер'] );
        }

        if (block && block.entities) {
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
              ['HATCH'].includes(blockEntity.type) && drawEntity(blockEntity, scale, true);
            } else {
              drawEntity(blockEntity, scale, true);
            }
          });
        }
      } else {

        if (entity.type === 'MTEXT') {


          entity.position?.y ? entity.position.y = entity.position.y - 250 : entity.position?.y;
        }

        // console.log(entity);
        drawEntity(entity, scale);
      }
    }
  });
};

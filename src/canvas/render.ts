import {
  IArcEntity, IDxf, IEntity, ITextEntity, IVertex
} from '../types/types';
import paper from 'paper';
import { drawEntity } from './draw';
import { findRanges, getScales_my } from './helpers';
import { IRanges } from '../types/helper.types';

const layers = (entity:IEntity) => !(
  ~entity.layer.toLowerCase().indexOf('стены') ||
  ~entity.layer.toLowerCase().indexOf('офисная мебель') ||
  ~entity.layer.toLowerCase().indexOf('двери') ||
  ~entity.layer.toLowerCase().indexOf('полилинии') ||
// ~entity.layer.toLowerCase().indexOf('0') ||
// ~entity.layer.toLowerCase().indexOf('помещений') ||
~entity.layer.toLowerCase().indexOf('перекрытия')
);


// функция ищет пуфы и стулья и заменяет их на кружки

function replaceWorkPlaces(entity: IEntity, scale:any) {
  const puf = entity.name && ~entity.name.toLowerCase().indexOf('пуф');
  const armchair = entity.name && ~entity.name.toLowerCase().indexOf('кресло');
  const chair = entity.name && ~entity.name.toLowerCase().indexOf('стул');

  if (armchair || chair || puf) {
    const en = entity as IArcEntity;
    en.type = 'CIRCLE';
    en.color = 'lightgray';
    en.radius = 200;
    en.center = {
      x: 0,
      y: chair ? -200 : 0,
      z: 0
    };
    drawEntity(en, scale, true);
    return true;
  }

  return false;
}
function drawNumbers(entity: IEntity, scale:any, number:{point:IVertex, text:string, fontSize:number}) {
  const en = { ...entity } as ITextEntity;
  en.text = number.text;
  en.position = number.point;
  en.type = 'MTEXT';
  en.height = number.fontSize;

  drawEntity(en, scale, false);

}

export const init = (dxf: IDxf) => {
  console.log(dxf);
  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  paper.setup(canvas);
  paper.view.onMouseUp = (event:any) => {
    paper.view.center = paper.view.center.subtract(event.delta);
  };
  const ZOOM_FACTOR = 1.5;
  canvas.addEventListener('wheel', (event) => {
    console.log('!');
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
    // @ts-ignore
    // paper.view.center += (mousePosition - oldCenter) * (1 - (oldZoom / newZoom));
  });


  // ===================================================================================================================
  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale = getScales_my(ranges, window.innerHeight * ratio, window.innerHeight);

  dxf.entities.forEach((entity: IEntity) => {
    if (layers(entity)) {
      return;
    }

    // если рабочее место, то заменяем его на кружок
    const WorkPlace = replaceWorkPlaces(entity, scale);

    // иначе обрабатываем entity
    if (!WorkPlace) {

      if ( entity.type === 'INSERT' && entity.name) {
        const block = dxf.blocks[entity.name];

        if (entity.attr && entity.attr['номер']) {
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
          entity.position?.y ? entity.position.y = entity.position.y - 200 : entity.position?.y;
        }

        // console.log(entity);
        drawEntity(entity, scale);
      }
    }
  });
};

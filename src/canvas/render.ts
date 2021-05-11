import {
  IAttributeMap, IDxf, IEntity, IHatchEntity, ISchema
} from '../types/types';
import { drawEntity, IDraw } from './draw';
// import { renderLayer } from './helpers';
import {
  changePolyline,
  checkSeats, drawNumbers, replaceWorkPlaces, simplifyBlock
} from './additionalTransformations';

import { MainDraw } from './config';

export const statistics: any = {};
export const statisticsFull: any = {};

export interface IFiltredEntities{
  markers:IEntity[],
  places:IEntity[]
}
export let mainDraw:MainDraw;

export const init = (dxf: IDxf, onWorkplaceClick?: (attributes: IAttributeMap) => void): ISchema => {

  mainDraw = new MainDraw(dxf);

  if ( !mainDraw.isReady) {
    return {} as ISchema;
  }


  // ++++++++++++++++
  // отрисовка примитивов
  mainDraw.entities.forEach((entity: IEntity) => {
    // проверяем нужно ли отрисовывать слой и исключаем слой 'марки' кроме текстов(его обработаем отдельно в POLYLINE)
    if (~entity.layer.toLowerCase().indexOf('марки') && entity.type !== 'MTEXT') {
      return;
    }

    // ++++++++++++++++
    if (entity.type === 'INSERT') {
      drawInsert({
        entity,
        block: dxf.blocks[entity.name],
        onWorkplaceClick
      });
      return;
    }

    // ++++++++++++++++
    // сдвигаем текст вниз на его высоту
    if (entity.type === 'MTEXT') {
      entity.position?.y ? entity.position.y = entity.position.y - (entity.height || 0) : entity.position?.y;
    }

    // делаем HATCH из полилайнов и отрисовываем метки для них
    if (entity.type === 'LWPOLYLINE') {
      entity = changePolyline(entity);

      const marks = (entity as IHatchEntity).marks || [];
      marks.forEach(m => {
        drawInsert({
          entity: m,

          block: dxf.blocks[m.name || '']
        });
      });
    }

    drawEntity({ entity, });

  });


  console.warn('================================STATISTICS==================================');
  console.log(statistics);
  console.log(statisticsFull);
  console.warn('============================================================================');

  return { zoom: mainDraw.zoom };
};


// =========================================================================================================================================
/** обрабатываем INSERT*/
function drawInsert({ entity, block, onWorkplaceClick }:IDraw) {
  if (entity.attr && entity.attr['номер'] && entity.attr['номер'].fontSize > 3) {
    drawNumbers(entity, mainDraw.scale, entity.attr['номер'], mainDraw.layers);
  }

  if (block && block.entities) {
    block.entities = simplifyBlock(block.entities.filter(i => !!i));

    /** Сидячие места обрабатываются отдельно */
    if (checkSeats(entity)) {
      replaceWorkPlaces(entity, block, mainDraw.scale, mainDraw.layers);
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
        blockEntity.attr = entity.attr;
        ['HATCH'].includes(blockEntity.type) && drawEntity({
          entity: blockEntity,

          block,
          onWorkplaceClick
        });
      } else {
        drawEntity({
          entity: blockEntity,
          block
        });
      }
    });

  }
}

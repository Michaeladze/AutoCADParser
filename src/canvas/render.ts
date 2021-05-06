import {
  IAttributeMap, IDxf, IEntity, IHatchEntity, ISchema
} from '../types/types';
import paper from 'paper';
import { drawEntity, IDraw } from './draw';
import {
  findRanges, getScales_my, renderLayer
} from './helpers';
import { IRanges, IScale } from '../types/helper.types';
import {
  changePolyline,
  checkSeats, drawNumbers, replaceWorkPlaces, simplifyBlock
} from './additionalTransformations';
import { globalZoom, zoom } from './zoom/zoom';

export const statistics: any = {};
export const statisticsFull: any = {};

export interface IFiltredEntities{
  markers:IEntity[],
  places:IEntity[]
}

export const init = (dxf: IDxf, onWorkplaceClick?: (attributes: IAttributeMap) => void): ISchema => {

  // ==============================CANVAS===============================================================================
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return {} as ISchema;
  }

  paper.setup(canvas);
  globalZoom();

  // ++++++++++++++++

  /** Создаем слои */
  const layers: Record<string, paper.Layer> = {
    tables: new paper.Layer(),
    rooms: new paper.Layer(),
    // text: new paper.Layer({ visible: false }),
    text: new paper.Layer(),
    items: new paper.Layer(),
    tab: new paper.Layer()
  };

  // ++++++++++++++++


  const container = document.getElementById('canvas-container');

  if (!container) {
    return {} as ISchema;
  }
  // ++++++++++++++++

  const { height } = container.getBoundingClientRect();

  const ranges: IRanges = findRanges(dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const scale: IScale = getScales_my(ranges, height * ratio, height, 368, 0);
  // объединяем линии в поли линии
  const actEntities = simplifyBlock(dxf.entities.filter((en) => renderLayer(en)));
  const filtredEntities:IFiltredEntities = {
    markers: actEntities.filter((en) => (~en.layer.toLowerCase().indexOf('марки')) && en.type === 'INSERT'),
    places: actEntities.filter((en) => en.name && ~en.name.toLowerCase().indexOf('место'))
  };
  // ++++++++++++++++
  // отрисовка примитивов
  actEntities.forEach((entity: IEntity) => {
    // проверяем нужно ли отрисовывать слой и исключаем слой 'марки' кроме текстов(его обработаем отдельно в POLYLINE)
    if (!renderLayer(entity) ||
      (~entity.layer.toLowerCase().indexOf('марки') && entity.type !== 'MTEXT')
    ) {
      return;
    }

    // ++++++++++++++++
    if (entity.type === 'INSERT') {
      drawInsert({
        entity,
        scale,
        layers,
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
      entity = changePolyline(entity, filtredEntities, scale);

      const marks = (entity as IHatchEntity).marks || [];
      marks.forEach(m => {
        drawInsert({
          entity: m,
          scale,
          layers,
          block: dxf.blocks[m.name || '']
        });
      });
    }

    drawEntity({
      entity,
      scale,
      layers
    });

  });

  layers.items.bringToFront();
  layers.rooms.bringToFront();
  layers.tables.bringToFront();
  layers.text.bringToFront();
  layers.tab.bringToFront();

  console.warn('================================STATISTICS==================================');
  console.log(statistics);
  console.log(statisticsFull);
  console.warn('============================================================================');

  return { zoom };
};


// =========================================================================================================================================
/** обрабатываем INSERT*/
function drawInsert({ entity, scale, layers, block, onWorkplaceClick }:IDraw) {
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
        blockEntity.attr = entity.attr;
        ['HATCH'].includes(blockEntity.type) && drawEntity({
          entity: blockEntity,
          scale,
          layers,
          block,
          onWorkplaceClick
        });
      } else {
        drawEntity({
          entity: blockEntity,
          scale,
          layers,
          block
        });
      }
    });

  }
}

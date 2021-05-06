import {
  IBounds, IDxf, IEntity, IVertex
} from '../types/types';
import { findRanges, renderLayer } from './helpers';
import paper from 'paper';
import { globalZoom } from './zoom/zoom';
import { IRanges, IScale } from '../types/helper.types';
import { simplifyBlock } from './additionalTransformations';
import { IFiltredEntities } from './render';

// export const showLayers: Record<string, boolean> = {
//   '0': false,
//   'АР_Двери': false,
//   'АР_Ниши ПК': false,
//   'АР_Окна': false,
//   'АР_Офисная мебель': false,
//   'АР_Офисная мебель_Заливка РМ': false,
//   'АР_Перекрытия': false,
//   'АР_Полилинии': true,
//   'АР_Стены': false,
//   'АР_Стены_Заливка': false,
//   'ИС_Воздухораспределители': false,
//   'ИС_Оборудование': false,
//   'ИС_Отопление': false,
//   'ИС_Сантехника': false,
//   'Марки помещений': false,
//   'Невидимые линии': false,
//   'Основные надписи': false
// };
export const showLayers: Record<string, boolean> = {
  '0': false,
  'АР_Двери': true,
  'АР_Ниши ПК': false,
  'АР_Окна': false,
  'АР_Офисная мебель': true,
  'АР_Офисная мебель_Заливка РМ': true,
  'АР_Перекрытия': false,
  'АР_Полилинии': true,
  'АР_Стены': false,
  'АР_Стены_Заливка': true,
  'ИС_Воздухораспределители': false,
  'ИС_Оборудование': false,
  'ИС_Отопление': false,
  'ИС_Сантехника': false,
  'Марки помещений': true,
  'Невидимые линии': false,
  'Основные надписи': false
};
export const bounds: IBounds = {
  minZoom: 1,
  maxZoom: 3
};

const layers = ():Record<string, paper.Layer> => {
  const l:Record<string, paper.Layer> = {
    tables: new paper.Layer(),
    rooms: new paper.Layer(),
    // text: new paper.Layer({ visible: false }),
    text: new paper.Layer(),
    items: new paper.Layer(),
    tab: new paper.Layer()
  };
  l.items.bringToFront();
  l.rooms.bringToFront();
  l.tables.bringToFront();
  l.text.bringToFront();
  l.tab.bringToFront();
  return l;
};

export class MainDraw {
  public showLayers=showLayers
  public isReady=false
  public layers:Record<string, paper.Layer>={}
  public scale:IScale={
    x: () => 1,
    y: () => 1,
    scale: () => 1,
    scalePoint: () => ({}as IVertex)
  }
public entities:IEntity[]=[]
public selection:IFiltredEntities={
  markers: [],
  places: []
}

// ========================= initialization=========================
constructor(dxf: IDxf) {
  this.dxf = dxf;

  this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!this.canvas) {
    this.fail();
    return;
  }

  this.isReady = true;
  paper.setup(this.canvas);
  this.layers = layers();
  this.scale = this.calcScale();
  globalZoom();
  // объединяем линии в поли линии
  this.entities = simplifyBlock(dxf.entities.filter((en) => renderLayer(en)));
  this.selection = {
    markers: this.entities.filter((en) => (~en.layer.toLowerCase().indexOf('марки')) && en.type === 'INSERT'),
    places: this.entities.filter((en) => en.name && ~en.name.toLowerCase().indexOf('место'))
  };

}
  private readonly canvas:HTMLCanvasElement= {} as HTMLCanvasElement
  private dxf:IDxf

private calcScale =():IScale => {
  const ranges: IRanges = findRanges(this.dxf.entities);
  const { xDomain, yDomain } = ranges;
  const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
  const container = document.getElementById('canvas-container') as HTMLElement;
  const { height } = container.getBoundingClientRect();


  const scale = (c:number) => c * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0]) * 1.35;
  const x = (c:number ) => 368 + (c - ranges.xDomain[0]) * height * ratio / Math.abs(ranges.xDomain[1] - ranges.xDomain[0]);
  const y = (c:number ) => height - ( (c - ranges.yDomain[0]) * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0]));
  return {
    x,
    y,
    scale,
    scalePoint: ((point:IVertex ) => ({
      x: x(point.x),
      y: y(point.y),
      z: scale(point.z)
    })

    )
  };
}

private fail=() => {
  console.error('==================================');
  console.error('fatal class error');
  console.error('==================================');

}

}

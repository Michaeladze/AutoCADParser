import {
  IBounds, IDxf, IEntity, IVertex
} from '../types/types';
import { findRanges } from './helpers';
import paper from 'paper';

import { zoom, globalZoom } from './zoom/zoom';
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
const showLayersAutocad: Record<string, boolean> = {
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
    workPlaces: new paper.Layer({ visible: true }),
    rooms: new paper.Layer({ visible: true }),
    // text: new paper.Layer({ visible: false }),
    text: new paper.Layer({ visible: true }),

    items: new paper.Layer({ visible: true }),
    informationBlocks: new paper.Layer({ visible: true })
  };
  l.items.bringToFront();
  l.rooms.bringToFront();
  l.workPlaces.bringToFront();
  l.text.bringToFront();
  l.informationBlocks.bringToFront();
  return l;
};
const scaleInit = {
  x: () => 1,
  y: () => 1,
  scale: () => 1,
  scalePoint: () => ({}as IVertex)
};


export class MainDraw {
  // ========================= Public=========================
  /** доступные слои в  */
  public showLayersAutocad=showLayersAutocad
  /** если класс успешно создался true */
  public isReady=false
  /** доступные слои paper */
  public layers:Record<string, paper.Layer>={}
  /** функции масштабирования координат
   * x-по шкале x
   * y-по шкале y
   * scale для скалярных величин(радиус)
   * scalePoint для точек
   * */
  public scale:IScale=scaleInit
  /** отфильтрованные объекты для отрисовки */
  public entities:IEntity[]=[]
  /** выборки для улучшения визуала */
  public selection:IFiltredEntities={
    markers: [],
    places: []
  }
  /** функция масштабирования*/
  public zoom:(factor: number)=>void=() => {}
  /** базовый размер места в пикселях*/
  public basicPlaceSize=-1
  /** проверяет размер стола относительно базовой единицы и скрывает или показывает слои */
  public checkLayers=(zoom = 1) => {
    if (this.basicPlaceSize * zoom > 20) {
      paper.project.layers[4].visible = false;
      paper.project.layers[2].visible = true;
    } else {
      paper.project.layers[4].visible = true;
      paper.project.layers[2].visible = false;
    }
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
    this.zoom = zoom;
    paper.setup(this.canvas);
    this.layers = layers();
    this.scale = this.calcScale();
    // @ts-ignore
    paper.mainDraw = this;
    this.basicPlaceSize = this.scale.scale(460);
    globalZoom();

    this.checkLayers();
    // объединяем линии в поли линии
    this.entities = simplifyBlock(dxf.entities.filter((en) => this.showLayersAutocad[en.layer]));
    this.selection = {
      markers: this.entities.filter((en) => (~en.layer.toLowerCase().indexOf('марки')) && en.type === 'INSERT'),
      places: this.entities.filter((en) => en.name && ~en.name.toLowerCase().indexOf('место'))
    };

  }
  // ========================= Private=========================
  /** текущий канвас */
  private readonly canvas:HTMLCanvasElement= {} as HTMLCanvasElement
  /** сырые данные */
  private dxf:IDxf
  /** вычисляет параметры масштабирования*/
  private calcScale =():IScale => {
    const ranges: IRanges = findRanges(this.dxf.entities);
    const { xDomain, yDomain } = ranges;
    const ratio = (xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0]);
    const container = document.getElementById('canvas-container') as HTMLElement;
    const { height } = container.getBoundingClientRect();
    const scale = (c:number) => c * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0]) * 1.35;
    const x = (c:number, offset = 368 ) =>
      offset + (c - ranges.xDomain[0]) * height * ratio / Math.abs(ranges.xDomain[1] - ranges.xDomain[0]);
    const y = (c:number ) => height - ( (c - ranges.yDomain[0]) * height / Math.abs(ranges.yDomain[1] - ranges.yDomain[0]));
    const k = (x(ranges.xDomain[1]) - 368) / (yDomain[1] - yDomain[0]);
    return {
      // k,
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
  /** в случае фейла */
  private fail=() => {
    console.error('==================================');
    console.error('fatal class error');
    console.error('==================================');

  }

}

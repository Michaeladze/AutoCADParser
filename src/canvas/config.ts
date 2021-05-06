import { IBounds } from '../types/types';

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

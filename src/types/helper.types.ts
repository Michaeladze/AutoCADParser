import { IVertex } from './types';

export interface IRanges {
  xDomain: [number, number];
  yDomain: [number, number];
}

export interface IScale {
  k?:number,
  x: (x: number, offset?:number) => number;
  y: (y: number) => number;
  scale: (scale: number) => number;
  scalePoint:(point:IVertex)=>IVertex;
}

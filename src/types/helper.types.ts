export interface IRanges {
  xDomain: [number, number];
  yDomain: [number, number];
}

export interface IScale {
  x: (x: number) => number;
  y: (y: number) => number;
  scale: (scale: number) => number;
}

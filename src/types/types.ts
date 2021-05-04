export interface IDxf {
  blocks: Record<string, IBlock>;
  entities: IEntity[];
}

export interface IBlock {
  entities: IEntity[];
  handle: string;
  layer: string;
  name: string;
  name2: string;
  ownerHandle: string;
  position: IVertex;
  xrefPath: string;
  id?: string;
  parentId?: string;
  text?: string;
}

export interface IEntity {
  extendedData: {
    applicationName: string;
    customStrings: string[]
  };
  attr?: IAttributeMap;
  handle: string;
  layer: string;
  ownerHandle: string;
  type: string;
  vertices: IVertex[];
  id?: string;
  height?: number;
  parentId?: string;
  name?: string;
  position?: IVertex;
  rotation?: number;
  color?: string
  text?: string;
}

export type IAttributeMap = Record<string, IAttribute>;

export interface IAttribute {
  point: IVertex,
  text: string,
  fontSize: number
}

export interface ICircleEntity extends IEntity {
  center: IVertex;
  radius: number;
}

export interface IEllipseEntity extends IEntity {
  center: IVertex;
  radius: number;
  axisRatio: number;
  endAngle: number;
  majorAxisEndPoint: IVertex;
  position: IVertex;
  rotation: number
  startAngle: number;
}

export interface IArcEntity extends IEntity {
  angleLength: number;
  center: IVertex;
  endAngle: number;
  position: IVertex;
  radius: number;
  rotation: number;
  startAngle: number;

}

export interface IHatchEntity extends IEntity {
  associativity: false
  boundaries: IVertex[][];
  boundaryPathsCount: number;
  elevationX: number;
  extrusionDirectionX: number;
  extrusionDirectionY: number;
  extrusionDirectionZ: number;
  position: IVertex;
  seedPointsCount: number;
  solidFill: boolean;
  color?: string
}

export interface ITextEntity extends IEntity {
  text: string;
  width: number;
  height: number;
  position: IVertex;
}

export interface IVertex {
  x: number;
  y: number;
  z: number;
}

export interface IBounds {
  minZoom: number;
  maxZoom: number;
}

export interface ISchema {
  zoom: (factor: number) => void;
}

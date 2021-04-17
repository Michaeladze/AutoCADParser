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
}

export interface IEntity {
  extendedData: {
    applicationName: string;
    customStrings: string[]
  };
  handle: string;
  layer: string;
  ownerHandle: string;
  type: string;
  vertices: IVertex[];
  id?: string;
  parentId?: string;
  name?: string;
  position?: IVertex;
}

export interface IVertex {
  x: number;
  y: number;
  z: number;
}

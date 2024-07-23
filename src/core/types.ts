export interface PosStyle {
  width: string;
  left: string;
  top: string;
  transform: string;
}

export interface IMasonryFlowItem {
  id: number;
  index: number;
  height: number;
  setPos: (pos: PosStyle) => void;
}

export interface IMasonryFlowOptions {
  width: number | `${number},${number}`;
  gap?: number;
  locationMode?: "left-top" | "translate";
}

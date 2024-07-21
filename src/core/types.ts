export interface IMasonryFlowItem {
  id: number;
  index: number;
  height: number;
  setPos: (pos: { left: string; top: string; width: string }) => void;
}

export interface IMasonryFlowOptions {
  width: number | `${number},${number}`;
  gap?: number;
}

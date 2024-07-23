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
  /**
   * @default 10
   */
  gap?: number;
  /**
   * @default undefined
   */
  gapX?: number;
  /**
   * @default undefined
   */
  gapY?: number;
  /**
   * @default 'translate'
   */
  locationMode?: "left-top" | "translate";
  /**
   * @default 'as-many-as-possible'
   */
  strategy?: "as-many-as-possible" | "as-less-as-possible";
}

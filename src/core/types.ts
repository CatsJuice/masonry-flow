export interface IMasonryFlowItemInfo {
  // TODO: virtual scroll support
  show: boolean;
  width: number;
  x: number;
  y: number;
  styleMap: PosStyle;
}

export interface PosStyle {
  width: string;
  left: string;
  top: string;
  transform: string;
  display?: string;
}

export interface IMasonryFlowItem {
  id: number;
  index: number;
  height: number;
  onUpdate?: (info?: IMasonryFlowItemInfo) => void;
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

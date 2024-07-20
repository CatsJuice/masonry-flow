import { CSSProperties, Dispatch, SetStateAction } from "react";

export interface IMasonryFlowItem {
  id: number;
  index: number;
  height: number;
  setPos: Dispatch<SetStateAction<CSSProperties>>;
}

export interface IMasonryFlowOptions {
  width: number | `${number},${number}`;
  gap?: number;
}

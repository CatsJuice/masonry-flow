import { CSSProperties, Dispatch, SetStateAction } from "react";

export interface IAbsoluteGridItem {
  id: number;
  index: number;
  height: number;
  setPos: Dispatch<SetStateAction<CSSProperties>>;
}

export interface IAbsoluteGridOptions {
  width: number | `${number},${number}`;
  gap?: number;
}

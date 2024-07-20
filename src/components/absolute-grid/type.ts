import { HTMLAttributes } from "react";
import { IAbsoluteGridOptions } from "../../core";

export interface AbsoluteGridProps
  extends IAbsoluteGridOptions,
    HTMLAttributes<HTMLDivElement> {
  transitionDuration?: number;
  transitionTiming?: string;
  scrollable?: boolean;
}

export interface AbsoluteGridItemProps extends HTMLAttributes<HTMLDivElement> {
  // TODO: optional height to make it fit the content
  height: number;
  index: number;
}
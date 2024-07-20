import { HTMLAttributes } from "react";
import { IMasonryFlowOptions } from "../../core";

export interface MasonryFlowProps
  extends IMasonryFlowOptions,
    HTMLAttributes<HTMLDivElement> {
  transitionDuration?: number;
  transitionTiming?: string;
  scrollable?: boolean;
}

export interface MasonryFlowItemProps extends HTMLAttributes<HTMLDivElement> {
  // TODO: optional height to make it fit the content
  height: number;
  index?: number;
}
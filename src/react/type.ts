import React from "react";
import { IMasonryFlowOptions } from "../core";

export interface MasonryFlowProps
  extends IMasonryFlowOptions,
    React.HTMLAttributes<HTMLDivElement> {
  transitionDuration?: number;
  transitionTiming?: string;
  scrollable?: boolean;
}

export interface MasonryFlowItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // TODO: optional height to make it fit the content
  height: number;
  index?: number;
}

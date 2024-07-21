import { IMasonryFlowItem } from "../core";
import React from "react";
import { MasonryFlowProps } from "./type";

export const Context = React.createContext<{
  items: IMasonryFlowItem[];
  setItems: React.Dispatch<React.SetStateAction<IMasonryFlowItem[]>>;
  width: MasonryFlowProps["width"];
  transitionDuration: MasonryFlowProps["transitionDuration"];
  transitionTiming: MasonryFlowProps["transitionTiming"];
}>({
  width: 0,
  setItems: () => null,
  items: [],
  transitionDuration: 200,
  transitionTiming: "ease",
});

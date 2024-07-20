import { IMasonryFlowItem } from "../../core";
import { createContext, Dispatch, SetStateAction } from "react";
import { MasonryFlowProps } from "./type";

export const Context = createContext<{
  items: IMasonryFlowItem[];
  setItems: Dispatch<SetStateAction<IMasonryFlowItem[]>>;
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

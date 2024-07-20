import { IAbsoluteGridItem } from "../../core";
import { createContext, Dispatch, SetStateAction } from "react";
import { AbsoluteGridProps } from "./type";

export const Context = createContext<{
  items: IAbsoluteGridItem[];
  setItems: Dispatch<SetStateAction<IAbsoluteGridItem[]>>;
  width: AbsoluteGridProps["width"];
  transitionDuration: AbsoluteGridProps["transitionDuration"];
  transitionTiming: AbsoluteGridProps["transitionTiming"];
}>({
  width: 0,
  setItems: () => null,
  items: [],
  transitionDuration: 200,
  transitionTiming: "ease",
});

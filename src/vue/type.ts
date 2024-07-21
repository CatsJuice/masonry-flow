import { CSSProperties } from "vue";
import { IMasonryFlowItem } from "../core";

export interface MasonryFlowRootProps {
  width: number | [number, number];
  gap?: number;
  scrollable?: boolean;
  transitionDuration?: number;
  transitionTiming?: string;
  onScroll?: () => void;
}

export interface MasonryFlowItemProps {
  height: number;
  index?: number;
  style?: CSSProperties;
}

export type ItemSet = (newItems: IMasonryFlowItem[]) => void;
export type ItemAdd = (item: IMasonryFlowItem) => void;
export type ItemRemove = (id: IMasonryFlowItem["id"]) => void;
export type ItemUpdate = (
  id: IMasonryFlowItem["id"],
  item: Partial<IMasonryFlowItem>
) => void;

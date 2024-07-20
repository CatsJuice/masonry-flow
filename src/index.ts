import "virtual:uno.css";
import {
  MasonryFlowFooter,
  MasonryFlowItem,
  MasonryFlowRoot,
} from "./components/absolute-grid";

export * from "./components/absolute-grid";

export const MasonryFlow = {
  Root: MasonryFlowRoot,
  Item: MasonryFlowItem,
  Footer: MasonryFlowFooter,
};

export default MasonryFlow;

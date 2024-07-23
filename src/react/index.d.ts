export * from "./type";
export declare const MasonryFlow: {
    Root: ({ gap, width, children, scrollable, transitionDuration, transitionTiming, onScroll: propsOnScroll, style, locationMode, ...attrs }: import("./type").MasonryFlowProps) => import("react").JSX.Element;
    Item: ({ children, style, height, index, ...attrs }: import("./type").MasonryFlowItemProps) => import("react").JSX.Element;
    Footer: ({ children }: {
        children?: import("react").ReactNode;
    }) => import("react").ReactNode;
};
export default MasonryFlow;

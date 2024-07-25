import React from "react";
import { MasonryFlowProps } from "./type";
import { calculate, IMasonryFlowItem } from "../core";
import { Context } from "./context";
import { MasonryFlowItem } from "./item";

export const MasonryFlowRoot = ({
  children,
  scrollable = true,
  transitionDuration = 230,
  transitionTiming = "ease",
  onScroll: propsOnScroll,
  style,

  // IMasonryFlowOptions
  gap,
  gapX,
  gapY,
  width,
  locationMode,
  strategy,

  ...attrs
}: MasonryFlowProps) => {
  const [items, setItems] = React.useState<IMasonryFlowItem[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const update = React.useCallback(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!container || !content) return;
    const rect = container.getBoundingClientRect();
    const { totalHeight, infoMap } = calculate(items, rect, {
      gap,
      gapX,
      gapY,
      width,
      locationMode,
      strategy,
    });

    content.style.height = `${totalHeight}px`;
    items.forEach((item) => {
      const info = infoMap.get(item.id);
      if (!info) return;
      item.onUpdate?.(info);
    });
  }, [gap, gapX, gapY, items, locationMode, strategy, width]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = React.useCallback(
    (e) => {
      if (!scrollable) return;
      const container = containerRef.current;
      if (!container) return;
      propsOnScroll?.(e);
      // TODO: virtual scroll
      // TODO: load more
    },
    [propsOnScroll, scrollable]
  );

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [update]);

  React.useLayoutEffect(() => {
    update();
  }, [update]);

  const minWidth =
    typeof width === "string"
      ? Math.min(...width.split(",").map(Number))
      : width;

  const childrenWithIndex = React.Children.map(children, (child, index) => {
    if (
      child !== null &&
      typeof child === "object" &&
      "type" in child &&
      child.type === MasonryFlowItem
    ) {
      return React.cloneElement(child, { index });
    } else {
      return child;
    }
  });

  return (
    <Context.Provider
      value={{ width, items, setItems, transitionDuration, transitionTiming }}
    >
      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{
          overflowY: scrollable ? "auto" : undefined,
          position: "relative",
          minWidth,
          ...style,
        }}
        {...attrs}
      >
        <div ref={contentRef}>{childrenWithIndex}</div>
      </div>
    </Context.Provider>
  );
};

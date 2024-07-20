import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MasonryFlowProps } from "./type";
import { calculate, IMasonryFlowItem } from "../../core";
import { Context } from "./context";
import { MasonryFlowItem } from "./item";

export const MasonryFlowRoot = ({
  gap,
  width,
  children,
  scrollable = true,
  transitionDuration = 400,
  transitionTiming = "cubic-bezier(.36,.19,.14,.99)",
  onScroll: propsOnScroll,
  ...attrs
}: MasonryFlowProps) => {
  const [items, setItems] = useState<IMasonryFlowItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!container || !content) return;
    const rect = container.getBoundingClientRect();
    const { totalHeight, infoMap } = calculate(items, rect, {
      width,
      gap,
    });

    content.style.height = `${totalHeight}px`;
    items.forEach((item) => {
      const info = infoMap.get(item.id);
      if (!info) return;
      const { left, top, width } = info.info;
      item.setPos({
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
      });
    });
  }, [gap, items, width]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback(
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

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [update]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  const minWidth =
    typeof width === "string"
      ? Math.min(...width.split(",").map(Number))
      : width;

  const childrenWithIndex = Children.map(children, (child, index) => {
    if (
      child !== null &&
      typeof child === "object" &&
      "type" in child &&
      child.type === MasonryFlowItem
    ) {
      return cloneElement(child, { index });
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
          overflowY: scrollable ? "auto" : "hidden",
          position: "relative",
          minWidth,
        }}
        {...attrs}
      >
        <div ref={contentRef}>{childrenWithIndex}</div>
      </div>
    </Context.Provider>
  );
};

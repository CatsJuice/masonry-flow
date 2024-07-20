import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MasonryFlowProps } from "./type";
import { calculate, IMasonryFlowItem } from "../../core";
import { Context } from "./context";

export const MasonryFlowRoot = ({
  gap,
  width,
  children,
  scrollable = true,
  transitionDuration = 400,
  transitionTiming = "cubic-bezier(.36,.19,.14,.99)",
  className,
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

  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
    if (!scrollable) return;
    const container = containerRef.current;
    if (!container) return;
    propsOnScroll?.(e);
    // TODO: virtual scroll
    // TODO: load more
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [update]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  return (
    <Context.Provider
      value={{ width, items, setItems, transitionDuration, transitionTiming }}
    >
      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{ overflowY: scrollable ? "auto" : "hidden" }}
        className={`relative ${className}`}
        {...attrs}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </Context.Provider>
  );
};

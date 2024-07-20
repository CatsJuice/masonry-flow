import {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MasonryFlowItemProps } from "./type";
import { Context } from "./context";

let _internalId = 0;
export const MasonryFlowItem = ({
  children,
  className,
  style,
  height,
  index,
  ...attrs
}: MasonryFlowItemProps) => {
  const { setItems, transitionDuration, transitionTiming } =
    useContext(Context);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ visibility: "hidden" } as CSSProperties);

  const finalStyle = useMemo(
    () => ({
      height: height ? `${height}px` : undefined,
      transition: `all ${transitionDuration}ms ${transitionTiming}`,
      ...pos,
      ...style,
    }),
    [height, pos, style, transitionDuration, transitionTiming]
  );

  useEffect(() => {
    const id = _internalId++;
    setItems((prev) =>
      [...prev, { id, height, setPos, index }].sort((a, b) => a.index - b.index)
    );

    return () => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };
  }, [height, index, setItems]);

  return (
    <div
      ref={ref}
      className={`absolute ${className}`}
      style={finalStyle}
      {...attrs}
    >
      {children}
    </div>
  );
};

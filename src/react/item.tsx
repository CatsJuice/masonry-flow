import React from "react";
import { MasonryFlowItemProps } from "./type";
import { Context } from "./context";

let _internalId = 0;
export const MasonryFlowItem = ({
  children,
  style,
  height,
  index,
  ...attrs
}: MasonryFlowItemProps) => {
  const { setItems, transitionDuration, transitionTiming } =
    React.useContext(Context);
  const [pos, setPos] = React.useState({
    visibility: "hidden",
  } as React.CSSProperties);

  const finalStyle = React.useMemo(
    () =>
      ({
        height: height ? `${height}px` : undefined,
        transition: `all ${transitionDuration}ms ${transitionTiming}`,
        position: "absolute",
        ...pos,
        ...style,
      } satisfies React.CSSProperties),
    [height, pos, style, transitionDuration, transitionTiming]
  );

  React.useEffect(() => {
    const id = _internalId++;
    setItems((prev) =>
      [...prev, { id, height, setPos, index: index ?? 0 }].sort(
        (a, b) => a.index - b.index
      )
    );

    return () => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };
  }, [height, index, setItems]);

  return (
    <div style={finalStyle} {...attrs}>
      {children}
    </div>
  );
};

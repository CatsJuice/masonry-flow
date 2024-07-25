import React from "react";
import { MasonryFlowItemProps } from "./type";
import { Context } from "./context";
import { IMasonryFlowItem, IMasonryFlowItemInfo } from "../core";

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
  const [info, setInfo] = React.useState<IMasonryFlowItemInfo>({
    styleMap: {
      display: "none",
      width: "0",
      left: "0",
      top: "0",
      transform: "none",
    },
    show: false,
    width: 0,
    x: 0,
    y: 0,
  });

  const onUpdate = React.useCallback((info?: IMasonryFlowItemInfo) => {
    if (info) setInfo(info);
  }, []);

  const finalStyle = React.useMemo(
    () =>
      ({
        height: height ? `${height}px` : undefined,
        transition: `all ${transitionDuration}ms ${transitionTiming}`,
        position: "absolute",
        ...info.styleMap,
        ...style,
      } satisfies React.CSSProperties),
    [height, info.styleMap, style, transitionDuration, transitionTiming]
  );

  React.useEffect(() => {
    const id = _internalId++;
    setItems((prev) =>
      [
        ...prev,
        { id, height, onUpdate, index: index ?? 0 } satisfies IMasonryFlowItem,
      ].sort((a, b) => a.index - b.index)
    );

    return () => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };
  }, [height, index, onUpdate, setItems]);

  return (
    <div data-x={info.x} data-y={info.y} style={finalStyle} {...attrs}>
      {children}
    </div>
  );
};

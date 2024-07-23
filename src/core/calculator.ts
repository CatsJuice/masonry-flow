import { IMasonryFlowItem, IMasonryFlowOptions, PosStyle } from "./types";

interface IMasonryFlowItemInfo extends IMasonryFlowItem {
  info: {
    // TODO: virtual scroll support
    show: boolean;
    width: number;
    x: number;
    y: number;
    styleMap: PosStyle;
  };
}

const getColumnsAsManyAsPossible = (
  totalWidth: number,
  range: [number, number],
  gap: number
) => {
  const [minWidth, maxWidth] = range;
  const maxColumns = Math.floor((totalWidth + gap) / (minWidth + gap));
  let width = minWidth;
  let columns = Math.max(1, maxColumns);

  for (; columns > 1; columns--) {
    const currentWidth = (totalWidth - gap * (columns - 1)) / columns;

    if (currentWidth >= minWidth && currentWidth <= maxWidth) {
      width = currentWidth;
      break;
    }
  }

  return { columns, width };
};
const getColumnsAsLessAsPossible = (
  totalWidth: number,
  range: [number, number],
  gap: number
) => {
  const [, maxWidth] = range;
  let columns = Math.floor((totalWidth + gap) / (maxWidth + gap));
  columns = Math.max(1, columns);

  const width = Math.min(
    maxWidth,
    (totalWidth - gap * (columns - 1)) / columns
  );

  return { columns, width };
};

const getStackHeight = (stack: IMasonryFlowItem[], gap: number) => {
  return (
    stack.reduce((acc, curr) => acc + curr.height, 0) + gap * (stack.length - 1)
  );
};

export const calculate = (
  items: IMasonryFlowItem[],
  containerSize: { width: number; height: number },
  options: IMasonryFlowOptions
) => {
  const {
    gap = 10,
    width,
    locationMode = "translate",
    strategy = "as-many-as-possible",
  } = options;
  const [minWidth, maxWidth] =
    typeof width === "string"
      ? width.split(",").map(Number).sort()
      : [width, width];

  const columnsCalculator =
    strategy === "as-many-as-possible"
      ? getColumnsAsManyAsPossible
      : getColumnsAsLessAsPossible;
  const { columns, width: itemWidth } = columnsCalculator(
    containerSize.width,
    [minWidth, maxWidth],
    gap
  );

  const actualWidth = columns * itemWidth + (columns - 1) * gap;
  const leftOffset = (containerSize.width - actualWidth) / 2;

  const stacks = Array.from({ length: columns }).map(
    () => [] as IMasonryFlowItem[]
  );

  items.forEach((item) =>
    stacks
      .slice(1)
      .reduce(
        (prev, curr) =>
          getStackHeight(prev, gap) <= getStackHeight(curr, gap) ? prev : curr,
        stacks[0]
      )
      .push(item)
  );

  const infoStacks = stacks.map((stack, i) => {
    let topOffset = 0;
    return stack.map((item) => {
      const x = leftOffset + i * (itemWidth + gap);
      const y = topOffset;
      const info = {
        show: true,
        width: itemWidth,
        x,
        y,
        styleMap:
          locationMode === "translate"
            ? {
                width: `${itemWidth}px`,
                transform: `translate3d(${x}px, ${y}px, 0)`,
                left: "0",
                top: "0",
              }
            : {
                width: `${itemWidth}px`,
                left: `${x}px`,
                top: `${y}px`,
                transform: "none",
              },
      } satisfies IMasonryFlowItemInfo["info"];
      topOffset += item.height + gap;
      return { ...item, info } satisfies IMasonryFlowItemInfo;
    });
  });

  const totalHeight = Math.max(
    ...infoStacks.map((stack) => getStackHeight(stack, gap))
  );

  const infoMap = infoStacks.reduce((acc, curr) => {
    curr.forEach((item) => {
      acc.set(item.id, item);
    });
    return acc;
  }, new Map<number, IMasonryFlowItemInfo>());

  return {
    totalHeight,
    infoMap,
  };
};

import {
  IMasonryFlowItem,
  IMasonryFlowItemInfo,
  IMasonryFlowOptions,
} from "./types";

const getColumnsAsManyAsPossible = (
  totalWidth: number,
  range: [number, number],
  gapX: number
) => {
  const [minWidth, maxWidth] = range;
  const maxColumns = Math.floor((totalWidth + gapX) / (minWidth + gapX));
  const columns = Math.max(1, maxColumns);

  const averageWidth = (totalWidth - gapX * (columns - 1)) / columns;
  const width = Math.min(minWidth, Math.max(maxWidth, averageWidth));

  return { columns, width };
};
const getColumnsAsLessAsPossible = (
  totalWidth: number,
  range: [number, number],
  gapX: number
) => {
  const [, maxWidth] = range;
  let columns = Math.floor((totalWidth + gapX) / (maxWidth + gapX));
  columns = Math.max(1, columns);

  const width = Math.min(
    maxWidth,
    (totalWidth - gapX * (columns - 1)) / columns
  );

  return { columns, width };
};

const getStackHeight = (stack: IMasonryFlowItem[], gapY: number) => {
  return (
    stack.reduce((acc, curr) => acc + curr.height, 0) +
    gapY * (stack.length - 1)
  );
};

export const calculate = (
  items: IMasonryFlowItem[],
  containerSize: { width: number; height: number },
  options: IMasonryFlowOptions
) => {
  const {
    gap: gapXY = 10,
    width,
    locationMode = "translate",
    strategy = "as-many-as-possible",
  } = options;
  const gapX = options.gapX ?? gapXY;
  const gapY = options.gapY ?? gapXY;
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
    gapX
  );

  const actualWidth = columns * itemWidth + (columns - 1) * gapX;
  const leftOffset = (containerSize.width - actualWidth) / 2;

  const stacks = Array.from({ length: columns }).map(
    () => [] as IMasonryFlowItem[]
  );

  items.forEach((item) =>
    stacks
      .slice(1)
      .reduce(
        (prev, curr) =>
          getStackHeight(prev, gapY) <= getStackHeight(curr, gapY)
            ? prev
            : curr,
        stacks[0]
      )
      .push(item)
  );

  const infoStacks = stacks.map((stack, i) => {
    let topOffset = 0;
    return stack.map((item) => {
      const x = leftOffset + i * (itemWidth + gapX);
      const y = topOffset;
      topOffset += item.height + gapY;
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
      } satisfies IMasonryFlowItemInfo;

      return { info, item };
    });
  });

  const totalHeight = Math.max(
    ...infoStacks.map((stack) =>
      getStackHeight(
        stack.map((e) => e.item),
        gapY
      )
    )
  );

  const infoMap = infoStacks.reduce((acc, curr) => {
    curr.forEach(({ item, info }) => {
      acc.set(item.id, info);
    });
    return acc;
  }, new Map<number, IMasonryFlowItemInfo>());

  return {
    totalHeight,
    infoMap,
  };
};

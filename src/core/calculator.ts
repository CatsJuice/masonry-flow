import { IMasonryFlowItem, IMasonryFlowOptions } from "./types";

interface IMasonryFlowItemInfo extends IMasonryFlowItem {
  info: {
    width: number;
    left: number;
    top: number;
  };
}

const getColumns = (
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
    } else {
      break;
    }
  }

  return { columns, width };
};

export const calculate = (
  items: IMasonryFlowItem[],
  containerSize: { width: number; height: number },
  options: IMasonryFlowOptions
) => {
  const { gap = 10, width } = options;
  const [minWidth, maxWidth] =
    typeof width === "string"
      ? width.split(",").map(Number).sort()
      : [width, width];

  const { columns, width: itemWidth } = getColumns(
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
      .reduce((prev, curr) => {
        const prevHeight = prev.reduce((acc, curr) => acc + curr.height, 0);
        const currHeight = curr.reduce((acc, curr) => acc + curr.height, 0);
        return prevHeight <= currHeight ? prev : curr;
      }, stacks[0])
      .push(item)
  );

  const infoStacks = stacks.map((stack, i) => {
    let topOffset = 0;
    return stack.map((item) => {
      const info = {
        width: itemWidth,
        left: leftOffset + i * (itemWidth + gap),
        top: topOffset,
      };
      topOffset += item.height + gap;
      return { ...item, info } as IMasonryFlowItemInfo;
    });
  });

  const totalHeight = Math.max(
    ...infoStacks.map((stack) =>
      stack.reduce((acc, curr) => acc + curr.height, 0)
    )
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

import { IAbsoluteGridItem, IAbsoluteGridOptions } from "./types";

interface IAbsoluteGridItemInfo extends IAbsoluteGridItem {
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
  let columns = maxColumns;

  for (; columns > 0; columns--) {
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
  items: IAbsoluteGridItem[],
  containerSize: { width: number; height: number },
  options: IAbsoluteGridOptions
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
    () => [] as IAbsoluteGridItem[]
  );

  items.forEach((item) =>
    stacks
      .reduce((prev, curr) => {
        const prevHeight = prev.reduce((acc, curr) => acc + curr.height, 0);
        const currHeight = curr.reduce((acc, curr) => acc + curr.height, 0);
        return prevHeight <= currHeight ? prev : curr;
      })
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
      return { ...item, info } as IAbsoluteGridItemInfo;
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
  }, new Map<number, IAbsoluteGridItemInfo>());

  return {
    totalHeight,
    infoMap,
  };
};

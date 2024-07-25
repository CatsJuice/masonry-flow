export interface Item {
  id: number;
  name: string;
  color: string;
  height: number;
  thumb: string;
  content: string;
}
let _id = 0;

export const getHeight = (fixed?: boolean) =>
  fixed ? 300 : Math.round(250 + Math.random() * 130);

const colors = [
  "#cd6155",
  "#ec7063",
  "#af7ac5",
  "#a569bd",
  "#5499c7",
  "#5dade2",
  "#48c9b0",
  "#45b39d",
  "#52be80",
  "#58d68d",
  "#f4d03f",
  "#f5b041",
  "#eb984e",
  "#dc7633",
  "#f0f3f4",
  "#cacfd2",
  "#aab7b8",
  "#99a3a4",
  "#5d6d7e",
  "#566573",
];
const ps = [
  "Not doing something will always be faster than doing it",
  "The same philosophy applies in other areas of life.",
  "For example, there is no meeting that goes faster than not having a meeting at all.",
  "This statement reminds me of the old computer programming saying",
  "“Remember that there is no code faster than no code.”",
];

export const randomItem = (fixedHeight?: boolean) => {
  const thumbIds = Array.from({ length: 10 }, (_, i) => i + 1);
  const randomThumbId = thumbIds[Math.floor(Math.random() * thumbIds.length)];

  return {
    id: _id++,
    name: "Item " + _id,
    color: colors[Math.floor(Math.random() * colors.length)],
    height: getHeight(fixedHeight),
    thumb: `imgs/thumb.${randomThumbId}.jpg`,
    content: ps[Math.floor(Math.random() * ps.length)],
  } satisfies Item;
};

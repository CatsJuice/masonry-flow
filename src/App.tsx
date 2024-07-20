import { useCallback, useEffect, useRef, useState } from "react";
import { MasonryFlowItem, MasonryFlowRoot } from "./components/absolute-grid";
import "./App.css";
import { Pane } from "tweakpane";

interface Item {
  id: number;
  name: string;
  color: string;
  height: number;
}
let _id = 0;
const getHeight = (fixed?: boolean) =>
  fixed ? 300 : Math.round(200 + Math.random() * 200);
const randomItem = (fixedHeight?: boolean) => {
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
  return {
    id: _id++,
    name: "Item " + _id,
    color: colors[Math.floor(Math.random() * colors.length)],
    height: getHeight(fixedHeight),
  };
};

const PARAMS = {
  fixedHeight: false,
  gap: 8,
  minWidth: 200,
  maxWidth: 300,
  transitionDuration: 400,
};

function App() {
  const [list, setList] = useState<Item[]>([]);

  const addItem = useCallback((item: Item) => {
    setList((prev) => [...prev, item]);
  }, []);

  const insertItem = useCallback((item: Item, index: number) => {
    setList((prev) => {
      const next = [...prev];
      next.splice(index, 0, item);
      return next;
    });
  }, []);

  const removeItem = useCallback((id?: number) => {
    if (id !== undefined)
      setList((prev) => prev.filter((item) => item.id !== id));
    else setList((prev) => prev.slice(0, -1));
  }, []);

  const batchAdd = useCallback(
    (count = 10, delay = 100) => {
      addItem(randomItem(fixedHeight));
      if (count > 1) {
        setTimeout(() => batchAdd(count - 1, delay), delay);
      }
    },
    [addItem]
  );

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) batchAdd(10);
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fixedHeight, setFixedHeight] = useState(PARAMS.fixedHeight);
  const [gap, setGap] = useState(PARAMS.gap);
  const [minWidth, setMinWidth] = useState(PARAMS.minWidth);
  const [maxWidth, setMaxWidth] = useState(PARAMS.maxWidth);
  const [transitionDuration, setTransitionDuration] = useState(
    PARAMS.transitionDuration
  );

  useEffect(() => {
    const pane = new Pane();

    const prevHeights = new Map();

    const itemsControl = pane.addFolder({ title: "Items" });

    // height control
    itemsControl
      .addBinding(PARAMS, "fixedHeight", { label: "Fix height" })
      .on("change", ({ value }) => {
        setFixedHeight(value);
        setList((prev) => {
          if (value) {
            prevHeights.clear();
            prev.forEach((item) => prevHeights.set(item.id, item.height));
          }
          return prev.map((item) => ({
            ...item,
            height: value
              ? getHeight(value)
              : prevHeights.get(item.id) ?? getHeight(value),
          }));
        });
      });

    // clear
    itemsControl
      .addButton({ title: "Clear all", label: "Reset" })
      .on("click", () => setList([]));

    // add
    itemsControl
      .addButton({ label: "Add single", title: "+1" })
      .on("click", () => addItem(randomItem(fixedHeight)));
    itemsControl
      .addButton({ label: "Add 10", title: "+10" })
      .on("click", () => batchAdd(10, 100));
    // remove
    itemsControl
      .addButton({ label: "Remove single", title: "-1" })
      .on("click", () => removeItem());
    itemsControl
      .addButton({ label: "Remove 10", title: "-10" })
      .on("click", () => setList((prev) => prev.slice(0, -10)));

    const styleControl = pane.addFolder({ title: "Style" });
    styleControl
      .addBinding(PARAMS, "gap", { min: 0, max: 50, step: 1 })
      .on("change", ({ value }) => setGap(value));
    styleControl
      .addBinding(PARAMS, "minWidth", { min: 50, max: 300, step: 10 })
      .on("change", ({ value }) => setMinWidth(value));
    styleControl
      .addBinding(PARAMS, "maxWidth", { min: 300, max: 500, step: 10 })
      .on("change", ({ value }) => setMaxWidth(value));
    styleControl
      .addBinding(PARAMS, "transitionDuration", {
        min: 0,
        max: 1000,
        step: 10,
        label: "Duration",
      })
      .on("change", ({ value }) => setTransitionDuration(value));

    const virtualScrollControl = pane.addFolder({ title: "Virtual Scroll" });
    virtualScrollControl.addButton({ title: "Not implemented", label: "TODO" });

    return () => pane.dispose();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center w-screen h-screen px-10 py-4 mx-auto">
      <MasonryFlowRoot
        width={`${minWidth},${maxWidth}`}
        gap={gap}
        transitionDuration={transitionDuration}
        className="w-full h0 flex-1 rounded"
      >
        {list.map((item, index) => {
          return (
            <MasonryFlowItem index={index} key={item.id} height={item.height}>
              <div
                className="card w-full h-full rounded-2 flex gap-2 flex-col items-center justify-center p4"
                style={{ background: item.color }}
              >
                {item.name}
                <button
                  data-dense
                  data-ghost
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
                <button
                  data-dense
                  data-ghost
                  onClick={() => insertItem(randomItem(fixedHeight), index)}
                >
                  Insert Before
                </button>
                <button
                  data-dense
                  data-ghost
                  onClick={() => insertItem(randomItem(fixedHeight), index + 1)}
                >
                  Insert After
                </button>
              </div>
            </MasonryFlowItem>
          );
        })}
      </MasonryFlowRoot>
    </div>
  );
}

export default App;

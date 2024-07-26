import { useCallback, useEffect, useRef, useState } from "react";
import MasonryFlow from "../../src/react";
import { Pane } from "tweakpane";
import { getHeight, type Item, randomItem } from "./utils/item";
import { Card } from "./components/card";
import { AppHeader } from "./components/app-header";
import { ResizeFrame } from "./components/resize-frame";

const PARAMS = {
  fixedHeight: false,
  gapX: 8,
  gapY: 8,
  minWidth: 260,
  maxWidth: 370,
  transitionDuration: 400,
  locationMode: "translate" as const,
  strategy: "as-many-as-possible" as const,
};

function App() {
  const debuggerContainerRef = useRef<HTMLDivElement>(null);
  const insertPointRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<Item[]>([]);
  const [fixedHeight, setFixedHeight] = useState(PARAMS.fixedHeight);
  const [gapX, setGapX] = useState(PARAMS.gapX);
  const [gapY, setGapY] = useState(PARAMS.gapY);
  const [minWidth, setMinWidth] = useState(PARAMS.minWidth);
  const [maxWidth, setMaxWidth] = useState(PARAMS.maxWidth);
  const [locationMode, setLocationMode] = useState(PARAMS.locationMode);
  const [transitionDuration, setTransitionDuration] = useState(
    PARAMS.transitionDuration
  );
  const [strategy, setStrategy] = useState(PARAMS.strategy);

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

  const moveItem = useCallback((id: number, offset: number) => {
    setList((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const next = [...prev];
      const item = next.splice(index, 1)[0];
      next.splice(index + offset, 0, item);
      return next;
    });
  }, []);

  const batchAdd = useCallback(
    (count = 10, delay = 100, offset = 5) => {
      addItem(randomItem(fixedHeight));
      if (count > 1) {
        setTimeout(() => batchAdd(count - 1, delay), delay + offset);
      }
    },
    [addItem, fixedHeight]
  );
  const batchRemove = useCallback(
    (count = 10, delay = 50, offset = -2) => {
      removeItem();
      if (count > 1) {
        setTimeout(() => batchRemove(count - 1, delay), delay + offset, offset);
      }
    },
    [removeItem]
  );

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) batchAdd(10);
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pane = new Pane({
      container: debuggerContainerRef.current!,
    });

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
      .on("click", () => batchRemove(10));
    itemsControl
      .addBinding(PARAMS, "locationMode", {
        options: { "Left-Top": "left-top", Translate: "translate" },
        label: "Location Mode",
      })
      .on("change", ({ value }) => setLocationMode(value));
    itemsControl
      .addBinding(PARAMS, "strategy", {
        options: {
          "As many as possible": "as-many-as-possible",
          "As less as possible": "as-less-as-possible",
        },
        label: "Strategy",
      })
      .on("change", ({ value }) => setStrategy(value));

    const styleControl = pane.addFolder({ title: "Style" });
    styleControl
      .addBinding(PARAMS, "gapX", { min: 0, max: 50, step: 1 })
      .on("change", ({ value }) => setGapX(value));
    styleControl
      .addBinding(PARAMS, "gapY", { min: 0, max: 50, step: 1 })
      .on("change", ({ value }) => setGapY(value));
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
  }, [addItem, batchAdd, batchRemove, fixedHeight, removeItem]);

  return (
    <div className="w-full h-full flex flex-col relative">
      <AppHeader
        debuggerContainerRef={debuggerContainerRef}
        className="px10 max-w-1200px mx-auto w-full"
      />
      <ResizeFrame className="h0 flex-1 px4 pt0 pb6">
        <MasonryFlow.Root
          width={`${minWidth},${maxWidth}`}
          gapX={gapX}
          gapY={gapY}
          transitionDuration={transitionDuration}
          className="w-full h-full"
          scrollable={true}
          locationMode={locationMode}
          strategy={strategy}
        >
          {list.map((item, index) => {
            return (
              <MasonryFlow.Item key={item.id} height={item.height}>
                <Card
                  insertPointRef={insertPointRef}
                  item={item}
                  onInsertBefore={() =>
                    insertItem(randomItem(fixedHeight), index)
                  }
                  onInsertAfter={() =>
                    insertItem(randomItem(fixedHeight), index + 1)
                  }
                  onRemove={() => removeItem(item.id)}
                  onMoveBefore={() => moveItem(item.id, -1)}
                  onMoveAfter={() => moveItem(item.id, 1)}
                />
              </MasonryFlow.Item>
            );
          })}
          <div ref={insertPointRef} />
        </MasonryFlow.Root>
      </ResizeFrame>
    </div>
  );
}

export default App;

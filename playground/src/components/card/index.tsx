import React, {
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Item } from "../../utils/item";
import "./card.css";

interface CardProps extends PropsWithChildren {
  item: Item;
  insertPointRef?: React.RefObject<HTMLDivElement>;
  onInsertBefore: () => void;
  onInsertAfter: () => void;
  onMoveBefore: () => void;
  onMoveAfter: () => void;
  onRemove: () => void;
}
export const Card = ({
  item,
  insertPointRef,
  onInsertBefore,
  onInsertAfter,
  onMoveBefore,
  onMoveAfter,
  onRemove,
}: CardProps) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return () => {
      const card = cardRef.current?.parentNode as HTMLDivElement;
      const parent = insertPointRef?.current;
      if (!card || !parent) return;

      const cloned = card.cloneNode(true) as HTMLDivElement;
      const bounding = card.getBoundingClientRect();
      if (bounding.width === 0 || bounding.height === 0) return;

      const x = parseFloat(card.dataset.x ?? "0");
      const y = parseFloat(card.dataset.y ?? "0");

      const duration = 270;
      cloned.classList.remove("animate-in");
      cloned.style.transition = `all ${duration}ms`;
      cloned.style.opacity = "1";
      cloned.style.pointerEvents = "none";
      parent.appendChild(cloned);

      requestAnimationFrame(() => {
        if (card.style.transform && card.style.transform !== "none") {
          cloned.style.transform = `translate(${x}px, ${y + 5}px) scale(0.2)`;
        } else {
          cloned.style.transform = `translate(0%, 5px) scale(0.2)`;
        }
        cloned.style.opacity = "0";
        setTimeout(() => cloned.remove(), duration);
      });
    };
  }, [insertPointRef]);

  return (
    <div
      ref={cardRef}
      className="card animate-in w-full h-full rounded-4 border-0.5 border-solid border-card-border bg-card-bg px5 py4 flex flex-col items-start gap-2 text-sm"
    >
      <h3>{item.name}</h3>

      <p className="text-sm font-400">{item.content}</p>

      <div
        className="w-full h-full rounded-2 block max-h-20 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${item.thumb})` }}
      ></div>

      <div className="flex items-center flex-nowrap gap4">
        <div className="card-item-label">Counter</div>
        <div className="flex items-center flex-nowrap">
          <button
            className="count-button prev"
            onClick={() => setCount((prev) => prev - 1)}
          >
            <div className="i-mdi:minus" />
          </button>
          <div className="count px2 text-xs min-w-40px">{count}</div>
          <button
            className="count-button next"
            onClick={() => setCount((prev) => prev + 1)}
          >
            <div className="i-mdi:plus"></div>
          </button>
        </div>
      </div>

      <div className="flex items-center flex-nowrap gap4">
        <div className="card-item-label">Insert</div>
        <div className="flex items-center flex-nowrap gap2">
          <button onClick={onInsertBefore} className="action-button">
            Before
          </button>
          <button onClick={onInsertAfter} className="action-button">
            After
          </button>
        </div>
      </div>

      <div className="flex items-center flex-nowrap gap4">
        <div className="card-item-label">Move</div>
        <div className="flex items-center flex-nowrap gap2">
          <button onClick={onMoveBefore} className="action-button">
            Before
          </button>
          <button onClick={onMoveAfter} className="action-button">
            After
          </button>
        </div>
      </div>

      <div className="h0 flex-1" />

      <a
        onClick={onRemove}
        className="flex gap3 items-center text-xs color-red-5 hover:color-red-7 cursor-pointer"
      >
        <div>remove</div>
        <div className="i-mdi:arrow-right" />
      </a>
    </div>
  );
};

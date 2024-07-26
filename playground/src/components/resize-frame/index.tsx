import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Ruler } from "./ruler";
import "./resize.css";

const MAX_WIDTH = 1920;
interface ResizeFrameProps extends HTMLAttributes<HTMLDivElement> {}
export const ResizeFrame = ({ children, className }: ResizeFrameProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [totalWidth, setTotalWidth] = useState(1200);
  const [width, setWidth] = useState(1200);
  const [dragging, setDragging] = useState(false);

  const availableWidth = totalWidth - 100;
  const finalWidth = Math.min(width, availableWidth);

  const onResize = useCallback((rect: DOMRectReadOnly) => {
    setTotalWidth(rect.width);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const _onResize = () => {
      const rect = wrapper.getBoundingClientRect();
      onResize(rect);
    };

    window.addEventListener("resize", _onResize);

    _onResize();

    return () => {
      window.removeEventListener("resize", _onResize);
    };
  }, [onResize]);

  const startXRef = useRef(0);

  const onMousedown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, reverse = false) => {
      const onMousemove = (e: MouseEvent) => {
        e.preventDefault();

        const dx = e.clientX - startXRef.current;
        const next = width + dx * 2 * (reverse ? -1 : 1);
        setWidth(Math.max(300, Math.min(next, availableWidth)));
      };

      const onMouseup = () => {
        window.removeEventListener("mousemove", onMousemove);
        window.removeEventListener("mouseup", onMouseup);
        window.removeEventListener("blur", onMouseup);
        setDragging(false);
      };

      e.stopPropagation();
      e.preventDefault;

      const startX = e.clientX;
      startXRef.current = startX;
      setDragging(true);
      window.addEventListener("mousemove", onMousemove);
      window.addEventListener("mouseup", onMouseup);
      window.addEventListener("blur", onMouseup);
    },
    [availableWidth, width]
  );

  return (
    <div
      ref={wrapperRef}
      className={`resize-frame flex flex-col gap4 ${
        dragging ? "dragging" : ""
      } ${className ?? ""}`}
    >
      <Ruler className="mx-auto" width={finalWidth} maxWidth={MAX_WIDTH} />
      <div
        className="resize-container mx-auto h0 flex-1 relative flex-center"
        style={{ width: finalWidth }}
      >
        <div className="resize-hover-effect px4 absolute">
          <div className="resize-hover-effect-inner w-full h-full flex items-center relative">
            <div
              className="resize-handle l"
              onMouseDown={(e) => onMousedown(e, true)}
            />
            <div className="resize-handle r" onMouseDown={onMousedown} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

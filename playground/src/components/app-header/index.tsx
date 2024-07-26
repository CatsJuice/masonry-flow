import { HTMLAttributes, useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle/theme-toogle";

interface AppHeaderProps extends HTMLAttributes<HTMLDivElement> {
  debuggerContainerRef: React.RefObject<HTMLDivElement>;
}

export const AppHeader = ({
  debuggerContainerRef,
  className,
}: AppHeaderProps) => {
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    if (showDebugger) {
      const onClick = (e: MouseEvent) => {
        const container = debuggerContainerRef.current;
        const target = e.target as HTMLElement;
        if (!target.closest(".debugger-root") && !container?.contains(target)) {
          setShowDebugger(false);
        }
      };
      window.addEventListener("click", onClick);
      return () => {
        window.removeEventListener("click", onClick);
      };
    }
  }, [debuggerContainerRef, showDebugger]);

  return (
    <header
      className={`flex justify-between h16 items-center ${className ?? ""}`}
    >
      <h1 className="text-lg">Masonry Flow</h1>

      <div className="flex gap1">
        <ThemeToggle />
        <button
          className="debugger-root header-action relative"
          onClick={() => setShowDebugger((prev) => !prev)}
        >
          <div className="i-mdi:settings" />
          <div
            onClick={(e) => e.stopPropagation()}
            ref={debuggerContainerRef}
            className={`w300px absolute top-full right-0 z100 select-none mt2 ${
              showDebugger
                ? "visible pointer-events-auto"
                : "hidden pointer-events-none"
            }`}
          />
        </button>
        <button className="header-action">
          <a
            href="https://github.com/CatsJuice/masonry-flow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="i-mdi:github" />
          </a>
        </button>
      </div>
    </header>
  );
};

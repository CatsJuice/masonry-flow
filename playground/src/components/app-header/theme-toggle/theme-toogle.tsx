import { useCallback, useEffect, useMemo, useState } from "react";

const transitionStyle = {
  transition: "all .6s cubic-bezier(.69,.15,.34,1.37)",
};

export const ThemeToggle = () => {
  const [modifiedManually, setModifiedManually] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    setModifiedManually(true);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    const onThemeChange = (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? "dark" : "light";
      if (!modifiedManually) {
        setTheme(newColorScheme);
      }
    };

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", onThemeChange);

    return () => {
      mediaQueryList.removeEventListener("change", onThemeChange);
    };
  }, [modifiedManually]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle(theme, true);
    document.documentElement.classList.toggle(
      theme === "light" ? "dark" : "light",
      false
    );
  }, [theme]);

  const totalCircles = 12;
  const outerCircles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const deg = (i * 360) / totalCircles;
        const cx = isDark ? 50 : 50 + 24 * Math.cos((deg * Math.PI) / 180);
        const cy = isDark ? 50 : 50 + 24 * Math.sin((deg * Math.PI) / 180);
        const width = isDark ? 0 : 8;
        const height = isDark ? 0 : 4;
        const x = cx - width / 2;
        const y = cy - height / 2;
        const rx = height / 2;
        const ry = height / 2;
        const rotate = deg;
        const transform = `rotate(${rotate}, ${cx}, ${cy})`;
        return {
          x,
          y,
          width,
          height,
          rx,
          ry,
          transform,
          style: {
            ...transitionStyle,
            transitionDelay: isDark ? "0s" : `${(i * 0.2) / totalCircles}s`,
            opacity: isDark ? 0 : 1,
          },
        };
      }),
    [isDark]
  );

  return (
    <button className="header-action" onClick={toggleTheme}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
      >
        {/* Outer */}
        <g>
          <g>
            {outerCircles.map((attrs, i) => (
              <rect fill="currentColor" key={i} {...attrs} />
            ))}
          </g>
        </g>

        {/* Inner */}
        <g>
          <defs>
            <mask id="themeToggleMask">
              <circle
                style={transitionStyle}
                cx="50"
                cy="50"
                r={isDark ? 26 : 15}
                fill="white"
              />
              <circle
                style={transitionStyle}
                cx={isDark ? 50 + 15 : 50 + 30}
                cy={isDark ? 50 - 15 : 50 - 30}
                r={isDark ? 25 : 5}
                fill="black"
              />
            </mask>
          </defs>
          <g>
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="currentColor"
              mask="url(#themeToggleMask)"
            />
          </g>
        </g>
      </svg>
    </button>
  );
};

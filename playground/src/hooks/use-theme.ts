import React from "react";

export type Theme = "dark" | "light";
export const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}>({
  theme: "light",
  setTheme: () => {},
});

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  return [context.theme, context.setTheme] as const;
};

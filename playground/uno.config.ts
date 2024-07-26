// uno.config.ts
import { defineConfig, presetIcons, presetUno, presetWind } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  shortcuts: [
    [
      "header-action",
      "h8 w8 rounded-2 flex items-center justify-center hover:bg-card-action-bg border-0.5 border-transparent border-solid hover:border-0.5 hover:border-card-action-border text-xl cursor-pointer bg-transparent color-inherit",
    ],
    ["flex-center", "flex items-center justify-center"],
  ],
  presets: [
    presetUno(),
    presetWind(),
    presetIcons({
      autoInstall: true,
    }),
  ],
  theme: {
    colors: {
      "card-bg": "var(--bg-card)",
      "card-highlight": "var(--card-highlight)",
      "card-border": "var(--card-border)",
      "card-action-bg": "var(--card-action-bg)",
      "card-action-bg-hover": "var(--card-action-bg-hover)",
      "card-action-border": "var(--card-action-border)",
    },
  },
  preflights: [
    {
      getCSS: () => `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    `,
    },
  ],
});

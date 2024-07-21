// uno.config.ts
import { defineConfig, presetIcons, presetUno, presetWind } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetWind(), presetIcons()],
  preflights: [{
    getCSS: () => `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    `
  }],
});

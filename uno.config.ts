// uno.config.ts
import { defineConfig, presetIcons, presetUno, presetWind } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetWind(), presetIcons()],
});

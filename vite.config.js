import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
  base: "/goit-js-hw-24/",
  assetsInclude: ["**/*.hbs"],
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/templates"),
    }),
  ],
});

import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
  base: "/Vite/",
  assetsInclude: ["**/*.hbs"],
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/templates"),
      context: { siteTitle: "Мій сайт" },
      helpers: {
        shout: (txt) => txt.toUpperCase(),
      },
    }),
  ],
});

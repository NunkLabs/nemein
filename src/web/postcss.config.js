import { fileURLToPath } from "node:url";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const tailwindConfig = fileURLToPath(
  new URL("./tailwind.config.js", import.meta.url),
);

export default {
  plugins: [tailwindcss(tailwindConfig), autoprefixer],
};

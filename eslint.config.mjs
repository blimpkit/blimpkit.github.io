import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.jquery, blimpkit: "readonly", angular: "readonly" } } },
  pluginJs.configs.recommended,
];
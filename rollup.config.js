import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";
import pkgMinifyHTML from "rollup-plugin-minify-html-literals";
const minifyHTML = pkgMinifyHTML.default;

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "es",
    sourcemap: false,
    plugins: [
      terser({
        ecma: 2021,
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
        compress: {
          drop_console: true,
          dead_code: true,
        },
        output: {
          comments: false,
        },
      }),
    ],
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    // minifyHTML(),
    postcss({
      extract: true,
      // minimize: true,
      sourceMap: "inline",
      plugins: [
        postcssUrl({
          basePath: "../../public",
        }),
      ],
    }),
    copy({
      targets: [{ src: "public/*", dest: "dist" }],
    }),
  ],
};

// // rollup.config.js
// import serve from "rollup-plugin-serve";
// import postcss from "rollup-plugin-postcss";
// export default {
// 	input: "src/index.ts",
// 	output: {
// 		file: "dist/bundle.js",
// 	},
// 	plugins: [
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 		}),
// 		postcss({
// 			extract: true,
// 			// minimize: true,
// 			sourceMap: "inline",
// 			plugins: [
// 				postcssUrl({
// 					basePath: "../../public",
// 				}),
// 			],
// 		}),

// 		serve({
// 			// Launch in browser (default: false)
// 			contentBase: ["dist", "public"],
// 			open: true,
// 		}),
// 	],
// };

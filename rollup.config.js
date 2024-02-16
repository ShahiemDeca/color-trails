import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";

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
		url(),
		url({ fileName: "[name][extname]", include: ["**/assets/*.mp3"], limit: 100000 }),
		postcss({
			extract: true,
			minimize: true,
			sourceMap: "inline",
			plugins: [
				postcssUrl({
					url: (asset) => {
						const assetName = asset.url.substring(asset.url.lastIndexOf("/") + 1);
						return `assets/${assetName}`;
					},
				}),
			],
		}),
		copy({
			targets: [
				{ src: "src/assets/*", dest: "dist/assets/" },
				{ src: "public/*", dest: "dist" },
			],
		}),
	],
};

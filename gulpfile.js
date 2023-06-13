import { deleteAsync } from "del";
import { env } from "node:process";
import * as rollup from "rollup";
import alias from "@rollup/plugin-alias";
import autoprefixer from "autoprefixer";
import commonjs from "@rollup/plugin-commonjs";
import cssnano from "cssnano";
import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "gulp-postcss";
import purgecss from "@fullhuman/postcss-purgecss";
import replace from "@rollup/plugin-replace";
import sass from "gulp-dart-sass";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const isProduction = env.NODE_ENV === "production";

/** @type { import("rollup-plugin-terser").Options } */
const terserOption = {
  compress: {
    passes: 5,
    toplevel: true,
    unsafe: true,
  },
  ecma: 2020,
  format: {
    comments: false,
    ecma: 2020,
    quote_style: 1,
    wrap_iife: true,
  },
};

/** @type { import("@rollup/plugin-replace").RollupReplaceOptions } */
const replaceOption = {
  preventAssignment: true,
  values: {
    "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
  },
};

/** @type { Array<import("rollup").RollupOptions> } */
const rollupConfig = [
  {
    input: "./src/js/app.tsx",
    output: {
      dir: "./dist/js",
      format: "iife",
      name: "app.js",
    },
    plugins: [
      alias({
        entries: [
          { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
          { find: "react", replacement: "preact/compat" },
          { find: "react-dom", replacement: "preact/compat" },
        ],
      }),
      nodeResolve(),
      replace(replaceOption),
      commonjs(),
      typescript(),
      isProduction && terser(terserOption),
    ],
  },
  {
    input: "./src/service-worker.ts",
    output: {
      dir: "./dist",
      format: "cjs",
      name: "service-worker.js",
    },
    plugins: [nodeResolve(), replace(replaceOption), commonjs(), typescript(), isProduction && terser(terserOption)],
  },
];

const postcssPlugins = [autoprefixer()];

if (isProduction) {
  postcssPlugins.push(cssnano({ preset: ["default", { discardComments: { removeAll: true } }] }));
  postcssPlugins.push(purgecss({ content: ["./src/index.html", "./src/js/**/*.tsx"] }));
}

gulp.task("clean", () => deleteAsync("./dist"));

gulp.task("build:html", () =>
  gulp
    .src("./src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"))
);

gulp.task("build:css", () =>
  gulp
    .src("./src/css/app.scss")
    .pipe(sass({ includePaths: ["node_modules"] }))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest("./dist/css"))
);

gulp.task("build:js", () =>
  Promise.all(rollupConfig.map(config => rollup.rollup(config).then(bundle => bundle.write(config.output))))
);

gulp.task("build:static", () =>
  gulp
    .src(["./src/manifest.json", "./src/img/**/*"], {
      base: "./src",
      since: gulp.lastRun("build:static"),
    })
    .pipe(gulp.dest("./dist"))
);

gulp.task("watch", () => {
  gulp.watch("./src/index.html", { ignoreInitial: false }, gulp.series("build:html"));
  gulp.watch("./src/css/**/*.scss", { ignoreInitial: false }, gulp.series("build:css"));
  gulp.watch(["./src/manifest.json", "./src/img/**/*"], { ignoreInitial: false }, gulp.series("build:static"));
  const watcher = rollup.watch(rollupConfig);
  watcher.on("change", () => {
    console.log("Changed");
  });
});

gulp.task("default", gulp.series("clean", gulp.parallel("build:html", "build:js", "build:css", "build:static")));
gulp.task("dev", gulp.series("clean", "watch"));

const esbuild = require("esbuild");

const isProd = process.argv.includes("--prod");

esbuild.build({
  entryPoints: ["src/index.tsx"],   // entry file
  bundle: true,                     // combine everything
  minify: isProd,                   // minify in prod
  sourcemap: !isProd,               // keep sourcemap in dev
  outfile: "dist/bundle.js",        // single output file
  platform: "browser",              // for ReactJS web
//   target: ["es2017"],               // JS target
  define: {
    "process.env.NODE_ENV": `"${isProd ? "production" : "development"}"`
  },
  jsx: "automatic"                  // for React 17+ (JSX transform)
}).catch(() => process.exit(1));

const esbuild = require("esbuild");
const fs = require("fs");
const { basename } = require("path");
const dotenv = require('dotenv')


const entry = process.argv[2];

if (entry.split("/").length < 3) {
  console.error("Entry must be in the format 'src/folder/file.js'");
  process.exit(1);
}
const outfile = entry.split("/")[1]
const isProd = process.argv.includes("--prod");
const ENV_VARIABLE = {}

if (fs.existsSync(`./src/${outfile}/.prod.env`) || fs.existsSync(`./src/${outfile}/.dev.env`) ) {
  if (isProd) {
    dotenv.config({path: `./src/${outfile}/.prod.env`})
  } else {
    dotenv.config({path: `./src/${outfile}/.dev.env`})
  }

  const { ENV } = require(`./src/${outfile}/constant.ts`)

  for (let i in ENV) {
    ENV_VARIABLE[i] = process.env[i]
  }
}

console.log('ENV:', ENV_VARIABLE)


const buildOptions = {
  entryPoints: [entry],
  bundle: true,
  minify: isProd,
  sourcemap: !isProd,
  outfile: `dist/${outfile}/index.js`,
  platform: "browser",
  define: {
    "process.env.NODE_ENV": `"${isProd ? "production" : "development"}"`,
    ...ENV_VARIABLE
  },
  loader: {
    ".svg": "file",
    ".png": "file",
    ".ttf": "file",
    ".woff": "file",
  },
  jsx: "automatic",
};

if (isProd) {
  // For production: run a single build and exit
  esbuild.build(buildOptions).then(() => {
    console.log('Production build completed:', buildOptions.outfile);
  }).catch(() => process.exit(1));
} else {
  // For development: create a context with watch + serve
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();

    const serveOptions = {
      servedir: '.',
      port: 3000,
    };
    
    // Add HTTPS if certificates exist
    try {
      serveOptions.keyfile = 'localhost-key.pem';
      serveOptions.certfile = 'localhost.pem';
      fs.accessSync('localhost-key.pem');
      fs.accessSync('localhost.pem');
      console.log('HTTPS server running at https://localhost:3000');
    } catch {
      console.log('HTTP server running at http://localhost:3000');
      console.log('To enable HTTPS, generate certificates with: mkcert localhost');
    }
    
    ctx.serve(serveOptions);
    return
  }).catch(() => process.exit(1));
}

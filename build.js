const esbuild = require("esbuild");
const fs = require("fs");

const entry = process.argv[2];
const outfile = process.argv[3];
const isProd = process.argv.includes("--prod");

const buildOptions = {
  entryPoints: [entry],
  bundle: true,
  minify: isProd,
  sourcemap: !isProd,
  outfile: outfile,
  platform: "browser",
  define: {
    "process.env.NODE_ENV": `"${isProd ? "production" : "development"}"`
  },
  loader: {
    ".svg": "file",
    ".png": "file",
    ".ttf": "file",
    ".woff": "file",
  },
  jsx: "automatic",
};

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
}).catch(() => process.exit(1));

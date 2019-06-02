import fs from 'fs';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'worker-pool'
const workerSrc = 'src/worker'

const plugins = () => {
  return [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ];
};

const config = [{
  input: [`src/${libraryName}.ts`, `${workerSrc}/worker.ts`],
  experimentalCodeSplitting: true,
  output: {
    dir: 'rollup/build',
    format: 'amd',
    chunkFileNames: 'shared.js'
  },
  watch: {
    include: 'src/**'
  },
  plugins: plugins(),
  moduleContext: {
    [require.resolve('whatwg-fetch')]: 'window',
  }
}, {
  input: `rollup/${libraryName}.js`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      intro: fs.readFileSync(require.resolve('./rollup/bundle_prelude.js'), 'utf8'),
    },
  ],
  watch: {
    include: 'rollup/**'
  },
  treeshake: false,
  plugins: []
}];

if (process.env.DEV_SERVER) {
  config[1].plugins = [
    ...config[1].plugins,
    serve({
      open: true,
      verbose: true,
      contentBase: [''],
      port: 8080
    }),
  ];
}

export default config;

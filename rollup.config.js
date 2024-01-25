import pkg from './package.json'
import commonjs from 'rollup-plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'



const plugins = [
  nodeResolve({
    mainFields: ['jsnext', 'preferBuiltins', 'browser'],
  }),
  commonjs(),
  json(),
].filter(Boolean)

export default {
  input: "./src/index.js",
  output: [
    {
      file: "dist/worker.js",
      name: "yuvCanvas",
      format: "umd",
      exports: "named",
    },
  ],
  plugins,
};

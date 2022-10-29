import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import cssnano from 'cssnano'
import postcssImport from 'postcss-import'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { prebundleAlias, prebundleConfig } from './rollup.prebundle.config.mjs'
import tsc from './tsconfig.json' assert { type: 'json' }

const { compilerOptions } = tsc

export default [
  prebundleConfig,
  {
    plugins: [
      prebundleAlias,
      json({ preferConst: true }),
      esbuild({
        minify: !process.env.ROLLUP_WATCH,
        target: compilerOptions.target,
      }),
      nodeResolve(),
      commonjs(),
      postcss({
        plugins: [postcssImport, cssnano({ preset: 'default' })],
      }),
      copy({ targets: [{ src: 'demo/public/**/*', dest: 'dist' }] }),
      process.env.ROLLUP_WATCH && serve({ contentBase: 'dist' }),
      process.env.ROLLUP_WATCH && livereload(),
    ],
    input: ['demo/js/index.js'],
    output: { dir: 'dist', format: 'iife', compact: true },
  },
]

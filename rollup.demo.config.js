import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import postcssImport from 'postcss-import'
import copy from 'rollup-plugin-copy'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    plugins: [
      json({ preferConst: true }),
      typescript(),
      nodeResolve(),
      commonjs(),
      postcss({
        plugins: [postcssImport],
      }),
      copy({ targets: [{ src: 'demo/public/**/*', dest: 'dist' }] }),
      !process.env.ROLLUP_WATCH && terser(),
      process.env.ROLLUP_WATCH && serve({ contentBase: 'dist' }),
      process.env.ROLLUP_WATCH && livereload(),
    ],
    input: ['demo/js/index.js'],
    output: { dir: 'dist', format: 'iife', compact: true },
  },
]

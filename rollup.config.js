import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const external = (id) =>
  Object.keys(pkg.dependencies).some(
    (dep) => dep === id || id.startsWith(`${dep}/`)
  )

const plugins = [
  json({ preferConst: true }),
  typescript(),
  nodeResolve(),
  commonjs(),
  !process.env.ROLLUP_WATCH && terser(),
]

export default [
  {
    external,
    plugins,
    input: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
    output: { dir: 'lib', exports: 'named', format: 'cjs', compact: true },
  },
  {
    external,
    plugins,
    input: 'src/index.ts', // jsx-runtime is only for CommonJS
    output: {
      chunkFileNames: '[name]-[hash].mjs',
      dir: 'module',
      entryFileNames: '[name].mjs',
      exports: 'named',
      format: 'es',
      compact: true,
    },
    preserveModules: true, // to emit tree-shakable scripts
  },
]

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'
import { prebundleAlias, prebundleConfig } from './rollup.prebundle.config'
import { compilerOptions } from './tsconfig.json'

const external = (id) =>
  Object.keys(pkg.dependencies).some(
    (dep) => dep === id || id.startsWith(`${dep}/`)
  )

const plugins = [
  prebundleAlias,
  json({ preferConst: true }),
  esbuild({
    minify: !process.env.ROLLUP_WATCH,
    target: compilerOptions.target,
  }),
  nodeResolve(),
  commonjs(),
]

export default [
  prebundleConfig,
  {
    external,
    plugins,
    input: 'src/index.ts',
    output: { dir: 'lib', exports: 'named', format: 'cjs', compact: true },
  },
  {
    external,
    plugins,
    input: ['src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
    output: { dir: 'lib', exports: 'named', format: 'cjs', compact: true },
  },
  {
    external,
    plugins,
    input: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
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

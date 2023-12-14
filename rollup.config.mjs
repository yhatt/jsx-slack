import { createRequire } from 'node:module'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import { prebundleAlias, prebundleConfig } from './rollup.prebundle.config.mjs'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const { compilerOptions } = require('./tsconfig.json')

const external = (id) =>
  Object.keys(pkg.dependencies).some(
    (dep) => dep === id || id.startsWith(`${dep}/`),
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
      preserveModules: true, // to emit tree-shakable scripts
      // https://github.com/rollup/rollup/issues/3684#issuecomment-1535836196
      entryFileNames: (chunkInfo) =>
        chunkInfo.name.includes('node_modules')
          ? `${chunkInfo.name.replace('node_modules', 'vendor')}.mjs`
          : '[name].mjs',
    },
  },
]

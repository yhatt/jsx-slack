import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'

const external = (id) =>
  Object.keys(pkg.dependencies).some(
    (dep) => dep === id || id.startsWith(`${dep}/`)
  )

const plugins = ({ prebundle = false } = {}) =>
  [
    json({ preferConst: true }),
    esbuild({
      minify: !process.env.ROLLUP_WATCH,
      target: 'es2019',
      experimentalBundling: prebundle,
    }),
    !prebundle && nodeResolve(),
    !prebundle && commonjs(),
  ].filter(Boolean)

export default [
  {
    external,
    plugins: plugins(),
    input: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
    output: { dir: 'lib', exports: 'named', format: 'cjs', compact: true },
  },
  {
    external,
    plugins: plugins(),
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

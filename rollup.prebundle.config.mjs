import { createRequire } from 'node:module'
import path from 'node:path'
import url from 'node:url'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'

const require = createRequire(import.meta.url)
const { compilerOptions } = require('./tsconfig.json')
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export const prebundleAlias = alias({
  entries: [
    {
      find: /^.*\bprebundles\/(.+)$/,
      replacement: path.resolve(__dirname, './vendor/$1.ts.mjs'),
    },
    // Node's URL dependency will never use in jsx-slack
    {
      find: 'node:url',
      replacement: path.resolve(__dirname, './src/prebundles/mocks/url.ts'),
    },
  ],
})

const preBundles = ['src/prebundles/hastUtilToMdast.ts', 'src/prebundles/he.ts']

export const prebundleConfig = {
  plugins: [
    json({ preferConst: true }),
    esbuild({
      minify: !process.env.ROLLUP_WATCH,
      target: compilerOptions.target,
      optimizeDeps: {
        include: preBundles,
        exclude: ['node:url'],
        esbuildOptions: { outbase: __dirname, entryNames: '[dir]/[name].ts' },
      },
    }),
  ],
  input: preBundles,
  external: ['node:url'],
  output: {
    chunkFileNames: '[name]-[hash].mjs',
    dir: 'vendor',
    entryFileNames: '[name].mjs',
    exports: 'named',
    format: 'es',
    compact: true,
  },
}

import path from 'path'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import { compilerOptions } from './tsconfig.json'

export const prebundleAlias = alias({
  entries: [
    {
      find: /^.*\bprebundles\/(.+)$/,
      replacement: path.resolve(__dirname, './vendor/$1.mjs'),
    },
    // Node's URL dependency will never use in jsx-slack
    {
      find: 'node:url',
      replacement: path.resolve(__dirname, './src/prebundles/mocks/url.ts'),
    },
  ],
})

export const prebundleConfig = {
  plugins: [
    json({ preferConst: true }),
    esbuild({
      minify: !process.env.ROLLUP_WATCH,
      target: compilerOptions.target,
      experimentalBundling: true,
    }),
  ],
  input: ['src/prebundles/hastUtilToMdast.ts', 'src/prebundles/he.ts'],
  output: {
    chunkFileNames: '[name]-[hash].mjs',
    dir: 'vendor',
    entryFileNames: '[name].mjs',
    exports: 'named',
    format: 'es',
    compact: true,
  },
}

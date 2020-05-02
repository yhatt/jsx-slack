/* eslint-disable @typescript-eslint/no-var-requires */
const autoprefixer = require('autoprefixer')
const axios = require('axios').default
const postcss = require('postcss')
const postcssImportUrl = require('postcss-import-url')

const icongramCache = new Map()
const postcssIcongram = postcss.plugin(
  'postcss-icongram',
  () => async (root) => {
    const resolvers = []

    root.walkDecls((decl) => {
      const icongramUrlPattern = /(url\(\s*['"]?)(https:\/\/icongr\.am\/[^"')]+\.svg[^"')]*)(["']?\s*\))/g
      const splitted = decl.value.split(icongramUrlPattern)

      if (splitted.length <= 1) return

      resolvers.push(async () => {
        for (let i = 2; i < splitted.length; i += 4) {
          const url = splitted[i]
          let resolved = icongramCache.get(url)

          if (!resolved) {
            // eslint-disable-next-line no-await-in-loop
            const ret = await axios.get(url, { responseType: 'arraybuffer' })
            const base64 = Buffer.from(ret.data).toString('base64')

            resolved = `data:image/svg+xml;base64,${base64}`
            icongramCache.set(url, resolved)
          }

          splitted[i] = resolved
        }

        // eslint-disable-next-line no-param-reassign
        decl.value = splitted.join('')
      })
    })

    // eslint-disable-next-line no-await-in-loop
    for (const resolver of resolvers) await resolver()
  }
)

module.exports = {
  plugins: [autoprefixer(), postcssIcongram(), postcssImportUrl()],
}
